"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("About");

  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 to-zinc-900/0">
      <section className="py-14 lg:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
            <div className="img-box relative w-full h-[500px]">
              <Image
                src="/images/my-character.png"
                alt="My Character Icon"
                className="max-lg:mx-auto object-contain"
                fill
              />
            </div>
            <div className="lg:pl-[10px] flex items-center">
              <div className="data w-full">
                <h2 className="font-mono font-bold text-4xl lg:text-5xl text-zinc-100 mb-9 max-lg:text-center relative">
                  {t("title")}{" "}
                </h2>
                <p className="font-mono text-lg leading-8 text-zinc-400 max-lg:text-center max-w-2xl mx-auto">
                  Driven by a passion for seamless user experiences, we've
                  meticulously curated pagedone to empower creators, designers,
                  and developers alike. Our mission is to provide a
                  comprehensive toolkit, enabling you to build intuitive,
                  beautiful interfaces that resonate with users on every
                  interaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
