import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * Fonts embedded into OG images. Paths stay literal inside join(process.cwd(), …)
 * so Next.js file tracing bundles them if an image route ever renders lazily.
 * Fraunces is a committed static instance (satori cannot consume variable
 * fonts); Korean glyphs fall back to Pretendard static weights shipped by the
 * existing `pretendard` dependency (satori reads woff, not woff2).
 */

export interface OgFont {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: "normal";
}

let fontsPromise: Promise<OgFont[]> | undefined;

export function ogFonts(): Promise<OgFont[]> {
  fontsPromise ??= Promise.all([
    readFile(
      join(process.cwd(), "src/assets/fonts/Fraunces-opsz144-SemiBold.ttf"),
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/pretendard/dist/web/static/woff/Pretendard-Bold.woff",
      ),
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/pretendard/dist/web/static/woff/Pretendard-Regular.woff",
      ),
    ),
  ]).then(([fraunces, pretendardBold, pretendardRegular]) => [
    { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
    { name: "Pretendard", data: pretendardBold, weight: 700, style: "normal" },
    {
      name: "Pretendard",
      data: pretendardRegular,
      weight: 400,
      style: "normal",
    },
  ]);
  return fontsPromise;
}
