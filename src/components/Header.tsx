import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  currentTab: 'screener' | 'portfolio' | 'calendar' | 'calculator';
  onTabChange: (tab: 'screener' | 'portfolio' | 'calendar' | 'calculator') => void;
  onOpenAddModal: () => void;
  portfolioHoldingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  portfolioHoldingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div 
          onClick={() => onTabChange('screener')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
          <span>SGX Dividend Hub</span>
        </div>

        {/* Zone 2: 4 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <button
            onClick={() => onTabChange('screener')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentTab === 'screener'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Screener &amp; Picker
          </button>
          <button
            onClick={() => onTabChange('portfolio')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'portfolio'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>My Dividend Tracker</span>
            {portfolioHoldingsCount > 0 && (
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {portfolioHoldingsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('calendar')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentTab === 'calendar'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Dividend Calendar
          </button>
          <button
            onClick={() => onTabChange('calculator')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentTab === 'calculator'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            DRIP &amp; FIRE Calculator
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track Stock</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-900/50 px-2 py-2 text-xs font-medium text-slate-400">
        <button
          onClick={() => onTabChange('screener')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'screener' ? 'text-emerald-400 font-semibold' : ''}`}
        >
          Screener
        </button>
        <button
          onClick={() => onTabChange('portfolio')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'portfolio' ? 'text-emerald-400 font-semibold' : ''}`}
        >
          My Dividends ({portfolioHoldingsCount})
        </button>
        <button
          onClick={() => onTabChange('calendar')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'calendar' ? 'text-emerald-400 font-semibold' : ''}`}
        >
          Calendar
        </button>
        <button
          onClick={() => onTabChange('calculator')}
          className={`px-2 py-1 rounded transition-colors ${currentTab === 'calculator' ? 'text-emerald-400 font-semibold' : ''}`}
        >
          DRIP / FIRE
        </button>
      </div>
    </header>
  );
};
