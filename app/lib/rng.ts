/**
 * Small deterministic PRNG (mulberry32).
 *
 * Scene layout used Math.random() during render, which is impure and can
 * differ between server and client. A fixed seed keeps the starfield stable
 * across renders and hydration while looking just as arbitrary.
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
