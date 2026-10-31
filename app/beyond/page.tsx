import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beyond the work | Aryan Mudhole",
  description:
    "Washington DC with the Huntsman School of Business, and what a year away from home actually looked like.",
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
    <section className="max-w-3xl mx-auto px-6 py-28">
      <h1 className="text-4xl md:text-5xl mb-3">Washington, DC</h1>

      <p className="text-sm mb-12" style={{ color: "var(--ink-3)" }}>
        Huntsman School of Business leadership programme, October 2025
      </p>

      <div className="prose-serif space-y-6 text-lg max-w-[62ch] mb-8">
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

      <blockquote
        className="prose-serif pl-5 italic text-xl mb-14"
        style={{ borderLeft: "2px solid var(--signal)", color: "var(--ink)" }}
      >
        &ldquo;Ascend to higher ground and descend to higher ground.&rdquo;
      </blockquote>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden"
            style={{ border: "1px solid var(--rule)" }}
          >
            <Image
              src={src}
              alt={`Washington DC, October 2025, photo ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <Link href="/" className="link text-sm">
        Back to home
      </Link>
    </section>
  );
}
