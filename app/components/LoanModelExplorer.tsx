"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MODEL,
  MODEL_METRICS,
  LABELS,
  meanOf,
  predict,
} from "../lib/loanModel";

/** Indian-rupee formatting, since the dataset is denominated in INR. */
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
    hint: "India's credit score, 300–900",
  },
  {
    name: "loan_term",
    min: 2,
    max: 20,
    step: 1,
    format: (n) => `${Math.round(n)} yr`,
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
    // loan_income_ratio is engineered, so it has to track its inputs.
    const withRatio = {
      ...values,
      loan_income_ratio: values.loan_amount / values.income_annum,
    };
    return predict(withRatio);
  }, [values]);

  const pct = result.probability * 100;
  const rejected = result.probability >= 0.5;

  // Only the features that actually move: everything else sits at its mean
  // and contributes exactly zero.
  const bars = useMemo(() => {
    const moving = result.parts
      .filter((p) => Math.abs(p.contribution) > 0.001)
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
    const widest = Math.max(...moving.map((p) => Math.abs(p.contribution)), 0.5);
    return { moving, widest };
  }, [result]);

  const reset = () => setValues(START);

  return (
    <section id="model" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-blue-400 text-sm mb-2">Interactive · Real model</p>
        <h2 className="text-3xl font-semibold text-white mb-3">
          Try the model yourself
        </h2>
        <p className="text-gray-400 max-w-2xl mb-10">
          These are the actual fitted weights from my loan-approval classifier —
          logistic regression on {(
            MODEL_METRICS.trainSize + MODEL_METRICS.testSize
          ).toLocaleString()}{" "}
          applications, {(MODEL_METRICS.accuracy * 100).toFixed(1)}% accuracy and{" "}
          {MODEL_METRICS.rocAuc.toFixed(2)} ROC-AUC on a held-out test set. Move a
          control and watch the decision change. Every feature you don&apos;t
          touch is held at its dataset average.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* CONTROLS */}
          <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">Application</h3>
              <button
                onClick={reset}
                className="text-xs text-gray-400 hover:text-blue-400 transition"
              >
                Reset to average
              </button>
            </div>

            <div className="space-y-6">
              {CONTROLS.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between items-baseline mb-1">
                    <label
                      htmlFor={c.name}
                      className="text-sm text-slate-200 font-medium"
                    >
                      {LABELS[c.name]}
                    </label>
                    <span className="text-sm text-blue-300 tabular-nums">
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
                      setValues((v) => ({
                        ...v,
                        [c.name]: Number(e.target.value),
                      }))
                    }
                    aria-describedby={`${c.name}-hint`}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                  <p id={`${c.name}-hint`} className="text-xs text-gray-500 mt-1">
                    {c.hint}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-slate-700">
              Loan-to-income ratio is engineered from the two amounts above, so
              it moves on its own.
            </p>
          </div>

          {/* PREDICTION + CONTRIBUTIONS */}
          <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-6">Model output</h3>

            <div className="mb-2 flex items-baseline gap-3">
              <motion.span
                key={Math.round(pct)}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className={`text-5xl font-bold tabular-nums ${
                  rejected ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {pct.toFixed(1)}%
              </motion.span>
              <span className="text-sm text-gray-400">
                probability of rejection
              </span>
            </div>

            <div
              className="h-2 w-full bg-slate-700 rounded-full overflow-hidden mb-2"
              role="meter"
              aria-valuenow={Number(pct.toFixed(1))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Probability of rejection"
            >
              <motion.div
                className={rejected ? "h-full bg-rose-400" : "h-full bg-emerald-400"}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              />
            </div>

            <p className="text-sm mb-8">
              <span
                className={rejected ? "text-rose-400" : "text-emerald-400"}
              >
                {rejected ? "Rejected" : "Approved"}
              </span>
              <span className="text-gray-500"> at the 50% threshold</span>
            </p>

            <h4 className="text-sm text-slate-300 font-medium mb-1">
              Why — contribution to log-odds
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Each bar is the coefficient times the standardized value. For a
              linear model that is exactly its SHAP value, so these sum to the
              prediction.
            </p>

            <div className="space-y-2">
              {bars.moving.length === 0 && (
                <p className="text-sm text-gray-500">
                  Everything sits at the dataset average — nothing is pushing
                  the decision either way.
                </p>
              )}

              {bars.moving.map((p) => {
                const width = (Math.abs(p.contribution) / bars.widest) * 50;
                const pushesReject = p.contribution > 0;
                return (
                  <div key={p.name} className="flex items-center gap-2 text-xs">
                    <span className="w-32 shrink-0 text-right text-gray-400 truncate">
                      {LABELS[p.name]}
                    </span>
                    <div className="relative flex-1 h-5">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />
                      <motion.div
                        className={`absolute top-1 h-3 rounded-sm ${
                          pushesReject ? "bg-rose-400/80" : "bg-emerald-400/80"
                        }`}
                        animate={{
                          width: `${width}%`,
                          left: pushesReject ? "50%" : `${50 - width}%`,
                        }}
                        transition={{ type: "spring", stiffness: 180, damping: 22 }}
                      />
                    </div>
                    <span
                      className={`w-14 shrink-0 tabular-nums ${
                        pushesReject ? "text-rose-300" : "text-emerald-300"
                      }`}
                    >
                      {p.contribution > 0 ? "+" : ""}
                      {p.contribution.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-6 pt-4 border-t border-slate-700 text-xs text-gray-500">
              <span>
                <span className="inline-block w-2 h-2 rounded-sm bg-rose-400/80 mr-1" />
                toward rejection
              </span>
              <span>
                <span className="inline-block w-2 h-2 rounded-sm bg-emerald-400/80 mr-1" />
                toward approval
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 max-w-2xl">
          Trained on the public loan-approval dataset (4,269 applications,
          Indian lending data). The model predicts the lender&apos;s
          approve/reject decision at origination — not post-origination default.
          CIBIL score dominates the decision, which is a property of this
          dataset as much as of the model.
        </p>
      </div>
    </section>
  );
}
