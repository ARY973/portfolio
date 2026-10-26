"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ModelEvaluation() {
  return (
    <section className="mt-32 flex flex-col items-center text-center">

      {/* Section Title */}
      <h2 className="text-3xl font-semibold text-white mb-4">
        Model Evaluation & Insights
      </h2>

      <p className="text-gray-400 mb-12 max-w-xl">
        Evaluation metrics and interpretability analysis from my machine learning models.
        These visualizations demonstrate model performance, reliability, and feature impact.
      </p>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full">

        {/* Confusion Matrix */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-6 text-left hover:border-blue-400 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            Confusion Matrix
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            Classification performance of the logistic-regression benchmark on a held-out test set.
            It highlights true positives, true negatives, false positives, and false negatives.
          </p>

          <Image
            src="/images/confusion_matrix.png"
            alt="Confusion Matrix"
            width={1521}
            height={1361}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg border border-slate-700 mb-4 h-auto w-full"
          />

          <p className="text-blue-400 text-sm">
            Accuracy: 91%
          </p>
        </motion.div>

        {/* ROC Curve */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-6 text-left hover:border-blue-400 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            ROC Curve
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            Separability between applications the lender approved and those it
            rejected — rejection standing in for default risk.
          </p>

          <Image
            src="/images/roc_curve.png"
            alt="ROC Curve"
            width={2074}
            height={1638}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg border border-slate-700 mb-4 h-auto w-full"
          />

          <p className="text-blue-400 text-sm">
            AUC Score: 0.97
          </p>
        </motion.div>

        {/* Feature Importance */}
        <motion.div
  whileHover={{ scale: 1.03 }}
  className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-6 text-left hover:border-blue-400 transition"
>

<h3 className="text-lg font-semibold text-white mb-2">
F1 Performance Insight
</h3>

<p className="text-gray-400 text-sm mb-4">
Analysis of the relationship between driver age and podium finishes using Formula 1 race data.
</p>

<Image
            src="/images/f1_driver_age_podium.png"
            alt="Driver Age vs Podium Probability"
            width={2548}
            height={1638}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg border border-slate-700 h-auto w-full"
          />

</motion.div>

        {/* SHAP Summary Plot */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-6 text-left hover:border-blue-400 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            SHAP Summary Plot
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            Explains how individual features contribute to model predictions.
            SHAP values show how much each variable moves an individual decision.
          </p>

          <Image
            src="/images/shap_summary.png"
            alt="SHAP Summary"
            width={2328}
            height={1857}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg border border-slate-700 mb-4 h-auto w-full"
          />

          <p className="text-blue-400 text-sm">
            Model Interpretability Analysis
          </p>
        </motion.div>

      </div>
    </section>
  );
}