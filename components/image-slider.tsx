"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
  alt?: string;
  autoPlayInterval?: number;
}

const ChevronLeft = () => (
  <svg
    className="w-8 h-8 sm:w-6 sm:h-6 md:w-10 md:h-10 text-gray-700 drop-shadow-lg"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-8 h-8 sm:w-6 sm:h-6 md:w-10 md:h-10 text-gray-700 drop-shadow-lg"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  alt,
  autoPlayInterval = 5000,
}) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [current, autoPlayInterval, total]);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-4 mb-8">
      <div
        className="relative w-full rounded-lg border border-zinc-200 overflow-hidden"
        style={{ maxHeight: 550 }}
      >
        <Image
          src={images[current]}
          alt={alt || `Slide ${current + 1}`}
          width={1000}
          height={0}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "550px",
            objectFit: "contain",
          }}
          priority
        />
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-transparent hover:bg-gray-200 transition-colors duration-200 ease-out w-12 h-12 flex items-center justify-center active:scale-95"
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-transparent hover:bg-gray-200 transition-colors duration-200 ease-out w-12 h-12 flex items-center justify-center active:scale-95"
        aria-label="Next"
      >
        <ChevronRight />
      </button>

      <div className="mt-4 flex justify-center gap-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-colors
              h-3 w-3 sm:h-2.5 sm:w-2.5 md:h-4 md:w-4
              ${i === current ? "bg-blue-600" : "bg-zinc-400"}
            `}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
