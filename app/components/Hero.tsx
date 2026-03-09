"use client";

import { motion } from "framer-motion";
import ThreeScene from "./ThreeScene";

export default function Hero({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">

      {/* 3D BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <ThreeScene />
      </div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
      >
        Aryan Mudhole
      </motion.h1>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-6 text-2xl md:text-3xl font-medium text-gray-300 max-w-3xl"
      >
        Implementing machine learning  
        for financial decision systems.
      </motion.h2>

      {/* Subtext */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-6 text-sm text-gray-500 space-y-1"
      >
        <p>Master of Information Systems</p>
        <p>Applied modeling • Regression logic • Business impact</p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-10 flex gap-6"
      >
        <a
          href="#work"
          className="px-6 py-3 bg-white text-black rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          View Applied Work
        </a>

        <button
          onClick={() => setOpen(prev => !prev)}
          className="px-6 py-3 border border-white text-white rounded-md text-sm font-medium hover:bg-white hover:text-black transition"
        >
          Evaluate Candidate
        </button>
      </motion.div>

    </section>
  );
}