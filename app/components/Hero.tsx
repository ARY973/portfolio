import LiveFeed from "./LiveFeed";

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
    <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">
      <div className="rise">
        <h1 className="text-[2.6rem] md:text-[3.75rem] leading-[1.05] max-w-[18ch]">
          Aryan Mudhole
        </h1>

        <p
          className="prose-serif mt-7 text-xl md:text-2xl max-w-[46ch]"
          style={{ color: "var(--ink-2)" }}
        >
          I build the data behind decisions that affect people: who gets a meal,
          how a court counts its cases, whether a loan is worth the risk.
        </p>
      </div>

      {/* The codebook entry: what he is doing right now, as typed rows. */}
      <dl
        className="mt-16 rule-top"
        style={{ borderColor: "var(--rule-firm)" }}
      >
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
              <span className="block text-sm mt-0.5" style={{ color: "var(--ink-2)" }}>
                {c.org}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-14">
        <LiveFeed />
      </div>

      <p className="mt-12 text-sm" style={{ color: "var(--ink-2)" }}>
        MMIS candidate at Utah State University&apos;s Huntsman School of
        Business, graduating May 2027.{" "}
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
