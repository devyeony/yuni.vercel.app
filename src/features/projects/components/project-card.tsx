import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import type { Project } from "@/features/projects/lib/collection";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatRange } from "@/lib/dates";

const STACK_PREVIEW = 5;

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const overflow = project.stack.length - STACK_PREVIEW;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full rounded-md"
    >
      <Card className="flex h-full flex-col gap-4 transition-colors duration-(--duration-fast) ease-out-soft group-hover:border-accent/40">
        <div className="flex flex-col gap-2">
          <Heading as="h2" variant="subtitle">
            {project.title}
          </Heading>
          <Text variant="caption">
            {formatRange(
              locale,
              project.period.start,
              project.period.end,
              t("present"),
            )}
          </Text>
        </div>
        <Text variant="muted" className="flex-1">
          {project.summary}
        </Text>
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, STACK_PREVIEW).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
          {overflow > 0 && <Tag variant="accent">+{overflow}</Tag>}
        </div>
      </Card>
    </Link>
  );
}
