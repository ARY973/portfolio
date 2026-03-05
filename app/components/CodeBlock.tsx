"use client";
import { codeToHtml } from "shiki";

export default async function CodeBlock({ code }: { code: string }) {

  const html = await codeToHtml(code, {
    lang: "python",
    theme: "github-dark",
  });

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/50 text-xs text-gray-300">

        <span>loan_default_model.py</span>

      </div>

      {/* Code */}
      <div
        className="overflow-auto max-h-[700px] text-sm p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />

    </div>
  );
}
