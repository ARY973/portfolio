"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../../lib/rng";

/* ------------------------------------------------------------------ *
 * A countertop: scale on the right, machine on the left, cup that
 * travels between them. Everything is generated from primitives and
 * profile curves — no model files.
 *
 * `level` is 0 to 1 across the sequence:
 *   0.00–0.13  machine    wide shot, at rest
 *   0.13–0.28  weigh      beans on the scale, readout climbing
 *   0.28–0.43  grind      beans go, grounds fall into the basket
 *   0.43–0.56  tamp       portafilter locks in, tamper presses
 *   0.56–0.66  place      the cup travels under the group head
 *   0.66–0.80  extract    dark stream
 *   0.80–0.92  lengthen   water, the drink opens up
 *   0.92–1.00  serve      steam, settled
 * ------------------------------------------------------------------ */

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Ease so travel settles rather than stopping dead. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const WEIGH = [0.13, 0.28] as const;
const GRIND = [0.28, 0.43] as const;
const TAMP = [0.43, 0.56] as const;
const PLACE = [0.56, 0.66] as const;
const EXTRACT = [0.66, 0.8] as const;
const WATER = [0.8, 0.92] as const;

/* Breville-ish: brushed stainless, black polymer, walnut. */
const STEEL = "#c3c7cc";
const STEEL_DARK = "#8f949b";
const BLACK = "#26262a";
const WALNUT = "#6b4423";
const PORCELAIN = "#f7f4ee";

const MACHINE_X = -1.72;
const HEAD_Z = 0.8;
const CUP_PARKED: [number, number, number] = [2.15, 0.07, 1.0];
const CUP_UNDER: [number, number, number] = [MACHINE_X, 0.07, HEAD_Z];

function cupProfile() {
  const pts: THREE.Vector2[] = [];
  (
    [
      [0, 0],
      [0.4, 0],
      [0.5, 0.05],
      [0.62, 0.22],
      [0.71, 0.5],
      [0.75, 0.82],
      [0.76, 0.95],
    ] as [number, number][]
  ).forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  pts.push(new THREE.Vector2(0.73, 0.97));
  (
    [
      [0.68, 0.82],
      [0.58, 0.5],
      [0.49, 0.24],
      [0.38, 0.09],
      [0, 0.07],
    ] as [number, number][]
  ).forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  return pts;
}

/** Scale with a bean pile and a climbing readout. */
function Scale({ level }: { level: React.RefObject<number> }) {
  const beans = useRef<THREE.Points>(null);
  const needle = useRef<THREE.Mesh>(null);

  const seed = useMemo(() => {
    const rand = mulberry32(0x5ca1e);
    const n = 90;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.3;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = 0.3 + rand() * 0.09;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    return { pos, n };
  }, []);

  useFrame(() => {
    const l = level.current ?? 0;
    const filling = span(l, WEIGH[0], WEIGH[1]);
    const gone = span(l, GRIND[0], GRIND[0] + 0.05);
    if (beans.current) {
      const mat = beans.current.material as THREE.PointsMaterial;
      mat.opacity = filling * (1 - gone);
      beans.current.visible = mat.opacity > 0.01;
    }
    // Readout bar grows with the dose.
    if (needle.current) {
      needle.current.scale.x = Math.max(filling * (1 - gone), 0.001);
    }
  });

  return (
    <group position={[1.55, 0, 0.6]}>
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.66, 0.14, 40]} />
        <meshStandardMaterial color={BLACK} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[0.52, 0.52, 0.03, 40]} />
        <meshStandardMaterial color={STEEL} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Readout */}
      <mesh position={[0, 0.1, 0.62]} rotation-x={-0.5}>
        <planeGeometry args={[0.46, 0.16]} />
        <meshStandardMaterial color="#10110f" roughness={0.6} />
      </mesh>
      <mesh ref={needle} position={[-0.19, 0.105, 0.628]} rotation-x={-0.5} scale-x={0.001}>
        <planeGeometry args={[0.34, 0.05] } />
        <meshStandardMaterial color="#79d6a0" emissive="#2f7f53" emissiveIntensity={0.6} />
      </mesh>

      <points ref={beans} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color="#53301a" transparent opacity={0} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  );
}

function Machine({ level }: { level: React.RefObject<number> }) {
  const portafilter = useRef<THREE.Group>(null);
  const tamper = useRef<THREE.Group>(null);
  const puck = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const l = level.current ?? 0;
    // Out and angled for weigh and grind, swinging home through tamp.
    const home = ease(span(l, TAMP[0], TAMP[1]));
    if (portafilter.current) {
      portafilter.current.position.x = lerp(1.1, 0, home);
      portafilter.current.position.y = lerp(0.28, 0, home);
      portafilter.current.rotation.y = lerp(0.9, 0, home);
    }
    // Grounds appear in the basket as it is dosed.
    if (puck.current) {
      const dosed = span(l, GRIND[0] + 0.03, GRIND[1]);
      puck.current.scale.y = Math.max(dosed, 0.001);
      puck.current.visible = dosed > 0.02;
    }
    // Tamper presses once, mid-tamp.
    if (tamper.current) {
      const t = span(l, TAMP[0] + 0.03, TAMP[1]);
      const press = Math.sin(clamp01(t) * Math.PI);
      tamper.current.position.y = 1.15 - press * 0.42;
      const mat = (tamper.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.opacity = press;
      mat.transparent = true;
    }
  });

  return (
    <group position={[MACHINE_X, 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.45, 1.9, 1.3]} />
        <meshStandardMaterial color={STEEL} roughness={0.34} metalness={0.78} />
      </mesh>
      {/* Black fascia */}
      <mesh position={[0, 0.95, 0.66]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.06]} />
        <meshStandardMaterial color={BLACK} roughness={0.5} metalness={0.25} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 1.9, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.45, 40]} />
        <meshStandardMaterial color={STEEL} roughness={0.28} metalness={0.85} />
      </mesh>
      {/* Pressure gauge */}
      <mesh position={[0.42, 1.52, 0.7]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 32]} />
        <meshStandardMaterial color={PORCELAIN} roughness={0.25} metalness={0.2} />
      </mesh>
      <mesh position={[0.42, 1.52, 0.73]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.17, 0.02, 10, 32]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Group head */}
      <mesh position={[0, 0.78, HEAD_Z]} castShadow>
        <cylinderGeometry args={[0.29, 0.33, 0.4, 32]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.26} metalness={0.9} />
      </mesh>
      {/* Portafilter: basket, walnut handle, spout */}
      <group ref={portafilter} position={[0, 0, HEAD_Z]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.29, 0.26, 0.22, 32]} />
          <meshStandardMaterial color={STEEL_DARK} roughness={0.24} metalness={0.9} />
        </mesh>
        <mesh ref={puck} position={[0, 0.63, 0]} scale-y={0.001}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 28]} />
          <meshStandardMaterial color="#3b2112" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.5, 0.52]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.055, 0.06, 0.64, 20]} />
          <meshStandardMaterial color={WALNUT} roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.41, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.035, 0.12, 16]} />
          <meshStandardMaterial color={STEEL_DARK} roughness={0.25} metalness={0.9} />
        </mesh>
      </group>
      {/* Tamper, visible only while tamping */}
      <group ref={tamper} position={[0, 1.15, HEAD_Z]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.07, 28]} />
          <meshStandardMaterial color={STEEL_DARK} roughness={0.22} metalness={0.92} transparent opacity={0} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.13, 0.32, 20]} />
          <meshStandardMaterial color={WALNUT} roughness={0.6} transparent opacity={0.9} />
        </mesh>
      </group>
      {/* Drip tray */}
      <mesh position={[0, 0.04, 0.72]} receiveShadow>
        <boxGeometry args={[1.45, 0.1, 1.0]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.3} metalness={0.85} />
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
    const fill = shot * 0.4 + water * 0.55;
    if (ref.current) {
      ref.current.position.y = 0.09 + fill * 0.78;
      ref.current.scale.setScalar(0.4 + fill * 0.3);
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
    const surface = 0.09 + (shot * 0.4 + water * 0.55) * 0.78;
    const top = 1.05;
    const h = Math.max(top - surface, 0.01);
    ref.current.scale.y = h;
    ref.current.position.y = surface + h / 2;
  });
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[radius * 0.7, radius, 1, 16, 1, true]} />
      <meshStandardMaterial color={colour} roughness={0.18} transparent opacity={0.94} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Grounds falling from the grinder into the basket. */
function Grounds({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const rand = mulberry32(0xbea75);
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = Math.sin(a) * r;
      off[i] = rand();
    }
    return { pos, off };
  }, [count]);

  useFrame(() => {
    const l = level.current ?? 0;
    const active = span(l, GRIND[0], GRIND[1]);
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = active > 0.02 && active < 0.98 ? 0.95 : 0;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const p = clamp01(active * 1.8 - seed.off[i] * 0.8);
      arr[i * 3] = seed.pos[i * 3];
      arr[i * 3 + 1] = 1.5 - p * 0.85;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[MACHINE_X + 1.1, 0.28, HEAD_Z]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.032} color="#4a2a16" transparent opacity={0} depthWrite={false} sizeAttenuation />
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
      pos[i * 3] = (rand() - 0.5) * 0.4;
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = (rand() - 0.5) * 0.4;
      phase[i] = rand() * Math.PI * 2;
    }
    return { pos, phase };
  }, [count]);

  useFrame((state) => {
    const l = level.current ?? 0;
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = span(l, 0.72, 0.97) * 0.4;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const y = (seed.pos[i * 3 + 1] + t * 0.2) % 1;
      arr[i * 3] = seed.pos[i * 3] + Math.sin(t * 0.7 + seed.phase[i]) * 0.09 * y;
      arr[i * 3 + 1] = 1.0 + y;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2] + Math.cos(t * 0.6 + seed.phase[i]) * 0.09 * y;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#efe7dc" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/** The cup waits by the scale, then travels under the group head. */
function Cup({ level }: { level: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pts = useMemo(() => cupProfile(), []);

  useFrame(() => {
    const l = level.current ?? 0;
    const t = ease(span(l, PLACE[0], PLACE[1]));
    if (!group.current) return;
    group.current.position.x = lerp(CUP_PARKED[0], CUP_UNDER[0], t);
    group.current.position.z = lerp(CUP_PARKED[2], CUP_UNDER[2], t);
    // Lifts slightly as it is carried, and sets down at the end.
    group.current.position.y = CUP_PARKED[1] + Math.sin(t * Math.PI) * 0.3;
  });

  return (
    <group ref={group} position={CUP_PARKED}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[pts, 64]} />
        <meshStandardMaterial color={PORCELAIN} roughness={0.34} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>
      <Drink level={level} />
      <Stream level={level} from={EXTRACT[0]} to={EXTRACT[1]} colour="#30170c" radius={0.04} />
      <Stream level={level} from={WATER[0]} to={WATER[1]} colour="#b08a63" radius={0.06} />
      <Steam level={level} count={40} />
    </group>
  );
}

/** Wide on the counter, then in on the cup as the shot is pulled. */
function Rig({ level }: { level: React.RefObject<number> }) {
  useFrame((state) => {
    const l = level.current ?? 0;
    const close = ease(span(l, PLACE[0], EXTRACT[1]));
    const cam = state.camera;
    cam.position.x = lerp(0.1, -1.1, close);
    cam.position.y = lerp(2.3, 1.15, close);
    cam.position.z = lerp(6.4, 3.0, close);
    cam.lookAt(lerp(-0.4, -1.5, close), lerp(1.0, 0.6, close), 0.5);
  });
  return null;
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
      camera={{ position: [0.1, 2.3, 6.4], fov: 34 }}
      gl={{ antialias: !light, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.78} />
      <directionalLight position={[3, 6, 4]} intensity={1.35} castShadow={!light} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 3, -2]} intensity={0.4} />

      <mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#e4ded3" roughness={0.92} />
      </mesh>

      <Machine level={level} />
      <Scale level={level} />
      <Cup level={level} />
      <Grounds level={level} count={light ? 40 : 80} />
      <Rig level={level} />
    </Canvas>
  );
}
