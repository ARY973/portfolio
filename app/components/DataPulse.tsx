"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DataPulse() {
  const meshRef = useRef<THREE.Mesh>(null);

  let t = 0;

  useFrame(() => {
    if (!meshRef.current) return;

    t += 0.01;

    meshRef.current.position.x = Math.sin(t) * 2;
    meshRef.current.position.y = Math.cos(t) * 1;
    meshRef.current.position.z = Math.sin(t * 0.5) * 1;

  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#93c5fd" />
    </mesh>
  );
}