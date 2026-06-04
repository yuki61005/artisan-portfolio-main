import GithubSlugger from "github-slugger";

export interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const toc: TocItem[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/[`*_~]/g, "").trim();
      toc.push({ depth, text, slug: slugger.slug(text) });
    }
  }
  return toc;
}

export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
