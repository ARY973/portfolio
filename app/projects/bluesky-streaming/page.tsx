import PipelineFlow from "../../components/PipelineFlow";

const STAGES = [
  {
    name: "Producer",
    detail:
      "Reads the Bluesky Jetstream firehose over a websocket and writes to one Kafka topic keyed by DID, so a record's create and its later delete land in the same partition and stay ordered. The replay cursor is persisted atomically, so a restart resumes rather than duplicates.",
    out: "46,022 events in 119.6s · 384.8/sec",
  },
  {
    name: "Bronze",
    detail:
      "The raw Kafka value, untouched, plus provenance: partition, offset, consume time. Nothing is parsed at this stage — if the parse turns out to be wrong, the original bytes are still there to re-run it against.",
    out: "26 gzipped NDJSON files · 4–5 per partition across all 6",
  },
  {
    name: "Silver",
    detail:
      "Folds the event log into current state, one row per at:// key. Highest ingestion timestamp wins, so the reduction is order-independent. Deletes tombstone the key rather than removing the row, and clear the content.",
    out: "45,697 rows · 44,207 live · 1,490 tombstoned",
  },
];

export default function ProjectPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl mb-6">
        Measuring a firehose before trusting it
      </h1>

      <p className="prose-serif max-w-[62ch] mb-6">
        A streaming pipeline over the Bluesky Jetstream firehose — Kafka in
        the middle, an immutable event log as Bronze, current state as Silver.
        The interesting part is not the architecture, which is conventional.
        It is that every decision in it was settled by measuring something
        rather than by reading documentation.
      </p>

      <p className="prose-serif max-w-[62ch] mb-6">
        Most streaming demos would run perfectly well as an hourly batch job.
        This one would not, and I can say so with a number.
      </p>

      <p className="prose-serif max-w-[62ch] mb-10">
        The code is at{" "}
        <a
          href="https://github.com/ARY973/bsky-pipeline"
          className="link"
          target="_blank"
          rel="noreferrer"
        >
          github.com/ARY973/bsky-pipeline
        </a>
        . It clones and runs from scratch — and the Silver reduction and the
        schema self-test both run with no Kafka, no Docker and no network, so
        you can see it work without setting anything up.
      </p>

      <div className="mb-16">
        <PipelineFlow
          stages={STAGES}
          caption="Figures are from a live run on 17 November 2026 against the live tail, not a replay."
        />
      </div>

      <h2 className="text-2xl md:text-3xl mb-4">
        First: does this need a broker at all?
      </h2>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr
              className="text-left"
              style={{
                borderBottom: "1px solid var(--rule-firm)",
                color: "var(--ink-3)",
              }}
            >
              <th className="py-2 pr-4 font-medium">Measured</th>
              <th className="py-2 pl-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--ink)" }}>
            {[
              ["Throughput", "398.3 events/sec"],
              ["Volume", "~34.4M events/day · ~18 GiB/day"],
              ["Message size", "avg 566 B · p99 1,313 B"],
              ["Lag behind real time", "p50 22 ms · max 435 ms"],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: "1px solid var(--rule)" }}>
                <td className="py-2 pr-4">{k}</td>
                <td className="py-2 pl-3 text-right tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="prose-serif max-w-[62ch] mb-4">
        The 22 ms figure is not a performance target. It is the evidence that
        this is a genuine push stream rather than a feed that batches behind
        the scenes — which is what makes a broker the right answer instead of
        a cron job.
      </p>

      <p className="prose-serif max-w-[62ch] mb-10">
        For contrast, the{" "}
        <a href="/projects/grid-demand-pipeline" className="link">
          batch pipeline I built alongside this
        </a>{" "}
        ingests about <strong>1,740 records a day</strong>. Jetstream is
        roughly <strong>20,000×</strong> that. Being able to say which of the
        two a problem needs, with a number attached, is the reason for having
        built both.
      </p>

      <h2 className="text-2xl md:text-3xl mb-3">
        The finding that mattered
      </h2>

      <p className="prose-serif max-w-[62ch] mb-4">
        Every record carries a <code>createdAt</code> set by the client that
        posted it. It is the obvious event-time column, and using it would be
        a mistake. Measured against the firehose&apos;s own ingestion
        timestamp across <strong>44,207 records</strong>:
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr
              className="text-left"
              style={{
                borderBottom: "1px solid var(--rule-firm)",
                color: "var(--ink-3)",
              }}
            >
              <th className="py-2 pr-4 font-medium">Statistic</th>
              <th className="py-2 pl-3 font-medium text-right">
                createdAt − ingestion time
              </th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--ink)" }}>
            {[
              ["Median", "−0.302 s"],
              ["p1 / p99", "−11.6 s / +9.7 s"],
              ["Earliest", "−98,764 s  (1.1 days backdated)"],
              ["Latest", "+39,594 s  (11 hours in the future)"],
              ["Ahead of ingestion", "6,102 records — 13.8%"],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: "1px solid var(--rule)" }}>
                <td className="py-2 pr-4">{k}</td>
                <td className="py-2 pl-3 text-right tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="prose-serif max-w-[62ch] mb-4">
        The median is tight and entirely sane. The tails are not.{" "}
        <strong>
          13.8% of records claim to have been created before the firehose
          observed them
        </strong>
        , and the spread between the earliest and latest{" "}
        <code>createdAt</code> inside a <em>two-minute</em> slice of traffic
        is over <strong>27 hours</strong>.
      </p>

      <p className="prose-serif max-w-[62ch] mb-10">
        So a two-minute tumbling window keyed on <code>createdAt</code> would
        scatter records across more than a day in both directions — some into
        windows already closed and emitted, some into windows that have not
        started. Neither is recoverable afterwards. That is why ingestion time
        is the event-time column here, and it is a measurement rather than a
        preference.
      </p>

      <h2 className="text-2xl md:text-3xl mb-4">
        Three traps, found by capturing payloads
      </h2>

      <div className="space-y-4 mb-12">
        {[
          {
            file: "Deletes carry no content and no CID",
            desc: "A delete event has only the account, collection and record key — the content of a deleted record is not recoverable from the stream at all. That forces the merge key to be at://{did}/{collection}/{rkey}, the only identifier present on both creates and deletes. Everything else about the design follows from this one constraint.",
          },
          {
            file: "A field silently changes JSON type",
            desc: "subject is an object on likes and reposts, and a bare string on follows. One shared schema nulls whichever half it does not match, and Spark raises nothing — you get a column of nulls and no error. Handled per collection. Across 40,932 subject-bearing records in the live run, zero came back unresolved.",
          },
          {
            file: "Timestamps arrive in three formats",
            desc: "Milliseconds with Z, no fractional part with Z, and a numeric offset with no Z — three shapes inside a twelve-record sample. A fixed format string drops whatever does not match, silently. Across 44,207 live records, the three patterns parsed every single one: absent 0, unparseable 0.",
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

      <h2 className="text-2xl md:text-3xl mb-3">Testing the replay claim</h2>

      <p className="prose-serif max-w-[62ch] mb-10">
        &ldquo;Replays converge on the same state&rdquo; is the sort of thing
        streaming projects assert and almost never check. The Silver reduction
        is a fold keyed on ingestion time, so it should be order-independent —
        and the <code>--verify</code> flag runs the reduction, then runs it
        again over the same events <em>reversed</em>, and asserts both outputs
        hash identically. A create arriving after its own delete still ends
        with the record deleted. It is a claim with a test behind it rather
        than a sentence in a README.
      </p>

      <div
        className="p-5 mb-6"
        style={{
          background: "var(--note-bg)",
          borderLeft: "3px solid var(--note-edge)",
        }}
      >
        <h2 className="text-sm mb-2" style={{ color: "var(--ink)" }}>
          Honest limits
        </h2>
        <p
          className="prose-serif text-[0.95rem] mb-3"
          style={{ color: "var(--ink-2)" }}
        >
          This has been run end to end in bursts, not operated continuously —
          nothing here claims an uptime record. Silver is a local reduction;
          pushing it into Delta on Databricks, where the batch side already
          lives, is the next step rather than something done.
        </p>
        <p
          className="prose-serif text-[0.95rem]"
          style={{ color: "var(--ink-2)" }}
        >
          There is no schema registry. For a single-producer repository the
          contract lives in code and self-tests against a captured fixture,
          which is sufficient; at more than one producer it would stop being.
        </p>
      </div>

      <div
        className="p-5"
        style={{
          background: "var(--note-bg)",
          borderLeft: "3px solid var(--note-edge)",
        }}
      >
        <h2 className="text-sm mb-2" style={{ color: "var(--ink)" }}>
          On the fixture
        </h2>
        <p
          className="prose-serif text-[0.95rem]"
          style={{ color: "var(--ink-2)" }}
        >
          The repository ships a redacted capture so a fresh clone can run the
          schema self-test and the Silver reduction with no Kafka, no Docker
          and no network. It preserves every shape the code is tested on —
          both subject types, all three timestamp formats, the original
          timings — with synthetic identifiers and placeholder text. The real
          capture is other people&apos;s posts, and stays out of the
          repository.
        </p>
      </div>
    </section>
  );
}
