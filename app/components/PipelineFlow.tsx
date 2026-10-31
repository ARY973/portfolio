"use client";

import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "../hooks/useInView";

export type Stage = {
  name: string;
  detail: string;
  out: string;
};

/**
 * A pipeline you can watch run. Each stage lights in turn, a marker travels
 * the connector, and the stage's real output appears when it lands. The
 * timing is cosmetic; the stages and their outputs are not.
 */
export default function PipelineFlow({
  stages,
  caption,
  cadence = 1150,
}: {
  stages: Stage[];
  caption?: string;
  cadence?: number;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!seen || reduced) return;
    let n = -1;
    const t = setInterval(() => {
      n += 1;
      setStep(n);
      if (n >= stages.length - 1) clearInterval(t);
    }, cadence);
    return () => clearInterval(t);
  }, [seen, reduced, stages.length, cadence]);

  const current = reduced ? stages.length - 1 : step;
  const done = current >= stages.length - 1;

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h3 className="text-sm" style={{ color: "var(--ink-2)" }}>
          One run, stage by stage
        </h3>
        {!reduced && (
          <button
            onClick={() => setStep(-1)}
            disabled={!done}
            className="text-xs underline disabled:opacity-40"
            style={{
              color: "var(--ink-3)",
              textUnderlineOffset: "0.18em",
              textDecorationThickness: "1px",
            }}
          >
            Run again
          </button>
        )}
      </div>

      <ol className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        {stages.map((s, i) => {
          const active = current === i;
          const passed = current > i;
          const lit = active || passed;
          return (
            <li
              key={s.name}
              className="spine py-5 rule-bottom relative"
              style={{ borderColor: "var(--rule)" }}
            >
              <div className="spine-label flex items-center gap-2">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: lit ? "var(--signal)" : "var(--rule-firm)",
                    transform: active ? "scale(1.8)" : "scale(1)",
                    transition: "background 260ms ease, transform 260ms ease",
                  }}
                />
                <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <div className="max-w-[58ch]">
                <div
                  className="mb-1"
                  style={{
                    color: lit ? "var(--ink)" : "var(--ink-3)",
                    transition: "color 300ms ease",
                  }}
                >
                  {s.name}
                </div>
                <p
                  className="prose-serif text-[0.95rem]"
                  style={{ color: "var(--ink-2)" }}
                >
                  {s.detail}
                </p>
                <p
                  className="mono text-xs mt-2"
                  style={{
                    color: "var(--signal)",
                    opacity: lit ? 1 : 0,
                    transform: lit ? "none" : "translateY(3px)",
                    transition: "opacity 320ms ease, transform 320ms ease",
                  }}
                >
                  {s.out}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {caption && (
        <p className="text-xs mt-4" style={{ color: "var(--ink-3)" }}>
          {caption}
        </p>
      )}
    </div>
  );
}
