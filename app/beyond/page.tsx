import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beyond the work | Aryan Mudhole",
  description:
    "Washington DC with the Huntsman School of Business — what a year away from home actually looked like.",
};

const images = [
  "/dc/20251010_051612_7CAE45.jpeg",
  "/dc/20251010_051612_788752.jpeg",
  "/dc/20251010_184124_700A1F.jpeg",
  "/dc/20251010_184124_79519E.jpeg",
  "/dc/20251010_184124_739209.jpeg",
  "/dc/20251010_184838_79891F.jpeg",
  "/dc/20251010_190310_7E70B1.jpeg",
  "/dc/20251010_190310_774615.jpeg",
  "/dc/20251012_104518_799B77.jpeg",
  "/dc/20251012_104519_7CEBDA.jpeg",
  "/dc/20251012_180224_7B10A8.jpeg",
  "/dc/20251013_112231_73DA1D.jpeg",
];

export default function BeyondPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-28 text-white">
      <p className="text-blue-400 text-sm mb-2">Beyond the work</p>

      <h1 className="text-4xl font-semibold mb-3">
        Washington, DC
      </h1>

      <p className="text-white/50 text-sm uppercase tracking-widest mb-10">
        USU Huntsman School of Business · Leadership Program · Oct 2025
      </p>

      <div className="space-y-6 text-lg leading-relaxed text-slate-200 mb-6">
        <p>
          I have tears while writing this. I never imagined that I would be
          gifted with so many experiences, lessons, and relationships in a
          single year.
        </p>
        <p>
          As an international student, I never felt like I was away from home.
          Utah State University and the Jon M. Huntsman School of Business
          shaped me in ways I&apos;ll carry for life.
        </p>
      </div>

      <blockquote className="border-l-2 border-blue-400/60 pl-5 italic text-slate-300 text-lg mb-14">
        &ldquo;Ascend to higher ground and descend to higher ground.&rdquo;
      </blockquote>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden rounded-lg border border-slate-800"
          >
            <Image
              src={src}
              alt={`Washington DC, October 2025 — photo ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      <Link href="/" className="text-blue-300 hover:text-blue-200 text-sm">
        ← Back to home
      </Link>
    </section>
  );
}
