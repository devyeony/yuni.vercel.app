import { useTranslations } from "next-intl";
import { ConstellationCat } from "@/components/ui/constellation-cat";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { AvailabilityBadge } from "./availability-badge";
import { Starfield } from "./starfield";

/**
 * The face of the brand: anchor positioning line over a starfield, with the
 * constellation cat as a quiet companion. Content staggers in with a CSS
 * reveal driven by duration tokens (reduced motion collapses it).
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden">
      <Starfield />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-section md:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <AvailabilityBadge className="reveal" />
            <Heading
              as="h1"
              variant="display"
              className="reveal mt-7 [--reveal-order:1]"
            >
              {t("headline")}
            </Heading>
            <Text
              variant="lead"
              className="reveal mt-6 text-text-muted [--reveal-order:2]"
            >
              {t("sub")}
            </Text>
            <p className="reveal mt-9 font-mono text-sm text-text-muted [--reveal-order:3]">
              {t("tagline")}
            </p>
            <div className="reveal mt-10 [--reveal-order:4]">
              <Link href="/about" variant="accent">
                {t("aboutCta")} →
              </Link>
            </div>
          </div>
          <ConstellationCat className="reveal w-40 shrink-0 self-end sm:w-52 lg:w-72 lg:self-auto [--reveal-order:3]" />
        </div>
      </div>
    </section>
  );
}
