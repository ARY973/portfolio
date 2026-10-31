import { codeToHtml } from "shiki";

export default async function CodeBlock({
  code,
  filename = "model.py",
}: {
  code: string;
  filename?: string;
}) {
  const html = await codeToHtml(code, {
    lang: "python",
    theme: "github-light",
  });

  return (
    <div style={{ border: "1px solid var(--rule)" }}>
      <div
        className="flex items-center justify-between px-4 py-2 text-xs mono"
        style={{
          borderBottom: "1px solid var(--rule)",
          color: "var(--ink-3)",
          background: "var(--paper-rise)",
        }}
      >
        <span>{filename}</span>
      </div>

      <div
        className="overflow-auto max-h-[36rem] text-[0.8125rem] p-4"
        style={{ background: "var(--paper-rise)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
