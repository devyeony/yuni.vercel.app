# Harness — the agent work loop

Rules for how any coding agent (Claude, Codex, Cursor, Gemini CLI, …) works in this
repository. `AGENTS.md` is the entry point; this file defines the loop it references.

## The loop

1. **Work** — smallest coherent change toward the current task.
2. **Check** — `pnpm check` (Biome + tsc + i18n key symmetry). Runs in seconds; run it
   after every change, not just at the end.
3. **Test** — `pnpm test` (Vitest). Add or update tests when behavior changes.
4. **Verify** — `pnpm verify` (production build + Playwright smoke at 360/768/1280
   viewports). Run before declaring any task done.

Never finish a task with a red loop. "It compiles" is not done; the loop is done.

## On failure

- Fix the cause, then re-run the failing command. Do not retry blindly.
- Never weaken the harness to get to green: no disabling lint rules, no `@ts-ignore` /
  `biome-ignore` without a stated reason, no deleting tests, no loosening tsconfig.
- If a rule genuinely needs changing, change it in its own commit with the rationale
  in the commit message (or an ADR if it is an architecture-level decision).

## Skills

Detailed procedures live in `agents/skills/<name>/SKILL.md` (portable markdown, vendor
neutral). Agents with a skill mechanism load them natively via generated adapters
(`pnpm setup:agents`); any other agent reads them as plain documents when the task
matches the skill's frontmatter description.

## Boundaries

- Vendor adapter files (`CLAUDE.md`, `.claude/`, `.cursor/`, `GEMINI.md`) are generated
  and gitignored — edit `AGENTS.md` / `agents/` instead, then run `pnpm setup:agents`.
- `PLAN.md` is a local working plan, never committed.
- Durable knowledge goes to `README.md`, `docs/` (ADRs), or this directory — in English.
