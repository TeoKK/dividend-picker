import React, { useState } from 'react';
import { SGXStock } from '../data/sgxStocks';
import { 
  X, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Building2,
  DollarSign,
  Percent,
  Clock,
  Loader2
} from 'lucide-react';

interface StockDetailModalProps {
  stock: SGXStock | null;
  onClose: () => void;
  onAddToPortfolio: (stock: SGXStock) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  onAddToPortfolio,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'ai'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!stock) return null;

  const handleRunAiAnalysis = async (customPrompt?: string) => {
    setActiveTab('ai');
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock, customPrompt }),
      });
      const data = await response.json();
      if (response.ok && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiError(data.error || 'Unable to generate analysis.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Network error while contacting AI server.');
    } finally {
      setAiLoading(false);
    }
  };

  const navDiscount = stock.navPerShare
    ? ((stock.price - stock.navPerShare) / stock.navPerShare) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
                SGX: {stock.ticker}
              </span>
              <span className="text-xs text-slate-400">
                {stock.sector}
              </span>
              {stock.isREIT && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  S-REIT
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {stock.name}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">
              {stock.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onAddToPortfolio(stock)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Portfolio</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price & Primary Dividend Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-950/60 border-b border-slate-800/80 shrink-0">
          <div>
            <div className="text-xs text-slate-400">Current Share Price</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
                SGD ${stock.price.toFixed(2)}
              </span>
              <span className={`text-xs font-semibold flex items-center font-mono tabular-nums ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Dividend Yield (TTM)</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums">
                {stock.dividendYield.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                (5Y avg: {stock.fiveYearAvgYield.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Annual Dividend / DPU</div>
            <div className="mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
                SGD ${stock.annualDividend.toFixed(3)}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">
                {stock.payoutFrequency}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Dividend Safety</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                {stock.dividendSafetyScore}
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-400">
                  {stock.dividendSafetyStatus}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {stock.consecutiveYears}y unbroken
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-900 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Fundamentals &amp; Ratios
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5-Year Dividend History ({stock.history.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('ai');
              if (!aiAnalysis && !aiLoading) {
                handleRunAiAnalysis();
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ai'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Dividend Sustainability Audit</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Upcoming Payout Countdown Box */}
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                      Upcoming SGX Dividend Schedule
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Estimated SGD ${stock.nextEstimatedDividend.toFixed(3)} per share
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Buy on or before <strong className="text-slate-200">{stock.exDividendDate}</strong> (Ex-Date) to qualify
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Record Date</span>
                    <span className="font-semibold text-slate-200">{stock.recordDate}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Pay Date</span>
                    <span className="font-semibold text-emerald-400">{stock.payoutDate}</span>
                  </div>
                </div>
              </div>

              {/* Fundamental Metrics Matrix */}
              <div>
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                  Valuation &amp; Capital Structure
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Payout Ratio</span>
                    <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                      {stock.payoutRatio.toFixed(1)}%
                    </div>
                    <span className="text-[10px] text-slate-400">of recurring profits/DPU</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Price / NAV (P/B)</span>
                    <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                      {stock.pbRatio.toFixed(2)}x
                    </div>
                    <span className={`text-[10px] font-mono tabular-nums ${navDiscount < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {navDiscount < 0 ? `${Math.abs(navDiscount).toFixed(1)}% discount` : `${navDiscount.toFixed(1)}% premium`}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Price to Earnings (P/E)</span>
                    <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                      {stock.peRatio.toFixed(1)}x
                    </div>
                    <span className="text-[10px] text-slate-400">trailing multiple</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Market Capitalization</span>
                    <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                      SGD ${stock.marketCapBillion}B
                    </div>
                    <span className="text-[10px] text-slate-400">SGX Mainboard</span>
                  </div>

                  {stock.isREIT && (
                    <>
                      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400">Gearing Ratio (Leverage)</span>
                        <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                          {stock.gearingRatio}%
                        </div>
                        <span className="text-[10px] text-emerald-400">MAS limit: 50%</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400">Interest Coverage (ICR)</span>
                        <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                          {stock.interestCoverageRatio}x
                        </div>
                        <span className="text-[10px] text-slate-400">safe debt service</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400">NAV per Unit</span>
                        <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                          SGD ${stock.navPerShare.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-slate-400">audited book value</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                        <span className="text-[11px] text-slate-400">5Y DPU CAGR Growth</span>
                        <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                          {stock.dividendGrowthRate5Y > 0 ? `+${stock.dividendGrowthRate5Y}%` : `${stock.dividendGrowthRate5Y}%`}
                        </div>
                        <span className="text-[10px] text-slate-400">annualized distribution</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Investment Highlights & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" />
                    <span>Investment Strengths &amp; Catalysts</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {stock.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">·</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Key Risk Factors to Monitor</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {stock.risks.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">·</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Audited historical distributions per share / unit</span>
                <span>Currency: Singapore Dollars (SGD)</span>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Period</th>
                      <th className="py-2.5 px-4">Amount / Share</th>
                      <th className="py-2.5 px-4">Ex-Dividend Date</th>
                      <th className="py-2.5 px-4">Payout Date</th>
                      <th className="py-2.5 px-4 text-right">Yield Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
                    {stock.history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-4 font-sans font-medium text-white">
                          {item.year} {item.period}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-emerald-400 tabular-nums">
                          SGD ${item.amount.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 tabular-nums">
                          {item.exDate}
                        </td>
                        <td className="py-2.5 px-4 text-slate-300 tabular-nums">
                          {item.payDate}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-400 tabular-nums">
                          {((item.amount / stock.price) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Quick Prompt Focus:</span>
                <button
                  onClick={() => handleRunAiAnalysis("Assess dividend cut risk and debt refinancing wall.")}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  Dividend Cut Risk
                </button>
                <button
                  onClick={() => handleRunAiAnalysis("How will Singapore/US interest rate changes impact this counter's DPU and valuation?")}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  Interest Rate Sensitivity
                </button>
                <button
                  onClick={() => handleRunAiAnalysis("Compare this stock's dividend stability against its closest SGX peers.")}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  Peer Comparison
                </button>
              </div>

              {aiLoading && (
                <div className="p-8 rounded-lg bg-slate-800/30 border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  <p className="text-xs">Analyzing financial statements, DPU coverage &amp; SGX market conditions...</p>
                </div>
              )}

              {aiError && (
                <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <div className="font-semibold">Analysis Error</div>
                    <div>{aiError}</div>
                  </div>
                </div>
              )}

              {!aiLoading && aiAnalysis && (
                <div className="p-5 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-200 text-xs leading-relaxed space-y-3 prose prose-invert max-w-none">
                  {aiAnalysis.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                      return <h4 key={index} className="text-sm font-bold text-white pt-2">{paragraph.replace('### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={index} className="font-semibold text-emerald-300">{paragraph.replace(/\*\*/g, '')}</p>;
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
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Singapore Exchange (SGX) · 0% Withholding Tax on Dividends
          </div>
          <button
            onClick={() => onAddToPortfolio(stock)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add {stock.ticker} to Portfolio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
