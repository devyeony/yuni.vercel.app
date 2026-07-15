---
name: verify
description: How to run and interpret this repo's verification loop (check/test/verify), including visual-baseline regeneration. Use before declaring any task done or when a loop command fails.
---

# Verify skill

The loop (from `agents/harness.md`): work → check → test → verify. Never
finish with a red loop.

## Commands

| Command | What runs | When |
|---|---|---|
| `pnpm check` | Biome + tsc + i18n key symmetry + knip | after every change (seconds) |
| `pnpm test` | Vitest (jsdom + Testing Library component tests) | when behavior changes |
| `pnpm verify` | production build + Playwright (smoke, a11y/axe, visual regression) at 360/768/1280 | before declaring done |

Playwright runs three projects — phone (360), tablet (768), desktop (1280),
all Chromium — against `next start` on port 3100.

## Visual regression (`e2e/design-visual.spec.ts`)

- `/design` full-page screenshots, dark + light, per viewport. Baselines are
  **per-platform** (`*-darwin.png`, `*-linux.png`) and committed next to the
  spec in `e2e/design-visual.spec.ts-snapshots/`.
- **Intended visual change** → regenerate and commit:
  `pnpm exec playwright test --update-snapshots`
- **First run on a new platform**: the test writes baselines and fails once;
  re-run to confirm green, then commit the PNGs. In CI, missing platform
  baselines skip (annotated) instead of failing.
- Linux (CI) baselines are generated inside the Playwright Docker image.
  Do NOT reuse host `node_modules` in the container — native binaries
  (SWC, oxide) are platform-specific; copy the repo and install fresh.
  Use `--platform linux/amd64` to match GitHub Actions runners:

  ```sh
  docker run --rm --platform linux/amd64 -v "$PWD:/host" \
    mcr.microsoft.com/playwright:v<version>-jammy bash -c '
    set -e
    corepack enable >/dev/null 2>&1
    mkdir -p /tmp/app
    tar -C /host --exclude=node_modules --exclude=.next --exclude=test-results \
      --exclude=.git --exclude=archive -cf - . | tar -C /tmp/app -xf -
    cd /tmp/app
    pnpm install --frozen-lockfile --ignore-scripts >/dev/null 2>&1
    pnpm build >/dev/null 2>&1
    npx playwright test design-visual --update-snapshots
    cp -f e2e/design-visual.spec.ts-snapshots/*-linux.png \
      /host/e2e/design-visual.spec.ts-snapshots/
  '
  ```

  (match `<version>` to the installed `@playwright/test`; `--ignore-scripts`
  is required because `prepare` runs lefthook, which needs `.git`).

## Common failures

- **knip: unused export** — remove the export or the file; don't add ignores
  casually. If the export is intentionally public-to-be (upcoming phase),
  prefer wiring it now or deleting until needed.
- **i18n symmetry** — add the missing key to the other locale file.
- **axe violation** — fix the component, not the test; contrast issues
  usually mean the wrong semantic token, not a new color.
- **size-limit (CI)** — client JS over 250 kB brotli: look for accidental
  client components or heavy client libraries first.
- **Visual diff** — inspect `test-results/**/design-*-diff.png`; if the
  change is intended, update snapshots (above); if not, fix the regression.

Never weaken the harness to get green (no rule-disabling, no test deletion,
no threshold bumps without rationale in the commit).
