# Build-time fonts

Fonts embedded into Open Graph images by satori (`src/features/og`). They are
read from disk at image-generation time and never ship to the client.

- `Fraunces-opsz144-SemiBold.ttf` — static instance (opsz 144, wght 600) of
  [Fraunces](https://github.com/undercasetype/Fraunces), served by Google
  Fonts. Licensed under the SIL Open Font License 1.1. Satori cannot consume
  variable fonts, so a pinned instance is committed here; the site itself
  keeps loading the variable font via `next/font`.
- Korean glyphs come from Pretendard static weights resolved from
  `node_modules/pretendard` (already a runtime dependency) — not duplicated
  here.
