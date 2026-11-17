import PipelineFlow from "../../components/PipelineFlow";

const STAGES = [
  {
    name: "Ingest",
    detail:
      "Pulls hourly demand and day-ahead forecast for the PACE balancing authority from the EIA API v2. The raw JSON response is landed unchanged, so a parsing bug never costs me the source data.",
    out: "Bronze Delta table · raw response, append-only",
  },
  {
    name: "Clean and conform",
    detail:
      "Flattens the response, casts the timestamp to a real UTC type, deduplicates on period and type, and merges into the Silver table so a re-run or a late correction updates the existing row rather than adding a second one.",
    out: "Silver Delta table · one row per hour per series",
  },
  {
    name: "Aggregate and gate",
    detail:
      "Builds the reporting table demand is read from, then runs the quality gates. If a gate fails the task fails, and the alert fires instead of the dashboard quietly going stale.",
    out: "Gold Delta table + SQL dashboard",
  },
];

export default function ProjectPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl mb-6">
        A pipeline that runs without me
      </h1>

      <p className="prose-serif max-w-[62ch] mb-6">
        Electricity demand data arrives hourly whether anyone is watching or
        not, which makes it a good forcing function: a pipeline that needs a
        human to press a button is not a pipeline. I built a scheduled
        medallion pipeline on Databricks that pulls demand and forecast figures
        for one balancing authority from the US Energy Information
        Administration, lands them through Bronze, Silver and Gold Delta
        tables, and tells me when something breaks.
      </p>

      <p className="prose-serif max-w-[62ch] mb-10">
        The whole thing runs on Databricks Free Edition. That constraint was
        deliberate — anything I could only demonstrate on a paid cluster is
        something I could not hand to anyone else.
      </p>

      <div className="mb-16">
        <PipelineFlow
          stages={STAGES}
          caption="Three tasks, run as one Job on a two-hourly schedule. The timing here is for watching; the real run is quick."
        />
      </div>

      <h2 className="text-2xl md:text-3xl mb-4">What makes it operational</h2>

      <div className="space-y-4 mb-12">
        {[
          {
            file: "Scheduled Job, 3 tasks",
            desc: "Ingest, transform and aggregate run as dependent tasks on a two-hourly cron rather than three notebooks someone remembers to run in order. A failure upstream stops the tasks below it instead of propagating bad data forward.",
          },
          {
            file: "Quality gates",
            desc: "Row counts, null checks on the demand value, and timestamp continuity. A gate that fails fails the task — the point of a gate is that the pipeline stops, not that a warning scrolls past in a log.",
          },
          {
            file: "Secrets",
            desc: "The EIA API key lives in a secret scope, not in the notebook. Obvious, but it is the thing that most tutorial pipelines get wrong and the first thing anyone reading the repo will check.",
          },
          {
            file: "Two alerts",
            desc: "One on job failure, one on the data itself going stale. These are different failures: the job can succeed while the upstream API quietly returns nothing new, and only the second alert catches that.",
          },
          {
            file: "SQL dashboard",
            desc: "Reads the Gold table. It is the reason the rest exists — the pipeline is not the deliverable, the number someone looks at is.",
          },
        ].map(({ file, desc }) => (
          <div key={file} className="py-4 border-b border-[var(--rule)]">
            <p className="font-mono text-[var(--signal)] text-sm mb-1">
              {file}
            </p>
            <p className="text-[var(--ink-2)] text-sm">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl md:text-3xl mb-3">
        The finding that mattered
      </h2>

      <p className="prose-serif max-w-[62ch] mb-4">
        This source produces roughly{" "}
        <strong>1,740 records a day</strong>. That is a genuinely small number,
        and noticing it is the useful part. Hourly batch is the correct
        architecture here, and any argument for streaming would have been
        résumé-driven rather than requirement-driven.
      </p>

      <p className="prose-serif max-w-[62ch] mb-10">
        So I went looking for a source where streaming <em>was</em> warranted,
        measured one that runs about twenty thousand times this volume, and
        built that separately. Knowing which of the two a problem needs is the
        skill; being able to build only one of them is not.
      </p>

      <div
        className="p-5 mb-10"
        style={{
          background: "var(--note-bg)",
          borderLeft: "3px solid var(--note-edge)",
        }}
      >
        <h2 className="text-sm mb-2" style={{ color: "var(--ink)" }}>
          On the medallion label
        </h2>
        <p
          className="prose-serif text-[0.95rem]"
          style={{ color: "var(--ink-2)" }}
        >
          Bronze, Silver and Gold here mean what they usually mean: raw landed
          exactly as received, conformed and deduplicated, then shaped for
          reading. The layers earn their place because the Silver merge makes
          re-runs safe and the Bronze table makes a bad transform recoverable.
          On a dataset this size the structure is a habit worth keeping rather
          than a performance decision.
        </p>
      </div>
    </section>
  );
}
