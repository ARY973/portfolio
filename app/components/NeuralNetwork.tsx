"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const NODE_COUNT = 40;
const CONNECTION_DISTANCE = 2;

export default function NeuralNetwork() {
    const { mouse } = useThree();
  const nodesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    return arr;
  }, []);

  const linePositions = useMemo(() => {
    return new Float32Array(NODE_COUNT * NODE_COUNT * 3);
  }, []);

  useFrame(() => {
  if (!nodesRef.current || !linesRef.current) return;

  const nodeArray =
    nodesRef.current.geometry.attributes.position.array as Float32Array;

  const lineArray =
    linesRef.current.geometry.attributes.position.array as Float32Array;

  let ptr = 0;

  for (let i = 0; i < NODE_COUNT; i++) {
    let xi = nodeArray[i * 3];
    let yi = nodeArray[i * 3 + 1];
    let zi = nodeArray[i * 3 + 2];

    // cursor influence
    const dx = xi - mouse.x * 5;
    const dy = yi - mouse.y * 3;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1.5) {
      xi += dx * 0.02;
      yi += dy * 0.02;
    }

    for (let j = i + 1; j < NODE_COUNT; j++) {
      const xj = nodeArray[j * 3];
      const yj = nodeArray[j * 3 + 1];
      const zj = nodeArray[j * 3 + 2];

      const d = Math.sqrt(
        (xi - xj) ** 2 +
        (yi - yj) ** 2 +
        (zi - zj) ** 2
      );

      if (d < CONNECTION_DISTANCE) {
        lineArray[ptr++] = xi;
        lineArray[ptr++] = yi;
        lineArray[ptr++] = zi;

        lineArray[ptr++] = xj;
        lineArray[ptr++] = yj;
        lineArray[ptr++] = zj;
      }
    }
  }

  linesRef.current.geometry.setDrawRange(0, ptr / 3);
  linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#3b82f6" />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#60a5fa" />
      </lineSegments>
    </>
  );
}