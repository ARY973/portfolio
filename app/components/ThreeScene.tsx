"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import NeuralNetwork from "./NeuralNetwork";
import Particles from "./Particles";
import CameraController from "./CameraController";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import DataPulse from "./DataPulse";

export default function ThreeScene() {

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6] }} style={{ width: "100vw", height: "100vh" }}>

        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade />

        <color attach="background" args={["#0b1a2b"]} />

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        <NeuralNetwork />
        <Particles />

        {!isMobile && (
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