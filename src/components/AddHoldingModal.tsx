import React, { useState } from 'react';
import { SGXStock, PortfolioHolding } from '../data/sgxStocks';
import { X, Plus, Calculator, DollarSign, Calendar } from 'lucide-react';

interface AddHoldingModalProps {
  stocks: SGXStock[];
  initialStock?: SGXStock | null;
  holdingToEdit?: PortfolioHolding | null;
  onClose: () => void;
  onSave: (holding: PortfolioHolding) => void;
}

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  stocks,
  initialStock,
  holdingToEdit,
  onClose,
  onSave,
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(
    holdingToEdit ? holdingToEdit.ticker : initialStock ? initialStock.ticker : stocks[0]?.ticker || ''
  );
  
  const selectedStock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0];

  const [shares, setShares] = useState<number>(
    holdingToEdit ? holdingToEdit.shares : 1000
  );
  const [avgBuyPrice, setAvgBuyPrice] = useState<number>(
    holdingToEdit ? holdingToEdit.avgBuyPrice : selectedStock ? selectedStock.price : 1.0
  );
  const [buyDate, setBuyDate] = useState<string>(
    holdingToEdit ? holdingToEdit.buyDate : new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>(
    holdingToEdit?.notes || ''
  );

  const totalCost = shares * avgBuyPrice;
  const annualDividend = selectedStock ? shares * selectedStock.annualDividend : 0;
  const yieldOnCost = avgBuyPrice > 0 && selectedStock ? (selectedStock.annualDividend / avgBuyPrice) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0 || avgBuyPrice <= 0) return;

    onSave({
      id: holdingToEdit ? holdingToEdit.id : `hold-${Date.now()}`,
      ticker: selectedTicker,
      shares,
      avgBuyPrice,
      buyDate,
      notes,
    });
    onClose();
  };

  const handleStockChange = (ticker: string) => {
    setSelectedTicker(ticker);
    const st = stocks.find((s) => s.ticker === ticker);
    if (st && !holdingToEdit) {
      setAvgBuyPrice(st.price);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">
              {holdingToEdit ? 'Edit Holding' : 'Add SGX Stock to Portfolio'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track Singapore dividend income, yield on cost, and payout dates
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Stock Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select SGX Counter
            </label>
            <select
              value={selectedTicker}
              onChange={(e) => handleStockChange(e.target.value)}
              disabled={!!holdingToEdit}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            >
              {stocks.map((s) => (
                <option key={s.ticker} value={s.ticker}>
                  {s.ticker} · {s.name} ({s.dividendYield.toFixed(2)}% Yield)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Lot Buttons & Quantity */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Number of Shares
              </label>
              <div className="flex items-center gap-1">
                {[100, 500, 1000, 5000].map((lot) => (
                  <button
                    type="button"
                    key={lot}
                    onClick={() => setShares(lot)}
                    className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {lot >= 1000 ? `${lot / 1000}k` : lot}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 1000 (standard SGX board lot)"
            />
          </div>

          {/* Buy Price */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Average Buy Price (SGD)
              </label>
              {selectedStock && (
                <button
                  type="button"
                  onClick={() => setAvgBuyPrice(selectedStock.price)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-mono tabular-nums"
                >
                  Use current price (${selectedStock.price.toFixed(2)})
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">SGD $</span>
              <input
                type="number"
                min="0.001"
                step="0.001"
                required
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(Math.max(0.001, parseFloat(e.target.value) || 0))}
                className="w-full pl-14 pr-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Purchase Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={buyDate}
                onChange={(e) => setBuyDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Note / Strategy (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Core dividend pillar"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Capital Cost:</span>
              <span className="font-mono tabular-nums font-semibold text-white">
                SGD ${totalCost.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Projected Annual Dividend:</span>
              <span className="font-mono tabular-nums font-semibold text-emerald-400">
                SGD ${annualDividend.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / yr
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Yield on Cost (YOC):</span>
              <span className="font-mono tabular-nums font-bold text-emerald-400">
                {yieldOnCost.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {holdingToEdit ? 'Save Changes' : 'Confirm & Track'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
