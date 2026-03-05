export default function F1Project() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-white">

      <h1 className="text-4xl font-semibold mb-6">
        Formula 1 Performance Analytics
      </h1>

      <p className="text-gray-200 leading-relaxed mb-10">
        This project analyzes Formula 1 race data to uncover patterns in driver
        performance, lap consistency, and race strategy using machine learning
        and statistical analysis.
      </p>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>

        <ul className="text-gray-200 space-y-2">
          <li>• Driver performance comparison across circuits</li>
          <li>• Lap time consistency analysis</li>
          <li>• Predictive modeling for race performance</li>
          <li>• Feature importance for lap outcomes</li>
        </ul>
      </div>

      <a
        href="/projects/Formula%201%20Presentation.pdf"
        target="_blank"
        className="inline-block mt-8 text-blue-300 hover:text-blue-200"
      >
        View Full Analysis →
      </a>

    </section>
  );
}