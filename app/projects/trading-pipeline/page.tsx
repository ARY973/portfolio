export default function TradingPipeline() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-white">

      <p className="text-sm text-white/50 uppercase tracking-widest mb-3">
        ML Engineering · FinTech · Advanced Python @ USU
      </p>

      <h1 className="text-4xl font-bold mb-6">
        AI-Powered Stock Trading Pipeline
      </h1>

      <p className="text-white/75 text-lg leading-relaxed mb-10">
        An end-to-end automated trading system built for my Advanced Python 
        course at Utah State University — deployed on AWS EC2 and running 
        every weekday at 9am ET without manual intervention.
      </p>

      {/* Architecture */}
      <h2 className="text-2xl font-semibold mb-4">Architecture</h2>
      <div className="space-y-4 mb-12">
        {[
          { file: "data_fetcher.py", desc: "Pulls real stock price data via yfinance and SEC 10-K filing metadata via the EDGAR API for 10 stocks: AAPL, MSFT, GOOGL, AMZN, NVDA, META, JPM, TSLA, AMD, NFLX." },
          { file: "sentiment_analyzer.py", desc: "Fetches actual SEC filing text and sends it to Groq's Llama 3 (llama-3.3-70b-versatile) for financial sentiment scoring — returning positive/negative/neutral scores with reasoning." },
          { file: "financial_signals.py", desc: "Calculates RSI, 20/50-day moving averages, momentum, volatility, P/E ratio, revenue growth, profit margin, debt-to-equity, and return on equity." },
          { file: "ml_model.py", desc: "Trains an XGBoost classifier combining all signals to generate BUY/SELL predictions with confidence scores and feature importance rankings." },
          { file: "alpaca_trader.py", desc: "Executes paper trades on Alpaca for signals exceeding confidence thresholds via the Alpaca paper trading API." },
          { file: "final_project.py", desc: "Orchestrates the full pipeline via subprocess calls, outputs results.json, and logs everything to cron_log.txt." },
        ].map(({ file, desc }) => (
          <div key={file} className="bg-white/10 border border-white/20 rounded-xl p-5">
            <p className="font-mono text-blue-300 text-sm mb-1">{file}</p>
            <p className="text-white/70 text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* Results */}
      <h2 className="text-2xl font-semibold mb-4">Key Findings</h2>
      <div className="grid grid-cols-2 gap-4 mb-12">
        {[
          { label: "NVDA Signal", value: "BUY", sub: "73% revenue growth from AI demand" },
          { label: "TSLA Signal", value: "SELL", sub: "P/E of 363, -3.1% revenue growth" },
          { label: "Top Feature", value: "RSI", sub: "23% importance — consistent with quant research" },
          { label: "Daily Output", value: "10 signals", sub: "6 BUY · 4 SELL, auto-executed" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white/10 border border-white/20 rounded-xl p-5">
            <p className="text-white/50 text-xs uppercase tracking-wide mb-1">{label}</p>
            <p className="text-white font-semibold text-xl">{value}</p>
            <p className="text-white/60 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Stack */}
      <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
      <div className="flex flex-wrap gap-2 mb-12">
        {["Python", "XGBoost", "Groq Llama 3", "SEC EDGAR API", "yfinance", "Alpaca Trading API", "AWS EC2", "crontab", "Scikit-learn", "Pandas"].map((t) => (
          <span key={t} className="text-xs bg-white/20 text-white px-3 py-1 rounded-full border border-white/20">
            {t}
          </span>
        ))}
      </div>

      {/* Automation */}
      <h2 className="text-2xl font-semibold mb-4">Automation</h2>
      <p className="text-white/70 leading-relaxed mb-4">
        The pipeline runs automatically every weekday at 9am ET via crontab on an AWS EC2 instance — no manual triggering required. Results and errors are logged to <span className="font-mono text-blue-300 text-sm">cron_log.txt</span> for monitoring.
      </p>
      <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-green-400 mb-12">
        0 13 * * 1-5 cd /home/ubuntu/data5500_mycode/final_project && python final_project.py
      </div>

      <a href="/projects" className="text-blue-300 hover:text-blue-200 text-sm">
        ← Back to Projects
      </a>

    </main>
  );
}