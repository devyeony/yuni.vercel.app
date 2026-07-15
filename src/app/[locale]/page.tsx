import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function Home({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home");

  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="font-mono text-sm text-neutral-500">{t("title")}</h1>
    </main>
  );
}
