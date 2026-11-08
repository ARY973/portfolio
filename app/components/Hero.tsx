import DecisionBoundary from "./DecisionBoundary";
import Bell from "./Bell";

const CURRENT = [
  {
    role: "Graduate Data Analyst",
    org: "Transforming Communities Institute, USU",
    since: "Since Apr 2026",
  },
  {
    role: "Data Analyst",
    org: "Meals on Wheels, Logan",
    since: "Since Aug 2026",
  },
  {
    role: "Teaching Assistant",
    org: "DATA 5330/6330 Data Pipeline Engineering",
    since: "Since Sep 2026",
  },
];

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-24 pb-24 md:pt-36 md:pb-32">
      {/* Deliberately off-centre: weight left, the bell and its emptiness right. */}
      <div className="grid md:grid-cols-[1fr_20rem] gap-x-16 gap-y-14 items-center">
        <div className="rise">
          <h1 className="text-[3rem] md:text-[4.75rem] leading-[0.98] max-w-[14ch]">
            Aryan Mudhole
          </h1>

          <p
            className="prose-serif mt-8 text-xl md:text-[1.6rem] md:leading-snug max-w-[40ch]"
            style={{ color: "var(--ink-2)" }}
          >
            Data analyst working across justice-system reporting, a
            meal-delivery programme, and credit-risk modelling. I care most
            about the part after the model, where someone has to act on it.
          </p>

          <p className="mt-8 flex items-center gap-4 text-sm" style={{ color: "var(--ink-2)" }}>
            <span className="seal" aria-hidden="true">
              AM
            </span>
            <span>
              MMIS candidate at Utah State University&apos;s Huntsman School of
              Business, graduating May 2027.
            </span>
          </p>
        </div>

        <div className="order-first md:order-last">
          <Bell />
          <p
            className="text-xs text-center mt-3"
            style={{ color: "var(--ink-3)" }}
          >
            Strike it.
          </p>
        </div>
      </div>

      {/* What he is doing right now, as typed rows. */}
      <dl className="mt-20 rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        {CURRENT.map((c) => (
          <div
            key={c.role + c.org}
            className="spine py-5 rule-bottom"
            style={{ borderColor: "var(--rule)" }}
          >
            <dt className="spine-label tabular">{c.since}</dt>
            <dd>
              <span className="block" style={{ color: "var(--ink)" }}>
                {c.role}
              </span>
              <span
                className="block text-sm mt-0.5"
                style={{ color: "var(--ink-2)" }}
              >
                {c.org}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div
        className="mt-14 rule-top pt-8"
        style={{ borderColor: "var(--rule-firm)" }}
      >
        <DecisionBoundary />
      </div>

      <p className="mt-12 text-sm" style={{ color: "var(--ink-2)" }}>
        <a href="#model" className="link">
          Try a model I trained
        </a>{" "}
        or{" "}
        <a href="#work" className="link">
          read the work
        </a>
        .
      </p>
    </section>
  );
}
