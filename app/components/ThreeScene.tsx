"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import NeuralNetwork from "./NeuralNetwork";
import Particles from "./Particles";
import { useIsMobile, usePrefersReducedMotion } from "../hooks/useReducedMotion";

export default function ThreeScene() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  // The scene is atmosphere for the hero, not a backdrop for every section.
  // Past the first screen it fades back so content carries the page.
  const [dim, setDim] = useState(false);
  useEffect(() => {
    const onScroll = () => setDim(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Catch a page restored mid-scroll without writing state during the
    // effect body itself.
    const id = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-700"
      style={{ opacity: dim ? 0.22 : 1 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6] }}
        style={{ width: "100vw", height: "100vh" }}
        dpr={[1, 1.5]}
        /* Reduced motion: render one static frame instead of an endless loop. */
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <color attach="background" args={["#0b1a2b"]} />

        <Stars
          radius={50}
          depth={50}
          count={isMobile ? 800 : 2000}
          factor={4}
          saturation={0}
          fade={!reducedMotion}
        />

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        <NeuralNetwork animate={!reducedMotion} />
        <Particles count={isMobile ? 800 : 2000} />

        {!isMobile && !reducedMotion && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.15}
          />
        )}
      </Canvas>
    </div>
  );
}
