import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

/*
 * Content pipeline — single source for pages, feeds, and (later) the RAG
 * index and MCP tools. Long-form content lives in locale directories
 * (content/<collection>/{en,ko}/<slug>.mdx); locale and slug are derived
 * from the path so frontmatter can't drift from the file layout.
 */

const locales = ["en", "ko"] as const;

const localeAndSlug = (path: string) => {
  const [locale, ...rest] = path.split("/");
  const parsed = z.enum(locales).safeParse(locale);
  if (!parsed.success || rest.length === 0) {
    throw new Error(
      `Content path "${path}" must be "<locale>/<slug>" with locale one of: ${locales.join(", ")}`,
    );
  }
  return { locale: parsed.data, slug: rest.join("/") };
};

/* "2021-07" — year-month keeps case-study periods honest without fake days. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

const projects = defineCollection({
  name: "projects",
  typeName: "Project",
  directory: "content/projects",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    period: z.object({ start: yearMonth, end: yearMonth.optional() }),
    /* Per-role contribution lines — the builder narrative (§ IA). */
    roles: z
      .object({
        planning: z.string().min(1).optional(),
        design: z.string().min(1).optional(),
        frontend: z.string().min(1).optional(),
        backend: z.string().min(1).optional(),
      })
      .refine((r) => Object.values(r).some(Boolean), {
        message: "at least one role contribution is required",
      }),
    /* The case-study spine: every project must state these three. */
    problem: z.string().min(1),
    decisions: z
      .array(
        z.object({ decision: z.string().min(1), tradeoff: z.string().min(1) }),
      )
      .min(1),
    outcomes: z.array(z.string().min(1)).min(1),
    stack: z.array(z.string().min(1)).min(1),
    links: z
      .object({
        site: z.url().optional(),
        repo: z.url().optional(),
        demo: z.url().optional(),
      })
      .optional(),
    featured: z.boolean().default(false),
    order: z.int().default(0),
    draft: z.boolean().default(false),
    /* MDX body (injected by the frontmatter parser). */
    content: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document);
    return { ...document, ...localeAndSlug(document._meta.path), body };
  },
});

const posts = defineCollection({
  name: "posts",
  typeName: "Post",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    date: z.iso.date(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
    /* MDX body (injected by the frontmatter parser). */
    content: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document);
    return { ...document, ...localeAndSlug(document._meta.path), body };
  },
});

export default defineConfig({ content: [projects, posts] });
