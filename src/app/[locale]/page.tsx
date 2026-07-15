import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Hero } from "@/features/home/components/hero";

export default function Home({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <Hero />
    </main>
  );
}
