import React, { useState, useMemo } from 'react';
import { SGXStock } from '../data/sgxStocks';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  TrendingUp, 
  Building2, 
  Calendar, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react';

interface StockPickerProps {
  stocks: SGXStock[];
  onSelectStock: (stock: SGXStock) => void;
  onAddToPortfolio: (stock: SGXStock) => void;
}

type SortField = 'dividendYield' | 'marketCapBillion' | 'price' | 'annualDividend' | 'dividendSafetyScore' | 'pbRatio' | 'exDividendDate';

export const StockPicker: React.FC<StockPickerProps> = ({
  stocks,
  onSelectStock,
  onAddToPortfolio,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [activePreset, setActivePreset] = useState<string>('all');
  const [minYield, setMinYield] = useState<number>(0);
  const [maxGearing, setMaxGearing] = useState<number>(55);
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('dividendYield');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Available Sectors
  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map((s) => s.sector)));
    return ['All', ...list];
  }, [stocks]);

  // Handle Preset Clicks
  const handlePresetSelect = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'all') {
      setSelectedSector('All');
      setMinYield(0);
      setMaxGearing(55);
      setFrequencyFilter('all');
    } else if (preset === 'high-yield') {
      setMinYield(5.5);
      setSelectedSector('All');
    } else if (preset === 'banks') {
      setSelectedSector('Banking & Financials');
      setMinYield(0);
    } else if (preset === 'reits') {
      setSelectedSector('All');
      setMinYield(0);
    } else if (preset === 'low-gearing') {
      setSelectedSector('All');
      setMaxGearing(38);
    } else if (preset === 'quarterly') {
      setFrequencyFilter('Quarterly');
    } else if (preset === 'below-nav') {
      setSelectedSector('All');
      setMinYield(0);
    }
  };

  // Filtered and Sorted Stocks
  const filteredStocks = useMemo(() => {
    return stocks
      .filter((stock) => {
        // Search Term (Ticker or Name)
        const matchesSearch =
          stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        // Sector Filter
        if (selectedSector !== 'All' && stock.sector !== selectedSector) {
          return false;
        }

        // Preset Specifics
        if (activePreset === 'reits' && !stock.isREIT) {
          return false;
        }
        if (activePreset === 'below-nav' && stock.pbRatio >= 1.0) {
          return false;
        }

        // Min Yield
        if (stock.dividendYield < minYield) return false;

        // Max Gearing (for REITs)
        if (stock.isREIT && stock.gearingRatio && stock.gearingRatio > maxGearing) {
          return false;
        }

        // Payout Frequency
        if (frequencyFilter !== 'all' && stock.payoutFrequency !== frequencyFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'exDividendDate') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (valA === undefined) return 1;
        if (valB === undefined) return -1;

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [stocks, searchTerm, selectedSector, activePreset, minYield, maxGearing, frequencyFilter, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for financial yields/metrics
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Fast Presets Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by SGX ticker or company name (e.g. D05, CICT, Singtel, FLCT)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* View Mode Toggle & Filter Expansion */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Presets:</span>
          {[
            { id: 'all', label: 'All Stocks' },
            { id: 'high-yield', label: 'High Yield (>5.5%)' },
            { id: 'banks', label: 'Singapore Banks' },
            { id: 'reits', label: 'S-REITs Only' },
            { id: 'low-gearing', label: 'Low Gearing (<38%)' },
            { id: 'quarterly', label: 'Quarterly Payers' },
            { id: 'below-nav', label: 'P/NAV < 1.0 (Discounted)' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1 text-xs rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in duration-100">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Sector Classification
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400 font-medium">Minimum Dividend Yield</span>
                <span className="font-mono text-emerald-400 font-semibold">{minYield}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={minYield}
                onChange={(e) => setMinYield(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400 font-medium">Max S-REIT Gearing (MAS Cap: 50%)</span>
                <span className="font-mono text-emerald-400 font-semibold">{maxGearing}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="50"
                step="1"
                value={maxGearing}
                onChange={(e) => setMaxGearing(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Distribution Frequency
              </label>
              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Frequencies</option>
                <option value="Quarterly">Quarterly (4x / yr)</option>
                <option value="Semi-Annual">Semi-Annual (2x / yr)</option>
                <option value="Annual">Annual (1x / yr)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Screened Stocks Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-semibold text-white font-mono">{filteredStocks.length}</span> of {stocks.length} SGX Dividend Counters
        </div>
        <div className="flex items-center gap-2">
          <span>Sort:</span>
          <select
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value as SortField);
              setSortAsc(false);
            }}
            className="bg-transparent text-slate-300 font-medium border-b border-slate-700 pb-0.5 focus:outline-none"
          >
            <option value="dividendYield" className="bg-slate-900 text-white">Dividend Yield</option>
            <option value="marketCapBillion" className="bg-slate-900 text-white">Market Capitalization</option>
            <option value="price" className="bg-slate-900 text-white">Share Price</option>
            <option value="annualDividend" className="bg-slate-900 text-white">Annual DPS / DPU</option>
            <option value="pbRatio" className="bg-slate-900 text-white">P/NAV Ratio</option>
            <option value="dividendSafetyScore" className="bg-slate-900 text-white">Safety Score</option>
            <option value="exDividendDate" className="bg-slate-900 text-white">Ex-Dividend Date</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Counter / Company</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Price (SGD)</span>
                      {sortField === 'price' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('dividendYield')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Yield (TTM)</span>
                      {sortField === 'dividendYield' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-3 px-4">Annual DPS / DPU</th>
                  <th className="py-3 px-4">Payout Frequency</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('pbRatio')}
                  >
                    <div className="flex items-center gap-1">
                      <span>P/NAV</span>
                      {sortField === 'pbRatio' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-3 px-4">Gearing</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('dividendSafetyScore')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Safety</span>
                      {sortField === 'dividendSafetyScore' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('exDividendDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Next Ex-Date</span>
                      {sortField === 'exDividendDate' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredStocks.map((stock) => (
                  <tr 
                    key={stock.ticker} 
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectStock(stock)}
                  >
                    {/* Ticker & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {stock.ticker}
                        </span>
                        <div>
                          <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {stock.name}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {stock.sector}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <div className="font-semibold text-white">
                        SGD ${stock.price.toFixed(2)}
                      </div>
                      <div className={`text-[10px] ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </td>

                    {/* Dividend Yield */}
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <div className="text-sm font-bold text-emerald-400">
                        {stock.dividendYield.toFixed(2)}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        5Y: {stock.fiveYearAvgYield.toFixed(2)}%
                      </div>
                    </td>

                    {/* Annual Dividend / DPU */}
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <div className="font-medium text-slate-200">
                        SGD ${stock.annualDividend.toFixed(3)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {stock.payoutRatio.toFixed(0)}% payout
                      </div>
                    </td>

                    {/* Frequency */}
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">
                        {stock.payoutFrequency}
                      </span>
                    </td>

                    {/* P/NAV */}
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <div className="font-medium text-slate-200">
                        {stock.pbRatio.toFixed(2)}x
                      </div>
                      <div className={`text-[10px] ${stock.pbRatio < 1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {stock.pbRatio < 1 ? 'Under NAV' : 'Premium'}
                      </div>
                    </td>

                    {/* Gearing */}
                    <td className="py-3 px-4 font-mono tabular-nums">
                      {stock.isREIT && stock.gearingRatio ? (
                        <div>
                          <span className={`font-semibold ${stock.gearingRatio > 42 ? 'text-amber-400' : 'text-slate-300'}`}>
                            {stock.gearingRatio}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            ICR: {stock.interestCoverageRatio}x
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Safety Score */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {stock.dividendSafetyScore}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {stock.dividendSafetyStatus}
                        </span>
                      </div>
                    </td>

                    {/* Next Ex-Date */}
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-300 text-[11px]">
                      {stock.exDividendDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onAddToPortfolio(stock)}
                          title="Add to portfolio"
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                        <button
                          onClick={() => onSelectStock(stock)}
                          title="Detailed analysis"
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Card Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock) => (
            <div
              key={stock.ticker}
              onClick={() => onSelectStock(stock)}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-800 px-2 py-0.5 rounded text-white border border-slate-700">
                      {stock.ticker}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {stock.sector}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-1 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {stock.name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                    {stock.dividendYield.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-400">Yield (TTM)</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Share Price</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    ${stock.price.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Annual DPS</span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    ${stock.annualDividend.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Frequency</span>
                  <span className="font-medium text-slate-300">
                    {stock.payoutFrequency}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-mono">
                  Ex-Date: <strong className="text-slate-300">{stock.exDividendDate}</strong>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPortfolio(stock);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredStocks.length === 0 && (
        <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No SGX Stocks Match Filter Criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your minimum yield threshold, clearing the search query, or selecting "All Stocks" preset.
          </p>
          <button
            onClick={() => handlePresetSelect('all')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
