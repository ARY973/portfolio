import PipelineFlow from "../../components/PipelineFlow";

const STAGES = [
  {
    name: "Extract",
    detail:
      "Pulls the five source tables out of Airtable, where programme staff enter records as part of their day rather than as a data-entry task.",
    out: "5 tables, raw",
  },
  {
    name: "Code and widen",
    detail:
      "Applies the codebook — free-text and categorical responses mapped to numeric codes — and reshapes long records into the wide format statistical software expects, one row per case.",
    out: "Coded wide-format dataset",
  },
  {
    name: "Deliver",
    detail:
      "Writes SPSS-ready files to Box on a weekly schedule, run by GitHub Actions. Box because that is where the research staff already work.",
    out: "Versioned export + codebook",
  },
];

export default function ProjectPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl mb-6">
        Getting justice-system data to the people analysing it
      </h1>

      <p className="prose-serif max-w-[62ch] mb-6">
        At Utah State University&apos;s Transforming Communities Institute I
        build and run the data pipeline behind the Community Justice
        Administration programme. Research staff need a clean, coded dataset
        they can open in SPSS and analyse. Programme staff enter records in
        Airtable as they work. Everything between those two facts is the job.
      </p>

      <p className="prose-serif max-w-[62ch] mb-10">
        The brief came from the Institute&apos;s Executive Director, not from a
        ticket, which meant most of the early work was understanding what the
        research team actually needed before writing anything that moved data.
      </p>

      <div className="mb-16">
        <PipelineFlow
          stages={STAGES}
          caption="A classic extract, transform and load. Five source tables in, one analysis-ready dataset out, every week."
        />
      </div>

      <h2 className="text-2xl md:text-3xl mb-4">
        Decisions that shaped it
      </h2>

      <div className="space-y-4 mb-12">
        {[
          {
            file: "Delivered where the work happens",
            desc: "SPSS-ready files written to Box, not a database endpoint or a dashboard login. The research staff are social scientists with an established workflow; a pipeline that asks them to change it is a pipeline that gets worked around.",
          },
          {
            file: "Versioned codebooks",
            desc: "The mapping from response to numeric code is itself versioned, alongside a data dictionary. Without that, the same question asked of two exports six weeks apart can return two different answers and nobody can tell which is right.",
          },
          {
            file: "Scheduled, not requested",
            desc: "GitHub Actions runs it weekly. The previous shape of this work was somebody exporting and reshaping by hand when asked, which does not scale and quietly varies each time.",
          },
          {
            file: "Wide format, deliberately",
            desc: "One row per case is not how the data is stored and not how I would model it, but it is what the analysis software and the people using it expect. The pipeline absorbs that mismatch so the researchers do not have to.",
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

      <h2 className="text-2xl md:text-3xl mb-3">What I take from it</h2>

      <p className="prose-serif max-w-[62ch] mb-4">
        The engineering here is not difficult. The part that took real work was
        the codebook — deciding, with the people who would use the output, what
        each response should become and holding that decision steady across
        versions so findings stay comparable over time.
      </p>

      <p className="prose-serif max-w-[62ch] mb-10">
        That is the part a pipeline diagram never shows, and it is the part
        that determines whether anyone trusts the dataset a year later.
      </p>

      <div
        className="p-5"
        style={{
          background: "var(--note-bg)",
          borderLeft: "3px solid var(--note-edge)",
        }}
      >
        <h2 className="text-sm mb-2" style={{ color: "var(--ink)" }}>
          On what is shown here
        </h2>
        <p
          className="prose-serif text-[0.95rem]"
          style={{ color: "var(--ink-2)" }}
        >
          This describes the architecture only. The data concerns real people
          in the justice system, so no records, fields, codebook contents or
          figures appear on this page or in any public repository.
        </p>
      </div>
    </section>
  );
}
