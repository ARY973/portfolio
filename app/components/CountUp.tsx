"use client";

import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "../hooks/useInView";

/**
 * Ticks a real figure to its value when it scrolls into view. Eases out, so
 * it settles rather than stopping dead.
 */
export default function CountUp({
  to,
  decimals = 0,
  duration = 900,
  prefix = "",
  suffix = "",
  className = "",
}: {
  to: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!seen || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration, reduced]);

  // Reduced motion lands on the final value without animating.
  const shown = reduced ? to : seen ? value : 0;

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {prefix}
      {decimals > 0
        ? shown.toFixed(decimals)
        : Math.round(shown).toLocaleString()}
      {suffix}
    </span>
  );
}
