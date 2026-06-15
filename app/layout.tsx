import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThreeScene from "./components/ThreeScene";

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
  description: "Portfolio of Aryan Mudhole — Data Analyst, MS Information Systems at Utah State University(Huntsman School of Business). Python, SQL, Power BI, Machine Learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative antialiased">
         {/* 🌌 GLOBAL GALAXY BACKGROUND */}
        <ThreeScene />

        {/* 📄 PAGE CONTENT — THIS WAS MISSING */}
        <main className="relative z-20">
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