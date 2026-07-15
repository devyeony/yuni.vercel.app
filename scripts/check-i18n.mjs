#!/usr/bin/env node
/**
 * i18n key symmetry check: every locale in messages/ must expose exactly the
 * same key tree as the default locale (en). Part of `pnpm check`.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const messagesDir = path.resolve(import.meta.dirname, "../messages");
const defaultLocale = "en";

function flattenKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object"
      ? flattenKeys(value, full)
      : [full];
  });
}

function loadKeys(locale) {
  const file = path.join(messagesDir, `${locale}.json`);
  return new Set(flattenKeys(JSON.parse(fs.readFileSync(file, "utf8"))));
}

const locales = fs
  .readdirSync(messagesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => path.basename(f, ".json"));

const base = loadKeys(defaultLocale);
let failed = false;

for (const locale of locales.filter((l) => l !== defaultLocale)) {
  const keys = loadKeys(locale);
  const missing = [...base].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !base.has(k));
  for (const key of missing) {
    console.error(`messages/${locale}.json missing key: ${key}`);
  }
  for (const key of extra) {
    console.error(`messages/${locale}.json has extra key: ${key}`);
  }
  failed ||= missing.length > 0 || extra.length > 0;
}

if (failed) {
  process.exit(1);
}
console.log(`i18n keys symmetric across: ${locales.join(", ")}`);
