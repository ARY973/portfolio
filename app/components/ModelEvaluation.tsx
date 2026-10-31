import Image from "next/image";

const figures = [
  {
    src: "/images/confusion_matrix.png",
    w: 832,
    h: 704,
    caption:
      "503 approvals and 279 rejections called correctly. The 44 rejections it missed are the expensive ones: a lender booking risk it meant to decline.",
  },
  {
    src: "/images/roc_curve.png",
    w: 864,
    h: 704,
    caption:
      "Separability between approved and rejected applications, across every threshold rather than just the default 50%.",
  },
  {
    src: "/images/coefficients.png",
    w: 1024,
    h: 800,
    caption:
      "Credit score outweighs everything else roughly five to one. That concentration is what the no-credit-score stress test was built to probe.",
  },
];

export default function ModelEvaluation() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl mb-3">How it was checked</h2>
      <p
        className="prose-serif text-lg max-w-[58ch] mb-14"
        style={{ color: "var(--ink-2)" }}
      >
        Evaluation on a held-out fifth of the data, the logistic-regression
        benchmark shown here because it is the one that can be read directly.
      </p>

      <div className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        {figures.map((f) => (
          <figure
            key={f.src}
            className="spine py-10 rule-bottom"
            style={{ borderColor: "var(--rule)" }}
          >
            <figcaption
              className="prose-serif spine-label md:pt-1"
              style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}
            >
              {f.caption}
            </figcaption>
            <div className="max-w-[34rem]">
              <Image
                src={f.src}
                alt=""
                width={f.w}
                height={f.h}
                sizes="(max-width: 820px) 100vw, 34rem"
                className="w-full h-auto"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
