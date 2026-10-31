export default function F1Project() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">

      <h1 className="text-4xl md:text-5xl mb-6">
        Formula 1 Performance Analytics
      </h1>

      <p className="prose-serif max-w-[62ch] mb-10">
        This project analyzes Formula 1 race data to uncover patterns in driver
        performance, lap consistency, and race strategy using machine learning
        and statistical analysis.
      </p>

      <div className="py-6" style={{ borderTop: "1px solid var(--rule)" }}>
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
        className="inline-block mt-8 link"
      >
        Read the full analysis →
      </a>

    </section>
  );
}