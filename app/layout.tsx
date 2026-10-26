import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThreeScene from "./components/ThreeScene";
import SiteNav from "./components/SiteNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

 export const metadata: Metadata = {
  title: "Aryan Mudhole | Data Analyst & ML",
  description: "Portfolio of Aryan Mudhole — Data Analyst, MMIS candidate at Utah State University's Jon M. Huntsman School of Business. Python, SQL, Power BI, Machine Learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="relative antialiased">
         {/* 🌌 GLOBAL GALAXY BACKGROUND */}
        <ThreeScene />

        <SiteNav />

        {/* 📄 PAGE CONTENT — THIS WAS MISSING */}
        <main id="main" className="relative z-20 pt-16">
          {children}
        </main>

        

        {/* 👣 FOOTER */}
        <footer className="relative z-20 py-20 flex flex-col items-center gap-6 text-gray-500">
          <p className="text-sm">
            Built with Next.js, Tailwind, and curiosity.
          </p>
        </footer>

      </body>
    </html>
  );
}