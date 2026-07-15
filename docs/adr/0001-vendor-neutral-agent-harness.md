# ADR-0001: Vendor-neutral agent harness with generated adapters

- Status: accepted
- Date: 2026-07-15

## Context

This site is built AI-assisted, and the collaboration setup is itself part of the
portfolio. Coding agents each read their own instruction files (`CLAUDE.md`,
`.cursor/rules/`, `GEMINI.md`, …). Committing vendor-specific files couples the
repository to one tool, duplicates content, and lets copies drift.

## Decision

Keep a single vendor-neutral source of truth and generate everything else:

- `AGENTS.md` — instructions entry point (the emerging cross-agent convention)
- `agents/harness.md` — the work loop: work → `pnpm check` → `pnpm test` → `pnpm verify`
- `agents/skills/*/SKILL.md` — portable procedures in plain markdown
- `scripts/setup-agents.mjs` — regenerates local, gitignored adapters
  (`CLAUDE.md`/`GEMINI.md` symlinks, `.cursor/rules/`, `.claude/skills/` links)

Rules are enforced by machines, not prompts: Biome/tsc/knip and the i18n symmetry
check (`pnpm check`), Vitest (`pnpm test`), build + Playwright smoke (`pnpm verify`),
mirrored 1:1 in CI. An agent forgetting an instruction is caught by the loop.

## Consequences

- Any coding agent can work here with identical instructions; switching tools is
  a non-event. The repo carries zero committed vendor footprint.
- New machines run `pnpm setup:agents` once (adapters are gitignored).
- Adapter generation must track vendor conventions as they evolve — accepted cost,
  isolated in one script.
