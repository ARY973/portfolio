"use client";

import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "model", label: "The model" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
];

const RESUME = "/resume/Aryan_Mudhole_Resume.pdf";

function useScrolled() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener("scroll", cb, { passive: true });
    return () => window.removeEventListener("scroll", cb);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > 40,
    () => false
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const scrolled = useScrolled();

  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // Close the menu on navigation, derived rather than in an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!onHome) return;
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [onHome]);

  const to = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
        Skip to content
      </a>

      <header
        className="sticky top-0 z-50"
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--paper) 88%, transparent)"
            : "var(--paper)",
          backdropFilter: scrolled ? "blur(8px)" : undefined,
          borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
          transition: "border-color 200ms ease",
        }}
      >
        <nav
          aria-label="Primary"
          className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-6"
        >
          <Link
            href="/"
            className="display text-[0.95rem] shrink-0"
            style={{ color: "var(--ink)" }}
          >
            Aryan Mudhole
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={to(s.id)}
                aria-current={onHome && active === s.id ? "true" : undefined}
                style={{
                  color:
                    onHome && active === s.id ? "var(--signal)" : "var(--ink-2)",
                }}
                className="hover:opacity-70 transition-opacity"
              >
                {s.label}
              </a>
            ))}
            <a
              href={RESUME}
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm"
            >
              Résumé
            </a>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden p-2 -mr-2"
            style={{ color: "var(--ink-2)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 7h18M3 17h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>

        {open && (
          <div
            id="menu"
            className="md:hidden px-6 py-5 flex flex-col gap-4 text-sm"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={to(s.id)}
                onClick={() => setOpen(false)}
                style={{ color: "var(--ink-2)" }}
              >
                {s.label}
              </a>
            ))}
            <Link href="/beyond" style={{ color: "var(--ink-2)" }}>
              Beyond the work
            </Link>
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="link">
              Résumé
            </a>
          </div>
        )}
      </header>
    </>
  );
}
