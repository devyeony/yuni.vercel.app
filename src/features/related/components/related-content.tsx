import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { RelatedItem } from "@/features/related/lib/related";
import { Link } from "@/i18n/navigation";

/*
 * "Similar work" block for detail pages. Purely presentational: items are
 * pre-computed at build time (features/related/lib), so this renders static
 * links — the cosine score is shown on purpose, as visible proof that the
 * recommendation comes from the embedding space.
 */
export function RelatedContent({ items }: { items: RelatedItem[] }) {
  const t = useTranslations("related");

  if (items.length === 0) return null;

  return (
    <div>
      <Heading as="h2" variant="title">
        {t("title")}
      </Heading>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.url}>
            <Link href={item.url} className="group block h-full rounded-md">
              <Card className="flex h-full flex-col gap-3 transition-colors duration-(--duration-fast) ease-out-soft group-hover:border-accent/40">
                <Text as="span" variant="caption" className="font-mono">
                  {t(`kind.${item.kind}`)} ·{" "}
                  {t("similarity", { score: item.score.toFixed(2) })}
                </Text>
                <Heading as="h3" variant="subtitle">
                  {item.title}
                </Heading>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
