---
name: content
description: How to add or update careers, activities, projects, blog posts, and the Now status. Use whenever changing anything under content/ — schemas, locales, and verification in one procedure.
---

# Content skill

The site is a living résumé: content updates are data changes, never
component changes. If a content update seems to require editing a component,
stop — that's an architecture violation; fix the renderer instead.

## The three content kinds (and the one banned place)

| Kind | Lives in | Format |
|---|---|---|
| Structured data (careers, activities, now) | `content/data/` | YAML, locale-keyed fields |
| Long-form (projects, posts) | `content/{projects,posts}/{en,ko}/` | MDX, one file per locale |
| UI microcopy (buttons, nav, labels) | `messages/*.json` | next-intl |

**Banned:** career/project/post content in `messages/*.json` or hardcoded in
components. This was the legacy site's core failure — content trapped in
translation strings could be neither updated nor reused.

All schemas live in `content-collections.ts` (Zod, build-time). An invalid
entry fails `pnpm check` with a per-field error — read the message, fix the
data.

## Adding a career or activity

One YAML file per entry. Every human-readable field is locale-keyed —
both `en` and `ko` are required (one fact, two renderings, no drift):

```yaml
# content/data/careers/<slug>.yaml
company: { en: "...", ko: "..." }
role: { en: "...", ko: "..." }
summary: { en: "...", ko: "..." }
period: { start: "2021-07", end: "2024-01" }   # end omitted = present
stack: [Java, Spring Boot]
```

```yaml
# content/data/activities/<slug>.yaml
kind: opensource   # opensource | talk | publication | community
title: { en: "...", ko: "..." }
org: { en: "...", ko: "..." }    # optional
date: "2025"                     # "2026" or "2026-07" — year when month is uncertain
endDate: "2026"                  # optional
note: { en: "...", ko: "..." }   # optional
link: "https://..."              # optional
```

Dates: never invent a month to satisfy a format — `"2025"` is valid and
renders as-is. The About page picks these up automatically (timeline sorted
by start desc; activities grouped by kind).

## Updating Now

Edit `content/data/now.yaml` (availability badge + focus lines) and bump
`updated`. Nothing else to touch.

## Adding a project (case study)

Create `content/projects/en/<slug>.mdx` **and** `content/projects/ko/<slug>.mdx`
(same slug — the ko twin is required by convention; hreflang links assume it).
Locale and slug derive from the path — do not put them in frontmatter.

The schema enforces the case-study spine; a project without it fails the
build:

- `problem` — what was actually hard, one paragraph
- `decisions[]` — each entry needs `decision` **and** `tradeoff` (what it
  cost; "we used X" without cost does not compile)
- `outcomes[]` — measured results, numbers over adjectives
- `roles` — at least one of planning/design/frontend/backend, one
  contribution line each
- plus `title`, `summary`, `period` (`"YYYY-MM"` strict), `stack`,
  optional `links{site,repo,demo}`, `featured`, `order`

The MDX body is free-form narrative *around* the spine — don't repeat the
frontmatter in prose. List/detail pages, and later feeds/RAG/MCP, pick the
file up automatically.

## Adding a blog post

Create `content/posts/{en,ko}/<slug>.mdx` (both locales):

```yaml
---
title: ...
summary: ...
date: "2026-07-18"        # full ISO date
tags: [portfolio, zod]    # lowercase slugs; tag pages generate from these
draft: true               # optional — hides from lists, feeds, and builds of tag pages
---
```

Reading time is computed at build. Code blocks are highlighted by Shiki at
build time — **theme constraint:** the axe scan checks code-token contrast
against `surface-raised`, so themes are pinned to
`github-dark-high-contrast`/`github-light-high-contrast`. Don't swap themes
without re-running `pnpm verify` (vesper and github-dark fail AA).

RSS/Atom feeds and tag pages regenerate from the collection — nothing to
update manually.

## Verify

1. `pnpm check` — schema validation + i18n symmetry (seconds; catches most
   content mistakes).
2. `pnpm verify` — only needed when a change adds a *route* (new post/project
   slug) — smoke/axe page lists in `e2e/smoke.spec.ts` and `e2e/a11y.spec.ts`
   name one representative slug per collection; update them only if the
   representative entry was renamed or removed.

## Voice and language

Repo artifacts are English; site content is EN default + KO. Korean copy is
natural, not literal translation (see i18n skill). Facts only — never invent
dates, employers, or metrics; when a fact is unknown, leave a `# TODO(owner
input)` comment and surface it to the owner.
