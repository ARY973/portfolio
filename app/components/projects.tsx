"use client";

import { motion } from "framer-motion";

const projects = [
  {
    category: "Machine Learning",
    title: "Formula 1 Performance Analysis",
    description:
      "Applied machine learning techniques to analyze and model Formula 1 performance data, focusing on predictive insights and data-driven evaluation.",
    tech: ["Python", "Pandas", "Scikit-learn", "Machine Learning"],
    link: "/projects/Formula%201%20Presentation.pdf",
    linkLabel: "View Project",
  },
  {
    category: "Machine Learning",
    title: "Housing Price Prediction",
    description:
      "Built predictive models to estimate housing prices using structured data. Emphasized feature engineering, model evaluation, and interpretability.",
    tech: ["Python", "Regression", "Data Analysis"],
    link: "/projects/project-1-presentation.pdf",
    linkLabel: "View Project",
  },
];

export default function Projects() {
  return (
    <section className="relative py-32 px-6">
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
            A selection of machine learning projects focused on real-world data and
            predictive modeling.
          </p>
        </motion.div>

        {/* CARDS */}
        <div className="grid gap-10 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
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

              {/* CONTENT */}
              <p className="text-sm text-white/60 mb-1 relative z-10">
                {project.category}
              </p>

              <h3 className="text-xl font-semibold text-white relative z-10">
                {project.title}
              </h3>

              <p className="mt-3 text-white/75 relative z-10">
                {project.description}
              </p>

              {/* TECH STACK */}
              <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                {project.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="
                      text-xs
                      bg-white/20
                      text-white
                      px-3 py-1
                      rounded-full
                      border border-white/20
                    "
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* LINK */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
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
        </div>
      </div>
    </section>
  );
}