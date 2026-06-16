export default function Experience() {
  const experiences = [
    {
      role: "Data Analyst",
      company: "USU Transforming Communities Institute",
      type: "Part-time · Current",
      period: "Apr 2026 — Present",
      story:
        "Working part-time within USU's Transforming Communities Institute, I'm building the data infrastructure that drives real decisions for a legal aid program. The role has taught me to move beyond analysis — to understand the problem first, then let the data shape the solution. Every pipeline I build here moves the institute toward a more structured, evidence-based operation.",
      stack: ["Python", "ETL Pipelines", "Airtable", "Softr", "T3", "Exploratory Data Analysis"],
    },
    {
      role: "Teaching Assistant — Cloud Computing",
      company: "Utah State University · Huntsman School of Business",
      type: "Seasonal",
      period: "Dec 2025 — Apr 2026",
      story:
        "One of the most rewarding experiences of my academic journey. As a TA for the cloud computing course at USU's Huntsman School, I guided students through industry-level AWS implementations — helping them understand not just the technology, but how to think with it. I pushed students to use AI as a learning tool, not a shortcut. The connections I made here, both with students and faculty, have stayed with me.",
      stack: ["AWS"],
    },
    {
      role: "SAP Materials Management Consultant",
      company: "Tata Motors",
      type: "Internship",
      period: "Jun 2024 — Aug 2024",
      story:
        "Getting to work inside one of India's largest automobile companies as a fresh IT graduate was a formative experience. I got hands-on with SAP Materials Management — learning how a company at that scale handles procurement, inventory, and data across thousands of moving parts. It gave me an early appreciation for how critical clean, structured data is at enterprise scale.",
      stack: ["SAP MM", "Microsoft Power BI"],
    },
    {
      role: "Business Intelligence Developer",
      company: "Medikart Pharmaceutical Distribution",
      type: "Internship",
      period: "Jan 2024 — Mar 2024",
      story:
        "My first real lesson in translating data into business language. Working with Medikart's datasets, I built Power BI dashboards that helped leadership make informed decisions about their growth strategy. The organisation was small, but the impact was real — and it taught me that good data communication matters regardless of company size.",
      stack: ["Power BI", "Power Query", "Excel"],
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-white">
      {/* Header */}
      <p className="text-sm text-white/50 uppercase tracking-widest mb-3">
        Career Journey
      </p>
      <h1 className="text-4xl font-bold mb-4">Experience</h1>
      <p className="text-white/60 text-lg mb-16">
        The roles that shaped how I think about data, people, and impact.
      </p>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-16">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8">
              {/* Dot */}
              <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-blue-400" />

              {/* Period */}
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                {exp.period}
              </p>

              {/* Role + Company */}
              <h2 className="text-xl font-semibold text-white mb-1">
                {exp.role}
              </h2>
              <p className="text-blue-300 text-sm mb-4">
                {exp.company} · {exp.type}
              </p>

              {/* Story */}
              <p className="text-white/70 leading-relaxed mb-5">
                {exp.story}
              </p>

              {/* Stack tags */}
              <div className="flex flex-wrap gap-2">
                {exp.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications placeholder */}
      <div className="mt-24 border border-white/10 rounded-2xl p-8 text-center">
        <p className="text-white/30 text-sm uppercase tracking-widest mb-2">
          Coming Soon
        </p>
        <h3 className="text-white/50 text-xl font-semibold">
          Certifications
        </h3>
        <p className="text-white/30 text-sm mt-2">
          AWS, Google, and more — in progress.
        </p>
      </div>

      {/* Back link */}
      <div className="mt-16">
        <a href="/" className="text-blue-300 hover:text-blue-200 text-sm">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}