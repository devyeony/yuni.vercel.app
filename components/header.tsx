"use client";

import { Link as I18nLink } from "@/i18n/routing";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Home } from "lucide-react";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const t = useTranslations("Header");

  return (
    <header ref={ref} className={className}>
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500 border-zinc-800"
        }`}
      >
        <div className="container flex items-center justify-center p-6 mx-auto">
          <div className="flex gap-6">
            <I18nLink
              href="/"
              className="relative duration-200 text-zinc-300 hover:text-purple-300"
            >
              <Home size={25} />
            </I18nLink>
            <I18nLink
              href="/about"
              className="relative duration-200 text-zinc-300 hover:text-purple-300"
            >
              {t("about")}
            </I18nLink>
            <I18nLink
              href="/projects"
              className="relative duration-200 text-zinc-300 hover:text-purple-300"
            >
              {t("projects")}
            </I18nLink>
            <I18nLink
              href="/blog"
              className="relative duration-200 text-zinc-300 hover:text-purple-300"
            >
              {t("blog")}
            </I18nLink>
            <I18nLink
              href="/contact"
              className="relative duration-200 text-zinc-300 hover:text-purple-300"
            >
              {t("contact")}
            </I18nLink>
          </div>
        </div>
      </div>
    </header>
  );
};
