export interface DividendHistoryItem {
  year: number;
  period: string; // e.g. "Q1", "Q2", "Interim", "Final", "Special"
  amount: number; // in SGD
  exDate: string;
  payDate: string;
}

export interface SGXStock {
  ticker: string;
  name: string;
  sector: 
    | 'Banking & Financials'
    | 'S-REITs - Retail'
    | 'S-REITs - Industrial'
    | 'S-REITs - Commercial & Office'
    | 'S-REITs - Healthcare & Specialized'
    | 'Telecommunications'
    | 'Industrials & Engineering'
    | 'Consumer & Supermarkets'
    | 'Utilities & Energy';
  isREIT: boolean;
  price: number;
  change: number;
  changePercent: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCapBillion: number; // SGD Billion
  dividendYield: number; // in %
  annualDividend: number; // in SGD
  payoutFrequency: 'Quarterly' | 'Semi-Annual' | 'Annual';
  payoutMonths: number[]; // 1-12
  payoutRatio: number; // in %
  fiveYearAvgYield: number; // in %
  dividendGrowthRate5Y: number; // in % CAGR
  consecutiveYears: number;
  peRatio: number;
  pbRatio: number; // P/NAV
  navPerShare: number; // in SGD
  gearingRatio?: number; // % (REITs only)
  interestCoverageRatio?: number; // x (REITs only)
  exDividendDate: string;
  recordDate: string;
  payoutDate: string;
  nextEstimatedDividend: number; // in SGD
  hasSpecialDividend?: boolean;
  dividendSafetyScore: number; // 0-100
  dividendSafetyStatus: 'Very Safe' | 'Safe' | 'Borderline' | 'At Risk';
  description: string;
  highlights: string[];
  risks: string[];
  history: DividendHistoryItem[];
}

export const SGX_STOCKS: SGXStock[] = [
  {
    ticker: 'D05.SI',
    name: 'DBS Group Holdings Ltd',
    sector: 'Banking & Financials',
    isREIT: false,
    price: 43.80,
    change: 0.35,
    changePercent: 0.81,
    fiftyTwoWeekHigh: 44.50,
    fiftyTwoWeekLow: 32.10,
    marketCapBillion: 124.6,
    dividendYield: 5.48,
    annualDividend: 2.40,
    payoutFrequency: 'Quarterly',
    payoutMonths: [3, 5, 8, 11],
    payoutRatio: 52.4,
    fiveYearAvgYield: 4.85,
    dividendGrowthRate5Y: 11.2,
    consecutiveYears: 24,
    peRatio: 11.2,
    pbRatio: 1.62,
    navPerShare: 27.04,
    exDividendDate: '2026-11-14',
    recordDate: '2026-11-17',
    payoutDate: '2026-11-28',
    nextEstimatedDividend: 0.60,
    hasSpecialDividend: true,
    dividendSafetyScore: 92,
    dividendSafetyStatus: 'Very Safe',
    description: 'Southeast Asia’s largest bank by market capitalization and assets. Global leader in digital banking and wealth management with an explicit quarterly dividend payout framework.',
    highlights: [
      'Quarterly dividend cadence of ~SGD $0.54 to $0.60/share plus bonus capital return',
      'Strong net interest income and non-interest fee growth from regional wealth management',
      'High CET1 capital ratio (>14.5%) providing generous dividend safety cushion'
    ],
    risks: [
      'Net interest margin (NIM) compression as global central bank rates normalize',
      'Regional credit exposure risks in Greater China and Southeast Asia'
    ],
    history: [
      { year: 2026, period: 'Q3', amount: 0.60, exDate: '2026-11-14', payDate: '2026-11-28' },
      { year: 2026, period: 'Q2', amount: 0.54, exDate: '2026-08-12', payDate: '2026-08-25' },
      { year: 2026, period: 'Q1', amount: 0.54, exDate: '2026-05-15', payDate: '2026-05-28' },
      { year: 2025, period: 'Q4 Final', amount: 0.54, exDate: '2026-03-08', payDate: '2026-03-24' },
      { year: 2025, period: 'Q3', amount: 0.54, exDate: '2025-11-14', payDate: '2025-11-27' },
      { year: 2025, period: 'Special', amount: 0.50, exDate: '2025-04-10', payDate: '2025-04-24' }
    ]
  },
  {
    ticker: 'O39.SI',
    name: 'Oversea-Chinese Banking Corp (OCBC)',
    sector: 'Banking & Financials',
    isREIT: false,
    price: 15.65,
    change: 0.08,
    changePercent: 0.51,
    fiftyTwoWeekHigh: 16.10,
    fiftyTwoWeekLow: 12.80,
    marketCapBillion: 70.4,
    dividendYield: 5.62,
    annualDividend: 0.88,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [6, 10],
    payoutRatio: 51.0,
    fiveYearAvgYield: 5.15,
    dividendGrowthRate5Y: 9.8,
    consecutiveYears: 30,
    peRatio: 9.8,
    pbRatio: 1.25,
    navPerShare: 12.52,
    exDividendDate: '2026-10-06',
    recordDate: '2026-10-07',
    payoutDate: '2026-10-22',
    nextEstimatedDividend: 0.44,
    dividendSafetyScore: 90,
    dividendSafetyStatus: 'Very Safe',
    description: 'Singapore’s longest-established bank with extensive franchise in Southeast Asia and Greater China, coupled with premier insurance subsidiary Great Eastern Holdings.',
    highlights: [
      'Committed target dividend payout ratio of 50% of core net profit',
      'Diversified non-interest income stream from Great Eastern Life and Bank of Singapore',
      'Conservative asset quality with low non-performing loan (NPL) ratio of 1.0%'
    ],
    risks: [
      'Exposure to Greater China trade finance and Hong Kong commercial real estate',
      'Integration costs and capital allocation around Great Eastern privatization'
    ],
    history: [
      { year: 2026, period: 'Interim', amount: 0.44, exDate: '2026-10-06', payDate: '2026-10-22' },
      { year: 2025, period: 'Final', amount: 0.44, exDate: '2026-05-04', payDate: '2026-05-20' },
      { year: 2025, period: 'Interim', amount: 0.42, exDate: '2025-08-11', payDate: '2025-08-27' },
      { year: 2024, period: 'Final', amount: 0.42, exDate: '2025-05-02', payDate: '2025-05-18' }
    ]
  },
  {
    ticker: 'U11.SI',
    name: 'United Overseas Bank Ltd (UOB)',
    sector: 'Banking & Financials',
    isREIT: false,
    price: 33.40,
    change: -0.15,
    changePercent: -0.45,
    fiftyTwoWeekHigh: 34.20,
    fiftyTwoWeekLow: 27.50,
    marketCapBillion: 55.8,
    dividendYield: 5.54,
    annualDividend: 1.85,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [5, 9],
    payoutRatio: 50.8,
    fiveYearAvgYield: 5.02,
    dividendGrowthRate5Y: 8.5,
    consecutiveYears: 28,
    peRatio: 10.1,
    pbRatio: 1.28,
    navPerShare: 26.09,
    exDividendDate: '2026-08-20',
    recordDate: '2026-08-21',
    payoutDate: '2026-09-04',
    nextEstimatedDividend: 0.95,
    dividendSafetyScore: 89,
    dividendSafetyStatus: 'Very Safe',
    description: 'Premier regional bank with unmatched retail and commercial presence across ASEAN following successful acquisition of Citigroup consumer businesses in Malaysia, Thailand, Vietnam, and Indonesia.',
    highlights: [
      'Accelerating cross-border corporate trade connectivity across Southeast Asia',
      'Dividend policy maintains 50% payout ratio with progressive payout trend',
      'Robust liquidity coverage ratio (LCR) and conservative loan-to-deposit ratio'
    ],
    risks: [
      'Regional ASEAN currency volatility impacting translated overseas earnings',
      'Higher integration overheads for acquired retail banking portfolios'
    ],
    history: [
      { year: 2026, period: 'Interim', amount: 0.95, exDate: '2026-08-20', payDate: '2026-09-04' },
      { year: 2025, period: 'Final', amount: 0.90, exDate: '2026-04-28', payDate: '2026-05-14' },
      { year: 2025, period: 'Interim', amount: 0.85, exDate: '2025-08-15', payDate: '2025-08-29' },
      { year: 2024, period: 'Final', amount: 0.85, exDate: '2025-04-26', payDate: '2025-05-13' }
    ]
  },
  {
    ticker: 'C38U.SI',
    name: 'CapitaLand Integrated Commercial Trust (CICT)',
    sector: 'S-REITs - Retail',
    isREIT: true,
    price: 2.12,
    change: 0.01,
    changePercent: 0.47,
    fiftyTwoWeekHigh: 2.18,
    fiftyTwoWeekLow: 1.82,
    marketCapBillion: 14.8,
    dividendYield: 5.14,
    annualDividend: 0.109,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [2, 8],
    payoutRatio: 96.0,
    fiveYearAvgYield: 5.35,
    dividendGrowthRate5Y: 2.4,
    consecutiveYears: 22,
    peRatio: 17.5,
    pbRatio: 0.98,
    navPerShare: 2.16,
    gearingRatio: 39.8,
    interestCoverageRatio: 3.1,
    exDividendDate: '2026-08-05',
    recordDate: '2026-08-06',
    payoutDate: '2026-08-28',
    nextEstimatedDividend: 0.055,
    dividendSafetyScore: 86,
    dividendSafetyStatus: 'Safe',
    description: 'The largest S-REIT by market capitalization in Singapore. Holds iconic downtown and suburban shopping malls and Grade-A office towers including Plaza Singapura, Raffles City, Bugis Junction, and CapitaSpring.',
    highlights: [
      'High portfolio occupancy of ~97.3% with positive rental reversions across suburban and downtown malls',
      'Strong institutional backing by CapitaLand Investment (CLI)',
      'Manageable gearing at 39.8% comfortably below the MAS regulatory ceiling of 45-50%'
    ],
    risks: [
      'Refinancing costs on fixed-rate hedges rolling off over 2026-2027',
      'Deceleration in tourist retail spending and domestic retail consumer sentiment'
    ],
    history: [
      { year: 2026, period: '1H DPU', amount: 0.055, exDate: '2026-08-05', payDate: '2026-08-28' },
      { year: 2025, period: '2H DPU', amount: 0.054, exDate: '2026-02-14', payDate: '2026-03-06' },
      { year: 2025, period: '1H DPU', amount: 0.053, exDate: '2025-08-06', payDate: '2025-08-29' },
      { year: 2024, period: '2H DPU', amount: 0.0545, exDate: '2025-02-12', payDate: '2025-03-07' }
    ]
  },
  {
    ticker: 'A17U.SI',
    name: 'CapitaLand Ascendas REIT (CLAR)',
    sector: 'S-REITs - Industrial',
    isREIT: true,
    price: 2.85,
    change: 0.02,
    changePercent: 0.71,
    fiftyTwoWeekHigh: 2.98,
    fiftyTwoWeekLow: 2.54,
    marketCapBillion: 12.3,
    dividendYield: 5.37,
    annualDividend: 0.153,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [2, 9],
    payoutRatio: 98.2,
    fiveYearAvgYield: 5.42,
    dividendGrowthRate5Y: 1.8,
    consecutiveYears: 22,
    peRatio: 18.2,
    pbRatio: 1.18,
    navPerShare: 2.41,
    gearingRatio: 37.8,
    interestCoverageRatio: 3.6,
    exDividendDate: '2026-08-11',
    recordDate: '2026-08-12',
    payoutDate: '2026-09-02',
    nextEstimatedDividend: 0.077,
    dividendSafetyScore: 85,
    dividendSafetyStatus: 'Safe',
    description: 'Singapore’s first and largest industrial and business space REIT with premium properties spanning Singapore, Australia, the United States, and the United Kingdom.',
    highlights: [
      'High proportion of tech parks, life science hubs, and logistics assets',
      'Solid gearing of 37.8% provides ample debt headroom for accretive acquisitions',
      '79% of borrowings on fixed rates with average debt maturity of 3.8 years'
    ],
    risks: [
      'US tech campus and suburban office softness',
      'Foreign exchange translation headwinds from AUD, GBP, and USD'
    ],
    history: [
      { year: 2026, period: '1H DPU', amount: 0.077, exDate: '2026-08-11', payDate: '2026-09-02' },
      { year: 2025, period: '2H DPU', amount: 0.076, exDate: '2026-02-10', payDate: '2026-03-04' },
      { year: 2025, period: '1H DPU', amount: 0.075, exDate: '2025-08-12', payDate: '2025-09-03' }
    ]
  },
  {
    ticker: 'BUOU.SI',
    name: 'Frasers Logistics & Commercial Trust (FLCT)',
    sector: 'S-REITs - Industrial',
    isREIT: true,
    price: 1.05,
    change: 0.00,
    changePercent: 0.00,
    fiftyTwoWeekHigh: 1.18,
    fiftyTwoWeekLow: 0.94,
    marketCapBillion: 3.9,
    dividendYield: 6.48,
    annualDividend: 0.068,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [6, 12],
    payoutRatio: 99.0,
    fiveYearAvgYield: 5.90,
    dividendGrowthRate5Y: 1.2,
    consecutiveYears: 8,
    peRatio: 14.8,
    pbRatio: 0.88,
    navPerShare: 1.19,
    gearingRatio: 33.2,
    interestCoverageRatio: 5.1,
    exDividendDate: '2026-11-12',
    recordDate: '2026-11-13',
    payoutDate: '2026-12-18',
    nextEstimatedDividend: 0.034,
    dividendSafetyScore: 88,
    dividendSafetyStatus: 'Safe',
    description: 'Premier logistics-focused S-REIT with prime modern logistics and industrial properties in Australia, Germany, the UK, the Netherlands, and Singapore.',
    highlights: [
      'One of the lowest gearing ratios among all S-REITs at just 33.2%',
      'High interest coverage ratio (ICR) of 5.1x ensuring rock-solid debt serviceability',
      'Trades at an attractive ~12% discount to NAV with modern logistics portfolio'
    ],
    risks: [
      'UK commercial business parks tenant retention',
      'EUR and AUD currency depreciation against SGD'
    ],
    history: [
      { year: 2026, period: '2H DPU', amount: 0.034, exDate: '2026-11-12', payDate: '2026-12-18' },
      { year: 2026, period: '1H DPU', amount: 0.034, exDate: '2026-05-18', payDate: '2026-06-25' },
      { year: 2025, period: '2H DPU', amount: 0.035, exDate: '2025-11-11', payDate: '2025-12-19' }
    ]
  },
  {
    ticker: 'N2IU.SI',
    name: 'Mapletree Pan Asia Commercial Trust (MPACT)',
    sector: 'S-REITs - Retail',
    isREIT: true,
    price: 1.34,
    change: 0.01,
    changePercent: 0.75,
    fiftyTwoWeekHigh: 1.48,
    fiftyTwoWeekLow: 1.18,
    marketCapBillion: 7.1,
    dividendYield: 6.64,
    annualDividend: 0.089,
    payoutFrequency: 'Quarterly',
    payoutMonths: [2, 5, 8, 11],
    payoutRatio: 98.0,
    fiveYearAvgYield: 5.85,
    dividendGrowthRate5Y: -0.5,
    consecutiveYears: 13,
    peRatio: 15.1,
    pbRatio: 0.78,
    navPerShare: 1.72,
    gearingRatio: 38.5,
    interestCoverageRatio: 2.9,
    exDividendDate: '2026-11-06',
    recordDate: '2026-11-09',
    payoutDate: '2026-12-04',
    nextEstimatedDividend: 0.022,
    dividendSafetyScore: 78,
    dividendSafetyStatus: 'Safe',
    description: 'Flagship commercial REIT owning VivoCity (Singapore’s largest shopping mall) and Mapletree Business City, alongside commercial properties in Hong Kong, Japan, and China.',
    highlights: [
      'VivoCity continues record tenant sales and near 100% committed occupancy',
      'Substantial 22% discount to Net Asset Value (P/NAV 0.78)',
      'Successful divestment of non-core assets to de-lever balance sheet'
    ],
    risks: [
      'Festival Walk Hong Kong retail tenant rental reversions',
      'Higher borrowing costs impacting overseas property income'
    ],
    history: [
      { year: 2026, period: 'Q2', amount: 0.022, exDate: '2026-11-06', payDate: '2026-12-04' },
      { year: 2026, period: 'Q1', amount: 0.0225, exDate: '2026-08-04', payDate: '2026-09-01' },
      { year: 2025, period: 'Q4', amount: 0.0225, exDate: '2026-05-08', payDate: '2026-06-05' },
      { year: 2025, period: 'Q3', amount: 0.022, exDate: '2026-02-06', payDate: '2026-03-05' }
    ]
  },
  {
    ticker: 'M44U.SI',
    name: 'Mapletree Logistics Trust (MLT)',
    sector: 'S-REITs - Industrial',
    isREIT: true,
    price: 1.36,
    change: -0.01,
    changePercent: -0.73,
    fiftyTwoWeekHigh: 1.62,
    fiftyTwoWeekLow: 1.25,
    marketCapBillion: 6.8,
    dividendYield: 6.47,
    annualDividend: 0.088,
    payoutFrequency: 'Quarterly',
    payoutMonths: [3, 6, 9, 12],
    payoutRatio: 99.0,
    fiveYearAvgYield: 5.40,
    dividendGrowthRate5Y: 0.8,
    consecutiveYears: 19,
    peRatio: 15.6,
    pbRatio: 0.96,
    navPerShare: 1.42,
    gearingRatio: 40.2,
    interestCoverageRatio: 3.4,
    exDividendDate: '2026-11-02',
    recordDate: '2026-11-03',
    payoutDate: '2026-12-15',
    nextEstimatedDividend: 0.0215,
    dividendSafetyScore: 79,
    dividendSafetyStatus: 'Safe',
    description: 'First Asia-focused logistics REIT in Singapore with modern warehouse networks spanning Singapore, Hong Kong, Japan, China, Australia, South Korea, Malaysia, and Vietnam.',
    highlights: [
      'High logistics occupancy of ~96% underpinned by e-commerce and consumer staples logistics',
      'Active asset recycling divesting older Singapore warehouses to fund modern Grade-A logistics assets',
      '84% of debt on fixed interest rates'
    ],
    risks: [
      'Weakness and oversupply in regional China tier-2 warehouse markets',
      'Japanese Yen depreciation impacting reported SGD DPU contributions'
    ],
    history: [
      { year: 2026, period: 'Q2', amount: 0.0215, exDate: '2026-11-02', payDate: '2026-12-15' },
      { year: 2026, period: 'Q1', amount: 0.0220, exDate: '2026-08-01', payDate: '2026-09-12' },
      { year: 2025, period: 'Q4', amount: 0.0222, exDate: '2026-05-02', payDate: '2026-06-18' }
    ]
  },
  {
    ticker: 'C2PU.SI',
    name: 'Parkway Life REIT (PLife)',
    sector: 'S-REITs - Healthcare & Specialized',
    isREIT: true,
    price: 3.75,
    change: 0.02,
    changePercent: 0.54,
    fiftyTwoWeekHigh: 3.98,
    fiftyTwoWeekLow: 3.42,
    marketCapBillion: 2.3,
    dividendYield: 4.05,
    annualDividend: 0.152,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [3, 9],
    payoutRatio: 99.5,
    fiveYearAvgYield: 3.85,
    dividendGrowthRate5Y: 3.2,
    consecutiveYears: 17,
    peRatio: 22.8,
    pbRatio: 1.58,
    navPerShare: 2.37,
    gearingRatio: 36.4,
    interestCoverageRatio: 10.2,
    exDividendDate: '2026-08-14',
    recordDate: '2026-08-17',
    payoutDate: '2026-09-18',
    nextEstimatedDividend: 0.076,
    dividendSafetyScore: 95,
    dividendSafetyStatus: 'Very Safe',
    description: 'One of Asia’s largest listed healthcare REITs. Holds Singapore’s premier private hospitals (Mount Elizabeth, Gleneagles, Parkway East) under a 20-year master lease plus over 50 nursing homes in Japan.',
    highlights: [
      '17 consecutive years of uninterrupted distribution per unit (DPU) growth since IPO',
      'Ultra-high Interest Coverage Ratio (ICR) of 10.2x — highest in the S-REIT sector',
      'Built-in inflation rent review mechanism with guaranteed 3% annual minimum rental step-up in Singapore'
    ],
    risks: [
      'Lower headline yield (~4%) compared to industrial and retail REITs due to its defensive safety premium',
      'Depreciation of the Japanese Yen impacting nursing home cash flow conversions'
    ],
    history: [
      { year: 2026, period: '1H DPU', amount: 0.076, exDate: '2026-08-14', payDate: '2026-09-18' },
      { year: 2025, period: '2H DPU', amount: 0.076, exDate: '2026-02-18', payDate: '2026-03-24' },
      { year: 2025, period: '1H DPU', amount: 0.075, exDate: '2025-08-15', payDate: '2025-09-19' }
    ]
  },
  {
    ticker: 'J69U.SI',
    name: 'Frasers Centrepoint Trust (FCT)',
    sector: 'S-REITs - Retail',
    isREIT: true,
    price: 2.26,
    change: 0.01,
    changePercent: 0.44,
    fiftyTwoWeekHigh: 2.36,
    fiftyTwoWeekLow: 2.05,
    marketCapBillion: 4.1,
    dividendYield: 5.42,
    annualDividend: 0.1225,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [5, 11],
    payoutRatio: 98.0,
    fiveYearAvgYield: 5.60,
    dividendGrowthRate5Y: 1.5,
    consecutiveYears: 18,
    peRatio: 16.8,
    pbRatio: 0.98,
    navPerShare: 2.30,
    gearingRatio: 38.8,
    interestCoverageRatio: 3.3,
    exDividendDate: '2026-11-04',
    recordDate: '2026-11-05',
    payoutDate: '2026-11-27',
    nextEstimatedDividend: 0.061,
    dividendSafetyScore: 87,
    dividendSafetyStatus: 'Safe',
    description: 'Pure-play Singapore suburban retail REIT. Holds essential community malls adjacent to MRT stations including Causeway Point, Northpoint City, Waterway Point, Tampines 1, and NEX.',
    highlights: [
      'Suburban retail footfall remains resilient with strong non-discretionary grocery and F&B tenant demand',
      'Portfolio occupancy remains at a near-full 99.7%',
      '100% Singapore exposure with zero foreign currency conversion risk'
    ],
    risks: [
      'Asset Enhancement Initiative (AEI) downtime during mall refurbishments',
      'Rising utility and maintenance operating costs'
    ],
    history: [
      { year: 2026, period: '2H DPU', amount: 0.061, exDate: '2026-11-04', payDate: '2026-11-27' },
      { year: 2026, period: '1H DPU', amount: 0.0615, exDate: '2026-05-06', payDate: '2026-05-29' },
      { year: 2025, period: '2H DPU', amount: 0.0602, exDate: '2025-11-05', payDate: '2025-11-28' }
    ]
  },
  {
    ticker: 'AJBU.SI',
    name: 'Keppel DC REIT',
    sector: 'S-REITs - Healthcare & Specialized',
    isREIT: true,
    price: 2.18,
    change: 0.03,
    changePercent: 1.40,
    fiftyTwoWeekHigh: 2.30,
    fiftyTwoWeekLow: 1.62,
    marketCapBillion: 3.8,
    dividendYield: 4.36,
    annualDividend: 0.095,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [2, 8],
    payoutRatio: 98.5,
    fiveYearAvgYield: 4.45,
    dividendGrowthRate5Y: 2.1,
    consecutiveYears: 10,
    peRatio: 21.0,
    pbRatio: 1.55,
    navPerShare: 1.41,
    gearingRatio: 37.2,
    interestCoverageRatio: 4.8,
    exDividendDate: '2026-08-03',
    recordDate: '2026-08-04',
    payoutDate: '2026-08-27',
    nextEstimatedDividend: 0.048,
    dividendSafetyScore: 84,
    dividendSafetyStatus: 'Safe',
    description: 'Asia’s first pure-play data center REIT listed on SGX, holding high-specification carrier-neutral data centers across Singapore, Australia, Ireland, Germany, and the Netherlands.',
    highlights: [
      'Massive secular tailwinds from Generative AI workloads and sovereign cloud requirements',
      'Long portfolio weighted average lease expiry (WALE) of >6.5 years with built-in rent escalation',
      'Strong sponsor backing by Keppel Ltd’s infrastructure division'
    ],
    risks: [
      'Guangdong data center tenant settlement recovery timeline',
      'High power availability constraints for expansion in European and Asian hubs'
    ],
    history: [
      { year: 2026, period: '1H DPU', amount: 0.048, exDate: '2026-08-03', payDate: '2026-08-27' },
      { year: 2025, period: '2H DPU', amount: 0.047, exDate: '2026-02-09', payDate: '2026-03-05' }
    ]
  },
  {
    ticker: 'Z74.SI',
    name: 'Singapore Telecommunications Ltd (Singtel)',
    sector: 'Telecommunications',
    isREIT: false,
    price: 3.25,
    change: 0.02,
    changePercent: 0.62,
    fiftyTwoWeekHigh: 3.38,
    fiftyTwoWeekLow: 2.30,
    marketCapBillion: 53.6,
    dividendYield: 5.23,
    annualDividend: 0.170,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [8, 12],
    payoutRatio: 82.0,
    fiveYearAvgYield: 4.95,
    dividendGrowthRate5Y: 8.4,
    consecutiveYears: 27,
    peRatio: 16.5,
    pbRatio: 1.74,
    navPerShare: 1.87,
    exDividendDate: '2026-11-20',
    recordDate: '2026-11-23',
    payoutDate: '2026-12-10',
    nextEstimatedDividend: 0.088,
    hasSpecialDividend: true,
    dividendSafetyScore: 86,
    dividendSafetyStatus: 'Safe',
    description: 'Asia’s leading communications technology group. Operates domestic mobile and enterprise networks alongside dominant stakes in regional champions: Telkomsel (Indonesia), Bharti Airtel (India), and AIS (Thailand).',
    highlights: [
      'Value realization program unlocking billions from assets like Nxera data centers and regional associate stakes',
      'Dividend framework pays 70-90% of underlying net profit PLUS 3-6 cents value realization special dividend',
      'Explosive growth in Bharti Airtel earnings and digital infrastructure monetization'
    ],
    risks: [
      'Intense mobile price competition in Australian subsidiary Optus',
      'Australian cyber compliance capital expenditures'
    ],
    history: [
      { year: 2026, period: 'Interim + Special', amount: 0.088, exDate: '2026-11-20', payDate: '2026-12-10' },
      { year: 2026, period: 'Final', amount: 0.082, exDate: '2026-07-28', payDate: '2026-08-18' },
      { year: 2025, period: 'Interim', amount: 0.052, exDate: '2025-11-21', payDate: '2025-12-11' },
      { year: 2025, period: 'Value Dividend', amount: 0.038, exDate: '2025-07-30', payDate: '2025-08-20' }
    ]
  },
  {
    ticker: 'S63.SI',
    name: 'Singapore Technologies Engineering (ST Engineering)',
    sector: 'Industrials & Engineering',
    isREIT: false,
    price: 4.70,
    change: 0.04,
    changePercent: 0.86,
    fiftyTwoWeekHigh: 4.85,
    fiftyTwoWeekLow: 3.75,
    marketCapBillion: 14.7,
    dividendYield: 3.62,
    annualDividend: 0.170,
    payoutFrequency: 'Quarterly',
    payoutMonths: [3, 6, 9, 12],
    payoutRatio: 78.5,
    fiveYearAvgYield: 3.80,
    dividendGrowthRate5Y: 4.1,
    consecutiveYears: 25,
    peRatio: 21.8,
    pbRatio: 5.20,
    navPerShare: 0.90,
    exDividendDate: '2026-11-18',
    recordDate: '2026-11-19',
    payoutDate: '2026-12-05',
    nextEstimatedDividend: 0.0425,
    dividendSafetyScore: 91,
    dividendSafetyStatus: 'Very Safe',
    description: 'Global technology, defense, and engineering group with market leadership in commercial aerospace maintenance (MRO), defense systems, satellite communications, and smart city infrastructure.',
    highlights: [
      'Record high order book of over SGD $27+ Billion providing 3+ years of revenue visibility',
      'Stable quarterly dividend of SGD 4.0 to 4.25 cents per share every single quarter',
      'Resilient sovereign defense contracts from Singapore Ministry of Defence (MINDEF)'
    ],
    risks: [
      'Debt burden from TransCore tolling acquisition continuing to amortize',
      'Supply chain bottlenecks for aircraft spare parts and defense hardware'
    ],
    history: [
      { year: 2026, period: 'Q3', amount: 0.0425, exDate: '2026-11-18', payDate: '2026-12-05' },
      { year: 2026, period: 'Q2', amount: 0.0425, exDate: '2026-08-19', payDate: '2026-09-04' },
      { year: 2026, period: 'Q1', amount: 0.0425, exDate: '2026-05-20', payDate: '2026-06-05' },
      { year: 2025, period: 'Q4', amount: 0.040, exDate: '2026-03-12', payDate: '2026-03-27' }
    ]
  },
  {
    ticker: 'BN4.SI',
    name: 'Keppel Ltd',
    sector: 'Industrials & Engineering',
    isREIT: false,
    price: 6.80,
    change: 0.05,
    changePercent: 0.74,
    fiftyTwoWeekHigh: 7.20,
    fiftyTwoWeekLow: 5.95,
    marketCapBillion: 12.1,
    dividendYield: 5.29,
    annualDividend: 0.360,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [5, 8],
    payoutRatio: 65.0,
    fiveYearAvgYield: 5.10,
    dividendGrowthRate5Y: 6.8,
    consecutiveYears: 23,
    peRatio: 12.5,
    pbRatio: 1.15,
    navPerShare: 5.91,
    exDividendDate: '2026-08-07',
    recordDate: '2026-08-10',
    payoutDate: '2026-08-25',
    nextEstimatedDividend: 0.18,
    hasSpecialDividend: true,
    dividendSafetyScore: 84,
    dividendSafetyStatus: 'Safe',
    description: 'Transformed global asset manager and infrastructure operator focused on energy transition, real estate solutions, and digital infrastructure with SGD 200B FUM target.',
    highlights: [
      'High recurring asset management fee income replacing cyclical offshore marine earnings',
      'Ongoing capital distribution via cash dividends and share buybacks',
      'Strong institutional alignment with global sovereign wealth capital'
    ],
    risks: [
      'Pace of private equity fundraising amidst global macro uncertainty',
      'Residual legacy assets monetization timing'
    ],
    history: [
      { year: 2026, period: 'Interim', amount: 0.18, exDate: '2026-08-07', payDate: '2026-08-25' },
      { year: 2025, period: 'Final', amount: 0.18, exDate: '2026-05-02', payDate: '2026-05-19' },
      { year: 2025, period: 'Interim', amount: 0.15, exDate: '2025-08-08', payDate: '2025-08-26' }
    ]
  },
  {
    ticker: 'OV8.SI',
    name: 'Sheng Siong Group Ltd',
    sector: 'Consumer & Supermarkets',
    isREIT: false,
    price: 1.58,
    change: 0.01,
    changePercent: 0.64,
    fiftyTwoWeekHigh: 1.64,
    fiftyTwoWeekLow: 1.45,
    marketCapBillion: 2.37,
    dividendYield: 4.11,
    annualDividend: 0.065,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [5, 8],
    payoutRatio: 72.0,
    fiveYearAvgYield: 4.05,
    dividendGrowthRate5Y: 4.5,
    consecutiveYears: 14,
    peRatio: 17.2,
    pbRatio: 4.10,
    navPerShare: 0.385,
    exDividendDate: '2026-08-18',
    recordDate: '2026-08-19',
    payoutDate: '2026-08-28',
    nextEstimatedDividend: 0.033,
    dividendSafetyScore: 94,
    dividendSafetyStatus: 'Very Safe',
    description: 'One of Singapore’s top supermarket chains with over 70 stores located in heartland HDB residential estates. Known for pristine gross margins and defensive consumer staples cash flow.',
    highlights: [
      'Pristine net cash balance sheet with zero bank debt',
      'Direct beneficiary of government Community Development Council (CDC) vouchers',
      'Committed dividend payout policy distributing at least 70% of net profit'
    ],
    risks: [
      'High labor costs and utility tariff increases for retail supermarket refrigeration',
      'Intensified competition from FairPrice and online grocery delivery platforms'
    ],
    history: [
      { year: 2026, period: 'Interim', amount: 0.033, exDate: '2026-08-18', payDate: '2026-08-28' },
      { year: 2025, period: 'Final', amount: 0.032, exDate: '2026-05-08', payDate: '2026-05-22' },
      { year: 2025, period: 'Interim', amount: 0.032, exDate: '2025-08-19', payDate: '2025-08-29' }
    ]
  },
  {
    ticker: 'CJLU.SI',
    name: 'NetLink NBN Trust',
    sector: 'Telecommunications',
    isREIT: false,
    price: 0.88,
    change: 0.00,
    changePercent: 0.00,
    fiftyTwoWeekHigh: 0.91,
    fiftyTwoWeekLow: 0.83,
    marketCapBillion: 3.43,
    dividendYield: 6.02,
    annualDividend: 0.053,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [6, 11],
    payoutRatio: 98.0,
    fiveYearAvgYield: 5.65,
    dividendGrowthRate5Y: 1.9,
    consecutiveYears: 8,
    peRatio: 32.5,
    pbRatio: 1.34,
    navPerShare: 0.657,
    exDividendDate: '2026-11-13',
    recordDate: '2026-11-16',
    payoutDate: '2026-11-26',
    nextEstimatedDividend: 0.0265,
    dividendSafetyScore: 92,
    dividendSafetyStatus: 'Very Safe',
    description: 'Sole nationwide provider of optical fiber infrastructure in Singapore under the Next Gen NBN scheme. Natural regulatory monopoly delivering mission-critical fiber connections to all homes and offices.',
    highlights: [
      'Utility-grade defensive cash flows with ~100% residential fiber household penetration in Singapore',
      'Stable distribution per unit (DPU) supported by recurring monthly interconnection charges',
      'Low gearing with predictable regulatory pricing reviewed every 5 years by IMDA'
    ],
    risks: [
      'Regulatory wholesale pricing adjustments by Infocomm Media Development Authority (IMDA)',
      'Inflationary operating expenses for duct and manhole maintenance'
    ],
    history: [
      { year: 2026, period: '1H Distribution', amount: 0.0265, exDate: '2026-11-13', payDate: '2026-11-26' },
      { year: 2026, period: '2H Distribution', amount: 0.0265, exDate: '2026-05-14', payDate: '2026-06-11' },
      { year: 2025, period: '1H Distribution', amount: 0.0265, exDate: '2025-11-14', payDate: '2025-11-27' }
    ]
  },
  {
    ticker: 'S68.SI',
    name: 'Singapore Exchange Ltd (SGX)',
    sector: 'Banking & Financials',
    isREIT: false,
    price: 11.85,
    change: 0.05,
    changePercent: 0.42,
    fiftyTwoWeekHigh: 12.40,
    fiftyTwoWeekLow: 9.10,
    marketCapBillion: 12.6,
    dividendYield: 3.12,
    annualDividend: 0.370,
    payoutFrequency: 'Quarterly',
    payoutMonths: [2, 5, 8, 11],
    payoutRatio: 64.0,
    fiveYearAvgYield: 3.45,
    dividendGrowthRate5Y: 3.2,
    consecutiveYears: 24,
    peRatio: 22.4,
    pbRatio: 7.20,
    navPerShare: 1.64,
    exDividendDate: '2026-11-05',
    recordDate: '2026-11-06',
    payoutDate: '2026-11-20',
    nextEstimatedDividend: 0.095,
    dividendSafetyScore: 93,
    dividendSafetyStatus: 'Very Safe',
    description: 'The operator of Singapore’s securities and derivatives exchange. A multi-asset international hub with ironclad monopoly status, expanding rapidly into FX OTC trading, iron ore, and index derivatives.',
    highlights: [
      'Monopoly moat with zero domestic exchange competition',
      'Solid quarterly dividend payouts with commitment to progressive increase',
      'High-margin derivatives and FX trading volumes offsetting slower domestic equity cash turnover'
    ],
    risks: [
      'Lull in primary equity IPO listings on the mainboard',
      'Competition from international exchanges for regional derivatives contracts'
    ],
    history: [
      { year: 2026, period: 'Q1', amount: 0.095, exDate: '2026-11-05', payDate: '2026-11-20' },
      { year: 2025, period: 'Q4 Final', amount: 0.090, exDate: '2026-08-25', payDate: '2026-09-08' },
      { year: 2025, period: 'Q3', amount: 0.090, exDate: '2026-05-05', payDate: '2026-05-19' }
    ]
  },
  {
    ticker: 'BS6.SI',
    name: 'Yangzijiang Shipbuilding Holdings',
    sector: 'Industrials & Engineering',
    isREIT: false,
    price: 2.72,
    change: 0.04,
    changePercent: 1.49,
    fiftyTwoWeekHigh: 2.95,
    fiftyTwoWeekLow: 1.60,
    marketCapBillion: 10.7,
    dividendYield: 4.41,
    annualDividend: 0.120,
    payoutFrequency: 'Annual',
    payoutMonths: [5],
    payoutRatio: 38.0,
    fiveYearAvgYield: 4.20,
    dividendGrowthRate5Y: 22.5,
    consecutiveYears: 17,
    peRatio: 7.8,
    pbRatio: 2.10,
    navPerShare: 1.29,
    exDividendDate: '2026-05-04',
    recordDate: '2026-05-05',
    payoutDate: '2026-05-20',
    nextEstimatedDividend: 0.12,
    dividendSafetyScore: 82,
    dividendSafetyStatus: 'Safe',
    description: 'One of the largest and most cost-effective private shipbuilders in the world. Record orderbook packed with clean-energy dual-fuel containerships, LNG carriers, and bulkers.',
    highlights: [
      'Massive order book extending through 2028-2029 providing guaranteed revenue visibility',
      'Very conservative payout ratio under 40% leaving substantial room for special dividends',
      'Low single-digit P/E multiple (<8x) with solid net cash backing'
    ],
    risks: [
      'Steel plate raw material price fluctuations',
      'Cyclicality of global maritime shipping freight rates'
    ],
    history: [
      { year: 2025, period: 'Annual', amount: 0.120, exDate: '2026-05-04', payDate: '2026-05-20' },
      { year: 2024, period: 'Annual', amount: 0.065, exDate: '2025-05-02', payDate: '2025-05-16' },
      { year: 2023, period: 'Annual', amount: 0.050, exDate: '2024-05-06', payDate: '2024-05-20' }
    ]
  },
  {
    ticker: 'C52.SI',
    name: 'ComfortDelGro Corporation Ltd',
    sector: 'Industrials & Engineering',
    isREIT: false,
    price: 1.48,
    change: 0.01,
    changePercent: 0.68,
    fiftyTwoWeekHigh: 1.55,
    fiftyTwoWeekLow: 1.28,
    marketCapBillion: 3.2,
    dividendYield: 5.06,
    annualDividend: 0.075,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [5, 8],
    payoutRatio: 75.0,
    fiveYearAvgYield: 4.80,
    dividendGrowthRate5Y: 5.2,
    consecutiveYears: 21,
    peRatio: 15.2,
    pbRatio: 1.18,
    navPerShare: 1.25,
    exDividendDate: '2026-08-14',
    recordDate: '2026-08-17',
    payoutDate: '2026-08-28',
    nextEstimatedDividend: 0.038,
    dividendSafetyScore: 83,
    dividendSafetyStatus: 'Safe',
    description: 'One of the world’s largest land transport companies with bus, rail, point-to-point taxi, and private hire operations across Singapore, Australia, the United Kingdom, and Europe.',
    highlights: [
      'International public bus contract wins in the UK, Australia, and Paris Metro',
      'Strong recovery in Singapore taxi ride commission platform fees and rail ridership',
      'Sound net cash balance sheet supporting 70-80% dividend payout policy'
    ],
    risks: [
      'Fuel cost spikes and driver wage inflation in Western Europe and Australia',
      'Fierce ride-hailing competition from Grab in Singapore'
    ],
    history: [
      { year: 2026, period: 'Interim', amount: 0.038, exDate: '2026-08-14', payDate: '2026-08-28' },
      { year: 2025, period: 'Final', amount: 0.037, exDate: '2026-05-05', payDate: '2026-05-21' },
      { year: 2025, period: 'Interim', amount: 0.035, exDate: '2025-08-15', payDate: '2025-08-29' }
    ]
  },
  {
    ticker: 'V03.SI',
    name: 'Venture Corporation Ltd',
    sector: 'Industrials & Engineering',
    isREIT: false,
    price: 13.90,
    change: 0.10,
    changePercent: 0.72,
    fiftyTwoWeekHigh: 15.20,
    fiftyTwoWeekLow: 12.40,
    marketCapBillion: 4.05,
    dividendYield: 5.40,
    annualDividend: 0.750,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [5, 9],
    payoutRatio: 82.0,
    fiveYearAvgYield: 5.25,
    dividendGrowthRate5Y: 1.5,
    consecutiveYears: 30,
    peRatio: 15.6,
    pbRatio: 1.45,
    navPerShare: 9.58,
    exDividendDate: '2026-08-17',
    recordDate: '2026-08-18',
    payoutDate: '2026-09-11',
    nextEstimatedDividend: 0.25,
    dividendSafetyScore: 88,
    dividendSafetyStatus: 'Safe',
    description: 'High-value technology design, engineering, and manufacturing provider with key expertise in medical life sciences, genomics, analytical instrumentation, and advanced industrial connectivity.',
    highlights: [
      'Net cash position exceeding SGD $1.1 Billion (representing over 25% of market cap)',
      'Unbroken track record of dividend payments through all market cycles for 3 decades',
      'High-margin proprietary ODM manufacturing partnerships with global Fortune 500 giants'
    ],
    risks: [
      'Prolonged inventory digestion cycle by global semiconductor and industrial clients',
      'Customer concentration in select medical and analytical equipment verticals'
    ],
    history: [
      { year: 2026, period: 'Interim', amount: 0.25, exDate: '2026-08-17', payDate: '2026-09-11' },
      { year: 2025, period: 'Final', amount: 0.50, exDate: '2026-05-04', payDate: '2026-05-22' },
      { year: 2025, period: 'Interim', amount: 0.25, exDate: '2025-08-18', payDate: '2025-09-12' }
    ]
  },
  {
    ticker: 'U96.SI',
    name: 'Sembcorp Industries Ltd',
    sector: 'Utilities & Energy',
    isREIT: false,
    price: 5.35,
    change: 0.04,
    changePercent: 0.75,
    fiftyTwoWeekHigh: 5.80,
    fiftyTwoWeekLow: 4.60,
    marketCapBillion: 9.5,
    dividendYield: 3.55,
    annualDividend: 0.190,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [5, 8],
    payoutRatio: 36.0,
    fiveYearAvgYield: 3.10,
    dividendGrowthRate5Y: 18.4,
    consecutiveYears: 25,
    peRatio: 10.4,
    pbRatio: 1.85,
    navPerShare: 2.89,
    exDividendDate: '2026-08-12',
    recordDate: '2026-08-13',
    payoutDate: '2026-08-27',
    nextEstimatedDividend: 0.09,
    dividendSafetyScore: 87,
    dividendSafetyStatus: 'Safe',
    description: 'Leading Singapore energy and urban development player. Rapidly transitioning its gross power portfolio to renewables (solar, wind, energy storage) across Singapore, China, India, and the UK.',
    highlights: [
      'Low payout ratio (<40%) offering significant dividend growth headroom',
      'Long-term power purchase agreements (PPA) locking in stable utility earnings',
      'Aggressive expansion of renewable energy capacity exceeding 14 GW'
    ],
    risks: [
      'Wholesale electricity spot price volatility in the Singapore National Electricity Market (NEMS)',
      'High capital expenditure requirements for greenfield renewable projects'
    ],
    history: [
      { year: 2026, period: 'Interim', amount: 0.09, exDate: '2026-08-12', payDate: '2026-08-27' },
      { year: 2025, period: 'Final', amount: 0.10, exDate: '2026-05-05', payDate: '2026-05-20' },
      { year: 2025, period: 'Interim', amount: 0.08, exDate: '2025-08-13', payDate: '2025-08-28' }
    ]
  }
];

export interface PortfolioHolding {
  id: string;
  ticker: string;
  shares: number;
  avgBuyPrice: number;
  buyDate: string;
  notes?: string;
}

export const DEFAULT_PORTFOLIO: PortfolioHolding[] = [
  {
    id: 'hold-1',
    ticker: 'D05.SI', // DBS Group
    shares: 1000,
    avgBuyPrice: 38.50,
    buyDate: '2025-03-15',
    notes: 'Core dividend engine, quarterly payout'
  },
  {
    id: 'hold-2',
    ticker: 'C38U.SI', // CICT
    shares: 6000,
    avgBuyPrice: 1.95,
    buyDate: '2025-05-10',
    notes: 'Prime retail/office S-REIT foundation'
  },
  {
    id: 'hold-3',
    ticker: 'Z74.SI', // Singtel
    shares: 5000,
    avgBuyPrice: 2.85,
    buyDate: '2025-06-20',
    notes: 'Telco + special asset realization dividend'
  },
  {
    id: 'hold-4',
    ticker: 'BUOU.SI', // FLCT
    shares: 8000,
    avgBuyPrice: 1.02,
    buyDate: '2025-08-12',
    notes: 'Low gearing (33%) industrial logistics'
  },
  {
    id: 'hold-5',
    ticker: 'OV8.SI', // Sheng Siong
    shares: 4000,
    avgBuyPrice: 1.50,
    buyDate: '2025-09-05',
    notes: 'Recession-proof grocery cash flow'
  }
];
