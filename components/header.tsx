"use client";

import { Link as I18nLink } from "@/i18n/routing";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Home, Menu, X } from "lucide-react";
import LocaleSwitcher from "@/components/locale-switcher";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Header.menu");

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const linkClasses = (href: string) =>
    `relative duration-200 hover:text-purple-300 ${
      pathname === href ? "text-purple-300" : "text-zinc-300"
    }`;

  return (
    <header ref={ref} className={className}>
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500 border-zinc-800"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between p-4 max-w-screen-lg">
          <div className="flex-1 sm:hidden" />

          {/* PC */}
          <nav className="hidden sm:flex gap-6 items-center mx-auto">
            <I18nLink href="/" className={linkClasses("/")}>
              <Home size={25} />
            </I18nLink>
            <I18nLink href="/about" className={linkClasses("/about")}>
              {t("about")}
            </I18nLink>
            <I18nLink href="/projects" className={linkClasses("/projects")}>
              {t("projects")}
            </I18nLink>
            <I18nLink href="/blog" className={linkClasses("/blog")}>
              {t("blog")}
            </I18nLink>
            <I18nLink href="/contact" className={linkClasses("/contact")}>
              {t("contact")}
            </I18nLink>
            <LocaleSwitcher />
          </nav>

          {/* Hamburger button */}
          <button
            className="sm:hidden flex-1 flex justify-end items-center text-zinc-300 p-4"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile */}
        {menuOpen && (
          <div className="sm:hidden bg-zinc-900 border-t border-zinc-800">
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <I18nLink href="/" className={linkClasses("/")}>
                <Home size={20} />
              </I18nLink>
              <I18nLink href="/about" className={linkClasses("/about")}>
                {t("about")}
              </I18nLink>
              <I18nLink href="/projects" className={linkClasses("/projects")}>
                {t("projects")}
              </I18nLink>
              <I18nLink href="/blog" className={linkClasses("/blog")}>
                {t("blog")}
              </I18nLink>
              <I18nLink href="/contact" className={linkClasses("/contact")}>
                {t("contact")}
              </I18nLink>
              <LocaleSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
