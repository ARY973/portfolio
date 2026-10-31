import Link from "next/link";

const roles = [
  {
    period: "Apr 2026 —",
    role: "Graduate Data Analyst",
    org: "Transforming Communities Institute, USU",
    current: true,
  },
  {
    period: "Aug 2026 —",
    role: "Data Analyst",
    org: "Meals on Wheels, Logan",
    current: true,
  },
  {
    period: "Sep 2026 —",
    role: "Teaching Assistant",
    org: "DATA 5330/6330 Data Pipeline Engineering",
    current: true,
  },
  {
    period: "Dec 2025 – Apr 2026",
    role: "Teaching Assistant",
    org: "Cloud Computing, USU",
  },
  {
    period: "Jun – Aug 2024",
    role: "SAP MM Intern",
    org: "Tata Motors, Pune",
  },
  {
    period: "Jan – Mar 2024",
    role: "Power BI Analyst",
    org: "Medikart Pharmaceutical, Pune",
  },
];

export default function ExperienceTeaser() {
  return (
    <section
      id="experience"
      className="max-w-5xl mx-auto px-6 py-20 scroll-mt-16"
    >
      <h2 className="text-3xl md:text-4xl mb-3">Experience</h2>
      <p
        className="prose-serif text-lg max-w-[58ch] mb-14"
        style={{ color: "var(--ink-2)" }}
      >
        Three concurrent roles at Utah State — a justice-data pipeline, a
        meal-delivery programme, and the pipeline-engineering course — on top of
        earlier enterprise work in Pune.
      </p>

      <dl className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        {roles.map((r) => (
          <div
            key={r.role + r.period}
            className="spine py-5 rule-bottom"
            style={{ borderColor: "var(--rule)" }}
          >
            <dt className="spine-label tabular">
              {r.period}
              {r.current && (
                <span
                  className="ml-2 align-middle inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--signal)" }}
                  aria-label="current role"
                />
              )}
            </dt>
            <dd>
              <span className="block">{r.role}</span>
              <span className="block text-sm mt-0.5" style={{ color: "var(--ink-2)" }}>
                {r.org}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm">
        <Link href="/experience" className="link">
          What each role actually involved
        </Link>
      </p>
    </section>
  );
}
