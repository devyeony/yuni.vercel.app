"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Link as I18nLink } from "@/i18n/routing";
import React, { useEffect, useRef, useState } from "react";
import { formatDateRange } from "@/utils/date-util";
import { ArrowLeft } from "lucide-react";

type Props = {
  project: {
    title: string;
    description: string;
    startDate?: string;
    endDate?: string;
    url?: string;
    demo?: string;
    presentation?: string;
    repository?: string;
    thumbnail?: string;
  };
  className?: string;
};

export const Header: React.FC<Props> = ({ project, className }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  const links: { label: string; href: string }[] = [];
  if (project.url) {
    links.push({
      label: "Website",
      href: project.url,
    });
  }
  if (project.repository) {
    links.push({
      label: "GitHub",
      href: `https://github.com/${project.repository}`,
    });
  }
  if (project.presentation) {
    links.push({
      label: "Presentation",
      href: project.presentation,
    });
  }
  if (project.demo) {
    links.push({
      label: "Demo",
      href: project.demo,
    });
  }

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const backgroundStyle = project.thumbnail
    ? {
        backgroundImage: `url(/images/projects/${project.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: "linear-gradient(to top left, black, #333, black)",
      };

  const locale = useLocale();

  return (
    <header
      ref={ref}
      className={`relative isolate overflow-hidden ${className ?? ""}`}
      style={backgroundStyle}
    >
      <div className="absolute w-10 h-10 sm:w-14 sm:h-14 top-6 left-6 z-10 rounded-full bg-black/80">
        <I18nLink
          href="/projects"
          className={`flex items-center justify-center w-full h-full rounded-full border-2 border-white p-2 duration-200 hover:scale-110 ${
            isIntersecting
              ? "text-zinc-400 hover:text-zinc-100"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <ArrowLeft size={40} strokeWidth={3} />
        </I18nLink>
      </div>
      <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mx-auto sm:max-w-xl text-4xl font-bold text-white sm:text-6xl font-display text-shadow-md leading-snug break-words">
              <span className="inline-block bg-black/70 border-8 px-4 pt-4 pb-6">
                {project.title}
              </span>
            </h1>
            <div className="text-xl font-bold mt-4">
              <span className="bg-white/70 px-2 py-1">
                {formatDateRange(project.startDate, project.endDate, locale)}
              </span>
            </div>
            <p className="mx-8 mt-4 px-2 py-2 text-xl leading-8 font-semibold bg-gray-800/90 text-zinc-300 break-words text-center">
              {project.description}
            </p>
          </div>

          {links.length > 0 && (
            <div className="mx-auto mt-5 max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-1 gap-y-3 gap-x-8 text-base font-semibold leading-7 sm:grid-cols-2 md:flex lg:gap-x-10">
                {links.map((link) => (
                  <div
                    key={link.label}
                    className="font-mono bg-black text-white border-2 px-2 hover:bg-purple-200 hover:text-black hover:border-black rounded-sm"
                  >
                    <Link target="_blank" href={link.href}>
                      {link.label} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
