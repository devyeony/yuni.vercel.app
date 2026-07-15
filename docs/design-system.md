# Design System

Deep-space editorial: near-black surfaces, one nebula accent, typography-led
layouts, film grain instead of flat gradients. The system is code-first —
tokens live in [`src/styles/tokens.css`](../src/styles/tokens.css) and every
rule below is enforced by the verification loop where possible. The living
showcase renders at [`/design`](https://yuni.vercel.app/en/design) from
production code.

## Tokens — three tiers (Tailwind v4 `@theme`)

| Tier | Examples | Rule |
|---|---|---|
| 1. Primitive | `--color-void-950`, `--color-starlight-100`, `--color-nebula-400`, `--color-flare-400` | Raw palette. Referenced only by the semantic tier and the `/design` showcase. |
| 2. Semantic | `--color-surface`, `--color-text-muted`, `--color-accent`, `--color-danger` | The only colors components may use. Light/dark themes flip here and only here. |
| 3. Component | none yet | Added only when a component genuinely needs one. |

Beyond color: fluid type scale (`--text-display/title/subtitle/lead`, all
`clamp()`-based), spacing rhythm (`--spacing-section`), radii, and motion
(`--duration-*`, `--ease-*`).

### Palette

- **void** — deep-space background scale (dark theme surfaces; light theme text)
- **starlight** — warm off-white scale (dark theme text; light theme surfaces)
- **nebula** — the single accent family (links, actions, focus)
- **flare** — danger/error only

All values are `oklch()`. Dark is the brand-primary theme and the default;
`.light` on `<html>` (set by next-themes) is the variant.

### Motion

Duration and easing are tokens; `prefers-reduced-motion` collapses every
duration token to `0.01ms` globally, so any transition built on tokens is
automatically reduced-motion-safe. Animate compositor-friendly properties
only (`transform`, `opacity`).

### Grain

A fixed SVG-turbulence overlay (`body::after`, deterministic seed) applies
film grain sitewide; `--grain-opacity` is themed.

## Components (`src/components/ui`)

Base UI (`@base-ui/react`) primitives + CVA variants; styling is 100% owned
here. Inventory: Button, Link, Card, Tag, Heading, Text, Section, Separator,
Input, Textarea, Field(+Label/Description/Error), Dialog, Tooltip,
ThemeToggle, LocaleSwitcher.

Rules:

- `components/ui` is domain-agnostic — it never imports from `features/` or
  knows about careers, projects, or posts.
- Semantic tokens only; a raw hex/oklch or primitive token in a component is
  a review violation.
- Server-first: wrappers carry no `"use client"` unless they use hooks
  (ThemeToggle, LocaleSwitcher); Base UI primitives are client components
  internally.
- Touch targets ≥ 44px on coarse pointers (`pointer-coarse:min-h-11`);
  hover is an enhancement, never the only affordance.
- Variants via CVA, class merging via `cn()` (`src/lib/cn.ts`).

## Anti-generic principles (banned / preferred)

- ❌ Purple-gradient heroes, glassmorphism cards, emoji bullets, 3-column
  feature grids, floating CTA/chat widgets
- ✅ Editorial typography (Fraunces display + Instrument Sans body +
  JetBrains Mono), restrained palette, film grain, custom motifs
  (constellation cat, Phase 2), micro-interactions only where meaningful

## Verification

- `/design` visual regression baselines (Playwright, per-platform) catch
  unintended visual drift in both themes.
- axe scans (`e2e/a11y.spec.ts`) enforce WCAG A/AA on every page, both themes.
- Component behavior (keyboard, focus, label association) is covered by
  Vitest + Testing Library.

Agent-facing procedures: [`agents/skills/design-system/SKILL.md`](../agents/skills/design-system/SKILL.md).
Decision record: [ADR-0001](adr/0001-vendor-neutral-agent-harness.md).
