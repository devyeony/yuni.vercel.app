"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Universe from "./components/universe";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
      <nav className="my-16">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>

      <Universe className="fixed inset-0 -z-10 min-h-screen" quantity={100} />

      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-1">
        <Image
          src="/images/astronaut-cat.png"
          alt="Astronaut Cat Icon"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 80px, (max-width: 1200px) 100px, 120px"
          priority
        />
      </div>

      <h1 className="py-3.5 px-0.5 z-10 text-2xl text-white duration-1000 cursor-default text-edge-outline font-mono sm:text-4xl md:text-5xl whitespace-nowrap font-bold">
        Yeonhee Kim
        <span className="cursor-blink">|</span>
      </h1>

      <div className="my-16 text-center">
        <h2 className="text-sm text-zinc-500 ">
          I'm building{" "}
          <Link
            target="_blank"
            href="https://unkey.dev"
            className="underline duration-500 hover:text-zinc-300"
          >
            unkey.dev
          </Link>{" "}
          to solve API authentication and authorization for developers.
        </h2>
      </div>

      <style jsx>{`
        .cursor-blink {
          display: inline-block;
          width: 1px;
          height: 1.2em; /* Adjust height based on font size */
          background-color: white;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
