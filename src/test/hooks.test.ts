// Unit tests for the Yielde-System post-edit hooks.
//
// The hooks are Node CLIs that read a JSON payload on stdin and write violations to stdout +
// the project hook-log. We test them as black boxes via execSync — synthesising a payload,
// writing a tmp source file, invoking the hook, and asserting on exit code + stdout contents.
//
// The hooks live one directory up from this scaffold:
//   ../.claude/hooks/post-edit-component.js
//   ../.claude/hooks/post-edit-globals.js
// When a client repo runs `vitest` the hooks are mirrored at `.claude/hooks/` inside the
// client repo via `/new-project`. The test resolves the hook path in both layouts.
//
// Each test writes its fixture under scaffold/src/test/__fixtures__/ and cleans up after
// itself. The hook's own hook-log append is diverted by running with cwd=os.tmpdir() — the
// hook detects "no state/ dir" and writes to a tmp .claude/hook-log.md which we ignore.

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Resolve the hook path. Priority: sibling `.claude/hooks/` (client repo layout),
// then `../.claude/hooks/` (scaffold tested from inside Yielde-System).
function resolveHookPath(name: string): string {
  const clientRepo = resolve(__dirname, '../../.claude/hooks', name);
  const systemRepo = resolve(__dirname, '../../../.claude/hooks', name);
  if (existsSync(clientRepo)) return clientRepo;
  if (existsSync(systemRepo)) return systemRepo;
  throw new Error(`Hook not found at ${clientRepo} or ${systemRepo}`);
}

// Resolve the authoritative banned-phrases.yml — the one the hook is supposed to read.
// We mirror it into the fixture dir so the hook's CWD-relative lookup finds it.
function resolveBannedPhrasesPath(): string {
  const candidates = [
    resolve(__dirname, '../../knowledge/copy-voice/banned-phrases.yml'),
    resolve(__dirname, '../../../knowledge/copy-voice/banned-phrases.yml'),
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  throw new Error(`banned-phrases.yml not found at ${candidates.join(' or ')}`);
}

const FIXTURE_DIR = join(__dirname, '__fixtures__');

beforeAll(() => {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  // Mirror banned-phrases.yml into FIXTURE_DIR/knowledge/copy-voice/ so that when we run the
  // hook with cwd=FIXTURE_DIR, its `loadBannedCtas()` lookup resolves. Without this, the CTA
  // list is empty and C5 becomes a silent pass for every input — which would mask real
  // false-positive regressions in the word-boundary / attribute-exclusion logic.
  const bannedDir = join(FIXTURE_DIR, 'knowledge', 'copy-voice');
  mkdirSync(bannedDir, { recursive: true });
  writeFileSync(
    join(bannedDir, 'banned-phrases.yml'),
    readFileSync(resolveBannedPhrasesPath(), 'utf8'),
    'utf8',
  );
});

afterAll(() => {
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

interface HookResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function runHook(hookName: string, filePath: string): HookResult {
  const hook = resolveHookPath(hookName);
  const payload = JSON.stringify({ tool_input: { file_path: filePath } });
  try {
    const stdout = execSync(`node "${hook}"`, {
      input: payload,
      encoding: 'utf8',
      // Run from FIXTURE_DIR — the hook sees banned-phrases.yml via the mirrored tree, and
      // since FIXTURE_DIR has no `state/` subdir the hook writes its log to
      // FIXTURE_DIR/.claude/hook-log.md which afterAll cleans.
      cwd: FIXTURE_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { exitCode: 0, stdout, stderr: '' };
  } catch (err) {
    const e = err as { status?: number; stdout?: Buffer | string; stderr?: Buffer | string };
    return {
      exitCode: e.status ?? 1,
      stdout: e.stdout?.toString() ?? '',
      stderr: e.stderr?.toString() ?? '',
    };
  }
}

function writeFixture(name: string, body: string): string {
  const p = join(FIXTURE_DIR, name);
  writeFileSync(p, body, 'utf8');
  return p;
}

// ── post-edit-component.js ────────────────────────────────────────────────────

describe('post-edit-component — C1 raw hex', () => {
  it('flags 6-char hex', () => {
    const f = writeFixture('c1-6char.tsx', 'export const X = () => <div style={{ color: "#d4aa6a" }} />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C1 \| raw hex #d4aa6a/);
  });

  it('flags 8-char hex (alpha channel)', () => {
    const f = writeFixture('c1-8char.tsx', 'export const X = () => <div style={{ color: "#d4aa6a80" }} />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C1 \| raw hex #d4aa6a80/);
  });

  it('skips hex in // YIELD-FORKED lines', () => {
    const f = writeFixture('c1-forked.tsx', 'const base = "#d4aa6a"; // YIELD-FORKED\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });

  it('skips hex in comment lines', () => {
    const f = writeFixture('c1-comment.tsx', '// color was #d4aa6a before migration\nexport const X = 1;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — C2 rounded outside button', () => {
  it('flags rounded-md on a div', () => {
    const f = writeFixture('c2-div.tsx', 'export const X = () => <div className="rounded-md bg-bg" />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C2 \| rounded-\*/);
  });

  it('allows rounded-md on a JSX <button>', () => {
    const f = writeFixture('c2-button.tsx', 'export const X = () => <button className="rounded-md bg-accent" />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });

  it('allows rounded-md on a JSX <Button> (custom component)', () => {
    const f = writeFixture('c2-Button.tsx', 'export const X = () => <Button className="rounded-md" />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });

  it('does NOT false-positive on identifiers containing "button"', () => {
    // The pre-hardening regex matched `buttonVariants` because it was a substring search.
    const f = writeFixture('c2-identifier.tsx', 'const buttonVariants = {};\nconst X = () => <div className="rounded-md" />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    // The div should still be flagged, but not exempted by the identifier.
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C2/);
  });

  it('allows rounded-none anywhere', () => {
    const f = writeFixture('c2-none.tsx', 'export const X = () => <div className="rounded-none" />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — C3 shadow', () => {
  it('flags shadow-lg utility', () => {
    const f = writeFixture('c3-lg.tsx', 'export const X = () => <div className="shadow-lg" />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C3/);
  });

  it('allows shadow-none', () => {
    const f = writeFixture('c3-none.tsx', 'export const X = () => <div className="shadow-none" />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — C4 ramp tokens', () => {
  it('flags --ramp1- in a component', () => {
    const f = writeFixture('c4-ramp.tsx', 'export const X = () => <div style={{ color: "var(--ramp1-0)" }} />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C4 \| ramp token --ramp1-/);
  });

  it('flags --copper- ramp', () => {
    const f = writeFixture('c4-copper.tsx', 'export const X = () => <div className="text-[--copper-3]" />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C4 \| ramp token --copper-/);
  });

  it('allows semantic tokens', () => {
    const f = writeFixture('c4-semantic.tsx', 'export const X = () => <div style={{ color: "var(--accent)" }} />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — C5 banned CTAs (attribute-aware)', () => {
  it('flags >Submit< as JSX text', () => {
    const f = writeFixture('c5-jsx.tsx', 'export const X = () => <Button>Submit</Button>;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C5 \| banned CTA "submit"/);
  });

  it('does NOT flag type="submit" attribute', () => {
    const f = writeFixture('c5-attr.tsx', 'export const X = () => <input type="submit" />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });

  it('does NOT flag onSubmit event handler', () => {
    const f = writeFixture('c5-onSubmit.tsx', 'export const Form = () => <form onSubmit={handleSubmit} />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });

  it('does NOT flag handleSubmit identifier', () => {
    const f = writeFixture('c5-handler.tsx', 'const handleSubmit = () => {};\nexport const X = 1;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — C6 spec-notation typography', () => {
  it('flags var(--t-display-m)', () => {
    const f = writeFixture('c6-t.tsx', 'export const X = () => <h1 style={{ fontSize: "var(--t-display-m)" }} />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C6/);
  });

  it('allows the wired name var(--text-display-m)', () => {
    const f = writeFixture('c6-text.tsx', 'export const X = () => <h1 style={{ fontSize: "var(--text-display-m)" }} />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — C8 no purple', () => {
  it('flags bg-purple-500', () => {
    const f = writeFixture('c8-purple.tsx', 'export const X = () => <div className="bg-purple-500" />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C8 \| purple class "bg-purple-500"/);
  });

  it('flags text-violet-300', () => {
    const f = writeFixture('c8-violet.tsx', 'export const X = () => <p className="text-violet-300" />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C8/);
  });

  it('flags border-indigo-400', () => {
    const f = writeFixture('c8-indigo.tsx', 'export const X = () => <div className="border-indigo-400" />;\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C8/);
  });

  it('does NOT flag rose (warm-family accent, permitted)', () => {
    const f = writeFixture('c8-rose.tsx', 'export const X = () => <div className="text-rose-900" />;\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    // The hook intentionally does not ban rose. The design-reviewer agent is the judgement
    // layer for warm-family tones that dip into magenta.
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — C9 CursorProvider mandate', () => {
  it('flags layout.tsx missing CursorProvider', () => {
    const f = writeFixture('layout.tsx', 'export default function RootLayout({ children }) { return <html><body>{children}</body></html>; }\n');
    const { exitCode, stdout } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/C9 \| CursorProvider not present/);
  });

  it('passes layout.tsx with <CursorProvider />', () => {
    const f = writeFixture('layout.tsx', 'import CursorProvider from "./CursorProvider";\nexport default function RootLayout({ children }) { return <html><body><CursorProvider />{children}</body></html>; }\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });

  it('does NOT check non-layout files for CursorProvider', () => {
    const f = writeFixture('page.tsx', 'export default function Page() { return <main />; }\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });
});

describe('post-edit-component — no-op paths', () => {
  it('exits 0 for non-ts/tsx files', () => {
    const f = writeFixture('readme.md', '# banned word: #d4aa6a\n');
    const { exitCode } = runHook('post-edit-component.js', f);
    expect(exitCode).toBe(0);
  });

  it('exits 0 (ENOENT tolerated) on missing file', () => {
    const { exitCode } = runHook('post-edit-component.js', join(FIXTURE_DIR, 'does-not-exist.tsx'));
    expect(exitCode).toBe(0);
  });
});
