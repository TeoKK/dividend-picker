import React, { useState, useMemo } from 'react';
import { SGXStock, PortfolioHolding } from '../data/sgxStocks';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface DividendCalendarProps {
  stocks: SGXStock[];
  holdings: PortfolioHolding[];
  onSelectStock: (stock: SGXStock) => void;
}

export const DividendCalendar: React.FC<DividendCalendarProps> = ({
  stocks,
  holdings,
  onSelectStock,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'portfolio'>('all');
  const [timelineScope, setTimelineScope] = useState<'upcoming' | 'all'>('upcoming');

  const today = new Date();

  // Extract all dividend events
  const calendarEvents = useMemo(() => {
    const list: Array<{
      stock: SGXStock;
      userShares: number;
      estimatedPayout: number;
      exDate: string;
      recordDate: string;
      payDate: string;
      amountPerShare: number;
      daysUntilEx: number;
      daysUntilPay: number;
      isExPassed: boolean;
      isPayPassed: boolean;
    }> = [];

    const targetStocks = filterMode === 'portfolio'
      ? stocks.filter((s) => holdings.some((h) => h.ticker === s.ticker))
      : stocks;

    targetStocks.forEach((stock) => {
      const userHolding = holdings.find((h) => h.ticker === stock.ticker);
      const userShares = userHolding ? userHolding.shares : 0;
      const estimatedPayout = userShares * stock.nextEstimatedDividend;

      const exTime = new Date(stock.exDividendDate).getTime();
      const payTime = new Date(stock.payoutDate).getTime();
      const nowTime = today.getTime();

      const daysUntilEx = Math.ceil((exTime - nowTime) / (1000 * 60 * 60 * 24));
      const daysUntilPay = Math.ceil((payTime - nowTime) / (1000 * 60 * 60 * 24));

      list.push({
        stock,
        userShares,
        estimatedPayout,
        exDate: stock.exDividendDate,
        recordDate: stock.recordDate,
        payDate: stock.payoutDate,
        amountPerShare: stock.nextEstimatedDividend,
        daysUntilEx,
        daysUntilPay,
        isExPassed: daysUntilEx < 0,
        isPayPassed: daysUntilPay < 0,
      });
    });

    // Sort by Ex-Dividend Date
    return list.sort((a, b) => new Date(a.exDate).getTime() - new Date(b.exDate).getTime());
  }, [stocks, holdings, filterMode, today]);

  const upcomingEvents = useMemo(() => {
    return calendarEvents.filter((ev) => !ev.isPayPassed);
  }, [calendarEvents]);

  const displayedEvents = timelineScope === 'upcoming' ? upcomingEvents : calendarEvents;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span>SGX Ex-Dividend &amp; Payout Calendar</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key distribution milestones for Singapore Exchange dividend stocks and S-REITs
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All SGX Counters ({stocks.length})
            </button>
            <button
              onClick={() => setFilterMode('portfolio')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterMode === 'portfolio' ? 'bg-emerald-600 text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Holdings Only ({holdings.length})
            </button>
          </div>
        </div>
      </div>

      {/* SGX Dividend Education Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-white block">Ex-Dividend Date (XD)</span>
            <span className="text-slate-400 text-[11px] leading-relaxed">
              You must buy shares <strong>before</strong> the Ex-Date. If you buy on or after the Ex-Date, the seller receives the dividend.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-white block">Record Date</span>
            <span className="text-slate-400 text-[11px] leading-relaxed">
              Date SGX registrar compiles the official list of shareholders entitled to distribution. SGX operates on T+2 settlement.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 mt-0.5">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-white block">Payment Date (Tax-Free)</span>
            <span className="text-slate-400 text-[11px] leading-relaxed">
              Actual date cash hits your Singapore bank account / CDP / broker. 0% dividend withholding tax in Singapore.
            </span>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Counter</th>
                <th className="py-3 px-4">Ex-Dividend Date</th>
                <th className="py-3 px-4">Record Date</th>
                <th className="py-3 px-4">Payout Date</th>
                <th className="py-3 px-4 text-right">Est. Dividend / Share</th>
                <th className="py-3 px-4 text-right">My Expected Cashflow</th>
                <th className="py-3 px-4 text-right">Status / Countdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {displayedEvents.map((item) => (
                <tr 
                  key={item.stock.ticker}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectStock(item.stock)}
                >
                  {/* Stock Info */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700 group-hover:border-emerald-500 transition-colors">
                        {item.stock.ticker}
                      </span>
                      <div>
                        <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {item.stock.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.stock.sector} · {item.stock.payoutFrequency}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Ex Date */}
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <span className="font-semibold text-white block">
                      {item.exDate}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.daysUntilEx > 0 ? `in ${item.daysUntilEx} days` : item.daysUntilEx === 0 ? 'Today' : 'Passed'}
                    </span>
                  </td>

                  {/* Record Date */}
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    {item.recordDate}
                  </td>

                  {/* Pay Date */}
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <span className="font-semibold text-emerald-400 block">
                      {item.payDate}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.daysUntilPay > 0 ? `in ${item.daysUntilPay} days` : 'Paid'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <span className="font-bold text-white">
                      SGD ${item.amountPerShare.toFixed(3)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Yield: {item.stock.dividendYield.toFixed(2)}%
                    </span>
                  </td>

                  {/* Expected Cashflow for user's portfolio */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    {item.userShares > 0 ? (
                      <div>
                        <span className="font-bold text-emerald-400">
                          SGD ${item.estimatedPayout.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          on {item.userShares.toLocaleString()} shares
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Countdown status badge */}
                  <td className="py-3.5 px-4 text-right font-sans">
                    {item.daysUntilEx > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.daysUntilEx} days to buy
                      </span>
                    ) : item.daysUntilPay >= 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Pending Payout
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-slate-400">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
