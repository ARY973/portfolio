"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";

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
 * A tsurigane: the hanging bronze bell of a Japanese temple.
 *
 * Drawn by hand as inline SVG rather than pulled in as a 3D model, so it
 * weighs a few kilobytes, stays sharp at any size, and costs no dependency.
 *
 * It sways slowly on its own. Struck, it swings harder and sends rings out
 * from the tsuki-za, the lotus panel where the beam lands.
 */
export default function Bell() {
  const reduced = usePrefersReducedMotion();
  const [strikes, setStrikes] = useState(0);
  const cooling = useRef(false);

  const strike = () => {
    if (cooling.current) return;
    cooling.current = true;
    setStrikes((n) => n + 1);
    window.setTimeout(() => {
      cooling.current = false;
    }, 900);
  };

  return (
    <div className="bell-stage">
      <button
        type="button"
        onClick={strike}
        onMouseEnter={strike}
        className="bell-hit"
        aria-label="Strike the bell"
      >
        <svg
          viewBox="0 0 320 460"
          className={`bell-svg ${reduced ? "" : "bell-sway"}`}
          key={strikes}
          data-struck={strikes > 0 ? "true" : undefined}
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1a1e1c" stopOpacity="0.16" />
              <stop offset="38%" stopColor="#1a1e1c" stopOpacity="0.03" />
              <stop offset="72%" stopColor="#1a1e1c" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1a1e1c" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* The beam waits to the side, on its ropes. */}
          <g className="beam" stroke="var(--ink-2)" strokeWidth="2" fill="none">
            <line x1="296" y1="150" x2="296" y2="300" strokeWidth="1.2" />
            <line x1="246" y1="150" x2="250" y2="300" strokeWidth="1.2" />
            <rect
              x="232"
              y="298"
              width="76"
              height="15"
              rx="7.5"
              fill="var(--paper)"
              stroke="var(--ink-2)"
              strokeWidth="2"
            />
          </g>

          {/* Everything below swings as one, hinged at the loop. */}
          <g className="bell-body">
            {/* Ryuzu: the twin-headed loop it hangs from. */}
            <path
              d="M160 10
                 C 142 10, 132 24, 136 40
                 C 139 52, 150 56, 160 56
                 C 170 56, 181 52, 184 40
                 C 188 24, 178 10, 160 10 Z"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="3"
            />
            <path
              d="M148 30 C 152 36, 168 36, 172 30"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2"
            />

            {/* Kasagata: the crown. */}
            <path
              d="M112 70 C 112 58, 134 52, 160 52 C 186 52, 208 58, 208 70 Z"
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="3"
            />

            {/* The body: shoulders out to a flared lip. */}
            <path
              d="M112 70
                 C 104 112, 96 180, 94 262
                 C 93 312, 90 348, 84 372
                 L 236 372
                 C 230 348, 227 312, 226 262
                 C 224 180, 216 112, 208 70 Z"
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="3"
            />
            <path
              d="M112 70
                 C 104 112, 96 180, 94 262
                 C 93 312, 90 348, 84 372
                 L 236 372
                 C 230 348, 227 312, 226 262
                 C 224 180, 216 112, 208 70 Z"
              fill="url(#bronze)"
              stroke="none"
            />

            {/* Tai: the horizontal bands that divide the body. */}
            <path d="M99 170 L 221 170" stroke="var(--ink)" strokeWidth="2" />
            <path d="M95 254 L 225 254" stroke="var(--ink)" strokeWidth="2" />
            <path d="M88 342 L 232 342" stroke="var(--ink)" strokeWidth="2" />

            {/* Tsumi: vertical dividers in the upper register. */}
            <path d="M134 76 L 131 168" stroke="var(--ink)" strokeWidth="1.4" opacity="0.75" />
            <path d="M160 74 L 160 168" stroke="var(--ink)" strokeWidth="1.4" opacity="0.75" />
            <path d="M186 76 L 189 168" stroke="var(--ink)" strokeWidth="1.4" opacity="0.75" />

            {/* Chi: the rows of bosses. */}
            {[92, 116, 140].map((y, row) =>
              [0, 1, 2, 3].map((col) => {
                const spread = 1 + row * 0.04;
                const x = 160 + (col - 1.5) * 26 * spread;
                return (
                  <circle
                    key={`${y}-${col}`}
                    cx={x}
                    cy={y}
                    r="4.2"
                    fill="var(--ink)"
                    opacity="0.82"
                  />
                );
              })
            )}

            {/* Tsuki-za: the lotus panel the beam strikes. */}
            <g className="tsukiza">
              <circle
                cx="160"
                cy="300"
                r="22"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
              />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return (
                  <path
                    key={i}
                    d={`M160 300 L ${160 + Math.cos(a) * 22} ${300 + Math.sin(a) * 22}`}
                    stroke="var(--accent)"
                    strokeWidth="1.6"
                    opacity="0.55"
                  />
                );
              })}
              <circle cx="160" cy="300" r="6" fill="var(--accent)" />
            </g>

            {/* The lip. */}
            <path
              d="M84 372 C 112 382, 208 382, 236 372"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="3"
            />
          </g>

          {/* Rings leaving the strike panel. */}
          {strikes > 0 && (
            <g className="rings" fill="none" stroke="var(--accent)">
              <circle cx="160" cy="300" r="26" className="ring r1" />
              <circle cx="160" cy="300" r="26" className="ring r2" />
              <circle cx="160" cy="300" r="26" className="ring r3" />
            </g>
          )}
        </svg>
      </button>
    </div>
  );
}
