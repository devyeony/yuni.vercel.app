"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Github, LinkedinIcon, PenLine } from "lucide-react";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <div>
      <div className="relative flex justify-center items-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-1 mx-auto">
        <Image
          src="/images/astronaut-cat.png"
          alt="Astronaut Cat Icon"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 80px, (max-width: 1200px) 100px, 120px"
          priority
        />
      </div>

      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-white duration-1000 cursor-default text-edge-outline font-mono md:text-5xl whitespace-nowrap font-bold text-center">
        Yeonhee Kim
        <span className="cursor-blink">|</span>
      </h1>

      <div className="text-center mt-0">
        <p className="text-xl text-zinc-400 font-mono sm:text-2xl md:text-xl font-bold">
          Building software
        </p>
        <p className="text-md text-zinc-400 font-mono sm:text-lg md:text-md">
          with a love for cats and the cosmos
        </p>
      </div>

      <div className="my-8 text-center bg-zinc-800 p-2 rounded">
        <p className="text-center text-sm text-zinc-500 italic font-mono tracking-wide">
          “We will find a way. We always have.”
          <br />
          <span className="text-zinc-500">
            — Cooper, <i>Interstellar (2014)</i>
          </span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Link
          href="https://www.linkedin.com/in/yeonhee-hayden-kim/"
          target="_blank"
        >
          <LinkedinIcon size={40} />
        </Link>
        <Link href="https://github.com/devyeony" target="_blank">
          <Github size={40} />
        </Link>
        <Link href="https://medium.com/@devyeony" target="_blank">
          <PenLine size={40} />
        </Link>
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
