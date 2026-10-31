import Link from "next/link";

type Project = {
  id: string;
  field: string;
  year: string;
  title: string;
  summary: string;
  finding?: string;
  tech: string[];
  href: string;
};

const projects: Project[] = [
  {
    id: "loan-risk",
    field: "Credit risk",
    year: "Feb 2026",
    title: "Scoring borrowers for a micro-lender",
    summary:
      "Benchmarked logistic regression, random forest, gradient boosting and an MLP on 4,269 loan applications. The data carries an approve/reject label rather than an observed default flag, so rejection stands in for default risk. The limitation is stated up front rather than buried.",
    finding:
      "Removing credit score collapsed gradient boosting from 0.99 accuracy to 0.61. A lender serving underbanked borrowers cannot score credit-invisible applicants on this feature set at all.",
    tech: ["Python", "Gradient boosting", "Random forest", "SHAP", "scikit-learn"],
    href: "/projects/loan-default",
  },
  {
    id: "trading-pipeline",
    field: "FinTech",
    year: "Apr 2026",
    title: "An automated trading pipeline, end to end",
    summary:
      "SEC 10-K filings through EDGAR, sentiment scored by Groq Llama 3, quantitative signals (RSI, P/E, momentum) and XGBoost predictions, executing daily paper trades through the Alpaca API. Runs unattended on AWS EC2 with logging and error handling.",
    tech: ["Python", "XGBoost", "AWS EC2", "Groq Llama 3", "SEC EDGAR", "Alpaca"],
    href: "/projects/trading-pipeline",
  },
  {
    id: "housing-price",
    field: "Market analysis",
    year: "2025",
    title: "Housing signals across 335 US cities",
    summary:
      "Merged socio-economic datasets for 335 cities into one regression model, then read it for pricing patterns and growth signals, written as a narrative a non-technical reader can act on rather than a table of coefficients.",
    tech: ["Python", "Regression", "pandas"],
    href: "/projects/housing-price",
  },
  {
    id: "f1-analytics",
    field: "Sports analytics",
    year: "2025",
    title: "What makes a Formula 1 driver consistent",
    summary:
      "Race data across seasons analysed for lap consistency, strategy and driver performance, including how podium probability moves with driver age.",
    tech: ["Python", "pandas", "Visualisation"],
    href: "/projects/f1-analysis",
  },
];

export default function Projects() {
  return (
    <section id="work" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-16">
      <h2 className="text-3xl md:text-4xl mb-3">Work</h2>
      <p
        className="prose-serif text-lg max-w-[58ch] mb-14"
        style={{ color: "var(--ink-2)" }}
      >
        Four builds, each one carried past the model to the decision it was
        supposed to inform.
      </p>

      <div className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        {projects.map((p) => (
          <article
            key={p.id}
            className="spine py-10 rule-bottom"
            style={{ borderColor: "var(--rule)" }}
          >
            <div className="spine-label">
              <span className="block">{p.field}</span>
              <span className="block tabular mt-0.5">{p.year}</span>
            </div>

            <div className="max-w-[62ch]">
              <h3 className="text-xl md:text-2xl mb-3">
                <Link
                  href={p.href}
                  className="hover:underline"
                  style={{
                    textUnderlineOffset: "0.18em",
                    textDecorationThickness: "1px",
                  }}
                >
                  {p.title}
                </Link>
              </h3>

              <p className="prose-serif" style={{ color: "var(--ink-2)" }}>
                {p.summary}
              </p>

              {p.finding && (
                <p
                  className="prose-serif mt-4 pl-4"
                  style={{
                    borderLeft: "2px solid var(--signal)",
                    color: "var(--ink)",
                  }}
                >
                  {p.finding}
                </p>
              )}

              <p className="mt-5 text-sm" style={{ color: "var(--ink-3)" }}>
                {p.tech.join(", ")}
              </p>

              <p className="mt-4 text-sm">
                <Link href={p.href} className="link">
                  Read the write-up
                </Link>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
