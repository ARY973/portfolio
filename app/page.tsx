"use client";

import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/projects";
import ExperienceTeaser from "./components/ExperienceTeaser";
import LoanModelExplorer from "./components/LoanModelExplorer";
import ModelEvaluation from "./components/ModelEvaluation";
import ConnectSection from "./components/ConnectSection";
import { motion, useScroll } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative overflow-x-hidden min-h-screen">
      {/*
        Section order follows how a recruiter reads: what he built, proof it
        works, where he's worked, who he is, how to reach him.
      */}
      <Hero />
      <Projects />
      <LoanModelExplorer />
      <ModelEvaluation />
      <ExperienceTeaser />
      <About />
      <ConnectSection />

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-blue-400 origin-left z-[60]"
      />
    </main>
  );
}
