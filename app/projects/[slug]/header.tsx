"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { formatDateRange } from "@/utils/date-utils";
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
};

export const Header: React.FC<Props> = ({ project }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  const links: { label: string; href: string }[] = [];
  if (project.repository) {
    links.push({
      label: "GitHub",
      href: `https://github.com/${project.repository}`,
    });
  }
  if (project.url) {
    links.push({
      label: "Website",
      href: project.url,
    });
  }
  if (project.demo) {
    links.push({
      label: "Demo",
      href: project.demo,
    });
  }
  if (project.presentation) {
    links.push({
      label: "Presentation",
      href: project.presentation,
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
        backgroundImage: `url(/images/projects/thumbnail/${project.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: "linear-gradient(to top left, black, #333, black)",
      };

  return (
    <header
      ref={ref}
      className="relative isolate overflow-hidden"
      style={backgroundStyle}
    >
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/projects"
          className={`flex items-center justify-center rounded-full border-2 border-white p-2 duration-200 hover:scale-110 ${
            isIntersecting
              ? "text-zinc-400 hover:text-zinc-100"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <ArrowLeft size={40} strokeWidth={3} />
        </Link>
      </div>
      <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-3xl font-bold text-white sm:text-6xl font-display text-shadow-md">
              <span className="bg-black/70 border-8 px-4 py-2">
                {project.title}
              </span>
            </h1>
            <div className="text-xl font-bold mt-10">
              <span className="bg-white/70 px-1">
                {formatDateRange(project.startDate, project.endDate)}
              </span>
            </div>
            <p className="mt-4 text-lg leading-8 text-zinc-300 break-words text-center px-6">
              <span
                style={{
                  textShadow: `2px 2px 0 rgba(0, 0, 0, 0.7), -1px -1px 0 rgba(0, 0, 0, 0.7), 1px -1px 0 rgba(0, 0, 0, 0.7), -1px 1px 0 rgba(0, 0, 0, 0.7), 1px 1px 0 rgba(0, 0, 0, 0.7)`,
                }}
              >
                {project.description}
              </span>
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 sm:grid-cols-2 md:flex lg:gap-x-10">
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
        </div>
      </div>
    </header>
  );
};
