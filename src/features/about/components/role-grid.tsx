import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { Locale } from "@/i18n/routing";
import { roles } from "../lib/profile";

export function RoleGrid() {
  const locale = useLocale() as Locale;
  const t = useTranslations("about");

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {roles.map((role) => (
        <Card key={role.key} className="flex flex-col gap-3 p-7">
          <Heading as="h3" variant="subtitle">
            {role.title[locale]}
          </Heading>
          <Text variant="muted">{role.summary[locale]}</Text>
          <Text variant="caption" className="mt-auto pt-3">
            <span className="font-mono tracking-wider text-accent uppercase">
              {t("proofLabel")}
            </span>{" "}
            — {role.proof[locale]}
          </Text>
        </Card>
      ))}
    </div>
  );
}
