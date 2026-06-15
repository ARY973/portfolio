'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-24 px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center"
      >

        {/* LEFT — IMAGE */}
        <div className="flex justify-center md:justify-start">
          <div className="relative z-10 max-w-5xl mx-auto px-8 py10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 -z-10" />
            <Image
              src="/about/aryan.jpg"
              alt="Aryan portrait"
              width={360}
              height={360}
              className="rounded-2xl shadow-lg object-cover"
              priority
            />
          </div>
        </div>

      {/* RIGHT — TEXT */}
<div className="text-center md:text-left">
  <h2 className="text-3xl font-semibold text-white">
    About
  </h2>

  <p className="mt-4 text-slate-200 text-lg leading-relaxed mb-4">
  I'm Aryan — a Data Analyst and MS Information Systems student at Utah 
  State University's Jon M. Huntsman School of Business, where I also 
  serve as President of the USU AI Club.
</p>

<p className="text-slate-200 text-lg leading-relaxed mb-4">
  I've built my foundation across two data analyst roles — developing 
  Power BI dashboards at Medikart Pharmaceutical and building data 
  infrastructure for community justice programs at the USU Transforming 
  Communities Institute. Before that, hands-on experience with SAP MM 
  at Tata Motors.
</p>

<p className="text-slate-200 text-lg leading-relaxed">
  My master's coursework in Advanced ML and FinTech has pushed me deeper 
  — XGBoost classifiers, predictive pipelines, financial analytics systems. 
  I bring that statistical depth into how I think about every data problem.
</p>
</div>
      </motion.div>
    </section>
  );
}