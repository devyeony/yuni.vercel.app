# yuni — personal site

Personal site of **Yeonhee (yuni) Kim** — and a portfolio piece in itself: the
architecture, design system, and AI-assisted process are all on display.

> Status: under construction (Phase 0 — foundation). This README is a draft that
> grows into a full case study at launch.

*Building software with a love for cats and the cosmos.*

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 — design tokens as CSS-first `@theme` |
| UI primitives | Base UI (headless) + CVA variants |
| i18n | next-intl v4 — `en` (default) / `ko` |
| Typography | Fraunces · Instrument Sans · JetBrains Mono, Pretendard for Korean |
| Quality | Biome, Vitest, Playwright, knip, commitlint, lefthook |
| Deploy | Vercel |

## Architecture in one breath

Server components by default; client code only in leaves. Dependencies flow one
way: `app → features → components/ui → tokens`. Design tokens live in three
tiers (primitive → semantic → component) in [`src/styles/tokens.css`](src/styles/tokens.css);
components reference semantic tokens only. Decisions worth recording land in
[`docs/adr/`](docs/adr/).

## AI-assisted, vendor-neutral

This repo is built with coding agents — any of them. Instructions live in
vendor-neutral files ([`AGENTS.md`](AGENTS.md), [`agents/`](agents/)); local
adapters for specific tools are generated with `pnpm setup:agents` and never
committed. Rules are enforced by machines, not prompts — see
[ADR-0001](docs/adr/0001-vendor-neutral-agent-harness.md).

## Development

```sh
pnpm install          # also installs git hooks (lefthook)
pnpm dev              # start dev server

pnpm check            # static: Biome + tsc + i18n key symmetry + knip
pnpm test             # unit/component tests (Vitest)
pnpm verify           # production build + Playwright smoke (360/768/1280 viewports)

pnpm setup:agents     # regenerate local AI-agent adapter files
```

CI runs the exact same loop, plus a client-JS size budget, gitleaks, and CodeQL.

## License

Code is available to read as a portfolio; content (text, images, case studies)
is © Yeonhee Kim. Formal license lands before launch.
