"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { useSafeRawHtml } from "@/utils/safe-translation";
import { SocialLink } from "@/components/social-links";

export default function Home() {
  const t = useTranslations("Home");

  const rawHtml = t.raw("quote.source");

  return (
    <div>
      <div className="relative flex justify-center items-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto">
        <Image
          src="/images/astronaut-cat.png"
          alt="Astronaut Cat Icon"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 80px, (max-width: 1200px) 100px, 120px"
          priority
        />
      </div>

      <h1 className="py-2 px-0.5 z-10 text-3xl text-zinc-100 duration-1000 cursor-default text-edge-outline font-mono md:text-4xl whitespace-nowrap font-bold text-center">
        {t("title")}
        <span className="cursor-blink">|</span>
      </h1>

      <div className="text-center mt-0">
        <p
          className="text-xl text-zinc-400 font-mono sm:text-xl md:text-lg"
          dangerouslySetInnerHTML={{
            __html: useSafeRawHtml("Home", "description.line1"),
          }}
        />
        <p
          className="text-md text-zinc-400 font-mono sm:text-lg md:text-md"
          dangerouslySetInnerHTML={{
            __html: useSafeRawHtml("Home", "description.line2"),
          }}
        />
      </div>

      <div className="my-8 text-center bg-zinc-800 p-2 rounded">
        <p className="text-center text-sm text-zinc-500 font-mono tracking-wide">
          {t("quote.text")}
          <br />
          <span
            className="text-zinc-500"
            dangerouslySetInnerHTML={{
              __html: useSafeRawHtml("Home", "quote.source"),
            }}
          />
        </p>
      </div>

      <SocialLink />
    </div>
  );
}
