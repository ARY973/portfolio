import type { Metadata } from "next";
import "./lab.css";

export const metadata: Metadata = {
  title: "Motion lab",
  robots: { index: false, follow: false },
};

const ROWS = [
  ["Apr 2026 to now", "Graduate Data Analyst", "Transforming Communities Institute"],
  ["Aug 2026 to now", "Data Analyst", "Meals on Wheels, Logan"],
  ["Sep 2026 to now", "Teaching Assistant", "DATA 5330/6330 Pipeline Engineering"],
  ["Dec 2025 to Apr 2026", "Teaching Assistant", "Cloud Computing, USU"],
  ["Jun to Aug 2024", "SAP MM Intern", "Tata Motors, Pune"],
];

function Sample({ variant }: { variant: string }) {
  return (
    <div className={`lab-${variant}`}>
      {ROWS.map(([period, role, org]) => (
        <div
          key={role + period}
          className="lab-row spine py-6"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          <div className="spine-label tabular">{period}</div>
          <div>
            <div>{role}</div>
            <div className="text-sm mt-0.5" style={{ color: "var(--ink-2)" }}>
              {org}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const VARIANTS = [
  {
    id: "a",
    name: "A. What is on the site now",
    note: "Rises 16px and fades from 0.18. Deliberately restrained.",
  },
  {
    id: "b",
    name: "B. Same idea, much stronger",
    note: "Rises 56px from fully invisible, over a longer stretch of scroll.",
  },
  {
    id: "c",
    name: "C. Depth",
    note: "Comes toward you from behind: scales up from 0.88, unblurs, and sinks back as it leaves the top.",
  },
  {
    id: "d",
    name: "D. Slide in from the side",
    note: "Each row arrives from the left, alternating rows from the right.",
  },
];

export default function MotionLab() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl mb-4">Motion lab</h1>
      <p className="prose-serif text-lg max-w-[60ch] mb-4" style={{ color: "var(--ink-2)" }}>
        Four ways the page could reveal as you scroll. Scroll down slowly, then
        scroll back up: all four reverse, so you can see them hide again. Tell
        me a letter.
      </p>
      <p className="text-sm mb-24" style={{ color: "var(--ink-3)" }}>
        This page is a scratchpad and will be deleted once you pick.
      </p>

      {VARIANTS.map((v) => (
        <section key={v.id} className="mb-40">
          <h2 className="text-2xl mb-1">{v.name}</h2>
          <p className="text-sm mb-10" style={{ color: "var(--ink-2)" }}>
            {v.note}
          </p>
          <Sample variant={v.id} />
        </section>
      ))}

      <div style={{ height: "60vh" }} />
    </main>
  );
}
