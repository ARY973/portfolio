"use client";

import { useMemo } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { mulberry32 } from "../lib/rng";

export default function Particles({ count = 2000 }: { count?: number }) {
  // Built once per count — previously this reallocated on every render.
  const particles = useMemo(() => {
    const rand = mulberry32(0xc0ffee);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (rand() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  return (
    <Points positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        color="#ffffff"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        transparent
      />
    </Points>
  );
}
