import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Eye, EyeOff } from "lucide-react";
import { upsertPost } from "@/lib/posts.functions";
import { MarkdownView } from "@/components/site/MarkdownView";

interface Initial {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  content?: string;
  cover_image?: string | null;
  category?: string | null;
  tags?: string[];
  published?: boolean;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function PostEditor({ initial = {}, onSaved }: { initial?: Initial; onSaved: () => void }) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [cover, setCover] = useState(initial.cover_image ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [tagsText, setTagsText] = useState((initial.tags ?? []).join(", "));
  const [published, setPublished] = useState(initial.published ?? false);
  const [preview, setPreview] = useState(false);

  const save = useServerFn(upsertPost);
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: () =>
      save({
        data: {
          id: initial.id,
          title, slug: slug || slugify(title),
          excerpt: excerpt || null,
          content,
          cover_image: cover || null,
          category: category || null,
          tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
          published,
        },
      }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      onSaved();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-8 max-w-5xl">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">Studio</div>
          <h1 className="mt-2 font-display text-3xl font-bold">{initial.id ? "Edit essay" : "New essay"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreview(!preview)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm">
            {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {preview ? "Edit" : "Preview"}
          </button>
          <button onClick={() => m.mutate()} disabled={m.isPending || !title || !content} className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50">
            <Save className="h-4 w-4" /> {m.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4 min-w-0">
          <input value={title} onChange={(e) => { setTitle(e.target.value); if (!initial.id && !slug) setSlug(slugify(e.target.value)); }}
            placeholder="Title" className="w-full bg-transparent border-0 border-b border-border py-3 font-display text-3xl font-bold outline-none focus:border-vermilion" />
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Excerpt — a single sentence that previews the essay"
            className="w-full bg-transparent border-0 border-b border-border py-2 text-sm outline-none focus:border-vermilion" />

          {preview ? (
            <div className="prose-sumi rounded-md border border-border p-6 min-h-[60vh]">
              <MarkdownView content={content} />
            </div>
          ) : (
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={26}
              placeholder="# Write in Markdown…&#10;&#10;Supports headings, code blocks, tables, footnotes. Use ```ts for syntax-highlighted code."
              className="w-full rounded-md border border-border bg-background p-4 font-mono text-sm leading-relaxed outline-none focus:border-vermilion" />
          )}
        </div>

        <aside className="space-y-4">
          <Field label="Slug">
            <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="my-essay" className={input} />
          </Field>
          <Field label="Cover image URL">
            <input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" className={input} />
            {cover && <img src={cover} alt="" className="mt-2 aspect-[16/9] w-full rounded border border-border object-cover" />}
          </Field>
          <Field label="Category">
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Engineering" className={input} />
          </Field>
          <Field label="Tags (comma-separated)">
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="react, performance" className={input} />
          </Field>
          <label className="flex items-center gap-2 rounded-md border border-border p-3">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            <span className="text-sm">Published</span>
          </label>
        </aside>
      </div>
    </div>
  );
}

const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-vermilion";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
