import type { Locale } from "@/i18n/routing";

/** "2021-07" → "Jul 2021" (en) / "2021년 7월" (ko); a bare "2023" stays as-is. */
export function formatYearMonth(locale: Locale, value: string): string {
  if (!value.includes("-")) return value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`));
}

/** "2026-07-18" → "Jul 18, 2026" (en) / "2026년 7월 18일" (ko). */
export function formatDate(locale: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** Range with an open end rendered as `present` (localized by the caller). */
export function formatRange(
  locale: Locale,
  start: string,
  end: string | undefined,
  present: string,
): string {
  return `${formatYearMonth(locale, start)} – ${end ? formatYearMonth(locale, end) : present}`;
}
