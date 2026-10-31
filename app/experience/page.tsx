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
    <main className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl mb-4">Experience</h1>
      <p className="prose-serif text-lg max-w-[58ch] mb-6" style={{ color: "var(--ink-2)" }}>
        The roles that shaped how I think about data, people, and impact.
      </p>
      <a
        href="/resume/Aryan_Mudhole_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="link text-sm inline-block mb-16"
      >
        Download the résumé
      </a>

      <div className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        

        <div>
          {experiences.map((exp) => (
            <div key={`${exp.role}-${exp.period}`} className="spine py-10 rule-bottom" style={{ borderColor: "var(--rule)" }}>
              <div className="spine-label tabular">
                {exp.period}
                {exp.current && (
                  <span
                    className="ml-2 align-middle inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--signal)" }}
                    aria-label="current role"
                  />
                )}
              </div>

              <div className="max-w-[62ch]">
              <h2 className="text-xl md:text-2xl mb-1">{exp.role}</h2>
              <p className="text-sm mb-5" style={{ color: "var(--ink-2)" }}>
                {exp.company} — {exp.type}
              </p>

              <p className="prose-serif mb-4" style={{ color: "var(--ink-2)" }}>{exp.story}</p>

              {exp.points && (
                <ul className="space-y-2 mb-5">
                  {exp.points.map((pt) => (
                    <li
                      key={pt}
                      className="prose-serif text-[0.95rem] pl-4"
                      style={{ color: "var(--ink-2)", borderLeft: "1px solid var(--rule)" }}
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {exp.stack.map((tag) => (
                  <span key={tag} className="text-xs" style={{ color: "var(--ink-3)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership */}
      <section className="mt-24">
        <h2 className="text-2xl md:text-3xl mb-6">Leadership and speaking</h2>
        <div className="space-y-5">
          {leadership.map((l) => (
            <div
              key={l.title}
              className="py-5 rule-bottom"
              style={{ borderColor: "var(--rule)" }}
            >
              <h3 className="mb-1">{l.title}</h3>
              <p className="prose-serif text-[0.95rem]" style={{ color: "var(--ink-2)" }}>{l.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl mb-6">Certifications</h2>
        <ul className="flex flex-col gap-1">
          {certifications.map((c) => (
            <li
              key={c}
              className="text-sm py-2"
              style={{ color: "var(--ink-2)" }}
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16">
        <Link href="/" className="link text-sm">
          Back to home
        </Link>
      </div>
    </main>
  );
}
