import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { palette } from "./render";

/*
 * The OG renderer carries hex mirrors of tokens.css primitives (satori
 * resolves neither CSS custom properties nor oklch). This test recomputes
 * each mirror from the token source, so a palette change that forgets the
 * OG cards fails the loop instead of shipping stale brand colors.
 */

const tokensCss = readFileSync(
  join(process.cwd(), "src/styles/tokens.css"),
  "utf8",
);

function tokenOklch(name: string): [number, number, number] {
  const match = tokensCss.match(
    new RegExp(`--color-${name}:\\s*oklch\\(([^)]+)\\)`),
  );
  if (!match) throw new Error(`token --color-${name} not found in tokens.css`);
  const [l, c, h] = (match[1] as string).trim().split(/\s+/).map(Number);
  return [l as number, c as number, h as number];
}

/** oklch → sRGB hex, matching CSS Color 4 conversion (gamut-clamped). */
function oklchToHex([l, c, h]: [number, number, number]): string {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  const channel = (x: number) => {
    const v = Math.max(0, Math.min(1, x));
    const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(srgb * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${lin.map(channel).join("")}`;
}

describe("OG palette mirrors tokens.css", () => {
  it.each([
    ["surface", "void-950"],
    ["text", "starlight-100"],
    ["textMuted", "starlight-400"],
    ["starline", "starlight-300"],
    ["accent", "nebula-400"],
  ] as const)("palette.%s === %s", (key, token) => {
    expect(palette[key]).toBe(oklchToHex(tokenOklch(token)));
  });

  it("nebulaVeil is a translucent nebula-400", () => {
    const hex = oklchToHex(tokenOklch("nebula-400"));
    const rgb = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
    expect(palette.nebulaVeil).toBe(`rgba(${rgb.join(", ")}, 0.13)`);
  });
});
