"use client";

import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import rows from "../lib/liveApplications.json";

type Row = (typeof rows)[number];

const inr = (n: number) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(1)} Cr` : `₹${(n / 1e5).toFixed(0)} L`;

function usePrefersReducedMotion() {
  const subscribe = useCallback((cb: () => void) => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/**
 * Real applications from the held-out test set, scored by the fitted model,
 * one every few seconds. Every value on screen is a real number: nothing here
 * is decoration.
 */
export default function LiveFeed() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (reduced || !running) return;
    const t = setInterval(() => setI((n) => (n + 1) % rows.length), 2600);
    return () => clearInterval(t);
  }, [reduced, running]);

  const row: Row = rows[i];
  const rejected = row.p >= 0.5;
  const colour = rejected ? "var(--reject)" : "var(--approve)";
  const correct = rejected === (row.actual === 1);

  return (
    <div
      className="rule-top pt-6"
      style={{ borderColor: "var(--rule-firm)" }}
      onMouseEnter={() => setRunning(false)}
      onMouseLeave={() => setRunning(true)}
    >
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 className="text-sm" style={{ color: "var(--ink-2)" }}>
          My credit model, scoring held-out applications
        </h2>
        <button
          onClick={() => setRunning((r) => !r)}
          className="text-xs underline"
          style={{
            color: "var(--ink-3)",
            textUnderlineOffset: "0.18em",
            textDecorationThickness: "1px",
          }}
          aria-pressed={!running}
        >
          {running && !reduced ? "Pause" : "Play"}
        </button>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-4 items-baseline"
      >
        <Field label="Credit score" value={row.cibil.toString()} />
        <Field label="Income" value={inr(row.income)} />
        <Field label="Requested" value={inr(row.amount)} />
        <Field label="Term" value={`${row.term} yr`} />

        <div>
          <div className="text-xs mb-1" style={{ color: "var(--ink-3)" }}>
            Verdict
          </div>
          <div
            className="tabular text-lg leading-tight"
            style={{
              color: colour,
              transition: "color 300ms ease",
            }}
          >
            {(row.p * 100).toFixed(1)}%
          </div>
          <div className="text-xs mt-0.5" style={{ color: colour }}>
            {rejected ? "Reject" : "Approve"}
          </div>
        </div>
      </div>

      {/* The model's confidence, as a single rule that redraws each time. */}
      <div
        className="h-px w-full mt-5"
        style={{ background: "var(--rule)" }}
        aria-hidden="true"
      >
        <div
          className="h-px"
          style={{
            width: `${row.p * 100}%`,
            background: colour,
            transition: reduced ? "none" : "width 700ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      <p className="text-xs mt-4" style={{ color: "var(--ink-3)" }}>
        {correct
          ? "Matches what the lender actually decided."
          : "The lender decided the other way. The model is wrong on this one."}{" "}
        <a href="#model" className="link">
          Drive it yourself
        </a>
        .
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs mb-1" style={{ color: "var(--ink-3)" }}>
        {label}
      </div>
      <div className="tabular text-lg leading-tight">{value}</div>
    </div>
  );
}
