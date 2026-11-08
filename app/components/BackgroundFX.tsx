"use client";

import { useEffect } from "react";

/**
 * Publishes the pointer position as CSS variables so the ruled background can
 * brighten under the cursor, like paper catching a lamp.
 *
 * Nothing here renders. The work is one rAF-throttled write of two custom
 * properties per pointer burst, and the paint happens entirely in CSS.
 */
export default function BackgroundFX() {
  useEffect(() => {
    // Only where there is a real pointer: on touch there is nothing to follow,
    // and a lamp stuck in one corner looks like a bug.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      // Light it on the first real movement rather than on pointerenter,
      // which does not fire on document and left the lamp dark.
      root.style.setProperty("--lamp", "1");
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const douse = () => root.style.setProperty("--lamp", "0");

    root.style.setProperty("--lamp", "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", douse);
    window.addEventListener("blur", douse);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", douse);
      window.removeEventListener("blur", douse);
    };
  }, []);

  return null;
}
