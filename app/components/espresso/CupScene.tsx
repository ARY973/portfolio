"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../../lib/rng";

/* ------------------------------------------------------------------ *
 * Geometry is generated, not loaded. A cup is a profile curve revolved
 * around its axis, so there is no model file, no licence, and the
 * silhouette is tunable by editing numbers.
 * ------------------------------------------------------------------ */

/** Outer wall, floor and inner wall, as one closed lathe profile. */
function cupProfile() {
  const pts: THREE.Vector2[] = [];
  const outer: [number, number][] = [
    [0.0, 0.0],
    [0.46, 0.0],
    [0.58, 0.06],
    [0.72, 0.26],
    [0.82, 0.62],
    [0.86, 1.0],
    [0.87, 1.18],
  ];
  outer.forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  // Over the rim and back down the inside.
  pts.push(new THREE.Vector2(0.84, 1.2));
  const inner: [number, number][] = [
    [0.79, 1.0],
    [0.68, 0.62],
    [0.58, 0.28],
    [0.45, 0.1],
    [0.0, 0.08],
  ];
  inner.forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  return pts;
}

function saucerProfile() {
  return [
    [0.0, 0.0],
    [1.15, 0.0],
    [1.3, 0.06],
    [1.32, 0.1],
    [1.18, 0.08],
    [0.55, 0.05],
    [0.5, 0.12],
    [0.0, 0.1],
  ].map(([x, y]) => new THREE.Vector2(x, y));
}

/** Espresso surface: a disc that rises with the pour. */
function Liquid({ level }: { level: React.RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const l = level.current ?? 0;
    if (ref.current) {
      // Sits between the floor and just under the rim.
      ref.current.position.y = 0.1 + l * 0.95;
      ref.current.scale.setScalar(0.46 + l * 0.33);
      ref.current.visible = l > 0.02;
    }
    if (matRef.current) {
      // Crema: lighter and warmer as the shot finishes.
      matRef.current.color.setHSL(0.07, 0.62, 0.1 + l * 0.2);
    }
  });

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position-y={0.1}>
      <circleGeometry args={[1, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color="#2a150c"
        roughness={0.28}
        metalness={0.05}
      />
    </mesh>
  );
}

/** The pour itself: a tapering stream, visible only mid-extraction. */
function Stream({ level }: { level: React.RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const l = level.current ?? 0;
    const pouring = l > 0.04 && l < 0.97;
    if (!ref.current) return;
    ref.current.visible = pouring;
    if (pouring) {
      const top = 2.1;
      const surface = 0.1 + l * 0.95;
      const h = Math.max(top - surface, 0.01);
      ref.current.scale.y = h;
      ref.current.position.y = surface + h / 2;
    }
  });

  return (
    <mesh ref={ref} position-y={1.2}>
      <cylinderGeometry args={[0.035, 0.055, 1, 16, 1, true]} />
      <meshStandardMaterial
        color="#3a1d10"
        roughness={0.2}
        transparent
        opacity={0.95}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Steam: a handful of soft sprites drifting up once the cup is full. */
function Steam({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const rand = mulberry32(0xc0ffee);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 0.5;
      positions[i * 3 + 1] = rand() * 1.1;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.5;
      seeds[i] = rand() * Math.PI * 2;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state) => {
    const l = level.current ?? 0;
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, (l - 0.72) / 0.28) * 0.5;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;

    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const y = ((positions[i * 3 + 1] + t * 0.22) % 1.1);
      arr[i * 3] = positions[i * 3] + Math.sin(t * 0.7 + seeds[i]) * 0.09 * y;
      arr[i * 3 + 1] = 1.15 + y;
      arr[i * 3 + 2] = positions[i * 3 + 2] + Math.cos(t * 0.6 + seeds[i]) * 0.09 * y;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#efe7dc"
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Cup({ level, steam }: { level: React.RefObject<number>; steam: number }) {
  const group = useRef<THREE.Group>(null);
  const cupPts = useMemo(() => cupProfile(), []);
  const saucerPts = useMemo(() => saucerProfile(), []);

  useFrame((state) => {
    if (!group.current) return;
    // A slow turn, plus a touch of lean that follows the pour.
    const l = level.current ?? 0;
    group.current.rotation.y = state.clock.elapsedTime * 0.12;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.012;
    group.current.position.y = -0.55 + l * 0.02;
  });

  return (
    <group ref={group}>
      <mesh position-y={-0.02} castShadow receiveShadow>
        <latheGeometry args={[saucerPts, 72]} />
        <meshStandardMaterial
          color="#f2ece2"
          roughness={0.52}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position-y={0.06} castShadow receiveShadow>
        <latheGeometry args={[cupPts, 72]} />
        <meshStandardMaterial
          color="#faf6ef"
          roughness={0.38}
          metalness={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group position-y={0.06}>
        <Liquid level={level} />
        <Stream level={level} />
        <Steam level={level} count={steam} />
      </group>
    </group>
  );
}

/** Draws only when the scroll level has actually changed. */
function Invalidator({ level }: { level: React.RefObject<number> }) {
  const invalidate = useThree((s) => s.invalidate);
  const last = useRef(-1);
  useFrame(() => {
    const l = level.current ?? 0;
    if (Math.abs(l - last.current) > 0.0005 || (l > 0.72 && l <= 1)) {
      last.current = l;
      invalidate();
    }
  });
  return null;
}

export default function CupScene({
  level,
  quality = "full",
}: {
  level: React.RefObject<number>;
  quality?: "full" | "light";
}) {
  const light = quality === "light";

  return (
    <Canvas
      /* Draws on demand rather than running a loop forever. */
      frameloop="always"
      dpr={[1, light ? 1.25 : 1.75]}
      shadows={!light}
      camera={{ position: [0, 1.5, 4.2], fov: 34 }}
      gl={{ antialias: !light, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#00000000"]} />

      <ambientLight intensity={0.75} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.5}
        castShadow={!light}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#d9c3a5" />

      <Cup level={level} steam={light ? 24 : 54} />
      <Invalidator level={level} />
    </Canvas>
  );
}
