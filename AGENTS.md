# Agent Instructions

Single source of truth for AI coding agents working on this repository.
Vendor-specific files (`CLAUDE.md`, `.claude/`, `.cursor/`, `GEMINI.md`) are generated
adapters — never edit or commit them; they are gitignored and point back here.

## Project

Personal portfolio site of Yeonhee (yuni) Kim — the site itself is a portfolio piece:
architecture, design system, and process are all on display.

- Stack: Next.js 16 (App Router, RSC), TypeScript strict, Tailwind CSS v4 (`@theme` tokens),
  `@base-ui/react` + CVA, next-intl v4 (`en` default, `ko`), Biome, pnpm, Vercel.
- If present, `PLAN.md` is the local working plan (gitignored). Everything that
  must survive lives in English in `README.md`, `docs/`, and this file.

## Rules

- **Language**: all repository artifacts — code, comments, commit messages, PRs, docs — are
  written in English.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`).
- **Security & performance by default**: validate external input at boundaries (Zod),
  rate-limit API routes, never expose secrets to the client, prefer server components —
  adding `"use client"` is a reviewable decision.
- **Device-adaptive responsive**: optimize for each device class (phone, tablet, desktop,
  wide) — not one layout stretched. Mobile-first as technique; layouts genuinely recompose
  per breakpoint; adapt to input modality (`pointer`/`hover` media queries, touch targets
  ≥ 44px, no hover-only interactions); fluid type over per-viewport hardcoding; container
  queries where component-level adaptation fits. Verify at 360/768/1280/1920 viewports.
- Skills with detailed procedures live in `agents/skills/*/SKILL.md` (created in Phase 0/1):
  design-system, code-review, i18n, verify, content.

## Verification loop

After any change, verify your own work before finishing (full rules: `agents/harness.md`):

- `pnpm check` — static: Biome + tsc + i18n key symmetry — seconds (knip joins with CI)
- `pnpm test` — unit/component tests (Vitest)
- `pnpm verify` — build + Playwright smoke at 360/768/1280 viewports
  (axe a11y and visual regression on /design join in Phase 1)

Vendor adapters (`CLAUDE.md`, `.claude/`, `.cursor/`, `GEMINI.md`) are regenerated
with `pnpm setup:agents`.
