// Yielde-System hooks v1.1 — error surfacing parity with post-edit-component.js v1.2
'use strict';

const fs = require('fs');
const path = require('path');

// Collect stdin
let raw = '';
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => { main(raw); });

// ENOENT is "file genuinely absent — fall through to a warning that describes the missing
// precondition"; anything else is a hook bug and must surface to stderr rather than exit silently.
function readOrWarn(p, label) {
  try {
    return { ok: true, content: fs.readFileSync(p, 'utf8') };
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      process.stderr.write(`[post-edit-globals] ${label} not found at ${p} — drift check skipped\n`);
    } else {
      process.stderr.write(`[post-edit-globals] read failed for ${p}: ${err?.message ?? err}\n`);
    }
    return { ok: false };
  }
}

function main(raw) {
  // Parse PostToolUse payload
  let payload;
  try { payload = JSON.parse(raw); } catch { process.exit(0); }

  const filePath = payload?.tool_input?.file_path;
  if (!filePath) process.exit(0);

  // Self-guard: only fires on globals.css edits
  if (!filePath.endsWith('globals.css')) process.exit(0);

  // Determine system dir and log path
  // System dir has a state/ subdirectory; client repos do not
  const cwd = process.cwd();
  const isSystemDir = fs.existsSync(path.join(cwd, 'state'));
  const systemDir = isSystemDir ? cwd : path.join(cwd, '..', 'Yielde-System');
  const logPath = isSystemDir
    ? path.join(cwd, 'state', 'hook-log.md')
    : path.join(cwd, '.claude', 'hook-log.md');

  // Read state/active.md for active slug
  const activePath = path.join(systemDir, 'state', 'active.md');
  const active = readOrWarn(activePath, 'state/active.md');
  if (!active.ok) process.exit(0);

  const slugMatch = active.content.match(/^slug:\s*(.+)$/m);
  if (!slugMatch) {
    process.stderr.write('[post-edit-globals] no slug line in state/active.md — drift check skipped\n');
    process.exit(0);
  }
  const slug = slugMatch[1].trim();

  // Read anchor block from state/projects/[slug].md
  const projectPath = path.join(systemDir, 'state', 'projects', `${slug}.md`);
  const project = readOrWarn(projectPath, `state/projects/${slug}.md`);
  if (!project.ok) process.exit(0);

  const anchorTokens = parseAnchorBlock(project.content);
  if (!anchorTokens.size) {
    process.stderr.write(`[post-edit-globals] no anchor tokens in ${projectPath} — drift check skipped\n`);
    process.exit(0);
  }

  // Read the edited globals.css
  const globals = readOrWarn(filePath, 'globals.css');
  if (!globals.ok) process.exit(0);
  const globalsContent = globals.content;

  const globalsTokens = parseGlobalsAnchors(globalsContent);

  // Diff: anchor block tokens vs globals.css hex values
  const violations = [];
  for (const [token, briefHex] of anchorTokens) {
    const globalsHex = globalsTokens.get(token);
    if (!globalsHex) {
      violations.push(`anchor token ${token} absent from globals.css (expected ${briefHex})`);
    } else if (briefHex.toLowerCase() !== globalsHex.toLowerCase()) {
      violations.push(`${token} drifted: expected ${briefHex}, got ${globalsHex}`);
    }
  }

  if (!violations.length) process.exit(0);

  // Log each violation and exit non-zero
  const today = new Date().toISOString().slice(0, 10);
  const relFile = path.relative(cwd, path.resolve(filePath));
  ensureDir(path.dirname(logPath));

  for (const msg of violations) {
    const entry = `${today} | post-edit-globals | ${relFile} | DRIFT | ${msg}\n`;
    try {
      fs.appendFileSync(logPath, entry, 'utf8');
    } catch {
      process.stderr.write(`[post-edit-globals] Warning: could not write to ${logPath}\n`);
    }
    process.stdout.write(entry);
  }

  process.exit(1);
}

function ensureDir(dir) {
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
}

// Parse anchor block tokens from state/projects/[slug].md
// Two notations are in use across real project files and both must be supported:
//   1. Colon form  — `--copper-0: #2c3e1a   /* deepest */`  (older briefs, /orient output)
//   2. Pipe-table  — `| \`--ramp1-0\` | \`#07242c\` |`        (brief-intake default, current scaffold briefs)
// Backticks and the optional star-marker `★` used on primary anchor stops are stripped.
// Returns a Map of token → hex.
function parseAnchorBlock(content) {
  const tokens = new Map();
  const colonRe = /^\s*(--[a-z][a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\b/;
  const pipeRe = /^\s*\|\s*`?(--[a-z][a-z0-9-]+)`?\s*(?:★\s*)?\|\s*`?(#[0-9a-fA-F]{3,8})`?\s*\|/;
  for (const line of content.split('\n')) {
    const m = line.match(colonRe) ?? line.match(pipeRe);
    if (m) tokens.set(m[1], m[2]);
  }
  return tokens;
}

// Parse direct hex assignments from globals.css
// Only matches lines with a literal hex value — var() references are skipped
// Matches lines like:  --copper-0: #2c3e1a;
function parseGlobalsAnchors(content) {
  const tokens = new Map();
  const re = /^\s*(--[a-z][a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\b/;
  for (const line of content.split('\n')) {
    const m = line.match(re);
    if (m) tokens.set(m[1], m[2]);
  }
  return tokens;
}
