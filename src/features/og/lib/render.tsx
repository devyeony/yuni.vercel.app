import { ImageResponse } from "next/og";
import { catGeometry } from "@/components/ui/constellation-cat";
import { site } from "@/lib/site";
import { ogFonts } from "./fonts";

/** Shared 1200×630 Open Graph card: editorial type over the deep-space palette. */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/*
 * Hex mirrors of tokens.css oklch values (dark theme) — satori resolves
 * neither CSS custom properties nor oklch(). palette.test.ts recomputes
 * these from src/styles/tokens.css, so drift fails `pnpm test`.
 */
export const palette = {
  surface: "#07070d", // void-950
  text: "#f4f2ea", // starlight-100
  textMuted: "#b3aea0", // starlight-400
  starline: "#cfcabe", // starlight-300
  accent: "#bc8fdd", // nebula-400
  nebulaVeil: "rgba(188, 143, 221, 0.13)", // nebula-400, faint glow
};

/** "60,68 72,40 …" → "M60,68 L72,40 …" (satori draws paths, not polylines). */
function pointsToPath(points: string): string {
  const [first, ...rest] = points.split(" ");
  return `M${first} ${rest.map((p) => `L${p}`).join(" ")}`;
}

function ConstellationCat({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${catGeometry.viewBox} ${catGeometry.viewBox}`}
      aria-hidden="true"
      style={{ position: "absolute", top: 120, right: 48 }}
    >
      {catGeometry.polylines.map((points) => (
        <path
          key={points}
          d={pointsToPath(points)}
          fill="none"
          stroke={palette.starline}
          strokeOpacity={0.3}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {catGeometry.stars.map(([cx, cy, r]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          fill={palette.text}
          opacity={0.9}
        />
      ))}
      {catGeometry.ambient.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={1.2}
          fill={palette.text}
          opacity={0.45}
        />
      ))}
      {catGeometry.accents.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={3}
          fill={palette.accent}
        />
      ))}
    </svg>
  );
}

export interface OgCardProps {
  /** Big display line, set in Fraunces (Korean falls back to Pretendard). */
  title: string;
  /** Section eyebrow above the title (page kind, or the tagline on home). */
  kind?: string;
  /** Home already carries the name in its title — it hides this line. */
  showAuthor?: boolean;
}

export async function ogImage({ title, kind, showAuthor = true }: OgCardProps) {
  const fonts = await ogFonts();
  const titleSize = title.length <= 18 ? 92 : title.length <= 40 ? 72 : 54;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        padding: "64px 72px",
        backgroundColor: palette.surface,
        backgroundImage: `radial-gradient(ellipse 70% 90% at 88% 8%, ${palette.nebulaVeil}, rgba(188, 143, 221, 0))`,
        color: palette.text,
        fontFamily: "Pretendard",
      }}
    >
      <ConstellationCat size={430} />
      <div
        style={{
          display: "flex",
          fontSize: 26,
          fontWeight: 400,
          color: palette.textMuted,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        {kind ?? ""}
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: 690,
          fontFamily: "Fraunces, Pretendard",
          fontWeight: 600,
          fontSize: titleSize,
          lineHeight: 1.12,
          letterSpacing: "-0.01em",
          wordBreak: "keep-all",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 27,
        }}
      >
        <div style={{ display: "flex", fontWeight: 700 }}>
          {showAuthor ? site.author : ""}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: palette.textMuted,
            fontWeight: 400,
          }}
        >
          <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M7 0 L8.6 5.4 L14 7 L8.6 8.6 L7 14 L5.4 8.6 L0 7 L5.4 5.4 Z"
              fill={palette.accent}
            />
          </svg>
          {new URL(site.url).host}
        </div>
      </div>
    </div>,
    { ...ogSize, fonts },
  );
}
