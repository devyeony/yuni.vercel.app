import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { activitiesOfKind, activityKinds } from "@/features/about/lib/data";
import type { Locale } from "@/i18n/routing";
import { formatYearMonth } from "@/lib/dates";

/**
 * Talks, publications, open source, and community — grouped by kind and
 * rendered straight from content/data/activities.
 */
export function ActivityList() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
      {activityKinds.map((kind) => {
        const entries = activitiesOfKind(kind);
        if (entries.length === 0) return null;
        return (
          <section key={kind} aria-label={t(`kind.${kind}`)}>
            <h3 className="font-mono text-xs tracking-wider text-accent uppercase">
              {t(`kind.${kind}`)}
            </h3>
            <ul className="mt-4 flex flex-col gap-6">
              {entries.map((activity) => {
                const date = activity.endDate
                  ? `${formatYearMonth(locale, activity.date)}–${formatYearMonth(locale, activity.endDate)}`
                  : formatYearMonth(locale, activity.date);
                return (
                  <li key={activity._meta.path}>
                    <p className="font-medium text-text">
                      {activity.link ? (
                        <Link href={activity.link} variant="default">
                          {activity.title[locale]}
                        </Link>
                      ) : (
                        activity.title[locale]
                      )}
                    </p>
                    <Text variant="caption" className="mt-1">
                      {activity.org ? `${activity.org[locale]} · ` : ""}
                      {date}
                    </Text>
                    {activity.note && (
                      <Text variant="muted" className="mt-1 text-sm">
                        {activity.note[locale]}
                      </Text>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
