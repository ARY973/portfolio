"use client";

import { useEffect, useState } from "react";
import roc from "../lib/rocCurve.json";
import { useInView, usePrefersReducedMotion } from "../hooks/useInView";
import CountUp from "./CountUp";

const SIGNAL = "var(--signal)";

/* ------------------------------------------------------------------ */
/* ROC curve, drawn on entry                                           */
/* ------------------------------------------------------------------ */
export function RocCurve() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  const W = 320, H = 300, pad = 36;
  const sx = (v: number) => pad + v * (W - pad - 8);
  const sy = (v: number) => H - pad - v * (H - pad - 10);

  const d = roc.fpr
    .map((f, i) => `${i === 0 ? "M" : "L"}${sx(f).toFixed(1)},${sy(roc.tpr[i]).toFixed(1)}`)
    .join(" ");

  const area = `${d} L${sx(1).toFixed(1)},${sy(0).toFixed(1)} L${sx(0).toFixed(1)},${sy(0).toFixed(1)} Z`;

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
        <title>ROC curve, area under curve 0.974</title>

        {/* frame */}
        <line x1={pad} y1={10} x2={pad} y2={H - pad} stroke="var(--rule)" />
        <line x1={pad} y1={H - pad} x2={W - 8} y2={H - pad} stroke="var(--rule)" />
        <line
          x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)}
          stroke="var(--rule)" strokeDasharray="3 3"
        />

        {/* area under the curve, fading in after the line draws */}
        <path
          d={area}
          fill={SIGNAL}
          opacity={seen ? 0.08 : 0}
          style={{ transition: reduced ? "none" : "opacity 500ms ease 900ms" }}
        />

        {/* the curve itself */}
        <path
          d={d}
          fill="none"
          stroke={SIGNAL}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1200"
          strokeDashoffset={seen || reduced ? 0 : 1200}
          style={{
            transition: reduced ? "none" : "stroke-dashoffset 1100ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />

        {[0, 0.5, 1].map((t) => (
          <text key={`x${t}`} x={sx(t)} y={H - pad + 16} fontSize="10"
            fill="var(--ink-3)" textAnchor="middle">{t}</text>
        ))}
        {[0, 0.5, 1].map((t) => (
          <text key={`y${t}`} x={pad - 8} y={sy(t) + 3} fontSize="10"
            fill="var(--ink-3)" textAnchor="end">{t}</text>
        ))}
        <text x={sx(0.5)} y={H - 4} fontSize="10" fill="var(--ink-3)" textAnchor="middle">
          False positive rate
        </text>
      </svg>

      <p className="text-sm mt-2" style={{ color: "var(--ink-2)" }}>
        Area under the curve{" "}
        <CountUp to={0.974} decimals={3} duration={1100} />
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Confusion matrix, filling cell by cell                              */
/* ------------------------------------------------------------------ */
const CELLS = [
  { r: 0, c: 0, v: 503, label: "Approved, called approved" },
  { r: 0, c: 1, v: 28, label: "Approved, called rejected" },
  { r: 1, c: 0, v: 44, label: "Rejected, called approved" },
  { r: 1, c: 1, v: 279, label: "Rejected, called rejected" },
];

export function ConfusionMatrix() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!seen || reduced) return;
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= CELLS.length) clearInterval(t);
    }, 260);
    return () => clearInterval(t);
  }, [seen, reduced]);

  const visible = reduced ? CELLS.length : shown;
  const max = 503;

  return (
    <div ref={ref}>
      <div className="grid grid-cols-[auto_1fr_1fr] gap-px" style={{ maxWidth: "22rem" }}>
        <div />
        <div className="text-xs pb-2 text-center" style={{ color: "var(--ink-3)" }}>
          Called approved
        </div>
        <div className="text-xs pb-2 text-center" style={{ color: "var(--ink-3)" }}>
          Called rejected
        </div>

        {[0, 1].map((row) => (
          <RowGroup key={row} row={row} shown={visible} max={max} />
        ))}
      </div>

      <p className="text-sm mt-4" style={{ color: "var(--ink-2)" }}>
        <CountUp to={44} /> rejections called approved. Those are the expensive
        ones: risk a lender books having meant to decline it.
      </p>
    </div>
  );
}

function RowGroup({ row, shown, max }: { row: number; shown: number; max: number }) {
  const cells = CELLS.filter((c) => c.r === row);
  return (
    <>
      <div
        className="text-xs pr-3 flex items-center justify-end"
        style={{ color: "var(--ink-3)" }}
      >
        {row === 0 ? "Was approved" : "Was rejected"}
      </div>
      {cells.map((cell) => {
        const index = CELLS.indexOf(cell);
        const on = shown > index;
        const weight = cell.v / max;
        return (
          <div
            key={cell.label}
            className="aspect-[4/3] flex items-center justify-center"
            style={{
              background: on
                ? `color-mix(in srgb, var(--signal) ${Math.round(weight * 85)}%, var(--paper))`
                : "var(--paper)",
              border: "1px solid var(--rule)",
              transition: "background 420ms ease",
            }}
          >
            <span
              className="tabular text-2xl"
              style={{
                color: weight > 0.55 ? "var(--paper)" : "var(--ink)",
                opacity: on ? 1 : 0,
                transition: "opacity 300ms ease",
              }}
            >
              {on ? <CountUp to={cell.v} duration={600} /> : 0}
            </span>
          </div>
        );
      })}
    </>
  );
}
