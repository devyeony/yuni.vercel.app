"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSafeRawHtml } from "@/utils/safe-translation";
import { useContactInfo } from "@/hooks/useContactInfo";

export default function About() {
  const t = useTranslations("About");
  const contactInfo = useContactInfo();

  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 to-zinc-900/0">
      <section className="py-10 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative ">
          <h2 className="font-mono font-bold text-5xl text-zinc-100 mb-7 lg:mb-9 relative">
            {" "}
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
                <div className="text-2xl text-zinc-100 mb-6" dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "headline"),
                }} />
                <p className="text-2xl text-zinc-100 mb-6" dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "description"),
                }} />
                <div className="text-xl text-zinc-300">
                  <Link
                    href={contactInfo.linkedin.url}
                    target="_blank"
                    className="underline underline-offset-4 text-purple-300 hover:text-purple-500 transition-colors duration-200"
                  >
                    {contactInfo.linkedin.name}
                  </Link>
                  <span>{" | "}</span>
                  <Link
                    href={contactInfo.github.url}
                    target="_blank"
                    className="underline underline-offset-4 text-purple-300 hover:text-purple-500 transition-colors duration-200"
                  >
                    {contactInfo.github.name}
                  </Link>
                  <span>{" | "}</span>
                  <Link
                    href={contactInfo.blog.url}
                    target="_blank"
                    className="underline underline-offset-4 text-purple-300 hover:text-purple-500 transition-colors duration-200"
                  >
                    {contactInfo.blog.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center rounded bg-zinc-100/80 text-xl leading-8 text-gray-800 mt-8 px-10 py-8 mx-auto">
            <ul className="list-disc list-inside space-y-5">
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "body.line1"),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "body.line2"),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "body.line3"),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "body.line4"),
                }}
              />
            </ul>
          </div>

          <div className="flex flex-col items-center rounded bg-purple-100/80 text-xl leading-8 text-gray-800 px-10 py-6 mt-12 mx-auto">
            <h2 className="font-mono font-bold text-2xl underline">
              {t("publications.title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <span
                  dangerouslySetInnerHTML={{
                    __html: useSafeRawHtml(
                      "About",
                      "publications.line1.content"
                    ),
                  }}
                />
                {" 🔗"}
                <Link
                  href={t("publications.line1.link.url")}
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700 ml-1"
                >
                  {t("publications.line1.link.text")}
                </Link>
              </li>
              <li>
                <span
                  dangerouslySetInnerHTML={{
                    __html: useSafeRawHtml(
                      "About",
                      "publications.line2.content"
                    ),
                  }}
                />
                {" 🔗"}
                <Link
                  href={t("publications.line2.link.url")}
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700 ml-1"
                >
                  {t("publications.line2.link.text")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center rounded bg-purple-100/80 text-xl leading-8 text-gray-800 px-10 py-6 mt-6 mx-auto">
            <h2 className="font-mono font-bold text-2xl underline">
              {t("presentations.title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <span
                  dangerouslySetInnerHTML={{
                    __html: useSafeRawHtml(
                      "About",
                      "presentations.line1.content"
                    ),
                  }}
                />
                {" 🔗"}
                <Link
                  href={t("presentations.line1.link.url")}
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700 ml-1"
                >
                  {t("presentations.line1.link.text")}
                </Link>
              </li>
              <li>
                <span
                  dangerouslySetInnerHTML={{
                    __html: useSafeRawHtml(
                      "About",
                      "presentations.line2.content"
                    ),
                  }}
                />
                {" 🔗"} 
                <Link
                  href={t("presentations.line2.link.url")}
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700 ml-1"
                >
                  {t("presentations.line2.link.text")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center rounded bg-purple-100/80 text-xl leading-8 text-gray-800 px-10 py-6 mt-6 mx-auto">
            <h2 className="font-mono font-bold text-2xl underline">
              {t("community.title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "community.line1"),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "community.line2"),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "community.line3"),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: useSafeRawHtml("About", "community.line4"),
                }}
              />
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
