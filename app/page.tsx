"use client";

import Image from "next/image";
import React from "react";
import { SocialLink } from "@/components/social-links";

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

      <SocialLink />
    </div>
  );
}
