import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

// Lazy shiki singleton
let highlighterPromise: Promise<any> | null = null;
async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["github-dark-dimmed"],
        langs: [
          "typescript", "javascript", "tsx", "jsx", "json", "bash", "shell",
          "css", "html", "python", "go", "rust", "sql", "yaml", "markdown",
        ],
      }),
    );
  }
  return highlighterPromise;
}

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((hl) => {
        const safeLang = hl.getLoadedLanguages().includes(lang) ? lang : "text";
        const out = hl.codeToHtml(code, { lang: safeLang, theme: "github-dark-dimmed" });
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-md border border-border">
      <div className="flex items-center justify-between border-b border-border/60 bg-[oklch(0.1_0.004_60)] px-4 py-1.5 text-xs text-muted-foreground">
        <span className="font-mono lowercase tracking-wider">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {html ? (
        <div
          className="shiki-wrap text-[0.88rem] [&_pre]:m-0 [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:bg-[oklch(0.1_0.004_60)] [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="m-0 overflow-x-auto bg-[oklch(0.1_0.004_60)] p-4 text-[0.88rem] text-[oklch(0.92_0.006_80)]">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
