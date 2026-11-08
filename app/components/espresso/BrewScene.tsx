"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../../lib/rng";

/* ------------------------------------------------------------------ *
 * One generated scene: machine on the left, cup on the platform.
 * Nothing is loaded from disk — every shape is a primitive or a profile
 * curve revolved around its axis.
 *
 * `level` is 0 to 1 across the whole sequence:
 *   0.00–0.16  machine   wide, the machine at rest
 *   0.16–0.32  dose      grounds fall into the basket
 *   0.32–0.46  grind
 *   0.46–0.58  tamp      nothing pours; the pause is the point
 *   0.58–0.76  extract   dark stream, camera close on the cup
 *   0.76–0.90  lengthen  water, the drink opens up
 *   0.90–1.00  serve     steam, settled
 * ------------------------------------------------------------------ */

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const EXTRACT = [0.58, 0.76] as const;
const WATER = [0.76, 0.9] as const;

function cupProfile() {
  const pts: THREE.Vector2[] = [];
  (
    [
      [0, 0],
      [0.44, 0],
      [0.56, 0.06],
      [0.7, 0.26],
      [0.8, 0.6],
      [0.84, 0.98],
      [0.85, 1.14],
    ] as [number, number][]
  ).forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  pts.push(new THREE.Vector2(0.82, 1.16));
  (
    [
      [0.77, 0.98],
      [0.66, 0.6],
      [0.56, 0.28],
      [0.43, 0.1],
      [0, 0.08],
    ] as [number, number][]
  ).forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  return pts;
}

/** A lever machine, built from primitives. */
function Machine({ level }: { level: React.RefObject<number> }) {
  const portafilter = useRef<THREE.Group>(null);
  const lever = useRef<THREE.Group>(null);

  useFrame(() => {
    const l = level.current ?? 0;
    // The portafilter is out for dose and grind, locked in for tamp onward.
    const out = 1 - span(l, 0.4, 0.5);
    if (portafilter.current) {
      portafilter.current.position.z = out * 0.75;
      portafilter.current.rotation.y = out * 0.5;
    }
    // The lever pulls down through extraction.
    if (lever.current) {
      lever.current.rotation.z = -span(l, 0.5, 0.62) * 1.0;
    }
  });

  return (
    <group position={[-1.65, 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.9, 1.25]} />
        <meshStandardMaterial color="#cfc8bd" roughness={0.42} metalness={0.35} />
      </mesh>
      {/* Rounded crown */}
      <mesh position={[0, 1.9, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 1.5, 36]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.34} metalness={0.45} />
      </mesh>
      {/* Pressure gauge */}
      <mesh position={[0, 1.95, 0.64]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 28]} />
        <meshStandardMaterial color="#f3efe8" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Group head */}
      <mesh position={[0, 0.72, 0.78]} castShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.42, 28]} />
        <meshStandardMaterial color="#b9b1a4" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Lever */}
      <group ref={lever} position={[0, 1.42, 0.5]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.78, 16]} />
          <meshStandardMaterial color="#9a9287" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.76, 0]} castShadow>
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshStandardMaterial color="#4a3526" roughness={0.5} />
        </mesh>
      </group>
      {/* Portafilter */}
      <group ref={portafilter} position={[0, 0.5, 0.82]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.27, 0.2, 28]} />
          <meshStandardMaterial color="#b9b1a4" roughness={0.28} metalness={0.65} />
        </mesh>
        <mesh position={[0, 0.02, 0.44]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.62, 16]} />
          <meshStandardMaterial color="#4a3526" roughness={0.55} />
        </mesh>
      </group>
      {/* Drip tray */}
      <mesh position={[0, 0.03, 0.62]} receiveShadow>
        <boxGeometry args={[1.5, 0.08, 0.9]} />
        <meshStandardMaterial color="#a89f93" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

function Drink({ level }: { level: React.RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const colour = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const l = level.current ?? 0;
    const shot = span(l, EXTRACT[0], EXTRACT[1]);
    const water = span(l, WATER[0], WATER[1]);
    const fill = shot * 0.4 + water * 0.56;

    if (ref.current) {
      ref.current.position.y = 0.1 + fill * 0.92;
      ref.current.scale.setScalar(0.44 + fill * 0.33);
      ref.current.visible = fill > 0.01;
    }
    if (matRef.current) {
      colour.setHSL(0.063, 0.66 - water * 0.2, 0.07 + shot * 0.05 + water * 0.17);
      matRef.current.color.copy(colour);
    }
  });

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[1, 64]} />
      <meshStandardMaterial ref={matRef} color="#1d0e07" roughness={0.3} metalness={0.04} />
    </mesh>
  );
}

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
    const on = t > 0.02 && t < 0.99;
    if (!ref.current) return;
    ref.current.visible = on;
    if (!on) return;
    const shot = span(l, EXTRACT[0], EXTRACT[1]);
    const water = span(l, WATER[0], WATER[1]);
    const surface = 0.1 + (shot * 0.4 + water * 0.56) * 0.92;
    const top = 1.32;
    const h = Math.max(top - surface, 0.01);
    ref.current.scale.y = h;
    ref.current.position.y = surface + h / 2;
  });
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[radius * 0.7, radius, 1, 16, 1, true]} />
      <meshStandardMaterial color={colour} roughness={0.18} transparent opacity={0.93} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Grounds({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const rand = mulberry32(0xbea75);
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.26;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = Math.sin(a) * r;
      off[i] = rand();
    }
    return { pos, off };
  }, [count]);

  useFrame(() => {
    const l = level.current ?? 0;
    const active = span(l, 0.17, 0.44);
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = active > 0.02 && l < 0.5 ? 0.95 : 0;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const p = clamp01(active * 1.7 - seed.off[i] * 0.7);
      arr[i * 3] = seed.pos[i * 3];
      arr[i * 3 + 1] = 1.45 - p * 0.9;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[-1.65, 0, 0.82]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#4a2a16" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function Steam({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const rand = mulberry32(0xc0ffee);
    const pos = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 0.46;
      pos[i * 3 + 1] = rand() * 1.1;
      pos[i * 3 + 2] = (rand() - 0.5) * 0.46;
      phase[i] = rand() * Math.PI * 2;
    }
    return { pos, phase };
  }, [count]);

  useFrame((state) => {
    const l = level.current ?? 0;
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = span(l, 0.64, 0.96) * 0.4;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const y = (seed.pos[i * 3 + 1] + t * 0.2) % 1.1;
      arr[i * 3] = seed.pos[i * 3] + Math.sin(t * 0.7 + seed.phase[i]) * 0.1 * y;
      arr[i * 3 + 1] = 1.18 + y;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2] + Math.cos(t * 0.6 + seed.phase[i]) * 0.1 * y;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.13} color="#efe7dc" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/** Camera pulls from the whole machine in to the cup as the shot is pulled. */
function Rig({ level }: { level: React.RefObject<number> }) {
  useFrame((state) => {
    const l = level.current ?? 0;
    const close = span(l, 0.5, 0.82);
    const cam = state.camera;
    cam.position.x = lerp(-0.5, 0.15, close);
    cam.position.y = lerp(2.05, 1.25, close);
    cam.position.z = lerp(6.0, 3.3, close);
    cam.lookAt(lerp(-0.9, 0.05, close), lerp(1.0, 0.55, close), 0.4);
  });
  return null;
}

function Cup({ level }: { level: React.RefObject<number> }) {
  const pts = useMemo(() => cupProfile(), []);
  return (
    <group position={[0.1, 0.07, 0.62]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[pts, 64]} />
        <meshStandardMaterial color="#fbf7f0" roughness={0.36} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>
      <Drink level={level} />
      <Stream level={level} from={EXTRACT[0]} to={EXTRACT[1]} colour="#30170c" radius={0.045} />
      <Stream level={level} from={WATER[0]} to={WATER[1]} colour="#b08a63" radius={0.065} />
      <Steam level={level} count={44} />
    </group>
  );
}

export default function BrewScene({
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
      camera={{ position: [-0.5, 2.05, 6], fov: 34 }}
      gl={{ antialias: !light, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.82} />
      <directionalLight position={[3, 6, 3]} intensity={1.4} castShadow={!light} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -2]} intensity={0.38} />

      {/* Counter */}
      <mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#e6e0d6" roughness={0.9} />
      </mesh>

      <Machine level={level} />
      <Cup level={level} />
      <Grounds level={level} count={light ? 40 : 80} />
      <Rig level={level} />
    </Canvas>
  );
}
