"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useContactInfo } from "@/hooks/useContactInfo";

export default function About() {
  const t = useTranslations("About");
  const contactInfo = useContactInfo();

  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 to-zinc-900/0">
      <section className="py-10 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative ">
          <h2 className="font-mono font-bold text-5xl text-zinc-100 mb-7 lg:mb-9 relative">
            {t("title")}
          </h2>
          <div className="grid lg:grid-cols-10 gap-4">
            <div className="img-box relative w-full lg:col-span-4 max-w-xs sm:max-w-sm h-[300px] sm:h-[400px] mx-auto">
              <Image
                src="/images/my-character.png"
                alt="My Character Icon"
                className="max-lg:mx-auto object-contain"
                fill
              />
            </div>
            <div className="lg:col-span-6 lg:pl-[30px] flex items-center">
              <div className="data w-full">
                <div className="text-2xl font-semibold italic bg-black text-zinc-100 mb-6">
                  {t("headline")}
                </div>
                <p className="text-2xl text-zinc-100 mb-6">
                  {t("description")}
                </p>
                <div className="text-xl text-zinc-300">
                  <p>
                    <span className="font-bold">{contactInfo.linkedin.name} : </span>
                    <Link href={contactInfo.linkedin.url} target="_blank" className="underline text-base">{contactInfo.linkedin.url}</Link>
                  </p>
                  <p>
                    <span className="font-bold">{contactInfo.github.name} : </span>
                    <Link href={contactInfo.github.url} target="_blank" className="underline text-base">{contactInfo.github.url}</Link>
                  </p>
                  <p>
                    <span className="font-bold">{contactInfo.blog.name} : </span>
                    <Link href={contactInfo.blog.url} target="_blank" className="underline text-base">{contactInfo.blog.url}</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <p className="font-mono text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
              Driven by a passion for seamless user experiences, we've
              meticulously curated pagedone to empower creators, designers, and
              developers alike. Our mission is to provide a comprehensive
              toolkit, enabling you to build intuitive, beautiful interfaces
              that resonate with users on every interaction. Driven by a passion
              for seamless user experiences, we've meticulously curated pagedone
              to empower creators, designers, and developers alike. Our mission
              is to provide a comprehensive toolkit, enabling you to build
              intuitive, beautiful interfaces that resonate with users on every
              interaction. Driven by a passion for seamless user experiences,
              we've meticulously curated pagedone to empower creators,
              designers, and developers alike. Our mission is to provide a
              comprehensive toolkit, enabling you to build intuitive, beautiful
              interfaces that resonate with users on every interaction. Driven
              by a passion for seamless user experiences, we've meticulously
              curated pagedone to empower creators, designers, and developers
              alike. Our mission is to provide a comprehensive toolkit, enabling
              you to build intuitive, beautiful interfaces that resonate with
              users on every interaction. Driven by a passion for seamless user
              experiences, we've meticulously curated pagedone to empower
              creators, designers, and developers alike. Our mission is to
              provide a comprehensive toolkit, enabling you to build intuitive,
              beautiful interfaces that resonate with users on every
              interaction. Driven by a passion for seamless user experiences,
              we've meticulously curated pagedone to empower creators,
              designers, and developers alike. Our mission is to provide a
              comprehensive toolkit, enabling you to build intuitive, beautiful
              interfaces that resonate with users on every interaction. Driven
              by a passion for seamless user experiences, we've meticulously
              curated pagedone to empower creators, designers, and developers
              alike. Our mission is to provide a comprehensive toolkit, enabling
              you to build intuitive, beautiful interfaces that resonate with
              users on every interaction. Driven by a passion for seamless user
              experiences, we've meticulously curated pagedone to empower
              creators, designers, and developers alike. Our mission is to
              provide a comprehensive toolkit, enabling you to build intuitive,
              beautiful interfaces that resonate with users on every
              interaction. Driven by a passion for seamless user experiences,
              we've meticulously curated pagedone to empower creators,
              designers, and developers alike. Our mission is to provide a
              comprehensive toolkit, enabling you to build intuitive, beautiful
              interfaces that resonate with users on every interaction.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
