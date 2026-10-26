/**
 * The real fitted logistic-regression model from the loan-approval project.
 *
 * These are not illustrative numbers. They come from re-running the exact
 * pipeline published on /projects/loan-default — same dataset, same
 * preprocessing, same train/test split (test_size=0.2, random_state=42,
 * stratified), same StandardScaler, same LogisticRegression. The refit
 * reproduces the project's confusion matrix cell for cell (503 / 28 / 44 / 279),
 * accuracy 0.9157 and ROC-AUC 0.9745.
 *
 * Target: 1 = rejected, 0 = approved. A positive contribution pushes the
 * application toward REJECTION.
 */
import modelJson from "./loanModel.json";

export type FeatureName = (typeof modelJson)["features"][number];

export const MODEL = modelJson;

/** Test-set performance of this exact fit. */
export const MODEL_METRICS = {
  accuracy: 0.9157,
  precision: 0.9088,
  recall: 0.8638,
  f1: 0.8857,
  rocAuc: 0.9745,
  confusion: { tn: 503, fp: 28, fn: 44, tp: 279 },
  testSize: 854,
  trainSize: 3415,
} as const;

const index = (name: string) => {
  const i = MODEL.features.indexOf(name);
  if (i === -1) throw new Error(`Unknown feature: ${name}`);
  return i;
};

/** Dataset mean for a feature — the value used when a control is left alone. */
export const meanOf = (name: string) => MODEL.mean[index(name)];

/**
 * Per-feature contribution to the log-odds: coefficient x standardized value.
 *
 * For a linear model this is exactly the SHAP value (up to the shared base
 * term), which is why the bars add up to the prediction rather than merely
 * suggesting an ordering.
 */
export function contributions(values: Record<string, number>) {
  return MODEL.features.map((name, i) => {
    const raw = values[name] ?? MODEL.mean[i];
    const z = (raw - MODEL.mean[i]) / MODEL.scale[i];
    return { name, raw, z, contribution: MODEL.coef[i] * z };
  });
}

/** Probability that the application is REJECTED. */
export function predict(values: Record<string, number>) {
  const parts = contributions(values);
  const logOdds =
    MODEL.intercept + parts.reduce((sum, p) => sum + p.contribution, 0);
  return {
    probability: 1 / (1 + Math.exp(-logOdds)),
    logOdds,
    parts,
  };
}

/** Human-readable labels, so the UI never shows a raw column name. */
export const LABELS: Record<string, string> = {
  no_of_dependents: "Dependents",
  education: "Graduate",
  self_employed: "Self-employed",
  income_annum: "Annual income",
  loan_amount: "Loan amount",
  loan_term: "Loan term",
  cibil_score: "CIBIL score",
  residential_assets_value: "Residential assets",
  commercial_assets_value: "Commercial assets",
  luxury_assets_value: "Luxury assets",
  bank_asset_value: "Bank assets",
  loan_income_ratio: "Loan-to-income ratio",
};
