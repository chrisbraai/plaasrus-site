// Yielde-System hooks v1.2 — regex hardening + C8 (no purple) + C9 (CursorProvider mandate)
'use strict';

const fs = require('fs');
const path = require('path');

// Collect stdin
let raw = '';
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => { main(raw); });

function main(raw) {
  // Parse PostToolUse payload
  let payload;
  try { payload = JSON.parse(raw); } catch { process.exit(0); }

  const filePath = payload?.tool_input?.file_path;
  if (!filePath) process.exit(0);

  // Guard: .tsx and .ts files only (components AND page files)
  const ext = path.extname(filePath);
  if (ext !== '.tsx' && ext !== '.ts') process.exit(0);

  // Read file content. ENOENT (deleted/renamed during edit) is a clean no-op; anything else is
  // surfaced so hook failures do not pass silently.
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if (err && err.code === 'ENOENT') process.exit(0);
    process.stderr.write(`[post-edit-component] read failed for ${filePath}: ${err?.message ?? err}\n`);
    process.exit(0);
  }

  const lines = content.split('\n');
  const violations = [];

  try {
    checkC1(lines, violations);
    checkC2(lines, violations);
    checkC3(lines, violations);
    checkC4(lines, violations);
    checkC5(lines, violations);
    checkC6(lines, violations);
    checkC7(lines, violations, filePath);
    checkC8(lines, violations);
    checkC9(lines, violations, filePath);
  } catch (err) {
    // Any check-internal error is a hook bug, not a user violation — surface it.
    process.stderr.write(`[post-edit-component] check failed on ${filePath}: ${err?.stack ?? err}\n`);
    process.exit(0);
  }

  if (!violations.length) process.exit(0);

  const today = new Date().toISOString().slice(0, 10);
  const relFile = path.relative(process.cwd(), path.resolve(filePath));
  const logPath = getLogPath();
  ensureDir(path.dirname(logPath));

  for (const v of violations) {
    const entry = `${today} | post-edit-component | ${relFile} | ${v.check} | ${v.msg}\n`;
    try {
      fs.appendFileSync(logPath, entry, 'utf8');
    } catch (err) {
      process.stderr.write(`[post-edit-component] could not write to ${logPath}: ${err?.message ?? err}\n`);
    }
    process.stdout.write(entry);
  }

  process.exit(1);
}

// Determine hook-log.md path: system dir uses state/hook-log.md, client repo uses .claude/hook-log.md
function getLogPath() {
  const cwd = process.cwd();
  return fs.existsSync(path.join(cwd, 'state'))
    ? path.join(cwd, 'state', 'hook-log.md')
    : path.join(cwd, '.claude', 'hook-log.md');
}

function ensureDir(dir) {
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Returns true if the line is a comment (skip for violation checks)
function isComment(line) {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('<!--');
}

// C1: raw hex colour in non-comment lines — 3, 4, 6, or 8 hex digits (alpha-aware)
// Exception: lines containing // YIELD-FORKED are skipped
function checkC1(lines, violations) {
  const hexRe = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b/;
  lines.forEach((line, i) => {
    if (isComment(line) || line.includes('// YIELD-FORKED')) return;
    const m = line.match(hexRe);
    if (m) violations.push({ check: 'C1', msg: `raw hex ${m[0]} at line ${i + 1}` });
  });
}

// C2: rounded-* Tailwind class outside a JSX button element.
// Previous version matched the substring "button" in the line — false-positive on buttonVariants,
// loginButton, IconButton. This version requires a JSX opening tag: <button or <XxxButton.
function checkC2(lines, violations) {
  const roundedRe = /\brounded-[a-z0-9-]+/;
  // JSX tag patterns that indicate a button element is opened on this line.
  // Matches: <button, <Button, <MenuButton, <IconButton, <ButtonLink. Does NOT match
  // bare identifiers like "buttonVariants" or "loginButton" appearing in className strings.
  const jsxButtonRe = /<button\b|<[A-Z][A-Za-z0-9]*Button\b|<Button\b/;
  lines.forEach((line, i) => {
    if (isComment(line) || !roundedRe.test(line)) return;
    if (/\brounded-none\b/.test(line)) return; // always allowed
    if (jsxButtonRe.test(line)) return;
    violations.push({ check: 'C2', msg: `rounded-* class outside button element at line ${i + 1}` });
  });
}

// C3: shadow-* Tailwind class anywhere in the file (utility classes only — not variable names)
function checkC3(lines, violations) {
  // Require the shadow- prefix to be a Tailwind utility: preceded by whitespace, quote, or line start,
  // and followed by a Tailwind scale value (sm/md/lg/xl/2xl/inner/none or arbitrary [value]).
  const shadowRe = /(^|[\s"'`{])shadow-(?:sm|md|lg|xl|2xl|inner|\[|\d)/;
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    if (shadowRe.test(line) && !/shadow-none\b/.test(line)) {
      violations.push({ check: 'C3', msg: `shadow-* class at line ${i + 1}` });
    }
  });
}

// C4: ramp token leakage — direct use of palette ramp tokens instead of semantic tokens.
// The list covers current scaffold (ramp1/2/3), Yielde brand (copper, typeset, steel, amber, ink, brass),
// Garden Route / Yielde-v2 (fern, hay, rose), and common project presets (slate, steel, sea, sand, coral,
// earth, clay, rust). When a new project introduces a novel ramp prefix, extend this list in both the
// hook and .claude/agents/design-reviewer.md.
const RAMP_PREFIXES = [
  '--ramp1-', '--ramp2-', '--ramp3-',
  '--copper-', '--typeset-', '--steel-', '--amber-',
  '--fern-', '--hay-', '--rose-',
  '--ink-', '--brass-',
  '--slate-', '--sea-', '--sand-', '--coral-',
  '--earth-', '--clay-', '--rust-',
];
function checkC4(lines, violations) {
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const prefix of RAMP_PREFIXES) {
      if (line.includes(prefix)) {
        violations.push({ check: 'C4', msg: `ramp token ${prefix} at line ${i + 1}` });
        break;
      }
    }
  });
}

// C5: banned CTA substrings from knowledge/copy-voice/banned-phrases.yml.
// Previous version flagged ANY line containing the CTA substring — including `type="submit"`,
// `onSubmit`, `handleSubmit`. Evidence: state/hook-log.md had 40+ false positives on "submit".
//
// This version requires word boundaries (\b) AND excludes HTML/JSX attribute-value context
// (e.g. `type="submit"`, `role="submit"`). A real banned CTA appears either as JSX text content
// (between > and <) or inside a user-facing string literal not adjacent to an attribute assignment.
function checkC5(lines, violations) {
  const ctas = loadBannedCtas();
  if (!ctas.length) {
    process.stderr.write('[post-edit-component] banned-phrases.yml not found — C5 check skipped\n');
    return;
  }
  lines.forEach((line, i) => {
    if (isComment(line) || line.includes('YIELD-FORKED')) return;
    const lower = line.toLowerCase();
    for (const cta of ctas) {
      const ctaLc = cta.toLowerCase();
      // Word-boundary required — prevents matches inside camelCase identifiers like onSubmit.
      const wordRe = new RegExp(`\\b${escapeRe(ctaLc)}\\b`);
      if (!wordRe.test(lower)) continue;
      // Exclude HTML/JSX attribute-value context: foo="cta", role='cta', type="cta".
      // This is the dominant false-positive class in the current hook-log.
      const attrRe = new RegExp(`\\b[a-z-]+\\s*=\\s*["']${escapeRe(ctaLc)}["']`);
      if (attrRe.test(lower)) continue;
      // Exclude technical identifiers that commonly contain CTA substrings at word boundaries,
      // e.g. `e.preventDefault()`, `form.submit()`, `submit: () => ...` (object keys).
      // These occur as `.submit(` or `submit:` — not user-facing copy.
      const technicalRe = new RegExp(`[.\\s]${escapeRe(ctaLc)}\\s*[(:]`);
      if (technicalRe.test(lower)) continue;
      violations.push({ check: 'C5', msg: `banned CTA "${cta}" at line ${i + 1}` });
      break;
    }
  });
}

// Load the ctas list from banned-phrases.yml
// Tries system path first, then sibling Yielde-System path (for client repos)
function loadBannedCtas() {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'knowledge', 'copy-voice', 'banned-phrases.yml'),
    path.join(cwd, '..', 'Yielde-System', 'knowledge', 'copy-voice', 'banned-phrases.yml'),
  ];

  let yml = null;
  for (const p of candidates) {
    try { yml = fs.readFileSync(p, 'utf8'); break; } catch {}
  }
  if (!yml) return [];

  const ctas = [];
  let inSection = false;
  for (const line of yml.split('\n')) {
    if (/^ctas\s*:/.test(line)) { inSection = true; continue; }
    if (inSection) {
      if (/^[a-zA-Z_]/.test(line)) break;
      const m = line.match(/^\s+-\s+"?(.+?)"?\s*$/);
      if (m) ctas.push(m[1].toLowerCase());
    }
  }
  return ctas;
}

// C6: spec-notation tokens that resolve to empty — var(--t-*), var(--lh-*), var(--ls-*)
// These are shorthand from design-system prose; the wired names are --text-*, --leading-*, --tracking-*
function checkC6(lines, violations) {
  const specRe = /var\(--(?:t|lh|ls)-[a-z]/;
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    if (specRe.test(line)) {
      violations.push({
        check: 'C6',
        msg: `spec-notation token at line ${i + 1} — var(--t-*/--lh-*/--ls-*) is not a defined CSS property; use var(--text-*/--leading-*/--tracking-*)`
      });
    }
  });
}

// C7: heading length — H2 max 8 words, H3 max 12 words
function checkC7(lines, violations, filePath) {
  const basename = path.basename(filePath);
  const isPageOrSection = basename.includes('page') || basename.includes('Page') ||
    basename.includes('Section') || basename.includes('Hero') ||
    basename.includes('About') || basename.includes('Services') ||
    basename.includes('Contact') || basename.includes('Pricing');
  if (!isPageOrSection) return;

  const h2Re = /<h2[^>]*>([^<]{1,200})<\/h2>/;
  const h3Re = /<h3[^>]*>([^<]{1,200})<\/h3>/;

  lines.forEach((line, i) => {
    if (isComment(line)) return;

    const h2m = line.match(h2Re);
    if (h2m) {
      const words = h2m[1].trim().split(/\s+/).filter(Boolean);
      if (words.length > 8) {
        violations.push({ check: 'C7', msg: `H2 at line ${i + 1} is ${words.length} words — max 8 (see 10-copy-voice.md §11.4)` });
      }
    }

    const h3m = line.match(h3Re);
    if (h3m) {
      const words = h3m[1].trim().split(/\s+/).filter(Boolean);
      if (words.length > 12) {
        violations.push({ check: 'C7', msg: `H3 at line ${i + 1} is ${words.length} words — max 12 (see 10-copy-voice.md §11.4)` });
      }
    }
  });
}

// C8: No purple. Matches Tailwind utility classes for purple / violet / indigo / fuchsia
// on any visual property, and hex values in the purple-hue range (roughly 240°–300°).
// The design system bans purple outright (CLAUDE.md §3; 02-colour-rules.md §3.2).
// Hex-range detection is heuristic — it catches obvious cases like #6b21a8, #a855f7, #d946ef
// without flagging project-specific warm tokens. For ambiguous cases, the design-reviewer agent
// is the escalation path.
const PURPLE_CLASS_RE = /\b(bg|text|border|ring|outline|from|to|via|fill|stroke|decoration|divide|caret|accent)-(purple|violet|indigo|fuchsia)(-\d{1,3})?(\/\d+)?/;
function checkC8(lines, violations) {
  lines.forEach((line, i) => {
    if (isComment(line) || line.includes('YIELD-FORKED')) return;
    const m = line.match(PURPLE_CLASS_RE);
    if (m) {
      violations.push({ check: 'C8', msg: `purple class "${m[0]}" at line ${i + 1} — see 02-colour-rules.md §3.2 (no purple, ever)` });
    }
  });
}

// C9: Every Yielde site must ship with <CursorProvider /> in app/layout.tsx (CLAUDE.md §3 rule 7,
// 11-fingerprint.md §1). This check fires only when layout.tsx is edited and asserts the component
// is still rendered. It does NOT fire on other files — a missing CursorProvider in a non-layout
// file is correct.
function checkC9(lines, violations, filePath) {
  const basename = path.basename(filePath);
  if (basename !== 'layout.tsx') return;
  const joined = lines.join('\n');
  // Match either `<CursorProvider ... />` self-close or `<CursorProvider>...</CursorProvider>`.
  if (!/<CursorProvider\b/.test(joined)) {
    violations.push({
      check: 'C9',
      msg: `CursorProvider not present in layout.tsx — mandatory fingerprint element (see 11-fingerprint.md §1)`,
    });
  }
}
