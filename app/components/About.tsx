import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-16">
      <h2 className="text-3xl md:text-4xl mb-14">About</h2>

      <div className="grid md:grid-cols-[1fr_15rem] gap-x-14 gap-y-10 items-start">
        <div className="prose-serif text-lg max-w-[62ch] space-y-5">
          <p>
            I came to Logan from Pune in August 2025, alone with three
            suitcases, for a Master of Management Information Systems at Utah
            State University&apos;s Huntsman School of Business. It was the
            first time I had left India.
          </p>
          <p style={{ color: "var(--ink-2)" }}>
            What I like about data work is the part after the model. At the
            Transforming Communities Institute I own the Community Justice
            Administration pipeline end to end, from gathering requirements
            with the Executive Director through designing it, shipping it, and
            writing the codebooks so the research staff can use it without me. At Meals on
            Wheels the questions come from programme stakeholders rather than a
            spec, which means most of the job is working out what they actually
            need before writing anything.
          </p>
          <p style={{ color: "var(--ink-2)" }}>
            Before USU I built Power BI dashboards at Medikart and worked
            inside SAP at Tata Motors. I was president of the USU AI Club, and
            represented it in Washington, D.C. through the Covey Leadership
            Center. I teach the data pipeline engineering course now, which has
            made me much better at explaining things.
          </p>
          <p style={{ color: "var(--ink-2)" }}>
            I am looking for analyst and data roles where the output is a
            decision someone has to make.{" "}
            <Link href="/beyond" className="link">
              There is a longer story here
            </Link>
            .
          </p>
        </div>

        <div className="order-first md:order-last">
          <Image
            src="/about/aryan.jpg"
            alt="Aryan Mudhole"
            width={360}
            height={360}
            sizes="15rem"
            className="w-40 md:w-full h-auto"
            style={{ border: "1px solid var(--rule)" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
