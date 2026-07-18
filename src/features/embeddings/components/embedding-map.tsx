"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { MapKind, MapPoint } from "@/features/embeddings/lib/map";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/*
 * Interactive leaf for the embedding map. All heavy work (embedding, PCA,
 * neighbor ranking) happened at build time — this only holds the selection
 * state. Kind identity is encoded by glyph shape, not color alone: the
 * palette stays within the site's restrained accent set and the map reads
 * as a constellation of content, CVD-safe by construction.
 */

/** Glyphs on a -8..8 viewBox; `currentColor` inherits the kind's ink. */
const KIND_GLYPHS: Record<MapKind, { path: string; className: string }> = {
  project: {
    path: "M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8 Z",
    className: "text-accent",
  },
  post: {
    path: "M0 -4.5 A4.5 4.5 0 1 1 0 4.5 A4.5 4.5 0 1 1 0 -4.5 Z",
    className: "text-accent",
  },
  career: {
    path: "M0 -5 L5 0 L0 5 L-5 0 Z",
    className: "text-text",
  },
  activity: {
    path: "M0 -3 A3 3 0 1 1 0 3 A3 3 0 1 1 0 -3 Z",
    className: "text-text-muted",
  },
  now: {
    path: "M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6 Z",
    className: "text-text",
  },
};

function Glyph({ kind }: { kind: MapKind }) {
  const glyph = KIND_GLYPHS[kind];
  return (
    <svg
      aria-hidden="true"
      viewBox="-8 -8 16 16"
      className={cn("size-4", glyph.className)}
    >
      <path d={glyph.path} fill="currentColor" />
    </svg>
  );
}

/** Inset (in %) keeping edge points clear of the plot border. */
const PAD = 7;
const plot = (v: number) => PAD + v * (100 - 2 * PAD);

export function EmbeddingMap({ points }: { points: MapPoint[] }) {
  const t = useTranslations("embeddings");
  const [activeIndex, setActiveIndex] = useState(0);
  const active = points[activeIndex];

  if (!active) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
      <figure className="m-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border-muted sm:aspect-4/3">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            {active.neighbors.map(({ index }) => {
              const neighbor = points[index];
              if (!neighbor) return null;
              return (
                <line
                  key={neighbor.id}
                  x1={plot(active.x)}
                  y1={plot(active.y)}
                  x2={plot(neighbor.x)}
                  y2={plot(neighbor.y)}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-accent/40 stroke-1"
                />
              );
            })}
          </svg>
          <ul aria-label={t("plotLabel")} className="absolute inset-0">
            {points.map((point, index) => (
              <li
                key={point.id}
                className="absolute"
                style={{
                  left: `${plot(point.x)}%`,
                  top: `${plot(point.y)}%`,
                }}
              >
                <button
                  type="button"
                  aria-label={`${point.title} — ${t(`kind.${point.kind}`)}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "-translate-x-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full",
                    "transition-colors duration-(--duration-fast) ease-out-soft pointer-coarse:size-11",
                    index === activeIndex && "bg-accent/15",
                  )}
                >
                  <Glyph kind={point.kind} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {(Object.keys(KIND_GLYPHS) as MapKind[]).map((kind) => (
            <span key={kind} className="flex items-center gap-1.5">
              <Glyph kind={kind} />
              <Text as="span" variant="caption">
                {t(`kind.${kind}`)}
              </Text>
            </span>
          ))}
        </figcaption>
      </figure>

      <aside aria-live="polite" className="lg:min-h-64">
        <Text
          as="p"
          variant="caption"
          className="font-mono tracking-wider uppercase"
        >
          {t(`kind.${active.kind}`)}
        </Text>
        <Heading as="h2" variant="subtitle" className="mt-2">
          {active.title}
        </Heading>
        <Link
          href={active.url}
          className="mt-3 inline-flex min-h-8 items-center text-accent text-sm transition-colors duration-(--duration-fast) ease-out-soft hover:text-accent-muted pointer-coarse:min-h-11"
        >
          {t("visit")} →
        </Link>

        <Heading as="h3" variant="subtitle" className="mt-8 text-sm">
          {t("neighborsTitle")}
        </Heading>
        <ul className="mt-3 flex flex-col">
          {active.neighbors.map(({ index, score }) => {
            const neighbor = points[index];
            if (!neighbor) return null;
            return (
              <li key={neighbor.id}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group flex min-h-8 w-full items-center justify-between gap-4 rounded-xs text-left transition-colors duration-(--duration-fast) ease-out-soft pointer-coarse:min-h-11"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Glyph kind={neighbor.kind} />
                    <Text
                      as="span"
                      variant="muted"
                      className="truncate text-sm transition-colors duration-(--duration-fast) ease-out-soft group-hover:text-text"
                    >
                      {neighbor.title}
                    </Text>
                  </span>
                  <Text as="span" variant="caption" className="font-mono">
                    {score.toFixed(2)}
                  </Text>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
