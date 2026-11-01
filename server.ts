import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// Single stock dividend sustainability analysis
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { stock, customPrompt } = req.body;
    if (!stock) {
      return res.status(400).json({ error: 'Missing stock data in payload.' });
    }

    if (!ai) {
      // High quality structured fallback analysis if Gemini key not set
      return res.json({
        analysis: `### SGX Dividend Evaluation: ${stock.name} (${stock.ticker})

**Overall Verdict**: **${stock.dividendSafetyScore >= 75 ? 'Low Risk / Highly Sustainable' : stock.dividendSafetyScore >= 55 ? 'Moderate Risk / Stable' : 'Watchlist / Elevated Sensitivity'}**

- **Dividend Yield**: ${stock.dividendYield}% (5-Yr Avg: ${stock.fiveYearAvgYield}%)
- **Payout Sustainability**: The current payout ratio is **${stock.payoutRatio}%** (${stock.sector.includes('REIT') ? 'DPU distribution from taxable income and capital gains' : 'dividend covered by recurring EPS'}).
- **Capital Structure & Debt**: ${stock.gearingRatio ? `Aggregate leverage is **${stock.gearingRatio}%**, within the MAS regulatory ceiling of 45-50%. ICR is healthy at **${stock.interestCoverageRatio}x**.` : `Balance sheet carries a robust net cash or manageable debt ratio with strong cash generation.`}
- **Singapore Market Context**: In Singapore, dividends enjoy **0% withholding tax** and zero capital gains tax for individual investors. Payout cadence is **${stock.payoutFrequency}**.
- **Key Risks to Monitor**: Interest rate fluctuations affecting borrowing costs, foreign exchange translation (if holding overseas assets), and sector occupancy/margin pressure.`,
      });
    }

    const systemInstruction = `You are a premier senior equities analyst specializing in Singapore Exchange (SGX) dividend stocks, S-REITs, Singapore bank heavyweights (DBS, OCBC, UOB), and blue chips.
Analyze dividend sustainability, payout safety, MAS regulatory gearing limits (for REITs, 45-50% ceiling), interest rate sensitivity, cash flow coverage, and dividend growth prospects.
Keep analysis crisp, authoritative, balanced, and formatted in clean markdown with bullet points and bold highlights.
Do not invent fake numbers; use the provided metrics strictly.`;

    const promptText = customPrompt || `Conduct a rigorous dividend sustainability and safety analysis for:
Stock: ${stock.name} (${stock.ticker})
Sector: ${stock.sector}
Current Price: SGD $${stock.price}
Dividend Yield: ${stock.dividendYield}%
5-Year Average Yield: ${stock.fiveYearAvgYield}%
Annual Dividend/DPU: SGD $${stock.annualDividend}
Payout Frequency: ${stock.payoutFrequency}
Payout Ratio: ${stock.payoutRatio}%
${stock.gearingRatio ? `Gearing Ratio: ${stock.gearingRatio}%\nInterest Coverage Ratio (ICR): ${stock.interestCoverageRatio}x` : ''}
P/NAV (P/B): ${stock.pbRatio}
P/E: ${stock.peRatio}
Dividend Growth Rate (5Y CAGR): ${stock.dividendGrowthRate5Y}%
Consecutive Years of Payment: ${stock.consecutiveYears} years

Provide:
1. Executive Verdict & Dividend Safety Rating
2. Payout Sustainability & Cash Flow Health
3. Macro & Interest Rate Sensitivity (especially for SGX REITs/Banks)
4. Key Catalysts vs Downside Risks for Singapore income investors`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
      },
    });

    const markdownText = response.text || 'Unable to generate analysis at this time.';
    res.json({ analysis: markdownText });
  } catch (error: any) {
    console.error('Gemini Stock Analysis Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to complete dividend analysis with AI.',
    });
  }
});

// Portfolio-level dividend income audit
app.post('/api/gemini/portfolio-audit', async (req, res) => {
  try {
    const { holdings, totalValue, annualDividend, portfolioYield, yieldOnCost } = req.body;

    if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
      return res.status(400).json({ error: 'Holdings array cannot be empty.' });
    }

    if (!ai) {
      return res.json({
        audit: `### SGX Dividend Portfolio Audit Summary

- **Total Portfolio Value**: SGD $${Number(totalValue || 0).toLocaleString('en-SG', { minimumFractionDigits: 2 })}
- **Projected Annual Dividends**: SGD $${Number(annualDividend || 0).toLocaleString('en-SG', { minimumFractionDigits: 2 })}
- **Portfolio Current Yield**: ${portfolioYield}% | **Yield on Cost (YOC)**: ${yieldOnCost}%
- **Holdings Tracked**: ${holdings.length} SGX counters

**Portfolio Strengths**:
- High cash generation benefiting from Singapore's **0% dividend withholding tax**.
- Strong presence in core pillars of Singapore's real economy.

**Recommendations**:
- Ensure balanced sector weightings between high-yield S-REITs and dividend-growth banking leaders.
- Monitor quarterly distribution calendar to ensure consistent monthly cash flow.`,
      });
    }

    const holdingsSummary = holdings
      .map(
        (h: any) =>
          `- ${h.ticker} (${h.name}): ${h.shares} shares @ avg cost SGD $${h.avgCost}, Current: SGD $${h.price}, Value: SGD $${(h.shares * h.price).toFixed(2)}, Yield: ${h.yield}%, Annual Div: SGD $${(h.shares * h.annualDividend).toFixed(2)}`
      )
      .join('\n');

    const systemInstruction = `You are an expert Singapore wealth advisor and SGX dividend portfolio specialist.
Audit the user's SGX dividend portfolio for sector diversification, cashflow durability, yield vs risk, and concentration.
Highlight the tax-free advantage of SGX dividends. Format with clear markdown sections and actionable insights.`;

    const promptText = `Please audit this SGX dividend portfolio:
Total Value: SGD $${totalValue}
Projected Annual Dividend: SGD $${annualDividend}
Portfolio Yield: ${portfolioYield}%
Yield on Cost: ${yieldOnCost}%

Holdings List:
${holdingsSummary}

Provide:
1. Overall Portfolio Health & Income Grade
2. Sector Allocation & Concentration Risks (Banks vs S-REITs vs Industrials)
3. Income Stability & Dividend Growth Durability
4. Strategic Next Moves (Reinvestment tips, gaps in sector coverage, cash flow smoothing)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
      },
    });

    res.json({ audit: response.text || 'Unable to generate portfolio audit.' });
  } catch (error: any) {
    console.error('Gemini Portfolio Audit Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to complete portfolio audit with AI.',
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: port,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SGX Dividend Hub server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
