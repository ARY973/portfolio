"use client";

import { motion } from "framer-motion";

const projects = [
  {
    id: "loan-risk",
    category: "Financial Analytics",
    title: "FinTech Loan Default Risk Modeling",
    description:
      "Built classification models to predict loan default probability using cross-validation, feature engineering, and model optimization.",
    tech: ["Python", "XGBoost", "Scikit-learn", "FinTech"],
    link: "/projects/loan-default",
    linkLabel: "View Project",
  },
  {
    id: "f1-analytics",
    category: "Machine Learning",
    title: "Formula 1 Performance Analytics",
    description:
      "Analyzed Formula 1 race performance data to uncover patterns in lap consistency, race strategy, and driver performance.",
    tech: ["Python", "Pandas", "Data Analysis"],
    link: "/projects/f1-analysis",
    linkLabel: "View Project",
  },
  {
    id: "housing-price",
    category: "Machine Learning",
    title: "Housing Price Prediction",
    description:
      "Developed regression models to predict housing prices using structured datasets and feature engineering.",
    tech: ["Python", "Regression", "Machine Learning"],
    link: "/projects/housing-price",
    linkLabel: "View Project",
  },
];

/* 🔥 Stagger container controls child reveal */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/* 🔥 Individual card animation */
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
            A selection of machine learning projects focused on real-world data and predictive modeling.
          </p>
        </motion.div>

        {/* CARDS */}
        <motion.div
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
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