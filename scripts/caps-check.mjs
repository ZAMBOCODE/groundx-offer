#!/usr/bin/env node
/**
 * CAPS consistency checker — Samy 2026-05-25.
 *
 * Scans src/**\/*.tsx for JSX text rendered inside elements that are styled
 * as ALL-CAPS via any of these signals:
 *   · className contains "meta", "eyebrow", or "uppercase"
 *   · className contains a tracking-[Nem] utility (typically a CAPS context)
 *
 * For each such element, reports the cases where the actual source string
 * contains lowercase letters (i.e. relies on CSS text-transform). Even if
 * the rendered pixels look fine, mixed source casing is a code smell:
 *   · breaks copy-paste consistency when text-transform gets removed
 *   · makes accessibility tools and screen-readers read "lower" instead
 *     of "L-O-W-E-R" depending on configuration
 *   · drifts away from the global tone-of-voice
 *
 * Usage:  node scripts/caps-check.mjs            (report only)
 *         node scripts/caps-check.mjs --fix       (in-place uppercase fix)
 *
 * Exit code is 0 either way (informational, not a build blocker).
 */
import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const FIX = process.argv.includes("--fix");

const CAPS_CLASS_RE = /class(?:Name)?\s*=\s*(?:"([^"]*)"|\{?`([^`]*)`\}?)/;
const HAS_CAPS_SIGNAL = (cls) =>
  /\bmeta\b/.test(cls) ||
  /\beyebrow\b/.test(cls) ||
  /\buppercase\b/.test(cls) ||
  /tracking-\[[0-9.]+em\]/.test(cls);

// Walk src recursively for .tsx files.
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".tsx") || name.endsWith(".ts")) out.push(full);
  }
  return out;
}

/* Simple JSX-text scanner: walks character-by-character through the file
   tracking <tag …>TEXT</tag>. For each opening tag, capture its
   className value, then capture the immediate text node until the next
   `<` or `{`. Mismatched casing → report. This is intentionally simple
   (we don't need a full parser); false positives are OK because we
   never auto-fix interpolations or expressions. */
function scan(file) {
  const src = readFileSync(file, "utf8");
  const findings = [];
  const len = src.length;
  let i = 0;
  let line = 1;
  while (i < len) {
    const ch = src[i];
    if (ch === "\n") line++;
    if (ch === "<" && /[a-zA-Z]/.test(src[i + 1] ?? "")) {
      // Read opening tag until '>' (handle nested braces in attrs)
      let j = i + 1;
      let depth = 0;
      while (j < len) {
        const c = src[j];
        if (c === "{") depth++;
        else if (c === "}") depth--;
        else if (c === ">" && depth === 0) break;
        else if (c === "\n") line++;
        j++;
      }
      if (j >= len) break;
      const tagOpen = src.slice(i, j + 1);
      const selfClose = tagOpen.endsWith("/>");
      const startTextAt = j + 1;
      const m = CAPS_CLASS_RE.exec(tagOpen);
      const cls = m ? (m[1] ?? m[2] ?? "") : "";
      const isCaps = cls && HAS_CAPS_SIGNAL(cls);

      if (isCaps && !selfClose) {
        // grab text up to the next '<' or '{'
        let k = startTextAt;
        while (k < len && src[k] !== "<" && src[k] !== "{") k++;
        const raw = src.slice(startTextAt, k);
        const text = raw.replace(/[\s\u00a0]+/g, " ").trim();
        // Skip empties + pure punctuation + JSX-noise
        if (text && /[a-z]/.test(text)) {
          // Letters present, has lowercase → likely missing uppercase
          findings.push({
            line,
            startTextAt,
            endTextAt: k,
            text,
            raw,
          });
        }
      }

      // advance past the opening tag (don't consume text yet — outer loop handles it)
      i = j + 1;
      continue;
    }
    i++;
  }
  return { file, src, findings };
}

const files = walk(SRC);
let totalIssues = 0;
const filesToWrite = new Map();

for (const file of files) {
  const { src, findings } = scan(file);
  if (!findings.length) continue;
  const rel = relative(ROOT, file);
  console.log(`\n${rel}`);
  for (const f of findings) {
    totalIssues++;
    console.log(`  ${rel}:${f.line}  "${f.text}"  →  "${f.text.toUpperCase()}"`);
  }
  if (FIX) {
    // Apply replacements from last to first to keep offsets stable.
    let next = src;
    const sorted = [...findings].sort((a, b) => b.startTextAt - a.startTextAt);
    for (const f of sorted) {
      // Single-pass: match an HTML entity OR a lowercase letter. Entities
      // pass through untouched so we never mangle &nbsp; → &NBSP;.
      const upper = f.raw.replace(
        /&[a-zA-Z]+;|[a-z]/g,
        (m) => (m.startsWith("&") ? m : m.toUpperCase()),
      );
      next = next.slice(0, f.startTextAt) + upper + next.slice(f.endTextAt);
    }
    filesToWrite.set(file, next);
  }
}

if (FIX) {
  for (const [file, content] of filesToWrite) {
    writeFileSync(file, content);
  }
  console.log(`\n--fix applied to ${filesToWrite.size} file(s).`);
}

console.log(
  `\n${totalIssues} CAPS-context string(s) with lowercase letters across ${files.length} file(s).` +
    (FIX ? " Run prettier / tsc next." : " Run with --fix to uppercase them in place.")
);
