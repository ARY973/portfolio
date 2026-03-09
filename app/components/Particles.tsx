"use client";

import { Points, PointMaterial } from "@react-three/drei";

export default function Particles() {
  const count = 2000;
  const particles = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    particles[i] = (Math.random() - 0.5) * 10;
  }

  return (
    <Points positions={particles} stride={3}>
      <PointMaterial
        color="#ffffff"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}