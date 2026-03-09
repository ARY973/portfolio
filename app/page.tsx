"use client";

import ThreeScene from "./components/ThreeScene";
import { useState } from "react";
import Hero from "./components/Hero";
import ChatWidget from "./components/ChatWidget";
import About from "./components/About";
import DcExperience from "./components/DcExperience";
import DataPhilosophy from "./components/DataPhilosophy";
import Projects from "./components/projects";
import { motion, useScroll } from "framer-motion";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative overflow-x-hidden">

      {/* GLOBAL GALAXY BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <ThreeScene />
      </div>

      {/* CONTENT */}
      <Hero setOpen={setChatOpen} />
      <About />
      <DcExperience />
      <DataPhilosophy />
      <Projects />

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