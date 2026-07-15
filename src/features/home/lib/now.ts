import type { Locale } from "@/i18n/routing";

/**
 * Current status — the "living résumé" signal rendered in the hero.
 * Career-state copy lives in typed data modules, never in messages/*.json
 * (content architecture rule). Phase 3 migrates this into content/data
 * with schema validation; the shape (locale-keyed strings, no UI
 * knowledge) is already the final one.
 */
export const now = {
  availability: {
    open: true,
    label: {
      en: "Open to opportunities",
      ko: "새로운 기회를 찾고 있어요",
    } satisfies Record<Locale, string>,
  },
} as const;
