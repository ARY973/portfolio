import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Aryan Mudhole",
  description:
    "Data analyst and teaching assistant roles at Utah State University, plus earlier work at Tata Motors and Medikart in Pune.",
};

type Role = {
  role: string;
  company: string;
  type: string;
  period: string;
  current?: boolean;
  story: string;
  points?: string[];
  stack: string[];
};

const experiences: Role[] = [
  {
    role: "Graduate Data Analyst",
    company: "Transforming Communities Institute, Utah State University",
    type: "Part-time",
    period: "Apr 2026 — Present",
    current: true,
    story:
      "I own the Community Justice Administration data product end to end — requirements from the Executive Director, architecture, shipping, and iterating on what comes back. The role taught me to understand the problem before reaching for the data.",
    points: [
      "Built the CJA pipeline from scratch: Python extracts five Airtable tables, transforms them into one coded wide-format dataset, and delivers SPSS-ready CSVs to Box on a weekly GitHub Actions schedule.",
      "Authored the data dictionary and versioned codebooks so non-technical research staff can use the data without me in the room.",
      "Evaluated database migration options (PostgreSQL / Supabase) and proposed the infrastructure plan to a USU committee.",
    ],
    stack: ["Python", "Airtable", "GitHub Actions", "Box", "SPSS", "PostgreSQL", "Supabase"],
  },
  {
    role: "Data Analyst, Meals on Wheels",
    company: "Logan, UT",
    type: "Part-time",
    period: "Aug 2026 — Present",
    current: true,
    story:
      "Reporting and front-end work for a meal-delivery service where the data has a person at the end of it. Requirements come from program stakeholders rather than a spec, which means most of the job is asking the right questions first.",
    points: [
      "Gather reporting requirements from program stakeholders and build the datasets and reporting behind the meal-delivery service.",
      "Develop the front end of the program's application alongside the analytics work.",
    ],
    stack: ["Python", "SQL", "Front-end development", "Stakeholder requirements"],
  },
  {
    role: "Teaching Assistant — DATA 5330/6330 Data Pipeline Engineering",
    company: "Jon M. Huntsman School of Business, Utah State University",
    type: "Part-time",
    period: "Sep 2026 — Present",
    current: true,
    story:
      "Supporting 27 students through pandas, PySpark, SQL, Airflow, Databricks and Delta Lake. Most of the real work is removing the setup friction that stops people before they ever reach the actual material.",
    points: [
      "Built and published the course's PySpark setup module: a one-command install script for macOS, Ubuntu and Windows (WSL2), step-by-step guides and an automated install checker, verified on all three platforms.",
      "Documented 15 common PySpark failure modes and tested the Airflow-on-Azure (Docker, DAG) guide before release.",
      "Twice-weekly office hours and assignment grading for 27 students.",
    ],
    stack: ["PySpark", "Airflow", "Databricks", "Delta Lake", "SQL", "Docker", "Azure"],
  },
  {
    role: "Teaching Assistant — Cloud Computing",
    company: "Jon M. Huntsman School of Business, Utah State University",
    type: "Seasonal",
    period: "Dec 2025 — Apr 2026",
    story:
      "One of the most rewarding experiences of my academic journey. I guided students through industry-level AWS implementations — helping them understand not just the technology, but how to think with it, and pushing them to use AI as a learning tool rather than a shortcut.",
    points: [
      "Held office hours three times a week troubleshooting AWS deployments: EC2 launch templates, Application Load Balancers, Auto Scaling Groups, IAM Identity Center and Git workflows.",
      "Graded and gave written feedback on 45+ submissions per assignment, including a Redis and DynamoDB cache-aside (lazy loading) build.",
    ],
    stack: ["AWS EC2", "Load Balancing", "Auto Scaling", "IAM", "Redis", "DynamoDB"],
  },
  {
    role: "SAP MM Intern",
    company: "Tata Motors Ltd., Pune, India",
    type: "Internship",
    period: "Jun 2024 — Aug 2024",
    story:
      "Working inside one of India's largest automobile companies as a fresh IT graduate was formative. I saw how an organisation at that scale handles procurement, inventory and data across thousands of moving parts — and how much rests on that data being clean.",
    points: [
      "Analyzed procurement data in SAP MM to identify inefficiencies in purchasing workflows.",
    ],
    stack: ["SAP MM", "Power BI"],
  },
  {
    role: "Power BI Analyst",
    company: "Medikart Pharmaceutical Distribution, Pune, India",
    type: "Internship",
    period: "Jan 2024 — Mar 2024",
    story:
      "My first real lesson in translating data into business language. The organisation was small, but the impact was measurable — and it taught me that clear data communication matters regardless of company size.",
    points: [
      "Built automated Power BI dashboards (DAX, Power Query) that cut manual Excel reporting time by 40%.",
    ],
    stack: ["Power BI", "DAX", "Power Query", "Excel"],
  },
];

const leadership = [
  {
    title: "President, USU AI Club",
    detail:
      "Led events and brought in outside speakers, growing participation and the club's visibility. Represented the club in Washington, D.C. through USU's Covey Leadership Center.",
  },
  {
    title: "Panelist, International Business class — Oct 2026",
    detail:
      "Invited by the Huntsman School to represent India on culture and business practice between India and the U.S.",
  },
];

const certifications = [
  "Databricks Fundamentals accreditation",
  "Snowflake data warehousing workshop",
];

export default function Experience() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-white">
      <p className="text-sm text-white/50 uppercase tracking-widest mb-3">
        Career Journey
      </p>
      <h1 className="text-4xl font-bold mb-4">Experience</h1>
      <p className="text-white/60 text-lg mb-6">
        The roles that shaped how I think about data, people, and impact.
      </p>
      <a
        href="/resume/Aryan_Mudhole_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-blue-300 hover:text-blue-200 text-sm mb-16"
      >
        Download the résumé (PDF) →
      </a>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-16">
          {experiences.map((exp) => (
            <div key={`${exp.role}-${exp.period}`} className="relative pl-8">
              <div
                className={`absolute left-[-4px] top-1 w-2 h-2 rounded-full ${
                  exp.current ? "bg-blue-400" : "bg-white/30"
                }`}
              />

              <div className="flex items-center gap-3 mb-1">
                <p className="text-white/40 text-xs uppercase tracking-widest">
                  {exp.period}
                </p>
                {exp.current && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Current
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold text-white mb-1">
                {exp.role}
              </h2>
              <p className="text-blue-300 text-sm mb-4">
                {exp.company} · {exp.type}
              </p>

              <p className="text-white/70 leading-relaxed mb-4">{exp.story}</p>

              {exp.points && (
                <ul className="space-y-2 mb-5">
                  {exp.points.map((pt) => (
                    <li
                      key={pt}
                      className="text-white/60 text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-white/25"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              )}

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

      {/* Leadership */}
      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-6">Leadership &amp; speaking</h2>
        <div className="space-y-5">
          {leadership.map((l) => (
            <div
              key={l.title}
              className="border border-white/10 rounded-xl p-5 bg-white/5"
            >
              <h3 className="text-white font-medium mb-1">{l.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{l.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Certifications</h2>
        <ul className="flex flex-wrap gap-3">
          {certifications.map((c) => (
            <li
              key={c}
              className="text-sm bg-white/10 text-white/80 px-4 py-2 rounded-lg border border-white/20"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16">
        <Link href="/" className="text-blue-300 hover:text-blue-200 text-sm">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
