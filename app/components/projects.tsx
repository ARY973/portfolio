"use client";

import { motion } from "framer-motion";

const projects = [
  {
    id: "trading-pipeline",
    category: "Product Build · FinTech · ML Engineering",
    title: "AI-Powered Stock Trading System — 0 to 1",
    description:
      "Identified a gap in retail investor decision-making, defined success metrics, and shipped an end-to-end automated pipeline on AWS EC2 — integrating SEC 10-K filings via EDGAR, LLM sentiment scoring via Groq Llama 3, quantitative signals (RSI, P/E, momentum), XGBoost predictions, and automated paper trade execution via Alpaca API. Daily automated execution with logging and error handling.",
    tech: ["Python", "XGBoost", "AWS EC2", "Groq Llama 3", "SEC EDGAR", "Alpaca API"],
    link: "/projects/trading-pipeline",
    linkLabel: "View Project",
  },
  {
    id: "loan-risk",
    category: "FinTech · Data Product",
    title: "FinTech Credit Risk — From Data to Business Decision",
    description:
      "Built ensemble ML models to predict loan default probability using feature engineering, cross-validation, ROC-AUC, and SHAP analysis. Framed outputs as actionable credit risk recommendations for non-technical stakeholders — bridging technical model output and real business decision-making.",
    tech: ["Python", "XGBoost", "Scikit-learn", "SHAP", "FinTech"],
    link: "/projects/loan-default",
    linkLabel: "View Project",
  },
  {
    id: "housing-price",
    category: "Machine Learning · Market Intelligence",
    title: "Housing Market Intelligence — 335 US Cities",
    description:
      "Integrated multi-source socio-economic datasets across 335 US cities into a unified analytical model. Identified pricing patterns, growth signals, and investment insights — presented as a clear, actionable data narrative rather than raw model output.",
    tech: ["Python", "Regression Modeling", "Pandas", "Data Visualization"],
    link: "/projects/housing-price",
    linkLabel: "View Project",
  },
  {
    id: "f1-analytics",
    category: "Sports Analytics · Machine Learning",
    title: "Formula 1 Performance Analytics",
    description:
      "Analyzed Formula 1 race performance data to surface patterns in lap consistency, race strategy, and driver performance across seasons. Translated complex motorsport data into clear competitive insights.",
    tech: ["Python", "Pandas", "Data Analysis", "Visualization"],
    link: "/projects/f1-analysis",
    linkLabel: "View Project",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Projects() {
  return (
    <section id="work" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Projects
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            End-to-end product builds and data systems — from problem identification
            to shipped solution.
          </p>
        </motion.div>

        {/* CARDS */}
        <motion.div
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="
                relative
                bg-white/10 backdrop-blur-md
                border border-white/20
                rounded-2xl
                p-8
                shadow-lg
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                hover:border-white/40
              "
            >
              {/* Glow layer */}
              <div className="
                pointer-events-none
                absolute inset-0
                rounded-2xl
                opacity-0
                hover:opacity-100
                transition
                bg-gradient-to-br
                from-indigo-400/20
                via-purple-400/10
                to-transparent
              " />

              <p className="text-sm text-white/60 mb-1 relative z-10">
                {project.category}
              </p>

              <h3 className="text-xl font-semibold text-white relative z-10">
                {project.title}
              </h3>

              <p className="mt-3 text-white/75 relative z-10">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                {project.tech.map((techItem) => (
                  <span
                    key={techItem}
                    className="
                      text-xs
                      bg-white/20
                      text-white
                      px-3 py-1
                      rounded-full
                      border border-white/20
                    "
                  >
                    {techItem}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                className="
                  inline-flex items-center gap-1
                  mt-6
                  text-sm font-medium
                  text-blue-300
                  hover:text-blue-200
                  transition
                  relative z-10
                "
              >
                {project.linkLabel}
                <span>→</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
