import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import SiteNav from "./components/SiteNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* A reference-book serif: sturdy, low contrast, made for reading —
   not a high-contrast display face. */
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Aryan Mudhole — Data Analyst",
  description:
    "Data analyst and MMIS candidate at Utah State University's Huntsman School of Business. Justice-system data, meal-delivery reporting, credit-risk modelling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable}`}
    >
      <body>
        <SiteNav />

        <main id="main">{children}</main>

        <footer className="rule-top mt-32">
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-wrap gap-x-8 gap-y-2 justify-between text-sm">
            <p style={{ color: "var(--ink-3)" }}>
              Built with Next.js and Tailwind. Logan, Utah.
            </p>
            <p style={{ color: "var(--ink-3)" }}>
              <a className="link" href="mailto:aryan.mudhole11@gmail.com">
                aryan.mudhole11@gmail.com
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
