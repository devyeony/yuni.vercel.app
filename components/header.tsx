"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface HeaderProps {
  className?: string;
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

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

  return (
    <header ref={ref} className={className}>
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500  border-zinc-800 "
        }`}
      >
        <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div className="flex justify-between gap-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative duration-200 text-zinc-300 hover:text-zinc-100 after:content-[''] after:absolute after:left-[-4px] after:right-[-4px] after:bottom-[-6px] after:h-1 after:w-0 after:bg-green-300 after:rounded-full after:transition-all after:duration-300 hover:after:w-[calc(100%+8px)]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
