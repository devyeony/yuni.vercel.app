"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export const Header = () => {
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

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500  border-zinc-800 "
        }`}
      >
        <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div className="flex justify-between gap-8">
		  <Link
              href="/"
              className="relative duration-200 text-zinc-300 hover:text-zinc-100 after:content-[''] after:absolute after:left-[-4px] after:right-[-4px] after:bottom-[-6px] after:h-1 after:w-0 after:bg-green-300 after:rounded-full after:transition-all after:duration-300 hover:after:w-[calc(100%+8px)]"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="relative duration-200 text-zinc-300 hover:text-zinc-100 after:content-[''] after:absolute after:left-[-4px] after:right-[-4px] after:bottom-[-6px] after:h-1 after:w-0 after:bg-green-300 after:rounded-full after:transition-all after:duration-300 hover:after:w-[calc(100%+8px)]"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="relative duration-200 text-zinc-300 hover:text-zinc-100 after:content-[''] after:absolute after:left-[-4px] after:right-[-4px] after:bottom-[-6px] after:h-1 after:w-0 after:bg-green-300 after:rounded-full after:transition-all after:duration-300 hover:after:w-[calc(100%+8px)]"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
