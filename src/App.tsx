import React, { useState, useEffect } from 'react';
import { SGX_STOCKS, SGXStock, PortfolioHolding, DEFAULT_PORTFOLIO } from './data/sgxStocks';
import { Header } from './components/Header';
import { StockPicker } from './components/StockPicker';
import { PortfolioTracker } from './components/PortfolioTracker';
import { DividendCalendar } from './components/DividendCalendar';
import { DripCalculator } from './components/DripCalculator';
import { StockDetailModal } from './components/StockDetailModal';
import { AddHoldingModal } from './components/AddHoldingModal';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Percent, 
  DollarSign, 
  Search, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sgx_dividend_hub_holdings_v1';

export default function App() {
  const [stocks] = useState<SGXStock[]>(SGX_STOCKS);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load portfolio from localStorage, defaulting to starter set.', e);
    }
    return DEFAULT_PORTFOLIO;
  });

  const [currentTab, setCurrentTab] = useState<'screener' | 'portfolio' | 'calendar' | 'calculator'>('screener');
  const [selectedStockForModal, setSelectedStockForModal] = useState<SGXStock | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [holdingToEdit, setHoldingToEdit] = useState<PortfolioHolding | null>(null);
  const [initialStockForAdd, setInitialStockForAdd] = useState<SGXStock | null>(null);

  // Sync holdings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(holdings));
    } catch (e) {
      console.error('Failed to save holdings to localStorage:', e);
    }
  }, [holdings]);

  // Handlers
  const handleOpenAddModal = (stock?: SGXStock) => {
    setHoldingToEdit(null);
    setInitialStockForAdd(stock || null);
    setIsAddModalOpen(true);
  };

  const handleEditHolding = (holding: PortfolioHolding) => {
    setHoldingToEdit(holding);
    setInitialStockForAdd(null);
    setIsAddModalOpen(true);
  };

  const handleSaveHolding = (newHolding: PortfolioHolding) => {
    setHoldings((prev) => {
      const idx = prev.findIndex((h) => h.id === newHolding.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newHolding;
        return next;
      }
      return [newHolding, ...prev];
    });
  };

  const handleDeleteHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const handleLoadPreset = () => {
    setHoldings(DEFAULT_PORTFOLIO);
  };

  const handleClearPortfolio = () => {
    if (window.confirm('Are you sure you want to clear your SGX portfolio holdings?')) {
      setHoldings([]);
    }
  };

  interface NextPayoutItem {
    ticker: string;
    date: string;
    amount: number;
  }

  interface PortfolioSummary {
    totalCost: number;
    totalValue: number;
    totalAnnualDividend: number;
    unrealizedGain: number;
    unrealizedGainPercent: number;
    portfolioYield: number;
    yieldOnCost: number;
    monthlyIncome: number;
    nextPayout: NextPayoutItem | null;
    count: number;
  }

  // User's total portfolio calculations for the high-level summary header
  const portfolioSummary: PortfolioSummary = React.useMemo(() => {
    let totalCost = 0;
    let totalValue = 0;
    let totalAnnualDividend = 0;

    holdings.forEach((h) => {
      const stock = stocks.find((s) => s.ticker === h.ticker);
      const currentPrice = stock ? stock.price : h.avgBuyPrice;
      totalCost += h.shares * h.avgBuyPrice;
      totalValue += h.shares * currentPrice;
      if (stock) {
        totalAnnualDividend += h.shares * stock.annualDividend;
      }
    });

    const unrealizedGain = totalValue - totalCost;
    const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
    const portfolioYield = totalValue > 0 ? (totalAnnualDividend / totalValue) * 100 : 0;
    const yieldOnCost = totalCost > 0 ? (totalAnnualDividend / totalCost) * 100 : 0;
    const monthlyIncome = totalAnnualDividend / 12;

    // Find next upcoming dividend payout among user's holdings
    let nextPayout: NextPayoutItem | null = null;
    const nowTime = new Date().getTime();
    holdings.forEach((h) => {
      const stock = stocks.find((s) => s.ticker === h.ticker);
      if (stock && stock.payoutDate) {
        const pTime = new Date(stock.payoutDate).getTime();
        if (pTime >= nowTime) {
          if (!nextPayout || pTime < new Date(nextPayout.date).getTime()) {
            nextPayout = {
              ticker: stock.ticker,
              date: stock.payoutDate,
              amount: h.shares * stock.nextEstimatedDividend,
            };
          }
        }
      }
    });

    return {
      totalCost,
      totalValue,
      totalAnnualDividend,
      unrealizedGain,
      unrealizedGainPercent,
      portfolioYield,
      yieldOnCost,
      monthlyIncome,
      nextPayout,
      count: holdings.length,
    };
  }, [holdings, stocks]);

  // Quick SGX market overview metrics
  const marketStats = {
    avgBankYield: '5.54%',
    avgReitYield: '5.62%',
    withholdingTax: '0%',
    trackedCount: stocks.length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Bar Contract Compliant Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => handleOpenAddModal()}
        portfolioHoldingsCount={holdings.length}
      />

      {/* Hero Accent Strip (with generated Singapore financial backdrop) */}
      <section className="relative border-b border-slate-800 bg-slate-900/60 overflow-hidden">
        {/* Background Image Scrim */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity overflow-hidden">
          <img
            src="/src/assets/images/singapore_financial_district_1793537843029.jpg"
            alt="Singapore Marina Bay Financial Skyline"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-8 space-y-4">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">Singapore Exchange (SGX)</span>
              <span aria-hidden="true">·</span>
              <span>Zero Dividend Withholding Tax</span>
              <span aria-hidden="true">·</span>
              <span>Zero Capital Gains Tax</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Singapore Dividend Share Picker &amp; Portfolio Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Screen high-yield Singapore blue chips, track S-REIT distribution per unit (DPU) history, forecast monthly passive cashflow, and evaluate payout sustainability with AI.
            </p>
          </div>

          {/* SGX Key Financial Benchmark Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block">STI Bank Average Yield</span>
              <span className="text-base font-bold text-white font-mono tabular-nums">
                {marketStats.avgBankYield}
              </span>
              <span className="text-[10px] text-slate-400 block">DBS · OCBC · UOB</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block">S-REIT Average Yield</span>
              <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                {marketStats.avgReitYield}
              </span>
              <span className="text-[10px] text-slate-400 block">Retail, Industrial &amp; Healthcare</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block">Dividend Withholding Tax</span>
              <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                0.0%
              </span>
              <span className="text-[10px] text-slate-400 block">100% tax-free for individuals</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block">Curated SGX Counters</span>
              <span className="text-base font-bold text-white font-mono tabular-nums">
                {marketStats.trackedCount} Stocks
              </span>
              <span className="text-[10px] text-slate-400 block">With audited 5-Yr DPU history</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Viewport Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* High-Level Portfolio Summary Dashboard Header (At-a-glance tracker) */}
        <section 
          aria-label="My Dividend Tracker Summary"
          className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg backdrop-blur-sm overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  My Dividend Tracker · Live Portfolio Summary
                </span>
                <span className="text-[11px] text-slate-400 ml-2 font-mono">
                  ({portfolioSummary.count} {portfolioSummary.count === 1 ? 'Holding' : 'Holdings'})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentTab !== 'portfolio' ? (
                <button
                  onClick={() => setCurrentTab('portfolio')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  <span>Open Full Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentTab('screener')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>Explore SGX Stocks</span>
                  <Search className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => handleOpenAddModal()}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                + Add Holding
              </button>
            </div>
          </div>

          {/* At-A-Glance Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            {/* Total Portfolio Value */}
            <div className="p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                Total Portfolio Value
              </span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
                SGD ${portfolioSummary.totalValue.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums">
                <span className="text-[11px] text-slate-400">
                  Cost: ${portfolioSummary.totalCost.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-[11px] font-semibold ${portfolioSummary.unrealizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({portfolioSummary.unrealizedGain >= 0 ? '+' : ''}{portfolioSummary.unrealizedGainPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Estimated Annual Dividends */}
            <div className="p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-medium text-emerald-400 block uppercase tracking-wider">
                Est. Annual Dividends
              </span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
                SGD ${portfolioSummary.totalAnnualDividend.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                avg <strong className="text-slate-200">${portfolioSummary.monthlyIncome.toFixed(0)}</strong> / month (0% tax)
              </div>
            </div>

            {/* Yield on Cost & Current Yield */}
            <div className="p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                Yield on Cost (YOC)
              </span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-300 font-mono tabular-nums tracking-tight">
                {portfolioSummary.yieldOnCost.toFixed(2)}%
              </div>
              <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                Current Yield: <span className="text-white font-semibold">{portfolioSummary.portfolioYield.toFixed(2)}%</span>
              </div>
            </div>

            {/* Next Payout Pipeline */}
            <div className="p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                Next Payout Pipeline
              </span>
              {portfolioSummary.nextPayout ? (
                <>
                  <div className="text-base sm:text-xl font-bold text-white font-mono tabular-nums tracking-tight">
                    SGD ${portfolioSummary.nextPayout.amount.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    {portfolioSummary.nextPayout.ticker} on <span className="text-emerald-400 font-semibold">{portfolioSummary.nextPayout.date}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-base sm:text-xl font-bold text-slate-400 font-mono">
                    No Payouts Pending
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Add SGX stocks to track calendar
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {currentTab === 'screener' && (
          <StockPicker
            stocks={stocks}
            onSelectStock={(stock) => setSelectedStockForModal(stock)}
            onAddToPortfolio={(stock) => handleOpenAddModal(stock)}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioTracker
            stocks={stocks}
            holdings={holdings}
            onAddHolding={() => handleOpenAddModal()}
            onEditHolding={handleEditHolding}
            onDeleteHolding={handleDeleteHolding}
            onLoadPreset={handleLoadPreset}
            onClearPortfolio={handleClearPortfolio}
            onSelectStock={(stock) => setSelectedStockForModal(stock)}
          />
        )}

        {currentTab === 'calendar' && (
          <DividendCalendar
            stocks={stocks}
            holdings={holdings}
            onSelectStock={(stock) => setSelectedStockForModal(stock)}
          />
        )}

        {currentTab === 'calculator' && (
          <DripCalculator />
        )}
      </main>

      {/* Detailed Stock Modal */}
      {selectedStockForModal && (
        <StockDetailModal
          stock={selectedStockForModal}
          onClose={() => setSelectedStockForModal(null)}
          onAddToPortfolio={(stock) => {
            setSelectedStockForModal(null);
            handleOpenAddModal(stock);
          }}
        />
      )}

      {/* Add / Edit Holding Modal */}
      {isAddModalOpen && (
        <AddHoldingModal
          stocks={stocks}
          initialStock={initialStockForAdd}
          holdingToEdit={holdingToEdit}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveHolding}
        />
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">SGX Dividend Hub</span>
            <span aria-hidden="true">·</span>
            <span>Singapore Exchange equities &amp; S-REIT analytics</span>
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            Market metrics &amp; distributions for educational evaluation · Not financial advice
          </div>
        </div>
      </footer>
    </div>
  );
}
