import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Flame, 
  CheckCircle, 
  DollarSign, 
  Repeat, 
  Percent,
  Calendar,
  Layers
} from 'lucide-react';

export const DripCalculator: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState<number>(30000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000);
  const [dividendYield, setDividendYield] = useState<number>(5.5);
  const [dividendGrowthRate, setDividendGrowthRate] = useState<number>(3.0);
  const [capitalAppreciationRate, setCapitalAppreciationRate] = useState<number>(2.0);
  const [years, setYears] = useState<number>(15);
  const [enableDrip, setEnableDrip] = useState<boolean>(true);

  // Milestone targets
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState<number>(3000);

  // Calculate year-by-year compounding simulation
  const simulationData = useMemo(() => {
    let balanceDrip = initialCapital;
    let balanceNoDrip = initialCapital;
    let totalDividendsReceivedWithDrip = 0;
    let totalDividendsReceivedNoDrip = 0;

    const yearlyRecords: Array<{
      year: number;
      balanceDrip: number;
      balanceNoDrip: number;
      annualDividendDrip: number;
      annualDividendNoDrip: number;
      monthlyDividendDrip: number;
      totalInvested: number;
    }> = [];

    let currentYield = dividendYield / 100;

    for (let yr = 1; yr <= years; yr++) {
      const annualContrib = monthlyContribution * 12;
      const totalInvested = initialCapital + annualContrib * yr;

      // Dividends for this year
      const divWithDrip = balanceDrip * currentYield;
      const divNoDrip = balanceNoDrip * currentYield;

      totalDividendsReceivedWithDrip += divWithDrip;
      totalDividendsReceivedNoDrip += divNoDrip;

      // Balance growth
      // Capital appreciation on existing balance
      balanceDrip = balanceDrip * (1 + capitalAppreciationRate / 100) + annualContrib + (enableDrip ? divWithDrip : 0);
      balanceNoDrip = balanceNoDrip * (1 + capitalAppreciationRate / 100) + annualContrib;

      // Growth in dividend rate for next year
      currentYield = currentYield * (1 + dividendGrowthRate / 100);

      const nextYearAnnualDivDrip = balanceDrip * currentYield;
      const nextYearAnnualDivNoDrip = balanceNoDrip * currentYield;

      yearlyRecords.push({
        year: yr,
        balanceDrip,
        balanceNoDrip,
        annualDividendDrip: nextYearAnnualDivDrip,
        annualDividendNoDrip: nextYearAnnualDivNoDrip,
        monthlyDividendDrip: nextYearAnnualDivDrip / 12,
        totalInvested,
      });
    }

    return yearlyRecords;
  }, [initialCapital, monthlyContribution, dividendYield, dividendGrowthRate, capitalAppreciationRate, years, enableDrip]);

  const finalRecord = simulationData[simulationData.length - 1] || {
    balanceDrip: initialCapital,
    annualDividendDrip: (initialCapital * dividendYield) / 100,
    monthlyDividendDrip: (initialCapital * dividendYield) / 100 / 12,
    totalInvested: initialCapital,
  };

  // Milestone required capital calculation
  const targetAnnualIncome = targetMonthlyIncome * 12;
  const targetRequiredCapital = dividendYield > 0 ? (targetAnnualIncome / (dividendYield / 100)) : 0;

  // Estimate years to hit target
  const yearToHitTarget = useMemo(() => {
    const found = simulationData.find((r) => r.monthlyDividendDrip >= targetMonthlyIncome);
    return found ? found.year : null;
  }, [simulationData, targetMonthlyIncome]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Singapore Dividend Reinvestment (DRIP) &amp; FIRE Calculator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Model compound dividend growth leveraging Singapore's 0% tax on distributions and capital gains
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Reinvest Dividends (DRIP):</span>
            <button
              onClick={() => setEnableDrip(!enableDrip)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                enableDrip
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {enableDrip ? 'Enabled (Compounding)' : 'Disabled (Cash Out)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Simulation Outcomes on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs Column */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Portfolio Assumptions
          </h4>

          {/* Initial Capital */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Initial Capital</span>
              <span className="font-mono text-white font-semibold">SGD ${initialCapital.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={initialCapital}
              onChange={(e) => setInitialCapital(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Monthly Contribution */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Monthly Contribution</span>
              <span className="font-mono text-emerald-400 font-semibold">SGD ${monthlyContribution.toLocaleString()} / mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="250"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Expected Dividend Yield */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">SGX Dividend Yield</span>
              <span className="font-mono text-emerald-400 font-semibold">{dividendYield.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="9"
              step="0.1"
              value={dividendYield}
              onChange={(e) => setDividendYield(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>SG Banks (~5.5%)</span>
              <span>S-REITs (~6.0%)</span>
              <span>High Yield (~7.5%)</span>
            </div>
          </div>

          {/* Annual Dividend Growth Rate */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Annual Dividend Growth (CAGR)</span>
              <span className="font-mono text-white font-semibold">{dividendGrowthRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={dividendGrowthRate}
              onChange={(e) => setDividendGrowthRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Capital Appreciation Rate */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Underlying Price Growth</span>
              <span className="font-mono text-white font-semibold">{capitalAppreciationRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={capitalAppreciationRate}
              onChange={(e) => setCapitalAppreciationRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Years */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Time Horizon</span>
              <span className="font-mono text-white font-semibold">{years} Years</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {[5, 10, 15, 20, 25].map((y) => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`flex-1 py-1 text-xs rounded font-mono transition-colors cursor-pointer border ${
                    years === y
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {y}y
                </button>
              ))}
            </div>
          </div>

          {/* Singapore Tax Advantage Note */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Singapore Tax Advantage</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Unlike the US (30% withholding tax) or Australia/UK, Singapore has <strong>0% tax on dividends</strong> and <strong>0% capital gains tax</strong>, maximizing compounding efficiency.
            </p>
          </div>
        </div>

        {/* Right Outcomes Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Milestone Outcome Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Projected Portfolio Value</span>
              <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
                SGD ${finalRecord.balanceDrip.toLocaleString('en-SG', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                from ${finalRecord.totalInvested.toLocaleString()} invested
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Monthly Passive Cash Flow</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
                SGD ${finalRecord.monthlyDividendDrip.toLocaleString('en-SG', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                ${finalRecord.annualDividendDrip.toLocaleString('en-SG', { maximumFractionDigits: 0 })} / year
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Yield on Original Capital
              </span>
              <div className="text-2xl font-bold text-emerald-300 font-mono tabular-nums tracking-tight">
                {finalRecord.totalInvested > 0 ? ((finalRecord.annualDividendDrip / finalRecord.totalInvested) * 100).toFixed(1) : 0}%
              </div>
              <span className="text-[11px] text-slate-400">
                effective payout on money deposited
              </span>
            </div>
          </div>

          {/* FIRE Target Planner */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Target Monthly Dividend Goal (FIRE)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  How much capital is required to generate your desired Singapore monthly living expenses?
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[1500, 3000, 5000].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTargetMonthlyIncome(t)}
                    className={`px-2.5 py-1 text-xs rounded font-mono transition-colors cursor-pointer border ${
                      targetMonthlyIncome === t
                        ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    ${t}/mo
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Target Monthly Passive Income</div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">
                  SGD ${targetMonthlyIncome.toLocaleString()} / month
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Requires <strong className="text-emerald-400 font-mono">SGD ${targetRequiredCapital.toLocaleString('en-SG', { maximumFractionDigits: 0 })}</strong> in SGX dividend assets @ {dividendYield}% yield
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Estimated Time to Reach</div>
                <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                  {yearToHitTarget ? `${yearToHitTarget} Years` : `>${years} Years`}
                </div>
                <div className="text-[11px] text-slate-400">
                  {yearToHitTarget ? 'at current savings rate' : 'increase monthly contribution'}
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Year Growth Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 text-xs font-semibold text-slate-300">
              Year-by-Year Singapore Dividend Projection
            </div>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3 text-right">Cumulative Capital</th>
                    <th className="py-2 px-3 text-right">Portfolio Value</th>
                    <th className="py-2 px-3 text-right">Annual Dividends</th>
                    <th className="py-2 px-3 text-right">Monthly Cashflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {simulationData.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-white">Year {row.year}</td>
                      <td className="py-2 px-3 text-right text-slate-400 tabular-nums">
                        ${row.totalInvested.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-semibold text-white tabular-nums">
                        ${row.balanceDrip.toLocaleString('en-SG', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                        ${row.annualDividendDrip.toLocaleString('en-SG', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold tabular-nums">
                        ${row.monthlyDividendDrip.toLocaleString('en-SG', { maximumFractionDigits: 0 })} / mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
