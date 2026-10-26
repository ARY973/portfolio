"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { id: string; label: string };

/** Homepage sections, in the order a recruiter meets them. */
const SECTIONS: Item[] = [
  { id: "work", label: "Work" },
  { id: "model", label: "Try the model" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Solidify the bar once the hero is behind us.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight whichever section is nearest the top of the viewport.
  useEffect(() => {
    if (!onHome) return;

    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Band near the top, so "active" means "what you're reading".
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [onHome]);

  // Never leave the mobile menu open across a navigation. Derived during
  // render rather than in an effect, so there is no cascading re-render.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled || menuOpen
            ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-800"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="text-white font-semibold tracking-tight shrink-0 hover:text-blue-300 transition"
          >
            Aryan Mudhole
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={href(s.id)}
                aria-current={active === s.id ? "true" : undefined}
                className={`text-sm transition ${
                  active === s.id && onHome
                    ? "text-blue-300"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {s.label}
              </a>
            ))}

            <Link
              href="/beyond"
              className={`text-sm transition ${
                pathname === "/beyond"
                  ? "text-blue-300"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Beyond the work
            </Link>

            <a
              href="/resume/Aryan_resume_1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1.5 rounded-md bg-white text-black font-medium hover:opacity-90 transition"
            >
              Résumé
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-slate-200 hover:text-white p-2 -mr-2"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-slate-800 px-6 py-4 flex flex-col gap-4"
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={href(s.id)}
                onClick={() => setMenuOpen(false)}
                className="text-slate-200 hover:text-white text-sm"
              >
                {s.label}
              </a>
            ))}
            <Link href="/beyond" className="text-slate-200 hover:text-white text-sm">
              Beyond the work
            </Link>
            <a
              href="/resume/Aryan_resume_1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-300"
            >
              Résumé (PDF) →
            </a>
          </div>
        )}
      </header>
    </>
  );
}
