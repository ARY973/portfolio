"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import NeuralNetwork from "./NeuralNetwork";
import Particles from "./Particles";
import CameraController from "./CameraController";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import DataPulse from "./DataPulse";

export default function ThreeScene() {
  return (
    <div className="fixed inset-0 pointer-events-none will-change-transform">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <CameraController />
        {/* Background color */}
        <color attach="background" args={["#0b1a2b"]} />

        {/* Galaxy stars */}
        <Stars
          radius={80}
          depth={60}
          count={3000}
          factor={4}
          saturation={0}
          fade
        />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        {/* Neural network nodes */}
        <NeuralNetwork />

        {/* Floating particles */}
        <Particles />
        {/* Pulsing data point */}
        <DataPulse />
        {/* Slow rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.15}
        />
        <EffectComposer>
  <Bloom
    intensity={1.2}
    luminanceThreshold={0.2}
    luminanceSmoothing={0.9}
  />
</EffectComposer>
      </Canvas>
    </div>
  );
}