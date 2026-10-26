"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-blue-300 text-sm tracking-widest uppercase mb-6"
      >
        Data Analyst · ML &amp; Financial Analytics
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold tracking-tight text-white"
      >
        Aryan Mudhole
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-xl md:text-2xl font-medium text-slate-300 max-w-2xl leading-relaxed"
      >
        I build data products that end in a decision — not a dashboard nobody
        opens.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 text-sm text-slate-400 max-w-xl"
      >
        MMIS candidate at USU&apos;s Huntsman School of Business. Currently
        building the data behind a Meals on Wheels delivery programme and a
        Utah Supreme Court reporting pipeline.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-10 flex flex-wrap gap-4 justify-center"
      >
        <a
          href="#work"
          className="px-6 py-3 bg-white text-black rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          See the work
        </a>

        <a
          href="#model"
          className="px-6 py-3 border border-slate-500 text-white rounded-md text-sm font-medium hover:bg-white hover:text-black hover:border-white transition"
        >
          Try a model I trained
        </a>
      </motion.div>

      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        aria-label="Scroll to work"
        className="absolute bottom-10 text-slate-500 hover:text-slate-300 transition"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.a>
    </section>
  );
}
