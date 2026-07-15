---
name: design-system
description: Rules and exact patterns for styling and building UI in this repo — token tiers, CVA variants, Base UI usage, Tailwind v4 gotchas. Use whenever writing or changing components, styles, or tokens.
---

# Design system skill

Full rationale: `docs/design-system.md`. This file is the do-this-exactly version.

## Exact package names (training-data traps)

- Base UI is **`@base-ui/react`** (currently 1.6.x). The old name
  `@base-ui-components/react` is stale training data — never install or
  import it.
- Import per-component subpaths: `import { Dialog } from "@base-ui/react/dialog"`.
- Variants: `class-variance-authority` (CVA). Class merging: `cn()` from
  `@/lib/cn` (clsx + tailwind-merge).

## Token rules

1. Components use **semantic tokens only**: `bg-surface`, `text-text-muted`,
   `border-border`, `bg-accent`, `text-danger`… Never primitives
   (`bg-void-900`), never raw hex/oklch. The only exception is the `/design`
   showcase documenting the primitive palette.
2. New color = add primitive in `src/styles/tokens.css` `@theme`, map it in
   BOTH `:root` (dark) and `:root.light`, expose via `@theme inline`.
3. Motion always via tokens. Tailwind v4 gotchas verified in this repo:
   - `--ease-*` tokens generate utilities (`ease-out-soft` works).
   - `--duration-*` tokens do NOT generate utilities — write
     `duration-(--duration-fast)`.
   - `--text-*`, `--spacing-*`, `--radius-*` generate utilities
     (`text-display`, `py-section`, `rounded-md`).
4. Never hardcode font sizes per viewport — use the fluid scale tokens.
5. Reduced motion is handled at the token level (durations collapse to
   0.01ms). Do not add per-component `motion-reduce:` handling unless the
   animation bypasses duration tokens (then fix it to use tokens).

## Component pattern

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const thingVariants = cva("base classes", {
  variants: { variant: { a: "…", b: "…" } },
  defaultVariants: { variant: "a" },
});

export function Thing({ className, variant, ...props }: ThingProps) {
  return <div className={cn(thingVariants({ variant }), className)} {...props} />;
}
```

- `components/ui` is domain-agnostic; dependency direction is
  `app → features → components/ui → tokens`, never backwards.
- No `"use client"` unless the wrapper itself uses hooks. Base UI primitives
  are already client components internally.
- Base UI composition (trigger-as-button): use the `render` prop —
  `<DialogTrigger render={<Button>Open</Button>} />`.
- Touch targets: interactive elements get `pointer-coarse:min-h-11`
  (≥ 44px). Hover-only interactions are banned; hover is an enhancement.
- Focus is handled globally (`:focus-visible` in globals.css) — don't add
  per-component focus rings unless the global outline is unusable there.

## Theming

- next-themes, class-based (`.light`/`.dark` on `<html>`), dark default.
- Components never branch on theme — semantic tokens flip in tokens.css.
- Anything reading theme client-side must handle the unmounted state
  (see `theme-toggle.tsx`).

## Banned (anti-generic list)

Purple-gradient heroes, glassmorphism, emoji bullets, 3-column feature grids,
floating CTA/chat widgets, backdrop-blur cards, decorative shadows. When in
doubt: more whitespace and better type, not more effects.

## After changes

`pnpm check && pnpm test && pnpm verify`. Visual baselines for `/design`
will flag intended redesigns — regenerate with
`pnpm exec playwright test --update-snapshots` and commit the new PNGs.
