"use client";

import { useMemo, useState } from "react";
import { MODEL_METRICS, LABELS, meanOf, predict } from "../lib/loanModel";

/** The dataset is Indian lending data, so amounts are rupees. */
const inr = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

type Control = {
  name: string;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  hint: string;
};

const CONTROLS: Control[] = [
  {
    name: "cibil_score",
    min: 300,
    max: 900,
    step: 1,
    format: (n) => Math.round(n).toString(),
    hint: "India's credit score, 300 to 900",
  },
  {
    name: "loan_term",
    min: 2,
    max: 20,
    step: 1,
    format: (n) => `${Math.round(n)} years`,
    hint: "Repayment period",
  },
  {
    name: "income_annum",
    min: 200_000,
    max: 9_900_000,
    step: 100_000,
    format: inr,
    hint: "Applicant's yearly income",
  },
  {
    name: "loan_amount",
    min: 300_000,
    max: 39_500_000,
    step: 100_000,
    format: inr,
    hint: "Amount requested",
  },
  {
    name: "luxury_assets_value",
    min: 0,
    max: 39_200_000,
    step: 100_000,
    format: inr,
    hint: "Declared luxury assets",
  },
];

const START = Object.fromEntries(
  CONTROLS.map((c) => [c.name, meanOf(c.name)])
) as Record<string, number>;

export default function LoanModelExplorer() {
  const [values, setValues] = useState<Record<string, number>>(START);

  const result = useMemo(() => {
    const withRatio = {
      ...values,
      loan_income_ratio: values.loan_amount / values.income_annum,
    };
    return predict(withRatio);
  }, [values]);

  const pct = result.probability * 100;
  const rejected = result.probability >= 0.5;
  const verdictColor = rejected ? "var(--reject)" : "var(--approve)";

  const bars = useMemo(() => {
    const moving = result.parts
      .filter((p) => Math.abs(p.contribution) > 0.001)
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
    const widest = Math.max(...moving.map((p) => Math.abs(p.contribution)), 0.5);
    return { moving, widest };
  }, [result]);

  return (
    <section id="model" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-16">
      <h2 className="text-3xl md:text-4xl mb-3">The model, running</h2>
      <p
        className="prose-serif text-lg max-w-[58ch] mb-3"
        style={{ color: "var(--ink-2)" }}
      >
        These are the fitted weights from my credit-risk classifier, not a
        demonstration. Move a control and the decision moves with it.
      </p>
      <p className="text-sm max-w-[58ch] mb-12" style={{ color: "var(--ink-3)" }}>
        Logistic regression on{" "}
        {(MODEL_METRICS.trainSize + MODEL_METRICS.testSize).toLocaleString()}{" "}
        applications. {(MODEL_METRICS.accuracy * 100).toFixed(1)}% accuracy,{" "}
        {MODEL_METRICS.rocAuc.toFixed(3)} ROC-AUC on a held-out test set.
        Anything you leave alone sits at its dataset average.
      </p>

      <div
        className="grid md:grid-cols-[1fr_1.15fr] gap-x-14 gap-y-12 rule-top pt-10"
        style={{ borderColor: "var(--rule-firm)" }}
      >
        {/* The instrument */}
        <div>
          <div className="flex items-baseline justify-between mb-7">
            <h3 className="text-lg">Application</h3>
            <button
              onClick={() => setValues(START)}
              className="text-sm underline"
              style={{
                color: "var(--ink-3)",
                textUnderlineOffset: "0.18em",
                textDecorationThickness: "1px",
              }}
            >
              Reset
            </button>
          </div>

          <div className="space-y-7">
            {CONTROLS.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between items-baseline mb-2">
                  <label htmlFor={c.name} className="text-sm">
                    {LABELS[c.name]}
                  </label>
                  <span
                    className="tabular text-sm"
                    style={{ color: "var(--signal)" }}
                  >
                    {c.format(values[c.name])}
                  </span>
                </div>
                <input
                  id={c.name}
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={values[c.name]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [c.name]: Number(e.target.value) }))
                  }
                  aria-describedby={`${c.name}-hint`}
                  className="w-full cursor-pointer"
                />
                <p
                  id={`${c.name}-hint`}
                  className="text-xs mt-1.5"
                  style={{ color: "var(--ink-3)" }}
                >
                  {c.hint}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-xs mt-7 pt-5 rule-top"
            style={{ color: "var(--ink-3)", borderColor: "var(--rule)" }}
          >
            Loan-to-income ratio is engineered from the two amounts, so it moves
            on its own.
          </p>
        </div>

        {/* The reading */}
        <div>
          <h3 className="text-lg mb-7">Reading</h3>

          <div className="flex items-baseline gap-3">
            <span
              className="tabular text-6xl md:text-7xl leading-none"
              style={{ color: verdictColor, fontFamily: "var(--font-serif)" }}
            >
              {pct.toFixed(1)}%
            </span>
            <span className="text-sm" style={{ color: "var(--ink-2)" }}>
              chance of rejection
            </span>
          </div>

          <div
            className="h-px w-full my-5"
            style={{ background: "var(--rule)" }}
            role="meter"
            aria-valuenow={Number(pct.toFixed(1))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Chance of rejection"
          >
            <div
              className="h-px"
              style={{
                width: `${pct}%`,
                background: verdictColor,
                transition: "width 220ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>

          <p className="text-sm mb-10">
            <span style={{ color: verdictColor }}>
              {rejected ? "Rejected" : "Approved"}
            </span>
            <span style={{ color: "var(--ink-3)" }}> at the 50% threshold</span>
          </p>

          <h4 className="text-sm mb-1.5">What is moving it</h4>
          <p className="text-xs mb-6" style={{ color: "var(--ink-3)" }}>
            Each value is the coefficient times the standardised input. For a
            linear model that is its SHAP value, so these sum to the prediction
            rather than merely ranking it.
          </p>

          <div className="space-y-2.5">
            {bars.moving.length === 0 && (
              <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                Everything sits at the dataset average. Nothing is pushing the
                decision either way.
              </p>
            )}

            {bars.moving.map((p) => {
              const width = (Math.abs(p.contribution) / bars.widest) * 50;
              const pushesReject = p.contribution > 0;
              return (
                <div key={p.name} className="flex items-center gap-3 text-xs">
                  <span
                    className="w-28 shrink-0 text-right truncate"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {LABELS[p.name]}
                  </span>

                  <div className="relative flex-1 h-4">
                    <div
                      className="absolute left-1/2 top-0 bottom-0 w-px"
                      style={{ background: "var(--rule-firm)" }}
                    />
                    <div
                      className="absolute top-1 h-2"
                      style={{
                        width: `${width}%`,
                        left: pushesReject ? "50%" : `${50 - width}%`,
                        background: pushesReject
                          ? "var(--reject)"
                          : "var(--approve)",
                        transition:
                          "width 220ms cubic-bezier(0.22,1,0.36,1), left 220ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </div>

                  <span
                    className="tabular w-12 shrink-0"
                    style={{
                      color: pushesReject ? "var(--reject)" : "var(--approve)",
                    }}
                  >
                    {p.contribution > 0 ? "+" : ""}
                    {p.contribution.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <p
            className="text-xs mt-6 pt-5 rule-top"
            style={{ color: "var(--ink-3)", borderColor: "var(--rule)" }}
          >
            Left of the line pushes toward approval, right toward rejection.
          </p>
        </div>
      </div>

      <p
        className="text-sm mt-12 max-w-[62ch]"
        style={{ color: "var(--ink-3)" }}
      >
        Trained on a public dataset of Indian loan applications. It predicts the
        lender&apos;s approve-or-reject decision at origination, not whether a
        borrower later defaults. Credit score dominates, which is a property of this
        dataset as much as of the model, and the subject of{" "}
        <a href="/projects/loan-default" className="link">
          the stress test
        </a>
        .
      </p>
    </section>
  );
}
