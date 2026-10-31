"use client";

import { useEffect, useRef, useState } from "react";
import points from "../lib/boundaryPoints.json";
import { usePrefersReducedMotion } from "../hooks/useInView";

type P = { c: number; r: number; p: number };
const DATA = points as P[];

/* Plot bounds, chosen from the data rather than padded arbitrarily. */
const X_MIN = 300, X_MAX = 900;   // credit score
const Y_MIN = 0.6, Y_MAX = 5.4;   // loan-to-income ratio

const PAPER = "#f4f5f2";
const RULE = "#dcdfd9";
const INK3 = "#8a918b";
const REJECT = "#9b2c2c";
const APPROVE = "#1f5c3d";

/**
 * Every held-out application, scored by the fitted model and plotted as it is
 * scored. Credit score across, loan-to-income up. After a few seconds the
 * boundary the model learned has drawn itself, and the near-vertical split is
 * the concentration the no-credit-score stress test was built to probe.
 */
export default function DecisionBoundary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);
  const rafRef = useRef(0);

  // Advance the number of plotted points over time.
  useEffect(() => {
    if (reduced || !running) return;

    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      // ~47 points a second, so the full set lands in about 18 seconds:
      // long enough to watch the separation emerge, short enough to finish.
      setCount((c) => Math.min(c + dt * 0.047, DATA.length));
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, running]);

  // Paint.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);

    const padL = 44, padR = 10, padT = 10, padB = 30;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const sx = (c: number) => padL + ((c - X_MIN) / (X_MAX - X_MIN)) * plotW;
    const sy = (r: number) =>
      padT + plotH - ((r - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;

    // Axes
    ctx.strokeStyle = RULE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.fillStyle = INK3;
    ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    [300, 450, 600, 750, 900].forEach((t) => {
      ctx.fillText(String(t), sx(t), padT + plotH + 16);
    });
    ctx.textAlign = "right";
    [1, 2, 3, 4, 5].forEach((t) => {
      ctx.fillText(`${t}x`, padL - 8, sy(t) + 4);
    });

    ctx.textAlign = "center";
    ctx.fillText("Credit score", padL + plotW / 2, padT + plotH + 28);

    // Points, oldest first so the newest sit on top.
    const n = reduced ? DATA.length : Math.floor(count);
    for (let i = 0; i < n; i++) {
      const d = DATA[i];
      const x = sx(d.c);
      const y = sy(Math.min(Math.max(d.r, Y_MIN), Y_MAX));
      const rejected = d.p >= 0.5;
      // Confidence drives opacity: the uncertain middle stays faint.
      const conf = Math.abs(d.p - 0.5) * 2;
      ctx.fillStyle = rejected ? REJECT : APPROVE;
      ctx.globalAlpha = 0.18 + conf * 0.52;
      ctx.beginPath();
      ctx.arc(x, y, i > n - 4 ? 3.4 : 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [count, reduced]);

  const plotted = reduced ? DATA.length : Math.floor(count);
  const done = plotted >= DATA.length;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="text-sm" style={{ color: "var(--ink-2)" }}>
          My credit model scoring every held-out application
        </h2>
        <div className="flex items-center gap-4">
          <span className="tabular text-xs" style={{ color: "var(--ink-3)" }}>
            {plotted} / {DATA.length}
          </span>
          <button
            onClick={() => {
              if (done) setCount(0);
              else setRunning((r) => !r);
            }}
            className="text-xs underline"
            style={{
              color: "var(--ink-3)",
              textUnderlineOffset: "0.18em",
              textDecorationThickness: "1px",
            }}
          >
            {done ? "Replay" : running && !reduced ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "clamp(220px, 34vw, 330px)" }}
        role="img"
        aria-label={`Scatter plot of ${DATA.length} loan applications. Credit score on the horizontal axis, loan-to-income ratio on the vertical. The model's approvals and rejections separate almost entirely along credit score, at roughly 550.`}
      />

      <p className="text-xs mt-3" style={{ color: "var(--ink-3)" }}>
        Vertical axis is loan-to-income. Each dot is one real application,
        coloured by the model&apos;s verdict and faded by how unsure it was. The
        split falls almost entirely along credit score, which is the
        concentration{" "}
        <a href="/projects/loan-default" className="link">
          the stress test
        </a>{" "}
        was built to probe.
      </p>
    </div>
  );
}
