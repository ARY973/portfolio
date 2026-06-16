export default function ExperienceTeaser() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <p className="text-sm text-white/50 uppercase tracking-widest mb-3 text-center">
        Career Journey
      </p>
      <h2 className="text-4xl font-bold text-white text-center mb-4">
        Experience
      </h2>
      <p className="text-white/60 text-center mb-12 max-w-xl mx-auto">
        From enterprise SAP systems at Tata Motors to building data infrastructure
        at USU — every role has shaped how I think about data and impact.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {[
          { role: "Data Analyst", company: "USU Transforming Communities Institute", period: "Apr 2026 — Present", current: true },
          { role: "Teaching Assistant", company: "Utah State University · Cloud Computing", period: "Dec 2025 — Apr 2026", current: false },
          { role: "SAP MM Consultant", company: "Tata Motors", period: "Jun 2024 — Aug 2024", current: false },
          { role: "BI Developer", company: "Medikart Pharmaceutical", period: "Jan 2024 — Mar 2024", current: false },
        ].map((exp) => (
          <div key={exp.role} className="bg-white/5 border border-white/10 rounded-xl p-5 flex justify-between items-start">
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