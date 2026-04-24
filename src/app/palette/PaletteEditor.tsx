// Improvement 1: Parallel refs (anchorsRef, semanticRef) mirror state to eliminate stale-closure bugs in all callbacks — refs update synchronously while setState batches, so cross-state calculations always use current values.
// Improvement 2: All DOM-mutating side effects (applyPreset, generateRamp) follow the setTimeout+refresh() pattern — re-reading :root after the event loop turn ensures React state stays in sync with whatever the DOM actually resolved.
// Template: none — spec build.

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  readRootVars, parseAnchors, parseSemantic, resolveTokens,
  groupAnchors, wcagPairs, setRootVar, persistPalette,
  clearPersistedPalette, toCssBlock, applyPreset, generateRamp,
  detectRampRoles,
  SEMANTIC_TOKENS, TOKEN_ROLES, PRESETS,
  type AnchorMap, type SemanticMap, type ResolvedMap, type WcagResult,
} from '@/lib/palette'

// ── Helpers ───────────────────────────────────────────────────────────────────

function isHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v)
}

function stopLabel(stop: string): string {
  const labels: Record<string, string> = {
    '0': 'deepest',
    '1': 'dark surfaces',
    '2': 'danger / emphasis',
    '3': 'accent / secondary text',
    '4': 'tertiary text',
    '5': 'borders / subtle',
    '6': 'page background',
  }
  return labels[stop] ?? `stop ${stop}`
}

function rampRoleLabel(rampName: string, roles: ReturnType<typeof detectRampRoles>): string {
  if (rampName === roles.ramp1) return 'structural'
  if (rampName === roles.ramp2) return 'accent / surface'
  if (rampName === roles.ramp3) return 'danger'
  return ''
}

// ── Overline ──────────────────────────────────────────────────────────────────

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-overline uppercase tracking-micro text-fg-quiet mb-4">
      {children}
    </p>
  )
}

// ── Swatch ────────────────────────────────────────────────────────────────────

function Swatch({ hex, size = 40 }: { hex: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 border border-rule"
      // PALETTE-TOOL: raw hex intentional — this component exists to display colour values
      style={{ width: size, height: size, background: isHex(hex) ? hex : 'transparent' }}
      aria-hidden="true"
    />
  )
}

// ── WCAG badge ────────────────────────────────────────────────────────────────

function WcagBadge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={[
        'inline-block px-[9px] py-[2px] font-mono text-micro uppercase tracking-badge',
        pass ? 'bg-accent text-accent-ink' : 'border border-rule text-fg-quiet',
      ].join(' ')}
    >
      {label}
    </span>
  )
}

// ── Panel A — Ramp Editor ─────────────────────────────────────────────────────

interface PanelAProps {
  anchors:    AnchorMap
  semantic:   SemanticMap
  onChange:   (key: string, hex: string) => void
  onGenerate: (rampName: string, base: string, dark: string) => void
}

function PanelARampEditor({ anchors, semantic, onChange, onGenerate }: PanelAProps) {
  const groups    = groupAnchors(anchors)
  const roles     = detectRampRoles(semantic)
  const rampNames = Object.keys(groups).sort()
  const [genBase,   setGenBase]   = useState('#888888')
  const [genDark,   setGenDark]   = useState('#111111')
  const [genTarget, setGenTarget] = useState('')

  const target = genTarget || roles.ramp1

  return (
    <section className="space-y-8">
      <Overline>Ramp Editor</Overline>

      {rampNames.map(ramp => (
        <div key={ramp} className="space-y-1">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-display text-display-micro text-fg leading-display-tight">
              {ramp}
            </span>
            {rampRoleLabel(ramp, roles) && (
              <span className="font-mono text-micro uppercase tracking-badge text-fg-quiet">
                {rampRoleLabel(ramp, roles)}
              </span>
            )}
          </div>
          {Object.entries(groups[ramp])
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([stop, hex]) => (
              <AnchorRow
                key={`${ramp}-${stop}`}
                anchorKey={`${ramp}-${stop}`}
                hex={hex}
                label={stopLabel(stop)}
                onChange={onChange}
              />
            ))}
        </div>
      ))}

      <div className="border-t border-rule pt-6 space-y-3">
        <Overline>Generate ramp</Overline>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <label className="space-y-1">
            <span className="font-mono text-micro uppercase tracking-badge text-fg-quiet block">
              Base colour
            </span>
            <input
              type="text"
              value={genBase}
              onChange={e => setGenBase(e.target.value)}
              placeholder="#888888"
              className="w-full border-b border-rule bg-transparent px-0 py-2 font-mono text-body-xs text-fg focus:border-accent focus:outline-none"
            />
          </label>
          <label className="space-y-1">
            <span className="font-mono text-micro uppercase tracking-badge text-fg-quiet block">
              Dark anchor
            </span>
            <input
              type="text"
              value={genDark}
              onChange={e => setGenDark(e.target.value)}
              placeholder="#111111"
              className="w-full border-b border-rule bg-transparent px-0 py-2 font-mono text-body-xs text-fg focus:border-accent focus:outline-none"
            />
          </label>
          <div className="space-y-1">
            <span className="font-mono text-micro uppercase tracking-badge text-fg-quiet block">
              Into ramp
            </span>
            <select
              value={target}
              onChange={e => setGenTarget(e.target.value)}
              className="border-b border-rule bg-transparent px-0 py-2 font-mono text-body-xs text-fg focus:border-accent focus:outline-none"
            >
              {rampNames.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { if (isHex(genBase) && isHex(genDark)) onGenerate(target, genBase, genDark) }}
          disabled={!isHex(genBase) || !isHex(genDark)}
          className="bg-fg text-fg-inverse px-[22px] py-[14px] font-sans text-body-xs font-medium uppercase tracking-button transition-colors duration-[120ms] motion-reduce:transition-none hover:bg-accent hover:text-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate →
        </button>
      </div>
    </section>
  )
}

// ── Anchor row ────────────────────────────────────────────────────────────────

interface AnchorRowProps {
  anchorKey: string
  hex:       string
  label:     string
  onChange:  (key: string, hex: string) => void
}

function AnchorRow({ anchorKey, hex, label, onChange }: AnchorRowProps) {
  const [draft, setDraft] = useState(hex)
  const [error, setError] = useState(false)

  useEffect(() => { setDraft(hex) }, [hex])

  const commit = () => {
    if (isHex(draft)) { setError(false); onChange(anchorKey, draft) }
    else setError(true)
  }

  return (
    <div className="flex items-center gap-3 py-1">
      <span className="w-4 shrink-0 font-mono text-micro text-fg-quiet">
        {anchorKey.split('-').pop()}
      </span>
      <Swatch hex={hex} />
      <input
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => e.key === 'Enter' && commit()}
        className={[
          'w-28 border-b bg-transparent px-0 py-1 font-mono text-body-xs focus:outline-none',
          error ? 'border-danger text-danger' : 'border-rule text-fg focus:border-accent',
        ].join(' ')}
        aria-label={`${anchorKey} hex value`}
      />
      <span className="font-mono text-micro text-fg-quiet">{label}</span>
    </div>
  )
}

// ── Panel B — Semantic Token Map ──────────────────────────────────────────────

interface PanelBProps {
  anchors:  AnchorMap
  semantic: SemanticMap
  resolved: ResolvedMap
  onRemap:  (token: string, newStop: string) => void
}

function PanelBTokenMap({ anchors, semantic, resolved, onRemap }: PanelBProps) {
  const stopOptions = Object.keys(anchors).sort()

  return (
    <section className="space-y-4">
      <Overline>Token Map</Overline>
      <div className="space-y-0">
        {SEMANTIC_TOKENS.map(token => {
          const currentStop = semantic[token] ?? ''
          const resolvedHex = resolved[token] ?? ''
          return (
            <div
              key={token}
              className="grid items-center gap-3 border-b border-rule py-1.5 last:border-0"
              style={{ gridTemplateColumns: '130px 1fr auto auto' }}
            >
              <span className="font-mono text-body-xs text-fg">--{token}</span>
              <span className="truncate font-mono text-micro text-fg-quiet">
                {TOKEN_ROLES[token]}
              </span>
              <select
                value={currentStop}
                onChange={e => { if (e.target.value) onRemap(token, e.target.value) }}
                className="border-b border-rule bg-transparent px-2 py-1 font-mono text-micro text-fg focus:border-accent focus:outline-none"
                aria-label={`Remap --${token}`}
              >
                {/* Empty option shown only when token has no mapping */}
                {!currentStop && <option value="">—</option>}
                {stopOptions.map(stop => (
                  <option key={stop} value={stop}>{stop}</option>
                ))}
              </select>
              <Swatch hex={resolvedHex} size={28} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Panel C — WCAG ────────────────────────────────────────────────────────────

function PanelCWcag({ results }: { results: WcagResult[] }) {
  const allPass = results.length > 0 && results.every(r => r.aa)

  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <Overline>WCAG Contrast</Overline>
        {results.length > 0 && (
          <span className={['font-mono text-micro uppercase tracking-badge', allPass ? 'text-accent' : 'text-danger'].join(' ')}>
            {allPass ? 'All AA pass' : 'AA failures'}
          </span>
        )}
      </div>
      <div className="space-y-1">
        {results.map(r => (
          <div
            key={r.pair}
            className={[
              'flex items-center gap-3 border-l-2 px-3 py-2',
              !r.aa  ? 'border-danger bg-bg-raised' :
              !r.aaa ? 'border-accent bg-bg-raised' :
                       'border-rule   bg-bg-raised',
            ].join(' ')}
          >
            {/* PALETTE-TOOL: raw hex intentional — displaying colour pair values */}
            <Swatch hex={r.fg} size={20} />
            <Swatch hex={r.bg} size={20} />
            <span className="flex-1 font-mono text-body-xs text-fg">{r.pair}</span>
            <span className="w-12 text-right font-mono text-body-xs text-fg-muted">
              {r.ratio}:1
            </span>
            <WcagBadge pass={r.aa}  label="AA"  />
            <WcagBadge pass={r.aaa} label="AAA" />
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Panel D — Presets & Actions ───────────────────────────────────────────────

interface PanelDProps {
  anchors:     AnchorMap
  onPreset:    (presetKey: string) => void
  onCopy:      () => void
  onReset:     () => void
  copied:      boolean
  saveBlocked: boolean
}

function PanelDActions({ anchors, onPreset, onCopy, onReset, copied, saveBlocked }: PanelDProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Overline>Presets</Overline>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => onPreset(key)}
              className="border border-rule px-4 py-3 text-left font-sans text-body-xs text-fg transition-colors duration-[120ms] motion-reduce:transition-none hover:border-accent hover:text-accent"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-rule pt-6">
        <Overline>Actions</Overline>
        <button
          type="button"
          onClick={onCopy}
          disabled={saveBlocked}
          className="w-full bg-accent px-[22px] py-[14px] font-sans text-body-xs font-medium uppercase tracking-button text-accent-ink transition-colors duration-[120ms] motion-reduce:transition-none hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? 'Copied ✓' : 'Copy CSS →'}
        </button>
        {saveBlocked && (
          <p className="font-mono text-micro text-danger">
            Fix WCAG AA failures before copying.
          </p>
        )}
        <button
          type="button"
          onClick={onReset}
          className="w-full border border-rule px-[22px] py-[14px] font-sans text-body-xs font-medium uppercase tracking-button text-fg transition-colors duration-[120ms] motion-reduce:transition-none hover:border-danger hover:text-danger"
        >
          Reset to defaults
        </button>

        {Object.keys(anchors).length > 0 && (
          <details className="border border-rule">
            <summary className="cursor-pointer px-4 py-3 font-mono text-body-xs text-fg-muted hover:text-fg">
              CSS output ↓
            </summary>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all bg-bg-raised px-4 py-4 font-mono text-micro text-fg-muted">
              {toCssBlock(anchors)}
            </pre>
          </details>
        )}
      </div>
    </section>
  )
}

// ── Root component ─────────────────────────────────────────────────────────────

export function PaletteEditor() {
  // Defence-in-depth: the server page.tsx already guards this, but protect against
  // accidental direct import in non-demo contexts.
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null

  const [anchors,  setAnchors]  = useState<AnchorMap>({})
  const [semantic, setSemantic] = useState<SemanticMap>({})
  const [resolved, setResolved] = useState<ResolvedMap>({})
  const [wcag,     setWcag]     = useState<WcagResult[]>([])
  const [copied,   setCopied]   = useState(false)

  // Parallel refs mirror state synchronously — callbacks read from refs to avoid
  // stale closures when two state slices are updated in the same interaction.
  const anchorsRef      = useRef<AnchorMap>({})
  const semanticRef     = useRef<SemanticMap>({})
  const semanticEditsRef = useRef<Record<string, string>>({})

  const refresh = useCallback(() => {
    const vars = readRootVars()
    const a    = parseAnchors(vars)
    const s    = parseSemantic(vars)
    const r    = resolveTokens(a, s)
    anchorsRef.current  = a
    semanticRef.current = s
    setAnchors(a)
    setSemantic(s)
    setResolved(r)
    setWcag(wcagPairs(r))
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const handleAnchorEdit = useCallback((key: string, hex: string) => {
    setRootVar(`--${key}`, hex)
    const next = { ...anchorsRef.current, [key]: hex }
    anchorsRef.current = next
    const r = resolveTokens(next, semanticRef.current)
    setAnchors(next)
    setResolved(r)
    setWcag(wcagPairs(r))
    persistPalette(next, semanticEditsRef.current)
  }, [])

  const handleSemanticRemap = useCallback((token: string, newStop: string) => {
    const ref  = `var(--${newStop})`
    setRootVar(`--${token}`, ref)
    const next = { ...semanticRef.current, [token]: newStop }
    semanticRef.current = next
    semanticEditsRef.current = { ...semanticEditsRef.current, [token]: ref }
    const r = resolveTokens(anchorsRef.current, next)
    setSemantic(next)
    setResolved(r)
    setWcag(wcagPairs(r))
    persistPalette(anchorsRef.current, semanticEditsRef.current)
  }, [])

  const handlePreset = useCallback((presetKey: string) => {
    const preset = PRESETS[presetKey]
    if (!preset) return
    applyPreset(preset, semanticRef.current)
    setTimeout(() => {
      refresh()
      persistPalette(anchorsRef.current, semanticEditsRef.current)
    }, 0)
  }, [refresh])

  const handleGenerate = useCallback((rampName: string, base: string, dark: string) => {
    const generated = generateRamp(base, dark, rampName)
    for (const [key, hex] of Object.entries(generated)) {
      setRootVar(`--${key}`, hex)
    }
    setTimeout(() => {
      refresh()
      persistPalette(anchorsRef.current, semanticEditsRef.current)
    }, 0)
  }, [refresh])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(toCssBlock(anchorsRef.current)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  const handleReset = useCallback(() => {
    clearPersistedPalette()
    window.location.reload()
  }, [])

  const saveBlocked = wcag.some(r => !r.aa)

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-rule bg-bg px-[var(--container-pad)]">
        <Link
          href="/"
          className="mr-8 font-mono text-body-xs uppercase tracking-micro text-fg-muted transition-colors duration-[120ms] motion-reduce:transition-none hover:text-fg"
        >
          ← Site
        </Link>
        <h1 className="font-display text-display-micro leading-display text-fg">
          Palette Editor
        </h1>
        <span className="ml-auto font-mono text-micro uppercase tracking-badge text-fg-quiet">
          Demo mode
        </span>
      </header>

      <div className="h-[6px] w-full bg-accent" />

      <div
        className="mx-auto grid gap-12 px-[var(--container-pad)] py-12"
        style={{ maxWidth: 'var(--container-max)', gridTemplateColumns: '1fr 320px' }}
      >
        <div className="min-w-0 space-y-16">
          {Object.keys(anchors).length === 0 ? (
            <p className="font-mono text-body-xs text-fg-muted">Loading palette…</p>
          ) : (
            <>
              <PanelARampEditor
                anchors={anchors}
                semantic={semantic}
                onChange={handleAnchorEdit}
                onGenerate={handleGenerate}
              />
              <PanelBTokenMap
                anchors={anchors}
                semantic={semantic}
                resolved={resolved}
                onRemap={handleSemanticRemap}
              />
            </>
          )}
        </div>

        <div className="space-y-12">
          <PanelCWcag results={wcag} />
          <PanelDActions
            anchors={anchors}
            onPreset={handlePreset}
            onCopy={handleCopy}
            onReset={handleReset}
            copied={copied}
            saveBlocked={saveBlocked}
          />
        </div>
      </div>
    </div>
  )
}
