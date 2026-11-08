"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/* The 3D bundle is fetched only once the page is interactive, so the
   headline paints immediately whatever the network is doing. */
const CupScene = dynamic(() => import("./CupScene"), { ssr: false, loading: () => null });

function useMedia(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Espresso to americano, as the reader scrolls. Each stage names how the
 * work actually goes, which is the point: the drink is the frame, the
 * sentences are the content.
 */
const STAGES = [
  { at: 0.0, label: "Dose", note: "Weigh the problem before touching it." },
  { at: 0.14, label: "Grind", note: "Clean it, join it, write the codebook." },
  { at: 0.34, label: "Tamp", note: "Hold the method steady so the answer means something." },
  { at: 0.5, label: "Extract", note: "Train it, then try hard to break it." },
  { at: 0.74, label: "Lengthen", note: "A shot nobody can drink is not a result. Make it usable by the people who did not build it." },
  { at: 0.92, label: "Serve", note: "Hand someone a decision they can act on." },
];

export default function EspressoHero() {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const small = useMedia("(max-width: 768px)");

  const level = useRef(0);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => setReady(true);
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 1800 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(start, 700);
    return () => window.clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      // Page scroll, not element travel: the hero is on screen at load, so
      // element travel would start the cup already full.
      const over = window.innerHeight * 1.5;
      const l = Math.min(Math.max(window.scrollY / over, 0), 1);
      level.current = l;

      let next = 0;
      for (let i = 0; i < STAGES.length; i++) if (l >= STAGES[i].at) next = i;
      setStage((s) => (s === next ? s : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = STAGES[stage];

  return (
    <div className="relative" style={{ minHeight: "min(92vh, 860px)" }}>
      {/* The cup owns the middle of the hero. */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          style={{
            width: "min(100%, 46rem)",
            height: "min(78vh, 680px)",
          }}
        >
          {ready && !reduced ? (
            <CupScene level={level} quality={small ? "light" : "full"} />
          ) : null}
        </div>
      </div>

      {/* Text sits over it, top and bottom, so the cup is never obscured. */}
      <div className="relative flex flex-col justify-between" style={{ minHeight: "min(92vh, 860px)" }}>
        <div className="rise pt-20 md:pt-24 text-center">
          <h1 className="text-[2.75rem] md:text-[4.5rem] leading-[0.98]">
            Aryan Mudhole
          </h1>
          <p
            className="prose-serif mt-5 text-lg md:text-xl max-w-[34ch] mx-auto"
            style={{ color: "var(--ink-2)" }}
          >
            Data analyst. I care most about the part after the model, where
            someone has to act on it.
          </p>
        </div>

        <div className="pb-12 flex justify-center">
          <div
            className="pt-5 rule-top text-center max-w-[40ch] w-full"
            style={{
              borderColor: "var(--rule-firm)",
              background:
                "linear-gradient(to top, var(--paper) 55%, transparent)",
            }}
            aria-live="polite"
          >
            <div className="flex items-baseline justify-center gap-3">
              <span className="tabular text-sm" style={{ color: "var(--crema)" }}>
                {String(stage + 1).padStart(2, "0")} / {STAGES.length}
              </span>
              <span className="text-lg">{current.label}</span>
            </div>
            <p
              className="prose-serif text-[0.95rem] mt-1.5"
              style={{ color: "var(--ink-2)" }}
            >
              {current.note}
            </p>
            <p className="text-xs mt-4" style={{ color: "var(--ink-3)" }}>
              Keep scrolling to pull the shot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
