"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../lib/rng";

const NODE_COUNT = 40;
const CONNECTION_DISTANCE = 2;
const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

/** Cursor repulsion radius, and how hard nodes spring back to where they started. */
const CURSOR_RADIUS = 1.8;
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS;
const PUSH_STRENGTH = 0.06;
const RETURN_STRENGTH = 0.04;

export default function NeuralNetwork({ animate = true }: { animate?: boolean }) {
  const { mouse } = useThree();
  const nodesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Live positions, seeded randomly.
  const positions = useMemo(() => {
    const rand = mulberry32(0x5eed);
    const arr = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      arr[i * 3] = (rand() - 0.5) * 10;
      arr[i * 3 + 1] = (rand() - 0.5) * 6;
      arr[i * 3 + 2] = (rand() - 0.5) * 4;
    }
    return arr;
  }, []);

  // Home positions, so displaced nodes have somewhere to spring back to.
  const homes = useMemo(() => Float32Array.from(positions), [positions]);

  // Every unordered pair is 2 points x 3 floats.
  const linePositions = useMemo(
    () => new Float32Array(((NODE_COUNT * (NODE_COUNT - 1)) / 2) * 6),
    []
  );

  useFrame(() => {
    if (!nodesRef.current || !linesRef.current) return;

    const nodeArray = nodesRef.current.geometry.attributes.position
      .array as Float32Array;
    const lineArray = linesRef.current.geometry.attributes.position
      .array as Float32Array;

    const cursorX = mouse.x * 5;
    const cursorY = mouse.y * 3;

    if (animate) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const ix = i * 3;
        let x = nodeArray[ix];
        let y = nodeArray[ix + 1];

        // Push away from the cursor.
        const dx = x - cursorX;
        const dy = y - cursorY;
        const distSq = dx * dx + dy * dy;

        if (distSq < CURSOR_RADIUS_SQ && distSq > 0.0001) {
          const falloff = 1 - distSq / CURSOR_RADIUS_SQ;
          const inv = 1 / Math.sqrt(distSq);
          x += dx * inv * PUSH_STRENGTH * falloff * CURSOR_RADIUS;
          y += dy * inv * PUSH_STRENGTH * falloff * CURSOR_RADIUS;
        }

        // Spring back home.
        x += (homes[ix] - x) * RETURN_STRENGTH;
        y += (homes[ix + 1] - y) * RETURN_STRENGTH;

        // This write-back was missing before, so nodes never actually moved.
        nodeArray[ix] = x;
        nodeArray[ix + 1] = y;
      }

      nodesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Rebuild the connection lines from current positions.
    let ptr = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      const xi = nodeArray[ix];
      const yi = nodeArray[ix + 1];
      const zi = nodeArray[ix + 2];

      for (let j = i + 1; j < NODE_COUNT; j++) {
        const jx = j * 3;
        const ex = xi - nodeArray[jx];
        const ey = yi - nodeArray[jx + 1];
        const ez = zi - nodeArray[jx + 2];

        // Squared compare — no sqrt needed just to threshold.
        if (ex * ex + ey * ey + ez * ez < CONNECTION_DISTANCE_SQ) {
          lineArray[ptr++] = xi;
          lineArray[ptr++] = yi;
          lineArray[ptr++] = zi;
          lineArray[ptr++] = nodeArray[jx];
          lineArray[ptr++] = nodeArray[jx + 1];
          lineArray[ptr++] = nodeArray[jx + 2];
        }
      }
    }

    linesRef.current.geometry.setDrawRange(0, ptr / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={nodesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#3b82f6" sizeAttenuation />
      </points>

      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.5} />
      </lineSegments>
    </>
  );
}
