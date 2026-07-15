## What

<!-- One or two sentences: what changes and why. Link the issue if one exists. -->

## Self-review checklist

- [ ] `pnpm check`, `pnpm test`, `pnpm verify` are green locally
- [ ] Components reference semantic tokens only (no raw colors/px values)
- [ ] No new `"use client"` without a stated reason
- [ ] Device-adaptive: checked at 360 / 768 / 1280 (and wide if layout changes)
- [ ] i18n: en/ko messages stay symmetric; career content is not in `messages/`
- [ ] Security: external input validated at the boundary; no secrets in client code
- [ ] Scope: no non-goals introduced (Storybook, CMS, state library, …)
