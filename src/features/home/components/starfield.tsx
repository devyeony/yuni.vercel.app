"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  /** Downward drift in px per second. */
  drift: number;
}

const DENSITY = 1 / 3800; // stars per px² before clamping
const MIN_STARS = 40;
const MAX_STARS = 220;

/**
 * Decorative canvas starfield. A client leaf with zero React re-renders —
 * everything lives in refs and one effect. Four performance guards:
 *
 *   1. Adaptive workload — star count scales with canvas area (clamped),
 *      halves on low-core devices, and DPR is capped at 2.
 *   2. Pauses when the tab is hidden (visibilitychange).
 *   3. Pauses when scrolled off-screen (IntersectionObserver).
 *   4. prefers-reduced-motion renders a single static frame, no rAF loop.
 *
 * Star color follows the semantic text token via the canvas' CSS `color`,
 * re-read when the theme class on <html> changes.
 */
export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let color = "";
    let frame = 0;
    let running = false;
    let tabVisible = !document.hidden;
    let onScreen = true;

    const readColor = () => {
      color = getComputedStyle(canvas).color;
    };

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const coreFactor = (navigator.hardwareConcurrency ?? 8) <= 4 ? 0.5 : 1;
      const count = Math.round(
        Math.min(MAX_STARS, Math.max(MIN_STARS, width * height * DENSITY)) *
          coreFactor,
      );
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() ** 2 * 1.1,
        baseAlpha: 0.25 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.9,
        drift: (2 + Math.random() * 6) / 60,
      }));
      readColor();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      const seconds = t / 1000;
      const still = reduceMotion.matches;
      for (const s of stars) {
        const y = still ? s.y : (s.y + seconds * s.drift) % height;
        ctx.globalAlpha = still
          ? s.baseAlpha
          : s.baseAlpha * (0.55 + 0.45 * Math.sin(seconds * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      frame = requestAnimationFrame(loop);
    };

    const sync = () => {
      const shouldRun = tabVisible && onScreen && !reduceMotion.matches;
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
      if (reduceMotion.matches) draw(0);
    };

    const onVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      sync();
    });
    intersection.observe(canvas);

    reduceMotion.addEventListener("change", sync);

    const resize = new ResizeObserver(() => {
      init();
      if (!running) draw(0);
    });
    resize.observe(canvas);

    const theme = new MutationObserver(readColor);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    init();
    sync();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", sync);
      intersection.disconnect();
      resize.disconnect();
      theme.disconnect();
    };
  }, []);

  return (
    // Biome considers <canvas> interactive, so the decorative marker goes on
    // a wrapper the screen reader can skip wholesale.
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <canvas ref={canvasRef} className="size-full text-text" />
    </div>
  );
}
