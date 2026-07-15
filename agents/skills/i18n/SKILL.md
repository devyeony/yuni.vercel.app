---
name: i18n
description: How to add or change locales, messages, and localized pages (next-intl v4). Use when touching messages/*.json, adding routes, or handling locale-aware links.
---

# i18n skill

Setup: next-intl v4, `[locale]` routing, `en` (default) + `ko`, config in
`src/i18n/` (routing/navigation/request), proxy in `src/proxy.ts`.

## Adding UI strings

1. Add the key to **both** `messages/en.json` and `messages/ko.json` —
   `pnpm check` fails on key asymmetry (scripts/check-i18n.mjs).
2. `messages/*.json` is for **UI microcopy only** (buttons, nav, form
   labels). Career/project/blog content never goes here — that is a
   documented anti-pattern from the legacy site (content belongs in
   `content/`, Phase 3+).
3. Server components: `useTranslations("ns")` (works in RSC) or
   `await getTranslations({ locale, namespace })` in async metadata.
4. Client components: `useTranslations` under `NextIntlClientProvider`
   (already wired in the locale layout).

## Adding a page

1. Create under `src/app/[locale]/…`.
2. First lines of the page component:
   `const { locale } = use(params); setRequestLocale(locale);`
   (async variant: `await params`). Missing `setRequestLocale` breaks SSG.
3. Add `generateMetadata` with `getTranslations({ locale, namespace })`.
4. Add the page to the e2e overflow check in `e2e/smoke.spec.ts` and to
   `e2e/a11y.spec.ts` page lists.

## Links and navigation

- Always import `Link`/`usePathname`/`useRouter` from `@/i18n/navigation`
  (locale-aware), never from `next/link`/`next/navigation` directly.
  The ui `Link` component wraps this and handles external URLs.
- Locale switching: `<Link href={pathname} locale="ko">` (see
  `locale-switcher.tsx`).

## Korean specifics

- Korean glyphs render via Pretendard Variable dynamic subset — loaded only
  when Korean text renders; no font work needed when adding ko strings.
- Keep ko copy natural, not literal translation; keep terminology consistent
  (existing patterns: 다크/라이트 테마, 컴포넌트, 토큰).

## Verify

`pnpm check` (key symmetry) then `pnpm verify` — smoke tests assert both
locales render with correct `lang` attributes.
