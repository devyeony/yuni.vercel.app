# ADR-0002: Schema-enforced content pipeline with Content Collections

- Status: accepted
- Date: 2026-07-18

## Context

The site is a living résumé: careers, case studies, and posts keep growing
after launch. The legacy site stored career content as HTML strings inside
translation files, which made every update a component edit and reuse
impossible. The new architecture separates content into three kinds
(structured data, long-form MDX, UI microcopy) and requires that adding an
entry touches zero components. Long-form content also needs to feed more than
pages later: RSS, the RAG index, and MCP tool responses derive from the same
source.

Contentlayer, the obvious MDX-pipeline choice, is unmaintained.

## Decision

Use **Content Collections** (`@content-collections/*`) as the build-time
content pipeline for long-form MDX:

- Collections live in `content/<collection>/{en,ko}/<slug>.mdx`; locale and
  slug are **derived from the path** in the transform, so frontmatter cannot
  drift from the file layout.
- Frontmatter is validated with **Zod at build time** — invalid content fails
  `pnpm check`/`pnpm build`, not a reviewer.
- The project schema enforces the case-study spine as data, not prose
  convention: `problem`, `decisions[{decision, tradeoff}]`, `outcomes[]`, and
  per-role contributions are required fields the UI renders directly. A case
  study that skips its trade-offs does not compile.
- MDX is compiled at build time (`compileMDX`); pages render server-side via
  `MDXContent` — no MDX runtime in the client bundle.
- `content-collections build` runs at the head of `pnpm check` so a fresh
  checkout typechecks without a Next build.

## Consequences

- Adding a project = adding one MDX file per locale; list, detail, and later
  feeds/RAG/MCP pick it up with zero component changes.
- The generated types (`content-collections` path alias) give pages fully
  typed content access.
- en/ko content symmetry is a convention, not yet machine-checked (unlike
  messages); the Phase 3 content skill documents the pairing rule, and the
  check can be automated later if drift actually happens.
- Structured data files (`content/data/`, e.g. careers and Now) are a
  separate follow-up; this ADR covers the long-form MDX half.
