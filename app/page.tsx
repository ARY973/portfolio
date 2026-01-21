import Hero from "./components/Hero";
import About from "./components/About";
import DcExperience from "./components/DcExperience";
import SnowSection from "./components/SnowSection";
import DataPhilosophy from "./components/DataPhilosophy";
import Projects from "./components/projects";

export default function Home() {
  return (
    <main className="relative">
      <SnowSection />
      <Hero />
      <About />
      <DcExperience />
      <DataPhilosophy />
      <Projects />
    </main>
  );
}