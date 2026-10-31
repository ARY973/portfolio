import Image from "next/image";
import { RocCurve, ConfusionMatrix } from "./AnimatedFigures";
import CountUp from "./CountUp";

export default function ModelEvaluation() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl mb-3">How it was checked</h2>
      <p
        className="prose-serif text-lg max-w-[58ch] mb-4"
        style={{ color: "var(--ink-2)" }}
      >
        Evaluated on a held-out fifth of the data. The logistic-regression
        benchmark is shown because it is the one that can be read directly.
      </p>
      <p className="text-sm mb-14" style={{ color: "var(--ink-3)" }}>
        <CountUp to={4269} /> applications,{" "}
        <CountUp to={854} /> of them held back for testing.
      </p>

      <div className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        <div
          className="spine py-10 rule-bottom"
          style={{ borderColor: "var(--rule)" }}
        >
          <p className="prose-serif spine-label md:pt-1" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>
            Separability between approved and rejected applications, across
            every threshold rather than only the default 50%.
          </p>
          <div className="max-w-[22rem]">
            <RocCurve />
          </div>
        </div>

        <div
          className="spine py-10 rule-bottom"
          style={{ borderColor: "var(--rule)" }}
        >
          <p className="prose-serif spine-label md:pt-1" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>
            Where the model is right, and where it is not.
          </p>
          <div>
            <ConfusionMatrix />
          </div>
        </div>

        <figure
          className="spine py-10 rule-bottom"
          style={{ borderColor: "var(--rule)" }}
        >
          <figcaption className="prose-serif spine-label md:pt-1" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>
            Credit score outweighs everything else roughly five to one. That
            concentration is what the stress test was built to probe.
          </figcaption>
          <div className="max-w-[34rem]">
            <Image
              src="/images/coefficients.png"
              alt="Bar chart of model coefficients. Credit score is by far the largest, pushing toward approval."
              width={1024}
              height={800}
              sizes="(max-width: 820px) 100vw, 34rem"
              className="w-full h-auto"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
