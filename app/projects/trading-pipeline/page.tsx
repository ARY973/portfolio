import PipelineFlow from "../../components/PipelineFlow";

const STAGES = [
  {
    name: "Fetch prices and filings",
    detail:
      "data_fetcher.py pulls daily prices and the latest SEC 10-K text for ten tickers.",
    out: "10 tickers, prices + filings written to data/",
  },
  {
    name: "Score sentiment",
    detail:
      "sentiment_analyzer.py sends the filing text to Groq's Llama 3 (llama-3.3-70b-versatile) for financial sentiment, with reasoning attached.",
    out: "sentiment_scores.csv",
  },
  {
    name: "Build signals",
    detail:
      "financial_signals.py computes RSI, P/E, revenue growth and 20-day momentum from the price history.",
    out: "financial_signals.csv",
  },
  {
    name: "Predict",
    detail:
      "ml_model.py combines sentiment and signals in an XGBoost classifier that predicts whether a stock beats earnings expectations.",
    out: "6 buy, 4 sell · best NFLX at 0.758 confidence",
  },
  {
    name: "Execute",
    detail:
      "alpaca_trader.py places the corresponding paper trades through the Alpaca API. No real money is involved.",
    out: "results.json, cron_log.txt",
  },
];

export default function TradingPipeline() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">

      <p className="text-sm text-[var(--ink-3)] mb-3">
        ML Engineering · FinTech · Advanced Python @ USU
      </p>

      <h1 className="text-4xl font-bold mb-6">
        AI-Powered Stock Trading Pipeline
      </h1>

      <p className="text-[var(--ink-2)] text-lg leading-relaxed mb-10">
        An end-to-end automated trading system built for my Advanced Python 
        course at Utah State University, deployed on AWS EC2 and running 
        every weekday at 9am ET without manual intervention.
      </p>

      {/* Watch one run */}
      <div className="mb-16">
        <PipelineFlow
          stages={STAGES}
          caption="Stage names and outputs are taken from the repository. The timing is for watching; the run itself takes minutes."
        />
      </div>

      {/* Architecture */}
      <h2 className="text-2xl md:text-3xl mb-4">Architecture</h2>
      <div className="space-y-4 mb-12">
        {[
          { file: "data_fetcher.py", desc: "Pulls real stock price data via yfinance and SEC 10-K filing metadata via the EDGAR API for 10 stocks: AAPL, MSFT, GOOGL, AMZN, NVDA, META, JPM, TSLA, AMD, NFLX." },
          { file: "sentiment_analyzer.py", desc: "Fetches actual SEC filing text and sends it to Groq's Llama 3 (llama-3.3-70b-versatile) for financial sentiment scoring, returning positive, negative or neutral scores with reasoning." },
          { file: "financial_signals.py", desc: "Calculates RSI, 20/50-day moving averages, momentum, volatility, P/E ratio, revenue growth, profit margin, debt-to-equity, and return on equity." },
          { file: "ml_model.py", desc: "Trains an XGBoost classifier combining all signals to generate BUY/SELL predictions with confidence scores and feature importance rankings." },
          { file: "alpaca_trader.py", desc: "Executes paper trades on Alpaca for signals exceeding confidence thresholds via the Alpaca paper trading API." },
          { file: "final_project.py", desc: "Orchestrates the full pipeline via subprocess calls, outputs results.json, and logs everything to cron_log.txt." },
        ].map(({ file, desc }) => (
          <div key={file} className="py-4 border-b border-[var(--rule)]">
            <p className="font-mono text-[var(--signal)] text-sm mb-1">{file}</p>
            <p className="text-[var(--ink-2)] text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* Results */}
      <h2 className="text-2xl md:text-3xl mb-4">Key Findings</h2>
      <div className="grid grid-cols-2 gap-4 mb-12">
        {[
          { label: "NVDA Signal", value: "BUY", sub: "73% revenue growth from AI demand" },
          { label: "TSLA Signal", value: "SELL", sub: "P/E of 363, -3.1% revenue growth" },
          { label: "Top Feature", value: "RSI", sub: "23% importance, consistent with quant research" },
          { label: "Daily Output", value: "10 signals", sub: "6 BUY · 4 SELL, auto-executed" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="py-4 border-b border-[var(--rule)]">
            <p className="text-[var(--ink-3)] text-xs mb-1">{label}</p>
            <p className="text-[var(--ink)] font-semibold text-xl">{value}</p>
            <p className="text-[var(--ink-2)] text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Stack */}
      <h2 className="text-2xl md:text-3xl mb-4">Tech Stack</h2>
      <div className="flex flex-wrap gap-2 mb-12">
        {["Python", "XGBoost", "Groq Llama 3", "SEC EDGAR API", "yfinance", "Alpaca Trading API", "AWS EC2", "crontab", "Scikit-learn", "Pandas"].map((t) => (
          <span key={t} className="text-xs ">
            {t}
          </span>
        ))}
      </div>

      {/* Automation */}
      <h2 className="text-2xl md:text-3xl mb-4">Automation</h2>
      <p className="text-[var(--ink-2)] leading-relaxed mb-4">
        The pipeline runs automatically every weekday at 9am ET via crontab on an AWS EC2 instance, with no manual triggering required. Results and errors are logged to <span className="font-mono text-[var(--signal)] text-sm">cron_log.txt</span> for monitoring.
      </p>
      <div className="mono text-sm p-4 mb-12">
        0 13 * * 1-5 cd /home/ubuntu/data5500_mycode/final_project && python final_project.py
      </div>

      <a href="/projects" className="link text-sm">
        ← Back to Projects
      </a>

    </main>
  );
}