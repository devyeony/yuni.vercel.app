#!/usr/bin/env node
/**
 * Generates local vendor-specific adapter files from the vendor-neutral sources
 * (AGENTS.md + agents/). All outputs are gitignored — re-run anytime with:
 *
 *   pnpm setup:agents
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");

function link(target, linkPath) {
  const abs = path.join(root, linkPath);
  fs.rmSync(abs, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const rel = path.relative(path.dirname(abs), path.join(root, target));
  try {
    fs.symlinkSync(rel, abs);
    console.log(`link  ${linkPath} -> ${rel}`);
  } catch {
    // Symlinks may be unavailable (e.g. Windows without dev mode) — copy instead.
    fs.cpSync(path.join(root, target), abs, { recursive: true });
    console.log(`copy  ${linkPath} <- ${target}`);
  }
}

function write(filePath, content) {
  const abs = path.join(root, filePath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
  console.log(`write ${filePath}`);
}

// Claude Code / Gemini CLI read a root instructions file.
link("AGENTS.md", "CLAUDE.md");
link("AGENTS.md", "GEMINI.md");

// Claude Code loads skills from .claude/skills/<name>/SKILL.md.
const skillsDir = path.join(root, "agents/skills");
if (fs.existsSync(skillsDir)) {
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      link(`agents/skills/${entry.name}`, `.claude/skills/${entry.name}`);
    }
  }
}

// Cursor applies .cursor/rules/*.mdc; point it at the neutral sources.
write(
  ".cursor/rules/agents.mdc",
  `---
description: Repository agent instructions
alwaysApply: true
---

Follow AGENTS.md at the repository root. Detailed procedures live in
agents/skills/*/SKILL.md; the work loop is defined in agents/harness.md.
`,
);

console.log("done");
process.exit(0);
