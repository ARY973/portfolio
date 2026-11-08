"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../../lib/rng";

/* ------------------------------------------------------------------ *
 * Geometry is generated, not loaded. A cup is a profile curve revolved
 * around its axis, so there is no model file, no licence, and the
 * silhouette is tunable by editing numbers.
 *
 * `level` runs 0 to 1 across the whole pull:
 *   0.00 – 0.14  dose      beans in the basket
 *   0.14 – 0.34  grind
 *   0.34 – 0.50  tamp
 *   0.50 – 0.74  extract   espresso streams in, dark
 *   0.74 – 0.92  lengthen  water goes in, the colour opens up
 *   0.92 – 1.00  serve     steam, settled
 * ------------------------------------------------------------------ */

const ESPRESSO_FROM = 0.5;
const ESPRESSO_TO = 0.74;
const WATER_FROM = 0.74;
const WATER_TO = 0.92;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

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
  return ([
    [0.0, 0.0],
    [1.15, 0.0],
    [1.3, 0.06],
    [1.32, 0.1],
    [1.18, 0.08],
    [0.55, 0.05],
    [0.5, 0.12],
    [0.0, 0.1],
  ] as [number, number][]).map(([x, y]) => new THREE.Vector2(x, y));
}

/** The drink: rises with the shot, then rises further and opens up with water. */
function Drink({ level }: { level: React.RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const colour = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const l = level.current ?? 0;
    const shot = span(l, ESPRESSO_FROM, ESPRESSO_TO);
    const water = span(l, WATER_FROM, WATER_TO);
    const fill = shot * 0.42 + water * 0.56;

    if (ref.current) {
      ref.current.position.y = 0.1 + fill * 0.95;
      ref.current.scale.setScalar(0.46 + fill * 0.34);
      ref.current.visible = fill > 0.01;
    }
    if (matRef.current) {
      // Espresso is near-black; water lengthens it to americano brown.
      colour.setHSL(0.063, 0.66 - water * 0.2, 0.07 + shot * 0.05 + water * 0.17);
      matRef.current.color.copy(colour);
      matRef.current.roughness = 0.3 - water * 0.08;
    }
  });

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[1, 64]} />
      <meshStandardMaterial ref={matRef} color="#1d0e07" roughness={0.3} metalness={0.04} />
    </mesh>
  );
}

/** Two streams: espresso from the portafilter, then water. */
function Stream({
  level,
  from,
  to,
  colour,
  radius,
}: {
  level: React.RefObject<number>;
  from: number;
  to: number;
  colour: string;
  radius: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const l = level.current ?? 0;
    const t = span(l, from, to);
    const pouring = t > 0.02 && t < 0.99;
    if (!ref.current) return;
    ref.current.visible = pouring;
    if (!pouring) return;
    const shot = span(l, ESPRESSO_FROM, ESPRESSO_TO);
    const water = span(l, WATER_FROM, WATER_TO);
    const surface = 0.1 + (shot * 0.42 + water * 0.56) * 0.95;
    const top = 2.2;
    const h = Math.max(top - surface, 0.01);
    ref.current.scale.y = h;
    ref.current.position.y = surface + h / 2;
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[radius * 0.7, radius, 1, 16, 1, true]} />
      <meshStandardMaterial
        color={colour}
        roughness={0.18}
        transparent
        opacity={0.93}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Ground beans falling in, during dose and grind. */
function Grounds({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const rand = mulberry32(0xbea75);
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.4;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = Math.sin(a) * r;
      off[i] = rand();
    }
    return { pos, off };
  }, [count]);

  useFrame(() => {
    const l = level.current ?? 0;
    const active = span(l, 0.02, 0.34);
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = active > 0.02 && l < 0.46 ? 0.95 : 0;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;

    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const progress = clamp01(active * 1.6 - seed.off[i] * 0.6);
      arr[i * 3] = seed.pos[i * 3];
      arr[i * 3 + 1] = 1.5 - progress * 1.3;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.038} color="#4a2a16" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/** Steam, once there is something hot to steam. */
function Steam({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const rand = mulberry32(0xc0ffee);
    const pos = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 0.5;
      pos[i * 3 + 1] = rand() * 1.2;
      pos[i * 3 + 2] = (rand() - 0.5) * 0.5;
      phase[i] = rand() * Math.PI * 2;
    }
    return { pos, phase };
  }, [count]);

  useFrame((state) => {
    const l = level.current ?? 0;
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = span(l, 0.56, 0.95) * 0.42;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;

    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const y = (seed.pos[i * 3 + 1] + t * 0.2) % 1.2;
      arr[i * 3] = seed.pos[i * 3] + Math.sin(t * 0.7 + seed.phase[i]) * 0.1 * y;
      arr[i * 3 + 1] = 1.22 + y;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2] + Math.cos(t * 0.6 + seed.phase[i]) * 0.1 * y;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#efe7dc" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function Scene({ level, steam, grounds }: { level: React.RefObject<number>; steam: number; grounds: number }) {
  const group = useRef<THREE.Group>(null);
  const cupPts = useMemo(() => cupProfile(), []);
  const saucerPts = useMemo(() => saucerProfile(), []);

  useFrame((state) => {
    if (!group.current) return;
    const l = level.current ?? 0;
    // Turns slowly, and tips toward the viewer as the drink is handed over.
    group.current.rotation.y = state.clock.elapsedTime * 0.1 + l * 0.5;
    group.current.rotation.x = span(l, 0.9, 1) * 0.1;
    group.current.position.y = -0.62;
  });

  return (
    <group ref={group}>
      <mesh position-y={-0.02} castShadow receiveShadow>
        <latheGeometry args={[saucerPts, 72]} />
        <meshStandardMaterial color="#efe7db" roughness={0.55} metalness={0.03} side={THREE.DoubleSide} />
      </mesh>

      <mesh position-y={0.06} castShadow receiveShadow>
        <latheGeometry args={[cupPts, 72]} />
        <meshStandardMaterial color="#fbf7f0" roughness={0.36} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>

      <group position-y={0.06}>
        <Drink level={level} />
        <Stream level={level} from={ESPRESSO_FROM} to={ESPRESSO_TO} colour="#30170c" radius={0.05} />
        <Stream level={level} from={WATER_FROM} to={WATER_TO} colour="#b08a63" radius={0.07} />
        <Grounds level={level} count={grounds} />
        <Steam level={level} count={steam} />
      </group>
    </group>
  );
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
      dpr={[1, light ? 1.25 : 1.75]}
      shadows={!light}
      camera={{ position: [0, 1.35, 4.1], fov: 36 }}
      gl={{ antialias: !light, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.45}
        castShadow={!light}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#d9c3a5" />
      <Scene level={level} steam={light ? 22 : 52} grounds={light ? 40 : 90} />
    </Canvas>
  );
}
