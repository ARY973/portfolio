"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../../lib/rng";

/* ------------------------------------------------------------------ *
 * A real counter, left to right: espresso machine, grinder, scale.
 * Everything rests on the slab at y = 0. The portafilter is its own
 * travelling object, so it can be carried to the grinder, filled under
 * the chute, tamped, and locked into the group head — which is why no
 * coffee ever falls out of thin air.
 *
 * `level` 0 to 1:
 *   0.00–0.13  counter    wide, at rest
 *   0.13–0.28  weigh      beans onto the scale
 *   0.28–0.44  grind      portafilter under the chute, grounds fall in
 *   0.44–0.55  tamp       tamper presses the puck
 *   0.55–0.68  place      portafilter locks in, cup slides under
 *   0.68–0.82  extract    dark stream
 *   0.82–0.93  lengthen   water
 *   0.93–1.00  serve      steam
 * ------------------------------------------------------------------ */

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const WEIGH = [0.13, 0.28] as const;
const GRIND = [0.28, 0.44] as const;
const TAMP = [0.44, 0.55] as const;
const PLACE = [0.55, 0.68] as const;
const EXTRACT = [0.68, 0.82] as const;
const WATER = [0.82, 0.93] as const;

const STEEL = "#c3c7cc";
const STEEL_DARK = "#8f949b";
const BLACK = "#26262a";
const WALNUT = "#6b4423";
const PORCELAIN = "#f7f4ee";
const COUNTER = "#ddd5c8";

/* Counter layout. The slab top is y = 0; nothing sits below it. */
const MACHINE_X = -1.6;
const GRINDER_X = 0.35;
const SCALE_X = 1.7;
const HEAD_Z = 0.82;
/* High enough that a locked portafilter clears the rim of the cup under it. */
const HEAD_Y = 1.15;
const TRAY_TOP = 0.1;
const CUP_SCALE = 0.62;

/** Where the portafilter is at each phase. */
const PF_REST: [number, number, number] = [GRINDER_X - 0.02, 0.1, 1.05];
const PF_UNDER_CHUTE: [number, number, number] = [GRINDER_X, 0.1, 0.26];
/* Tamping happens clear of the grinder, not underneath its chute. */
const PF_TAMP: [number, number, number] = [GRINDER_X + 0.58, 0.1, 0.85];
const PF_LOCKED: [number, number, number] = [MACHINE_X, HEAD_Y - 0.18, HEAD_Z];

/* Where the spout ends up once locked in, and the same height expressed
   inside the scaled cup, so the stream starts at the spout rather than
   somewhere in the air above the drink. */
const SPOUT_Y = HEAD_Y - 0.38;
const STREAM_TOP = (SPOUT_Y - TRAY_TOP) / CUP_SCALE;

const CUP_PARKED: [number, number, number] = [-0.45, 0, 1.3];
const CUP_UNDER: [number, number, number] = [MACHINE_X, 0, HEAD_Z];

function cupProfile() {
  const pts: THREE.Vector2[] = [];
  (
    [
      [0, 0],
      [0.38, 0],
      [0.47, 0.05],
      [0.58, 0.2],
      [0.66, 0.46],
      [0.7, 0.74],
      [0.71, 0.86],
    ] as [number, number][]
  ).forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  pts.push(new THREE.Vector2(0.68, 0.88));
  (
    [
      [0.63, 0.74],
      [0.54, 0.46],
      [0.46, 0.22],
      [0.36, 0.08],
      [0, 0.06],
    ] as [number, number][]
  ).forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  return pts;
}

/* ---------------------------------------------------------------- */

function Counter() {
  return (
    <group>
      {/* Slab with a real front edge, so the surface reads as a surface. */}
      <mesh position={[0, -0.16, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 0.32, 5.2]} />
        <meshStandardMaterial color={COUNTER} roughness={0.85} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.335, 0]} receiveShadow>
        <boxGeometry args={[10.6, 0.03, 5.0]} />
        <meshStandardMaterial color="#b8ae9e" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Scale({ level }: { level: React.RefObject<number> }) {
  const beans = useRef<THREE.Points>(null);
  const bar = useRef<THREE.Mesh>(null);

  const pos = useMemo(() => {
    const rand = mulberry32(0x5ca1e);
    const n = 80;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.26;
      arr[i * 3] = Math.cos(a) * r;
      // Sitting on the platter, not hovering over it.
      arr[i * 3 + 1] = 0.205 + rand() * 0.05;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame(() => {
    const l = level.current ?? 0;
    const filling = span(l, WEIGH[0], WEIGH[1]);
    const gone = span(l, GRIND[0], GRIND[0] + 0.04);
    const amount = filling * (1 - gone);
    if (beans.current) {
      const mat = beans.current.material as THREE.PointsMaterial;
      mat.opacity = amount;
      beans.current.visible = amount > 0.01;
    }
    if (bar.current) bar.current.scale.x = Math.max(amount, 0.001);
  });

  return (
    <group position={[SCALE_X, 0, 0.45]}>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.58, 0.62, 0.16, 44]} />
        <meshStandardMaterial color={BLACK} roughness={0.48} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.175, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.03, 44]} />
        <meshStandardMaterial color={STEEL} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.115, 0.58]} rotation-x={-0.45}>
        <planeGeometry args={[0.44, 0.15]} />
        <meshStandardMaterial color="#10110f" roughness={0.6} />
      </mesh>
      <mesh ref={bar} position={[-0.18, 0.118, 0.588]} rotation-x={-0.45} scale-x={0.001}>
        <planeGeometry args={[0.32, 0.045]} />
        <meshStandardMaterial color="#79d6a0" emissive="#2f7f53" emissiveIntensity={0.7} />
      </mesh>
      <points ref={beans} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.065} color="#53301a" transparent opacity={0} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  );
}

/** Burr grinder: hopper of beans, body, and a chute the grounds come out of. */
function Grinder({ level }: { level: React.RefObject<number> }) {
  const hopper = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const l = level.current ?? 0;
    // Beans arrive in the hopper after weighing, and drain while grinding.
    const loaded = span(l, WEIGH[1] - 0.03, GRIND[0]);
    const drained = span(l, GRIND[0], GRIND[1]);
    if (hopper.current) {
      const fill = loaded * (1 - drained);
      hopper.current.scale.y = Math.max(fill, 0.001);
      hopper.current.position.y = 1.5 + fill * 0.14;
      hopper.current.visible = fill > 0.02;
    }
  });

  return (
    <group position={[GRINDER_X, 0, 0]}>
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.14, 0.78]} />
        <meshStandardMaterial color={BLACK} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.78, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.3, 0.56]} />
        <meshStandardMaterial color={STEEL} roughness={0.35} metalness={0.75} />
      </mesh>
      {/* Hopper */}
      <mesh position={[0, 1.65, -0.08]} castShadow>
        <cylinderGeometry args={[0.34, 0.2, 0.54, 28, 1, true]} />
        <meshStandardMaterial
          color="#cfd4d8"
          roughness={0.12}
          metalness={0.1}
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={hopper} position={[0, 1.5, -0.08]} scale-y={0.001}>
        <cylinderGeometry args={[0.3, 0.18, 0.4, 24]} />
        <meshStandardMaterial color="#53301a" roughness={0.9} />
      </mesh>
      {/* Chute: grounds leave here, which is where the portafilter waits. */}
      <mesh position={[0, 0.63, 0.26]} rotation-x={0.22} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.3, 20]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.28} metalness={0.85} />
      </mesh>
      {/* Fork the portafilter rests in */}
      <mesh position={[0, 0.3, 0.3]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.16]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

function Machine() {
  return (
    <group position={[MACHINE_X, 0, 0]}>
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.84, 1.3]} />
        <meshStandardMaterial color={STEEL} roughness={0.34} metalness={0.78} />
      </mesh>
      <mesh position={[0, 0.92, 0.66]} castShadow>
        <boxGeometry args={[1.24, 1.46, 0.06]} />
        <meshStandardMaterial color={BLACK} roughness={0.5} metalness={0.25} />
      </mesh>
      <mesh position={[0, 1.84, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 40]} />
        <meshStandardMaterial color={STEEL} roughness={0.28} metalness={0.85} />
      </mesh>
      <mesh position={[0.44, 1.46, 0.7]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 32]} />
        <meshStandardMaterial color={PORCELAIN} roughness={0.25} />
      </mesh>
      <mesh position={[0.44, 1.46, 0.73]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.17, 0.02, 10, 32]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Group head */}
      <mesh position={[0, HEAD_Y, HEAD_Z]} castShadow>
        <cylinderGeometry args={[0.29, 0.33, 0.4, 32]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.26} metalness={0.9} />
      </mesh>
      {/* Drip tray, raised off the slab on its own lip */}
      <mesh position={[0, 0.05, 0.74]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.1, 1.05]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.3} metalness={0.85} />
      </mesh>
    </group>
  );
}

/** Travels: rest → under the chute → tamped → locked into the group head. */
function Portafilter({ level }: { level: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const puck = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const l = level.current ?? 0;
    const toChute = ease(span(l, WEIGH[1] - 0.02, GRIND[0] + 0.02));
    const toTamp = ease(span(l, TAMP[0] - 0.04, TAMP[0] + 0.04));
    const toLock = ease(span(l, PLACE[0], PLACE[0] + 0.09));

    if (group.current) {
      const leg = (i: 0 | 1 | 2) =>
        lerp(
          lerp(lerp(PF_REST[i], PF_UNDER_CHUTE[i], toChute), PF_TAMP[i], toTamp),
          PF_LOCKED[i],
          toLock
        );
      // Carried between stations, so it lifts off the counter and sets back down.
      const hop = Math.sin(toTamp * Math.PI) * 0.16 + Math.sin(toLock * Math.PI) * 0.3;
      group.current.position.set(leg(0), leg(1) + hop, leg(2));
      group.current.rotation.y = lerp(0.5, 0, toChute) + toLock * 0.3;
    }
    if (puck.current) {
      const dosed = span(l, GRIND[0] + 0.03, GRIND[1]);
      const pressed = span(l, TAMP[0], TAMP[1]);
      puck.current.scale.y = Math.max(dosed * (1 - pressed * 0.35), 0.001);
      puck.current.visible = dosed > 0.02;
    }
  });

  return (
    <group ref={group} position={PF_REST}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.27, 0.24, 0.2, 32]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.24} metalness={0.9} />
      </mesh>
      <mesh ref={puck} position={[0, 0.07, 0]} scale-y={0.001}>
        <cylinderGeometry args={[0.23, 0.23, 0.1, 28]} />
        <meshStandardMaterial color="#3b2112" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.02, 0.5]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.05, 0.055, 0.6, 20]} />
        <meshStandardMaterial color={WALNUT} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.14, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.03, 0.12, 16]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.25} metalness={0.9} />
      </mesh>
    </group>
  );
}

/** Comes down onto the puck once, at the tamping spot beside the grinder. */
function Tamper({ level }: { level: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const l = level.current ?? 0;
    const t = span(l, TAMP[0], TAMP[1]);
    const press = Math.sin(clamp01(t) * Math.PI);
    if (!group.current) return;
    group.current.visible = press > 0.02;
    group.current.position.y = 1.05 - press * 0.76;
  });
  return (
    <group ref={group} position={[PF_TAMP[0], 1.05, PF_TAMP[2]]} visible={false}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 28]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.22} metalness={0.92} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.3, 20]} />
        <meshStandardMaterial color={WALNUT} roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Grounds leaving the chute, landing in the basket just below it. */
function Grounds({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const rand = mulberry32(0xbea75);
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.09;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = Math.sin(a) * r;
      off[i] = rand();
    }
    return { pos, off };
  }, [count]);

  useFrame(() => {
    const l = level.current ?? 0;
    const active = span(l, GRIND[0] + 0.02, GRIND[1]);
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = active > 0.02 && active < 0.97 ? 0.95 : 0;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Falls the short gap from chute mouth to basket, not from the sky.
      const p = (seed.off[i] + active * 2.2) % 1;
      arr[i * 3] = seed.pos[i * 3];
      arr[i * 3 + 1] = 0.38 - p * 0.26;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[GRINDER_X, 0.1, PF_UNDER_CHUTE[2]]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#4a2a16" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
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
      ref.current.position.y = 0.08 + fill * 0.72;
      ref.current.scale.setScalar(0.38 + fill * 0.28);
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
      <meshStandardMaterial ref={matRef} color="#1d0e07" roughness={0.3} />
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
    const surface = 0.08 + (shot * 0.4 + water * 0.55) * 0.72;
    const top = STREAM_TOP;
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

function Steam({ level, count }: { level: React.RefObject<number>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const rand = mulberry32(0xc0ffee);
    const pos = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 0.36;
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = (rand() - 0.5) * 0.36;
      phase[i] = rand() * Math.PI * 2;
    }
    return { pos, phase };
  }, [count]);

  useFrame((state) => {
    const l = level.current ?? 0;
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = span(l, 0.76, 0.98) * 0.38;
    ref.current.visible = mat.opacity > 0.01;
    if (!ref.current.visible) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const y = (seed.pos[i * 3 + 1] + t * 0.2) % 1;
      arr[i * 3] = seed.pos[i * 3] + Math.sin(t * 0.7 + seed.phase[i]) * 0.08 * y;
      arr[i * 3 + 1] = 0.92 + y;
      arr[i * 3 + 2] = seed.pos[i * 3 + 2] + Math.cos(t * 0.6 + seed.phase[i]) * 0.08 * y;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seed.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.11} color="#efe7dc" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/** Sits on the counter in frame from the start, then slides under the head. */
function Cup({ level }: { level: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pts = useMemo(() => cupProfile(), []);
  useFrame(() => {
    const l = level.current ?? 0;
    const t = ease(span(l, PLACE[0] + 0.04, PLACE[1]));
    if (!group.current) return;
    group.current.position.x = lerp(CUP_PARKED[0], CUP_UNDER[0], t);
    group.current.position.z = lerp(CUP_PARKED[2], CUP_UNDER[2], t);
    // Slides along the counter, lifting only onto the drip tray at the end.
    group.current.position.y = lerp(0, TRAY_TOP, t);
  });
  return (
    <group ref={group} position={CUP_PARKED} scale={CUP_SCALE}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[pts, 64]} />
        <meshStandardMaterial color={PORCELAIN} roughness={0.34} side={THREE.DoubleSide} />
      </mesh>
      <Drink level={level} />
      <Stream level={level} from={EXTRACT[0]} to={EXTRACT[1]} colour="#30170c" radius={0.038} />
      <Stream level={level} from={WATER[0]} to={WATER[1]} colour="#b08a63" radius={0.055} />
      <Steam level={level} count={40} />
    </group>
  );
}

/* Four stations. Each pan lands before its step's caption does, so nothing
   important ever happens off screen. */
const SHOT = {
  wide: { p: [-0.25, 2.3, 6.8], t: [-0.55, 0.85, 0.4] },
  scale: { p: [1.35, 1.75, 4.4], t: [1.7, 0.42, 0.45] },
  grinder: { p: [0.7, 1.8, 4.4], t: [0.5, 0.6, 0.4] },
  machine: { p: [-1.05, 1.24, 3.3], t: [-1.6, 0.52, 0.6] },
} as const;

function Rig({ level }: { level: React.RefObject<number> }) {
  useFrame((state) => {
    const l = level.current ?? 0;
    const toScale = ease(span(l, WEIGH[0], WEIGH[0] + 0.06));
    const toGrinder = ease(span(l, WEIGH[1] - 0.02, GRIND[0] + 0.04));
    const toMachine = ease(span(l, TAMP[1] - 0.03, PLACE[0] + 0.07));
    const at = (k: "p" | "t", i: number) =>
      lerp(
        lerp(lerp(SHOT.wide[k][i], SHOT.scale[k][i], toScale), SHOT.grinder[k][i], toGrinder),
        SHOT.machine[k][i],
        toMachine
      );
    state.camera.position.set(at("p", 0), at("p", 1), at("p", 2));
    state.camera.lookAt(at("t", 0), at("t", 1), at("t", 2));
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
      camera={{ position: [-0.25, 2.3, 6.8], fov: 34 }}
      gl={{ antialias: !light, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.76} />
      <directionalLight position={[4, 7, 5]} intensity={1.3} castShadow={!light} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 3, -2]} intensity={0.38} />

      <Counter />
      <Machine />
      <Grinder level={level} />
      <Scale level={level} />
      <Portafilter level={level} />
      <Tamper level={level} />
      <Grounds level={level} count={light ? 36 : 70} />
      <Cup level={level} />
      <Rig level={level} />
    </Canvas>
  );
}
