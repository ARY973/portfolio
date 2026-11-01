"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import points from "../lib/boundaryPoints.json";

type P = { c: number; r: number; p: number };
const DATA = points as P[];

/* Plot bounds, taken from the data rather than padded arbitrarily. */
const X_MIN = 300, X_MAX = 900;   // credit score
const Y_MIN = 0.6, Y_MAX = 5.4;   // loan-to-income ratio

const PAPER = "#f4f5f2";
const RULE = "#dcdfd9";
const RULE_FIRM = "#c3c8c0";
const INK3 = "#6b716d";
const REJECT = "#9b2c2c";
const APPROVE = "#1f5c3d";

/* The fill completes before the plot leaves the screen, so the finished
   boundary is visible rather than scrolling away mid-draw. */
const START = 0.04;
const END = 0.62;

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
 * The model scoring its held-out set, drawn by the reader's own scrolling.
 *
 * Credit score across, loan-to-income up. Every dot is one real application,
 * coloured by the verdict and faded by the model's confidence. Scroll down and
 * the boundary assembles; scroll back and it comes apart again.
 */
export default function DecisionBoundary() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  /* Map the plot's travel through the viewport onto 0 to 1. */
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = vh + rect.height;
      const travelled = vh - rect.top;
      const raw = travelled / span;
      const scaled = (raw - START) / (END - START);
      setProgress(Math.min(Math.max(scaled, 0), 1));
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
  }, [reduced]);

  // Reduced motion gets the finished plot without any scroll dependency.
  const plotted = reduced ? DATA.length : Math.round(progress * DATA.length);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const padL = 46, padR = 10, padT = 10, padB = 32;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const sx = (c: number) => padL + ((c - X_MIN) / (X_MAX - X_MIN)) * plotW;
    const sy = (r: number) =>
      padT + plotH - ((r - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;

    ctx.strokeStyle = RULE_FIRM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.strokeStyle = RULE;
    [1, 2, 3, 4, 5].forEach((t) => {
      ctx.beginPath();
      ctx.moveTo(padL, sy(t));
      ctx.lineTo(padL + plotW, sy(t));
      ctx.stroke();
    });

    ctx.fillStyle = INK3;
    ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    [300, 450, 600, 750, 900].forEach((t) =>
      ctx.fillText(String(t), sx(t), padT + plotH + 17)
    );
    ctx.fillText("Credit score", padL + plotW / 2, padT + plotH + 30);
    ctx.textAlign = "right";
    [1, 2, 3, 4, 5].forEach((t) => ctx.fillText(`${t}x`, padL - 8, sy(t) + 4));

    for (let i = 0; i < plotted; i++) {
      const d = DATA[i];
      const x = sx(d.c);
      const y = sy(Math.min(Math.max(d.r, Y_MIN), Y_MAX));
      const rejected = d.p >= 0.5;
      const confidence = Math.abs(d.p - 0.5) * 2;
      ctx.fillStyle = rejected ? REJECT : APPROVE;
      ctx.globalAlpha = 0.16 + confidence * 0.5;
      ctx.beginPath();
      ctx.arc(x, y, i > plotted - 5 ? 3.3 : 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [plotted]);

  const started = plotted > 0;

  return (
    <div ref={wrapRef}>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="text-sm" style={{ color: "var(--ink-2)" }}>
          {started
            ? "My credit model scoring its held-out set"
            : "Scroll to run my credit model on its held-out set"}
        </h2>
        <span className="tabular text-xs" style={{ color: "var(--ink-3)" }}>
          {plotted} / {DATA.length}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "clamp(230px, 34vw, 340px)" }}
        role="img"
        aria-label={`Scatter plot of ${DATA.length} loan applications scored by the model. Credit score on the horizontal axis, loan-to-income ratio on the vertical. Approvals and rejections separate almost entirely along credit score, at roughly 550.`}
      />

      <p className="text-xs mt-3" style={{ color: "var(--ink-3)" }}>
        Each dot is one real application, coloured by the model&apos;s verdict
        and faded by how unsure it was. The split falls almost entirely along
        credit score, which is the concentration{" "}
        <a href="/projects/loan-default" className="link">
          the stress test
        </a>{" "}
        was built to probe.
      </p>
    </div>
  );
}
