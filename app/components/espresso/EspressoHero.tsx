"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/* The 3D bundle is fetched only after the page is interactive, so the
   headline paints immediately whatever the network is doing. */
const CupScene = dynamic(() => import("./CupScene"), {
  ssr: false,
  loading: () => null,
});

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

/** The pour, as the reader scrolls: dose, grind, tamp, extract, pour. */
const STAGES = [
  { at: 0.0, label: "Dose", note: "Weigh the problem before touching it." },
  { at: 0.22, label: "Grind", note: "Clean, join, and write the codebook." },
  { at: 0.46, label: "Tamp", note: "Hold the method steady so the result means something." },
  { at: 0.7, label: "Extract", note: "Train it, then try to break it." },
  { at: 0.92, label: "Pour", note: "Hand someone a decision they can act on." },
];

export default function EspressoHero() {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const coarse = useMedia("(max-width: 768px)");

  const wrapRef = useRef<HTMLDivElement>(null);
  const level = useRef(0);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);

  /* Hold the 3D back until the browser is idle, so it can never compete
     with first paint. */
  useEffect(() => {
    if (reduced) return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    const start = () => setReady(true);
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 1800 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(start, 700);
    return () => window.clearTimeout(t);
  }, [reduced]);

  /* Scroll drives the fill. Written to a ref, so scrolling never
     re-renders React; only the canvas reads it. */
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      // Driven by page scroll, not by the element's travel: the hero is
      // already on screen at load, so element-travel starts the cup
      // two-thirds full. This starts empty and fills over roughly one and a
      // sixth screens of scrolling.
      const span = window.innerHeight * 1.15;
      const l = Math.min(Math.max(window.scrollY / span, 0), 1);
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
    <div ref={wrapRef} className="grid md:grid-cols-[1fr_22rem] gap-x-14 gap-y-12 items-center">
      <div className="rise">
        <h1 className="text-[3rem] md:text-[4.75rem] leading-[0.98] max-w-[14ch]">
          Aryan Mudhole
        </h1>

        <p
          className="prose-serif mt-8 text-xl md:text-[1.6rem] md:leading-snug max-w-[40ch]"
          style={{ color: "var(--ink-2)" }}
        >
          Data analyst working across justice-system reporting, a meal-delivery
          programme, and credit-risk modelling. I care most about the part after
          the model, where someone has to act on it.
        </p>

        {/* The stage reads out as the cup fills. */}
        <div
          className="mt-10 pt-5 rule-top max-w-[34ch]"
          style={{ borderColor: "var(--rule-firm)" }}
          aria-live="polite"
        >
          <div className="flex items-baseline gap-3">
            <span className="tabular text-sm" style={{ color: "var(--crema)" }}>
              {String(stage + 1).padStart(2, "0")}
            </span>
            <span className="text-lg">{current.label}</span>
          </div>
          <p className="prose-serif text-[0.95rem] mt-1" style={{ color: "var(--ink-2)" }}>
            {current.note}
          </p>
        </div>
      </div>

      <div className="order-first md:order-last">
        <div
          className="w-full"
          style={{ height: "clamp(300px, 46vw, 440px)" }}
          aria-hidden="true"
        >
          {ready && !reduced ? (
            <CupScene level={level} quality={coarse ? "light" : "full"} />
          ) : null}
        </div>
        <p className="text-xs text-center mt-2" style={{ color: "var(--ink-3)" }}>
          Scroll to pull the shot.
        </p>
      </div>
    </div>
  );
}
