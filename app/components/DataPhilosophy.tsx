export default function DataPhilosophy() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">

        {/* GLASS CONTAINER */}
        <div
          className="
            backdrop-blur-md
            bg-white/10
            border border-white/20
            rounded-2xl
            shadow-xl
            px-10 py-14
            text-center
          "
        >
          {/* Intro line */}
          <p className="text-white/70 mb-6 max-w-3xl mx-auto">
            I approach data not just as numbers, but as a strategic asset that drives
            prediction, financial insight, and scalable decision-making.
          </p>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-14">
            How I Think About Data
          </h2>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-10 text-left">

            <div className="space-y-3">
              <h3 className="font-semibold text-white text-lg">
                📊 Data is currency
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                In today’s world, data drives growth. Businesses that understand their
                data make faster, smarter, and more profitable decisions.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white text-lg">
                📈 Prediction fuels scale
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                From forecasting demand to managing financial risk, predictive models
                turn historical data into a competitive advantage.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white text-lg">
                ⚙️ Technology enables precision
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                Using advanced Python, machine learning, and fintech concepts, I build
                analytical systems designed for accuracy, clarity, and impact.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}