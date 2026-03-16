"use client";

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
            Visualizes the classification performance of the loan default prediction model.
            It highlights true positives, true negatives, false positives, and false negatives.
          </p>

          <img
            src="/images/confusion_matrix.png"
            alt="Confusion Matrix"
            className="rounded-lg border border-slate-700 mb-4"
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
            Evaluates the model's ability to distinguish between borrowers who will default
            and those who will not.
          </p>

          <img
            src="/images/roc_curve.png"
            alt="ROC Curve"
            className="rounded-lg border border-slate-700 mb-4"
          />

          <p className="text-blue-400 text-sm">
            AUC Score: 0.94
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

<img
  src="/images/f1_driver_age_podium.png"
  alt="Driver Age vs Podium Probability"
  className="rounded-lg border border-slate-700"
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
            SHAP values help interpret the impact of each variable on default risk.
          </p>

          <img
            src="/images/shap_summary.png"
            alt="SHAP Summary"
            className="rounded-lg border border-slate-700 mb-4"
          />

          <p className="text-blue-400 text-sm">
            Model Interpretability Analysis
          </p>
        </motion.div>

      </div>
    </section>
  );
}