import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/*
 * Brand motif: a sitting cat drawn as a constellation — vertex stars joined
 * by hairlines, a few accent stars twinkling. Deliberately angular and
 * imperfect, like a real star chart.
 */

const HEAD = "60,68 72,40 86,60 104,58 118,34 130,64 132,90 96,108 58,92 60,68";
const BODY =
  "58,92 52,124 40,170 68,206 110,208 148,196 158,156 136,120 132,90";
const TAIL = "148,196 178,204 200,184 204,144";

/** [cx, cy, r] — constellation vertices plus eyes. */
const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [60, 68, 2],
  [86, 60, 2],
  [104, 58, 2],
  [130, 64, 2],
  [132, 90, 2],
  [96, 108, 2.5],
  [58, 92, 2],
  [52, 124, 2],
  [40, 170, 2.5],
  [68, 206, 2],
  [110, 208, 2.5],
  [148, 196, 2],
  [158, 156, 2.5],
  [136, 120, 2],
  [178, 204, 2],
  [200, 184, 2],
  // eyes
  [86, 82, 1.5],
  [110, 80, 1.5],
];

/** Ambient stars scattered off the figure. */
const AMBIENT: ReadonlyArray<readonly [number, number]> = [
  [30, 52],
  [176, 44],
  [216, 96],
  [22, 128],
  [196, 228],
];

/** Ear tips and tail tip twinkle; delays stagger via duration tokens. */
const ACCENT_STARS: ReadonlyArray<readonly [number, number, number]> = [
  [72, 40, 0],
  [118, 34, 3],
  [204, 144, 5],
];

/**
 * Geometry shared with the OG image renderer (features/og), which redraws
 * the motif without CSS classes — satori has no stylesheet cascade.
 */
export const catGeometry = {
  viewBox: 240,
  polylines: [HEAD, BODY, TAIL],
  stars: STARS,
  ambient: AMBIENT,
  accents: ACCENT_STARS,
} as const;

export function ConstellationCat({
  className,
  ...props
}: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 240 240"
      aria-hidden="true"
      className={cn("text-text", className)}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points={HEAD} />
        <polyline points={BODY} />
        <polyline points={TAIL} />
      </g>
      <g fill="currentColor" opacity={0.9}>
        {STARS.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g fill="currentColor" opacity={0.45}>
        {AMBIENT.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.2} />
        ))}
      </g>
      <g className="fill-accent">
        {ACCENT_STARS.map(([cx, cy, delay]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={3}
            className="twinkle"
            style={{ animationDelay: `calc(var(--duration-slow) * ${delay})` }}
          />
        ))}
      </g>
    </svg>
  );
}
