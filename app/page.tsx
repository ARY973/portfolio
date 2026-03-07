"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import ChatWidget from "./components/ChatWidget";
import SnowSection from "./components/SnowSection";
import About from "./components/About";
import DcExperience from "./components/DcExperience";
import DataPhilosophy from "./components/DataPhilosophy";
import Projects from "./components/projects";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main className="relative">
      <SnowSection />
      <Hero setOpen={setChatOpen} />
      <About />
      <DcExperience />
      <DataPhilosophy />
      <Projects />
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
    </main>
  );
}