import React, { useState, useMemo } from 'react';
import { SGXStock, PortfolioHolding, DEFAULT_PORTFOLIO } from '../data/sgxStocks';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Plus, 
  Trash2, 
  Edit2, 
  Download, 
  Upload, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface PortfolioTrackerProps {
  stocks: SGXStock[];
  holdings: PortfolioHolding[];
  onAddHolding: () => void;
  onEditHolding: (holding: PortfolioHolding) => void;
  onDeleteHolding: (id: string) => void;
  onLoadPreset: () => void;
  onClearPortfolio: () => void;
  onSelectStock: (stock: SGXStock) => void;
}

export const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({
  stocks,
  holdings,
  onAddHolding,
  onEditHolding,
  onDeleteHolding,
  onLoadPreset,
  onClearPortfolio,
  onSelectStock,
}) => {
  const [aiAuditModalOpen, setAiAuditModalOpen] = useState(false);
  const [aiAuditContent, setAiAuditContent] = useState<string | null>(null);
  const [aiAuditLoading, setAiAuditLoading] = useState(false);
  const [aiAuditError, setAiAuditError] = useState<string | null>(null);

  // Map holdings with live stock market data
  const enrichedHoldings = useMemo(() => {
    return holdings.map((h) => {
      const stock = stocks.find((s) => s.ticker === h.ticker);
      const currentPrice = stock ? stock.price : h.avgBuyPrice;
      const totalCost = h.shares * h.avgBuyPrice;
      const currentValue = h.shares * currentPrice;
      const unrealizedGain = currentValue - totalCost;
      const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
      const annualDividendPerShare = stock ? stock.annualDividend : 0;
      const totalAnnualDividend = h.shares * annualDividendPerShare;
      const yieldOnCost = h.avgBuyPrice > 0 ? (annualDividendPerShare / h.avgBuyPrice) * 100 : 0;
      const currentYield = stock ? stock.dividendYield : 0;

      return {
        ...h,
        stock,
        currentPrice,
        totalCost,
        currentValue,
        unrealizedGain,
        unrealizedGainPercent,
        annualDividendPerShare,
        totalAnnualDividend,
        yieldOnCost,
        currentYield,
      };
    });
  }, [holdings, stocks]);

  // Portfolio Totals
  const summary = useMemo(() => {
    const totalCost = enrichedHoldings.reduce((sum, h) => sum + h.totalCost, 0);
    const totalValue = enrichedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    const totalAnnualDividend = enrichedHoldings.reduce((sum, h) => sum + h.totalAnnualDividend, 0);
    const portfolioYield = totalValue > 0 ? (totalAnnualDividend / totalValue) * 100 : 0;
    const portfolioYOC = totalCost > 0 ? (totalAnnualDividend / totalCost) * 100 : 0;
    const monthlyAverage = totalAnnualDividend / 12;

    return {
      totalCost,
      totalValue,
      totalGain,
      totalGainPercent,
      totalAnnualDividend,
      portfolioYield,
      portfolioYOC,
      monthlyAverage,
    };
  }, [enrichedHoldings]);

  // Projected 12-month calendar breakdown
  const monthlyProjection = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySums = new Array(12).fill(0);

    enrichedHoldings.forEach((h) => {
      if (h.stock && h.stock.payoutMonths && h.stock.payoutMonths.length > 0) {
        const payoutPerPeriod = h.totalAnnualDividend / h.stock.payoutMonths.length;
        h.stock.payoutMonths.forEach((m) => {
          if (m >= 1 && m <= 12) {
            monthlySums[m - 1] += payoutPerPeriod;
          }
        });
      }
    });

    const maxVal = Math.max(...monthlySums, 1);
    return months.map((month, idx) => ({
      month,
      amount: monthlySums[idx],
      percent: (monthlySums[idx] / maxVal) * 100,
    }));
  }, [enrichedHoldings]);

  // Sector breakdown
  const sectorAllocation = useMemo(() => {
    const map: Record<string, number> = {};
    enrichedHoldings.forEach((h) => {
      const sector = h.stock?.sector || 'Other';
      map[sector] = (map[sector] || 0) + h.currentValue;
    });

    return Object.entries(map).map(([sector, val]) => ({
      sector,
      value: val,
      percentage: summary.totalValue > 0 ? (val / summary.totalValue) * 100 : 0,
    })).sort((a, b) => b.value - a.value);
  }, [enrichedHoldings, summary.totalValue]);

  // Run AI Portfolio Audit
  const handleRunAiAudit = async () => {
    setAiAuditModalOpen(true);
    setAiAuditLoading(true);
    setAiAuditError(null);

    try {
      const payload = {
        holdings: enrichedHoldings.map((h) => ({
          ticker: h.ticker,
          name: h.stock?.name || h.ticker,
          shares: h.shares,
          avgCost: h.avgBuyPrice,
          price: h.currentPrice,
          yield: h.currentYield,
          annualDividend: h.annualDividendPerShare,
        })),
        totalValue: summary.totalValue.toFixed(2),
        annualDividend: summary.totalAnnualDividend.toFixed(2),
        portfolioYield: summary.portfolioYield.toFixed(2),
        yieldOnCost: summary.portfolioYOC.toFixed(2),
      };

      const res = await fetch('/api/gemini/portfolio-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.audit) {
        setAiAuditContent(data.audit);
      } else {
        setAiAuditError(data.error || 'Failed to generate audit.');
      }
    } catch (err: any) {
      setAiAuditError(err.message || 'Network error.');
    } finally {
      setAiAuditLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Ticker', 'Name', 'Shares', 'AvgBuyPriceSGD', 'CurrentPriceSGD', 'TotalCostSGD', 'CurrentValueSGD', 'UnrealizedGainSGD', 'AnnualDividendSGD', 'YieldOnCostPercent'];
    const rows = enrichedHoldings.map((h) => [
      h.ticker,
      `"${h.stock?.name || h.ticker}"`,
      h.shares,
      h.avgBuyPrice.toFixed(3),
      h.currentPrice.toFixed(3),
      h.totalCost.toFixed(2),
      h.currentValue.toFixed(2),
      h.unrealizedGain.toFixed(2),
      h.totalAnnualDividend.toFixed(2),
      h.yieldOnCost.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SGX_Dividend_Portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Portfolio Value</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            SGD ${summary.totalValue.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums">
            <span className="text-slate-400 text-[11px]">Cost: ${summary.totalCost.toLocaleString('en-SG', { minimumFractionDigits: 2 })}</span>
            <span className={`font-semibold flex items-center ${summary.totalGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({summary.totalGain >= 0 ? '+' : ''}{summary.totalGainPercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Projected Annual Income */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Annual Passive Income</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
            SGD ${summary.totalAnnualDividend.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            avg <strong className="text-slate-200">${summary.monthlyAverage.toFixed(0)}</strong> / month (tax-free)
          </div>
        </div>

        {/* Weighted Yield */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Portfolio Yield (Current)</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {summary.portfolioYield.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400">
            weighted market yield
          </div>
        </div>

        {/* Yield on Cost (YOC) */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            Yield on Cost (YOC)
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono tabular-nums tracking-tight">
            {summary.portfolioYOC.toFixed(2)}%
          </div>
          <div className="text-[11px] text-slate-400">
            income return on capital invested
          </div>
        </div>
      </div>

      {/* 12-Month Cashflow Runway & Sector Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 12-Month Passive Income Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Projected 12-Month SGX Dividend Cash Flow
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Expected distribution payments per calendar month based on stock payout cadence
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
              Total: SGD ${summary.totalAnnualDividend.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1.5 sm:gap-2 pt-4 items-end h-44 border-b border-slate-800/80 pb-2">
            {monthlyProjection.map((m) => (
              <div key={m.month} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tabular-nums">
                  ${m.amount > 0 ? m.amount.toFixed(0) : 0}
                </span>
                <div 
                  className={`w-full rounded-t transition-all ${
                    m.amount > 0 ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-slate-800/40'
                  }`}
                  style={{ height: `${Math.max(m.percent, 4)}%` }}
                />
                <span className="text-[11px] font-medium text-slate-400 font-mono">
                  {m.month}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Singapore dividends are not taxed (0% dividend tax rate)</span>
            <span className="font-mono tabular-nums text-slate-300">
              Avg: ${summary.monthlyAverage.toFixed(2)} / mo
            </span>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Sector Diversification
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Capital weight by Singapore industry vertical
            </p>
          </div>

          <div className="space-y-2.5 my-auto">
            {sectorAllocation.length > 0 ? (
              sectorAllocation.map((s) => (
                <div key={s.sector} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[160px]">{s.sector}</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {s.percentage.toFixed(1)}% (${s.value.toFixed(0)})
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 text-center py-6">
                No holdings tracked yet.
              </div>
            )}
          </div>

          <button
            onClick={handleRunAiAudit}
            disabled={holdings.length === 0}
            className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Portfolio Health &amp; Risk Audit</span>
          </button>
        </div>
      </div>

      {/* Holdings Table Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              SGX Portfolio Holdings ({holdings.length})
            </h3>
            <p className="text-xs text-slate-400">
              Tracked Singapore shares, average acquisition prices, and annual payouts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAddHolding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>

            {holdings.length === 0 && (
              <button
                onClick={onLoadPreset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Load Starter SGX Portfolio</span>
              </button>
            )}

            {holdings.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={onClearPortfolio}
                  className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Holdings Table */}
        {holdings.length > 0 ? (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Counter</th>
                    <th className="py-3 px-4 text-right">Shares</th>
                    <th className="py-3 px-4 text-right">Avg Cost</th>
                    <th className="py-3 px-4 text-right">Current Price</th>
                    <th className="py-3 px-4 text-right">Market Value</th>
                    <th className="py-3 px-4 text-right">Unrealized Gain</th>
                    <th className="py-3 px-4 text-right">Annual Income</th>
                    <th className="py-3 px-4 text-right">Yield on Cost</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
                  {enrichedHoldings.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Counter */}
                      <td className="py-3 px-4 font-sans">
                        <div 
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => h.stock && onSelectStock(h.stock)}
                        >
                          <span className="font-mono font-bold text-white text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700 group-hover:border-emerald-500 transition-colors">
                            {h.ticker}
                          </span>
                          <div>
                            <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {h.stock?.name || h.ticker}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {h.stock?.sector} · {h.stock?.payoutFrequency}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Shares */}
                      <td className="py-3 px-4 text-right tabular-nums text-white font-semibold">
                        {h.shares.toLocaleString()}
                      </td>

                      {/* Avg Cost */}
                      <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                        ${h.avgBuyPrice.toFixed(2)}
                      </td>

                      {/* Current Price */}
                      <td className="py-3 px-4 text-right tabular-nums text-white">
                        ${h.currentPrice.toFixed(2)}
                      </td>

                      {/* Market Value */}
                      <td className="py-3 px-4 text-right tabular-nums font-semibold text-white">
                        ${h.currentValue.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Unrealized Gain */}
                      <td className="py-3 px-4 text-right tabular-nums font-semibold">
                        <span className={h.unrealizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {h.unrealizedGain >= 0 ? '+' : ''}${h.unrealizedGain.toFixed(2)} ({h.unrealizedGainPercent.toFixed(1)}%)
                        </span>
                      </td>

                      {/* Annual Dividend */}
                      <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-bold">
                        ${h.totalAnnualDividend.toFixed(2)}
                      </td>

                      {/* Yield on Cost */}
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-300">
                        {h.yieldOnCost.toFixed(2)}%
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditHolding(h)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit shares or price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteHolding(h.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Remove holding"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Your SGX Dividend Portfolio is Empty</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Add your actual Singapore stock holdings to calculate your true Yield-on-Cost (YOC), cash flow projection, and upcoming payouts, or test with our curated starter portfolio.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onAddHolding}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                + Add First SGX Stock
              </button>
              <button
                onClick={onLoadPreset}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Load Starter Portfolio (DBS, CICT, FLCT, etc.)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Portfolio Audit Modal */}
      {aiAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">AI SGX Dividend Portfolio Audit</h3>
              </div>
              <button
                onClick={() => setAiAuditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {aiAuditLoading && (
                <div className="p-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Evaluating portfolio diversification, DPU durability, and interest rate resilience...
                  </p>
                </div>
              )}

              {aiAuditError && (
                <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs">
                  {aiAuditError}
                </div>
              )}

              {!aiAuditLoading && aiAuditContent && (
                <div className="text-xs text-slate-200 leading-relaxed space-y-3">
                  {aiAuditContent.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                      return <h4 key={index} className="text-sm font-bold text-white pt-2">{paragraph.replace('### ', '')}</h4>;
                    }
                    return (
                      <p key={index} className="text-slate-300">
                        {paragraph.split('**').map((chunk, cIdx) => 
                          cIdx % 2 === 1 ? <strong key={cIdx} className="text-white font-semibold">{chunk}</strong> : chunk
                        )}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button
                onClick={() => setAiAuditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
