"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DataPulse() {
  const meshRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame(() => {
    if (!meshRef.current) return;

    t.current += 0.01;

    meshRef.current.position.x = Math.sin(t.current) * 2;
    meshRef.current.position.y = Math.cos(t.current) * 1;
    meshRef.current.position.z = Math.sin(t.current * 0.5) * 1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#93c5fd" />
    </mesh>
  );
}