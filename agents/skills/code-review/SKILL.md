---
name: code-review
description: Repo-specific review criteria for PRs and diffs — judgment calls machines can't catch. Use when reviewing any change in this repository.
---

# Code review skill

Tier 1 (format/lint/type/test) is machine-enforced by lefthook and CI — do
not comment on anything Biome/tsc/knip already catches. Review only what
requires judgment:

## Architecture

- Dependency direction: `app → features → components/ui → tokens`. Flag any
  import going backwards (e.g. `components/ui` importing from `features/`).
- `components/ui` stays domain-agnostic — no knowledge of careers, projects,
  posts, or page-specific concerns.
- Major decisions should have an ADR in `docs/adr/`; flag significant
  architectural changes made without one.

## Design system

- Semantic tokens only in components — flag raw hex/oklch values and
  primitive tokens (`void-*`, `starlight-*`, `nebula-*`, `flare-*`) outside
  `tokens.css` and the `/design` showcase.
- Flag anti-generic violations: gradients as decoration, glassmorphism
  (backdrop-blur cards), emoji bullets, floating CTAs, decorative shadows.
- New tokens must be mapped in both `:root` and `:root.light`.

## RSC / client boundary

- `"use client"` is a reviewable decision — flag it unless the component
  uses hooks/browser APIs, and check the boundary is at a leaf, not a layout.
- Flag client-side data fetching for things computable at build time.

## Content architecture

- Career/project/post content must never live in `messages/*.json`
  (UI microcopy only) or be hardcoded in components — it belongs in
  `content/` (Phase 3+).

## i18n

- Every user-facing string goes through next-intl; flag hardcoded English
  in JSX. en/ko key symmetry is machine-checked; review translation
  *quality* and missing `setRequestLocale` in new pages.

## Security

- External input (forms, API routes, search params) validated with Zod at
  the boundary; API routes rate-limited.
- No server env vars reaching client components; no secrets in code.
- External links: `rel="noopener noreferrer"` (the ui Link handles this —
  flag raw `<a target="_blank">`).

## Performance

- Unnecessary client components or client-side libraries (bundle impact —
  size-limit gates 250 kB brotli total).
- Animations must use compositor-friendly properties (`transform`,
  `opacity`) and duration/ease tokens (reduced-motion collapses tokens).
- Images via `next/image`; fonts stay subset.

## Responsive / device adaptation

- Mobile-first utilities; flag desktop-first `max-*:` layouts without cause.
- Fixed pixel widths/heights that break at 360px; missing tablet
  consideration (768px is a real layout, not a stretched phone).
- Touch targets ≥ 44px on coarse pointers; hover-only interactions banned.
- Fluid type via tokens, not per-viewport font-size overrides.

## Over-engineering (non-goals)

Flag introductions of: state-management libraries, Storybook, CMS, paid
services, semantic-release, Figma pipelines — these are documented
non-goals; adding one needs an ADR, not a drive-by dependency.

## A11y

- Keyboard path works (focus visible, Escape closes overlays, focus
  restored); semantic elements over div+onClick; labels associated via
  Field primitives; `aria-label` on icon-only buttons.
