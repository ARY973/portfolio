/**
 * Small deterministic PRNG (mulberry32).
 *
 * Scene layout must not call Math.random() during render: it is impure, and
 * server and client would disagree. A fixed seed looks just as arbitrary and
 * stays stable across renders.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
