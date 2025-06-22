"use client";

import React, { useRef, useEffect } from "react";
import debounce from "lodash.debounce";

interface Star {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  baseOpacity: number;
  opacityDirection: 1 | -1;
}

interface SpaceBackgroundProps {
  className?: string;
  quantity?: number;
}

export default function SpaceBackground({
  className = "",
  quantity = 150,
}: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    contextRef.current = canvas.getContext("2d");
    initCanvas();

    const debouncedResize = debounce(initCanvas, 200);
    window.addEventListener("resize", debouncedResize);

    animate();

    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    starsRef.current = createStars(quantity, width, height);
  };

  const createStars = (count: number, width: number, height: number): Star[] => {
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1 + 0.8,
      speedX: Math.random() * 0.2 - 0.1,
      speedY: Math.random() * 0.2 - 0.1,
      baseOpacity: Math.random() * 0.5 + 0.5,
      opacityDirection: Math.random() > 0.5 ? 1 : -1,
    }));
  };

  const updateStars = (width: number, height: number) => {
    starsRef.current.forEach((star) => {
      star.x += star.speedX;
      star.y += star.speedY;

      if (star.x > width) star.x = 0;
      if (star.x < 0) star.x = width;
      if (star.y > height) star.y = 0;
      if (star.y < 0) star.y = height;

      star.baseOpacity += 0.005 * star.opacityDirection;
      if (star.baseOpacity >= 1 || star.baseOpacity <= 0.4) {
        star.opacityDirection *= -1;
      }
    });
  };

  const drawStars = (ctx: CanvasRenderingContext2D) => {
    starsRef.current.forEach((star) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(255, 255, 180, ${star.baseOpacity})`;
      ctx.fillStyle = `rgba(255, 255, 180, ${star.baseOpacity})`;
      ctx.fill();
      ctx.restore();
    });
  };

  const animate = () => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0d1b2a");
    gradient.addColorStop(0.3, "#1f2a44");
    gradient.addColorStop(0.5, "#16213e");
    gradient.addColorStop(0.7, "#2b3a4e");
    gradient.addColorStop(1, "#1a1a2e");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    updateStars(width, height);
    drawStars(ctx);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div
      className={`${className} fixed top-0 left-0 w-full h-full pointer-events-none`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
