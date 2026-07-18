import { useLocale, useTranslations } from "next-intl";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import { careersByRecency } from "@/features/about/lib/data";
import type { Locale } from "@/i18n/routing";
import { formatRange } from "@/lib/dates";

/**
 * Experience rendered straight from content/data/careers — adding an entry
 * is a data change, never a component change (§ content architecture).
 */
export function CareerTimeline() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;

  return (
    <ol className="flex flex-col gap-12">
      {careersByRecency().map((career) => (
        <li
          key={career._meta.path}
          className="grid grid-cols-1 gap-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
        >
          <Text
            as="span"
            variant="caption"
            className="font-mono tracking-wider uppercase"
          >
            {formatRange(
              locale,
              career.period.start,
              career.period.end,
              t("present"),
            )}
          </Text>
          <div>
            <p className="font-medium text-text">
              {career.role[locale]}
              <span className="text-text-muted">
                {" "}
                · {career.company[locale]}
              </span>
            </p>
            <Text variant="muted" className="mt-2 max-w-prose">
              {career.summary[locale]}
            </Text>
            {career.stack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {career.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
