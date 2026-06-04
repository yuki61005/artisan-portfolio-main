import { lazy, Suspense } from "react";

const ReactMarkdown = lazy(() => import("react-markdown"));

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { CodeBlock } from "./CodeBlock";

export function MarkdownView({ content }: { content: string }) {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            if (inline || !match) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock lang={match[1]} code={String(children).replace(/\n$/, "")} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Suspense>
  );
}
