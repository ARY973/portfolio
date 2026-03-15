"use client";

import { motion } from "framer-motion";

export default function ConnectSection() {
  return (
    <section className="mt-32 flex flex-col items-center text-center">

      <h2 className="text-3xl font-semibold text-white mb-4">
        Let's Connect
      </h2>

      <p className="text-gray-400 mb-12">
        Explore my professional profile, code repositories, and resume.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">

        {/* LinkedIn */}
        <motion.a
  href="https://www.linkedin.com/in/aryan-ryan-mudhole"
  target="_blank"
  onMouseMove={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}}
  className="relative bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-8 
hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
transition flex flex-col items-center text-center group overflow-hidden"
>
  {/* Spotlight */}
  <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300">
  <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.15),transparent_40%)]" />
</div>

  <svg className="w-10 h-10 text-blue-400 mb-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24h-5V8z"/>
  </svg>

  <h3 className="text-xl font-semibold text-white mb-2">
    LinkedIn
  </h3>

  <p className="text-gray-400 text-sm mb-6">
    Connect with me professionally and explore my experience.
  </p>

  <span className="text-blue-400 text-sm">
    View Profile →
  </span>

</motion.a>

        {/* GitHub */}
        <motion.a
  href="https://github.com/ARY973"
  target="_blank"
  onMouseMove={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}}
  className="relative bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-8 
hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
transition flex flex-col items-center text-center group overflow-hidden"
>
  {/* Spotlight */}
  <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300">
  <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.15),transparent_40%)]" />
</div>

  <svg className="w-10 h-10 text-blue-400 mb-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.44 7.86 10.97.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.38-3.87-1.38-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.21 1.79 1.21 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.06 11.06 0 012.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.67.42.36.79 1.08.79 2.18v3.24c0 .31.21.68.8.56 4.56-1.53 7.85-5.86 7.85-10.97C23.5 5.74 18.27.5 12 .5z"/>
  </svg>

  <h3 className="text-xl font-semibold text-white mb-2">
    GitHub
  </h3>

  <p className="text-gray-400 text-sm mb-6">
    Browse my repositories and explore my machine learning and analytics projects.
  </p>

  <span className="text-blue-400 text-sm">
    View Code →
  </span>
</motion.a>

        {/* Resume */}
        <motion.div
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }}
  whileHover={{ scale: 1.05 }}
  className="relative bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-8
  hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
  transition flex flex-col items-center text-center group overflow-hidden"
>

  {/* Spotlight */}
  <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300">
    <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.15),transparent_40%)]" />
  </div>

  {/* Icon */}
  <svg className="w-10 h-10 text-blue-400 mb-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5z"/>
  </svg>

  <h3 className="text-xl font-semibold text-white mb-4">
    Resume
  </h3>

  <p className="text-gray-400 text-sm mb-6">
    Data Analytics • Machine Learning • Python • SQL • Power BI
    <br /><br />
    Experience building ML models, dashboards, and analytics tools using real-world datasets.
  </p>

  <div className="h-[420px] w-full overflow-hidden border border-slate-700 rounded-md mb-4">
    <iframe
      src="/resume/Aryan_resume_1.pdf"
      className="w-full h-full"
    />
  </div>

  <a
    href="/resume/Aryan_resume_1.pdf"
    target="_blank"
    className="text-blue-400 text-sm"
  >
    Download Resume →
  </a>

</motion.div>

      </div>
    </section>
  );
}