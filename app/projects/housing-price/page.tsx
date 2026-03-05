export default function HousingProject() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-white">

      <h1 className="text-4xl font-semibold mb-6">
        Housing Price Prediction
      </h1>

      <p className="text-gray-200 leading-relaxed mb-10">
        Built regression-based machine learning models to estimate housing prices
        using structured datasets. The project focused on feature engineering,
        model comparison, and interpretability of predictive signals.
      </p>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>

        <ul className="text-gray-200 space-y-2">
          <li>• Feature engineering for housing attributes</li>
          <li>• Regression modeling for price prediction</li>
          <li>• Model evaluation using RMSE and R²</li>
          <li>• Interpreting key drivers of housing value</li>
        </ul>
      </div>

      <a
        href="/projects/project-1-presentation.pdf"
        target="_blank"
        className="inline-block mt-8 text-blue-300 hover:text-blue-200"
      >
        View Full Analysis →
      </a>

    </section>
  );
}