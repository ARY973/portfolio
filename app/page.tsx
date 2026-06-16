"use client";
import { useState } from "react";
import Hero from "./components/Hero";
import ChatWidget from "./components/ChatWidget";
import About from "./components/About";
import DcExperience from "./components/DcExperience";
import DataPhilosophy from "./components/DataPhilosophy";
import Projects from "./components/projects";
import ExperienceTeaser from "./components/ExperienceTeaser";
import { motion, useScroll } from "framer-motion";
import ConnectSection from "./components/ConnectSection";
import ModelEvaluation from "./components/ModelEvaluation";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative overflow-x-hidden min-h-screen">

      {/* CONTENT */}
      <Hero setOpen={setChatOpen} />
      <About />
      <DcExperience />
      <DataPhilosophy />
      <Projects />
      <ExperienceTeaser />
      <ModelEvaluation />
      <ConnectSection />

      {/* CHAT */}
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />

      {/* SCROLL PROGRESS BAR */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-white origin-left z-50"
      />

    </main>
  );
}