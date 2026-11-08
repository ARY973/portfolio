"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const BrewScene = dynamic(() => import("./BrewScene"), { ssr: false, loading: () => null });

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
 * The steps are the work. Each one is a real part of how Aryan actually
 * works, and happens to also be a step in pulling a shot. The coffee is the
 * frame; the sentences are the content.
 */
const STEPS = [
  {
    at: 0.0,
    step: "The machine",
    title: "Data analyst",
    body: "I work across justice-system reporting, a meal-delivery programme and credit-risk modelling. What I care about is the part after the model, where somebody has to act on it.",
  },
  {
    at: 0.13,
    step: "Weigh",
    title: "Weigh the problem first",
    body: "At the Transforming Communities Institute the brief came from the Executive Director, not a ticket. Most of the work was understanding what the research staff actually needed before writing anything.",
  },
  {
    at: 0.28,
    step: "Grind",
    title: "Break it down evenly",
    body: "Five Airtable tables into one coded wide-format dataset, delivered as SPSS-ready files on a weekly schedule. Uneven grounds ruin a shot; uneven joins ruin a finding.",
  },
  {
    at: 0.44,
    step: "Tamp",
    title: "Hold the method steady",
    body: "Versioned codebooks and a data dictionary, so the same question asked twice gets the same answer. The dull part is what makes the rest trustworthy.",
  },
  {
    at: 0.55,
    step: "Place the cup",
    title: "Decide where it lands",
    body: "Before anything runs, know who receives it and in what form. The CJA pipeline writes SPSS-ready files to Box on a schedule, because that is where the research staff actually work.",
  },
  {
    at: 0.68,
    step: "Extract",
    title: "Pull it, then try to break it",
    body: "Four models benchmarked on 4,269 loan applications, gradient boosting at 99% accuracy. Then I removed the credit score and watched it collapse to 0.61, which is the result that actually mattered.",
  },
  {
    at: 0.82,
    step: "Lengthen",
    title: "Make it drinkable",
    body: "A shot nobody can drink is not a result. At Meals on Wheels the reporting has to be usable by programme staff who did not build it, which is most of the job.",
  },
  {
    at: 0.93,
    step: "Serve",
    title: "Hand over a decision",
    body: "Don't score credit-invisible borrowers on this feature set. That sentence is the deliverable. Everything above it is how I got there.",
  },
];

export default function BrewSequence() {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const small = useMedia("(max-width: 860px)");

  const trackRef = useRef<HTMLDivElement>(null);
  const level = useRef(0);
  const [step, setStep] = useState(0);
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

  /* Progress through the pinned track drives the brew. */
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const l = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      level.current = l;

      let next = 0;
      for (let i = 0; i < STEPS.length; i++) if (l >= STEPS[i].at) next = i;
      setStep((s) => (s === next ? s : next));
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

  const current = STEPS[step];

  /* Reduced motion gets the same content as a plain list, no scene. */
  if (reduced) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-[3rem] md:text-[4.5rem] leading-[0.98] mb-10">Aryan Mudhole</h1>
        <ol className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
          {STEPS.map((s) => (
            <li key={s.step} className="spine py-6 rule-bottom" style={{ borderColor: "var(--rule)" }}>
              <div className="spine-label">{s.step}</div>
              <div className="max-w-[56ch]">
                <h2 className="text-xl mb-1">{s.title}</h2>
                <p className="prose-serif" style={{ color: "var(--ink-2)" }}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      aria-label="How the work goes, as a shot being pulled"
      style={{ height: `${STEPS.length * 58}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="h-full max-w-6xl mx-auto px-6 grid md:grid-cols-[minmax(0,26rem)_1fr] items-center gap-8">
          {/* The words sit in their own column. Nothing overlaps the scene. */}
          <div className="relative z-10 order-last md:order-first">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="tabular text-sm" style={{ color: "var(--crema)" }}>
                {String(step).padStart(2, "0")}
              </span>
              <span className="text-sm" style={{ color: "var(--ink-3)" }}>
                {current.step}
              </span>
            </div>

            <div aria-live="polite">
              {step === 0 ? (
                <h1 className="text-[2.6rem] md:text-[3.6rem] leading-[1.0] mb-4">
                  Aryan Mudhole
                </h1>
              ) : (
                <h2 className="text-2xl md:text-[2rem] leading-tight mb-3">
                  {current.title}
                </h2>
              )}
              <p
                className="prose-serif text-base md:text-lg max-w-[42ch]"
                style={{ color: "var(--ink-2)" }}
              >
                {current.body}
              </p>
            </div>

            {/* Where you are in the pull. */}
            <ol className="flex gap-1.5 mt-8" aria-hidden="true">
              {STEPS.map((s, i) => (
                <li
                  key={s.step}
                  style={{
                    height: 2,
                    width: 26,
                    background: i <= step ? "var(--crema)" : "var(--rule-firm)",
                    transition: "background 320ms ease",
                  }}
                />
              ))}
            </ol>
          </div>

          {/* The scene gets its own column, so the text never sits on top. */}
          <div className="h-[48vh] md:h-[78vh] w-full" aria-hidden="true">
            {ready ? <BrewScene level={level} quality={small ? "light" : "full"} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
