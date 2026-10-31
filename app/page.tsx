import Hero from "./components/Hero";
import Projects from "./components/projects";
import LoanModelExplorer from "./components/LoanModelExplorer";
import ModelEvaluation from "./components/ModelEvaluation";
import ExperienceTeaser from "./components/ExperienceTeaser";
import About from "./components/About";
import ConnectSection from "./components/ConnectSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <LoanModelExplorer />
      <ModelEvaluation />
      <ExperienceTeaser />
      <About />
      <ConnectSection />
    </>
  );
}
