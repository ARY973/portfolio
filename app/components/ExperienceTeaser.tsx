export default function ExperienceTeaser() {
  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-24 scroll-mt-20">
      <p className="text-sm text-white/50 uppercase tracking-widest mb-3 text-center">
        Career Journey
      </p>
      <h2 className="text-4xl font-bold text-white text-center mb-4">
        Experience
      </h2>
      <p className="text-white/60 text-center mb-12 max-w-xl mx-auto">
        Three concurrent roles at USU — a justice-data pipeline, a Meals on Wheels
        delivery programme, and teaching the pipeline-engineering course — on top of
        earlier enterprise work in Pune.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {[
          { role: "Graduate Data Analyst", company: "USU Transforming Communities Institute", period: "Apr 2026 — Present", current: true },
          { role: "Data Analyst", company: "Meals on Wheels, Logan UT", period: "Aug 2026 — Present", current: true },
          { role: "Teaching Assistant", company: "DATA 5330/6330 Data Pipeline Engineering", period: "Sep 2026 — Present", current: true },
          { role: "Teaching Assistant", company: "Utah State University · Cloud Computing", period: "Dec 2025 — Apr 2026", current: false },
          { role: "SAP MM Intern", company: "Tata Motors, Pune", period: "Jun 2024 — Aug 2024", current: false },
          { role: "Power BI Analyst", company: "Medikart Pharmaceutical, Pune", period: "Jan 2024 — Mar 2024", current: false },
        ].map((exp) => (
          <div key={`${exp.role}-${exp.period}`} className="bg-white/5 border border-white/10 rounded-xl p-5 flex justify-between items-start">
            <div>
              <p className="text-white font-medium">{exp.role}</p>
              <p className="text-white/50 text-sm mt-1">{exp.company}</p>
              <p className="text-white/30 text-xs mt-1">{exp.period}</p>
            </div>
            {exp.current && (
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-1 rounded-full">
                Current
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <a href="/experience" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-sm transition">
          View Full Experience →
        </a>
      </div>
    </section>
  );
}