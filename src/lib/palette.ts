// Improvement 1: Preset application via ramp-role detection — maps preset colours to whatever naming convention the project uses (--fern-0 or --ramp1-0) without hardcoding names.
// Improvement 2: Live-reference persistence for semantic remaps — stores var(--fern-2) not a hex snapshot, so Panel A anchor edits and Panel B remappings always resolve through the same chain.

// ── Types ─────────────────────────────────────────────────────────────────────

export type AnchorMap = Record<string, string>
export type SemanticMap = Record<string, string>  // { 'bg': 'hay-6' }
export type ResolvedMap = Record<string, string>  // { 'bg': '#f7f4ed' }

export type WcagResult = {
  pair:  string
  fg:    string
  bg:    string
  ratio: number
  aa:    boolean
  aaa:   boolean
}

export type PersistedPalette = {
  anchors:  AnchorMap
  semantic: Record<string, string>  // { 'accent': 'var(--fern-2)' } — live refs
}

export type Preset = {
  name:  string
  ramp1: Record<string, string>  // stop → hex (structural ramp, fg anchor)
  ramp2: Record<string, string>  // stop → hex (accent/surface ramp, bg anchor)
  ramp3: Record<string, string>  // stop → hex (danger ramp)
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const SEMANTIC_TOKENS = [
  'bg', 'bg-raised', 'bg-subtle', 'bg-inverse', 'bg-newsprint',
  'fg', 'fg-muted', 'fg-quiet', 'fg-inverse', 'fg-inverse-muted',
  'rule', 'rule-strong',
  'accent', 'accent-ink', 'accent-hover',
  'stat', 'stat-ink',
  'danger', 'danger-ink',
] as const

export type SemanticToken = (typeof SEMANTIC_TOKENS)[number]

export const WCAG_PAIRS: [SemanticToken, SemanticToken][] = [
  ['fg',          'bg'],
  ['fg-muted',    'bg'],
  ['accent-ink',  'accent'],
  ['fg-inverse',  'bg-inverse'],
  ['stat-ink',    'stat'],
  ['danger-ink',  'danger'],
]

export const TOKEN_ROLES: Record<SemanticToken, string> = {
  'bg':               'Page background',
  'bg-raised':        'Cards, elevated surfaces',
  'bg-subtle':        'Secondary surfaces',
  'bg-inverse':       'Dark band, header chrome',
  'bg-newsprint':     'Editorial / muted background',
  'fg':               'Primary body text',
  'fg-muted':         'Secondary text',
  'fg-quiet':         'Tertiary, labels',
  'fg-inverse':       'Text on dark band',
  'fg-inverse-muted': 'Subdued text on dark band',
  'rule':             'Borders, 1px hairlines',
  'rule-strong':      'Emphasized borders',
  'accent':           'CTAs, brand emphasis',
  'accent-ink':       'Text on accent background',
  'accent-hover':     'Accent hover state',
  'stat':             'Data tile background',
  'stat-ink':         'Text on stat tile',
  'danger':           'Error states',
  'danger-ink':       'Text on danger background',
}

// Ramp 1 = structural (fg anchor), Ramp 2 = surface/accent (bg anchor), Ramp 3 = danger
export const PRESETS: Record<string, Preset> = {
  'garden-route': {
    name:  'Garden Route',
    ramp1: { '0': '#1a2416', '1': '#2e3d28', '3': '#56703f', '4': '#7a8c5e', '5': '#a4b490', '6': '#d0dcbe' },
    ramp2: { '1': '#5c3d2e', '3': '#d4aa6a', '5': '#ede8d8', '6': '#f7f4ed' },
    ramp3: { '2': '#8c5040' },
  },
  'slate-steel': {
    name:  'Slate & Steel',
    ramp1: { '0': '#0e1117', '1': '#1c2432', '3': '#3d4f6b', '4': '#5b7099', '5': '#8fa3bf', '6': '#c8d6e8' },
    ramp2: { '1': '#1a2d4a', '3': '#4a7fc1', '5': '#d0dff0', '6': '#f0f4fa' },
    ramp3: { '2': '#8c3030' },
  },
  'ocean-mist': {
    name:  'Ocean Mist',
    ramp1: { '0': '#0d1e1c', '1': '#1a3330', '3': '#2e6b62', '4': '#4a8c80', '5': '#7ab0a8', '6': '#c0dcd8' },
    ramp2: { '1': '#1a3830', '3': '#38c0a8', '5': '#c8f0e8', '6': '#f0faf8' },
    ramp3: { '2': '#8c4040' },
  },
  'terracotta': {
    name:  'Terracotta Warm',
    ramp1: { '0': '#1a100a', '1': '#2e1e14', '3': '#6b3c28', '4': '#8c5a42', '5': '#b88c78', '6': '#e0c8bc' },
    ramp2: { '1': '#4a2016', '3': '#c87840', '5': '#f0d8c0', '6': '#faf4ef' },
    ramp3: { '2': '#8c2a2a' },
  },
}

const STORAGE_KEY = 'yielde-palette'

// Matches --fern-0, --hay-3, --ramp1-0 — single-digit stop suffix only.
const ANCHOR_RE = /^--([a-z][a-z\d]*)-(\d)$/

// ── Root var I/O ──────────────────────────────────────────────────────────────

function collectRootVars(rules: CSSRuleList, names: Set<string>): void {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
      for (let i = 0; i < rule.style.length; i++) {
        const n = rule.style[i]
        if (n.startsWith('--')) names.add(n)
      }
    } else if ('cssRules' in rule) {
      // Recurse into @layer, @media, @supports blocks.
      collectRootVars((rule as CSSGroupingRule).cssRules, names)
    }
  }
}

export function readRootVars(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const computed = getComputedStyle(document.documentElement)
  const names = new Set<string>()

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      collectRootVars(sheet.cssRules, names)
    } catch { /* cross-origin sheet */ }
  }

  // Include any inline overrides applied by PaletteProvider.
  for (let i = 0; i < document.documentElement.style.length; i++) {
    const name = document.documentElement.style[i]
    if (name.startsWith('--')) names.add(name)
  }

  const result: Record<string, string> = {}
  for (const name of names) {
    result[name] = computed.getPropertyValue(name).trim()
  }
  return result
}

export function setRootVar(name: string, value: string): void {
  if (typeof window === 'undefined') return
  document.documentElement.style.setProperty(name, value)
}

// ── Parse ─────────────────────────────────────────────────────────────────────

export function parseAnchors(vars: Record<string, string>): AnchorMap {
  const anchors: AnchorMap = {}
  for (const [key, val] of Object.entries(vars)) {
    if (ANCHOR_RE.test(key) && /^#[0-9a-fA-F]{3,6}$/.test(val)) {
      anchors[key.slice(2)] = val  // '--fern-0' → 'fern-0'
    }
  }
  return anchors
}

export function parseSemantic(vars: Record<string, string>): SemanticMap {
  const semantic: SemanticMap = {}
  for (const token of SEMANTIC_TOKENS) {
    const val = vars[`--${token}`]
    if (!val) continue
    // Only single-stop anchor refs (e.g. var(--fern-3)) are matched.
    // Chained, computed, or color-mix() values are intentionally ignored.
    const match = val.match(/var\(--([a-z][a-z\d]*-\d)\)/)
    if (match) semantic[token] = match[1]  // 'hay-6', 'ramp2-6', etc.
  }
  return semantic
}

export function resolveTokens(anchors: AnchorMap, semantic: SemanticMap): ResolvedMap {
  const resolved: ResolvedMap = {}
  for (const [token, stop] of Object.entries(semantic)) {
    if (anchors[stop]) resolved[token] = anchors[stop]
  }
  return resolved
}

// Groups anchors by ramp name: { fern: { '0': '#hex', '1': '#hex' }, hay: {...} }
export function groupAnchors(anchors: AnchorMap): Record<string, Record<string, string>> {
  const groups: Record<string, Record<string, string>> = {}
  for (const [key, hex] of Object.entries(anchors)) {
    const m = key.match(/^([a-z][a-z\d]*)-(\d)$/)
    if (!m) continue
    const [, ramp, stop] = m
    groups[ramp] ??= {}
    groups[ramp][stop] = hex
  }
  return groups
}

// ── WCAG ──────────────────────────────────────────────────────────────────────

function toLinear(c: number): number {
  const n = c / 255
  return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  const r = toLinear(parseInt(full.slice(0, 2), 16))
  const g = toLinear(parseInt(full.slice(2, 4), 16))
  const b = toLinear(parseInt(full.slice(4, 6), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker  = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function wcagPairs(resolved: ResolvedMap): WcagResult[] {
  return WCAG_PAIRS.map(([fgToken, bgToken]) => {
    const fgHex = resolved[fgToken] ?? '#000000'
    const bgHex = resolved[bgToken] ?? '#ffffff'
    const ratio = contrastRatio(fgHex, bgHex)
    return {
      pair:  `${fgToken} / ${bgToken}`,
      fg:    fgHex,
      bg:    bgHex,
      ratio: Math.round(ratio * 100) / 100,
      aa:    ratio >= 4.5,
      aaa:   ratio >= 7,
    }
  })
}

// ── Ramp generation (ported from tools/generate-palette.js) ──────────────────

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d   = max - min
  let h = 0
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))

  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + 6) % 6; break
      case g: h = (b - r) / d + 2;       break
      case b: h = (r - g) / d + 4;       break
    }
    h *= 60
  }
  return [h, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
      .toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function shortestHueArc(from: number, to: number): number {
  let d = to - from
  if (d > 180)  d -= 360
  if (d < -180) d += 360
  return d
}

export function generateRamp(base: string, dark: string, name: string): AnchorMap {
  const [bh, bs, bl] = hexToHsl(base)
  const [dh, , dl]   = hexToHsl(dark)
  // Saturation is held constant at the base value across all stops — intentional.
  // Dark near-neutral anchors (e.g. #0e1117) use the base saturation, not their own.
  const stops = 7
  const result: AnchorMap = {}

  for (let i = 0; i < stops; i++) {
    const t  = i / (stops - 1)
    const h  = (dh + shortestHueArc(dh, bh) * t + 360) % 360
    const ll = dl + (Math.min(bl + 0.38, 0.95) - dl) * t
    result[`${name}-${i}`] = hslToHex(h, bs, ll)
  }

  // Pin the two anchor endpoints exactly.
  result[`${name}-0`] = dark
  result[`${name}-6`] = hslToHex(bh, bs * 0.35, Math.min(bl + 0.38, 0.95))

  return result
}

// ── Ramp role detection ───────────────────────────────────────────────────────

export function detectRampRoles(semantic: SemanticMap): {
  ramp1: string
  ramp2: string
  ramp3: string
} {
  const strip = (s: string | undefined) => s?.replace(/-\d$/, '') ?? null
  return {
    ramp1: strip(semantic['fg'])     ?? 'ramp1',
    ramp2: strip(semantic['bg'])     ?? 'ramp2',
    ramp3: strip(semantic['danger']) ?? 'ramp3',
  }
}

export function applyPreset(preset: Preset, semantic: SemanticMap): void {
  if (typeof window === 'undefined') return
  const { ramp1, ramp2, ramp3 } = detectRampRoles(semantic)
  const push = (role: string, stops: Record<string, string>) => {
    for (const [stop, hex] of Object.entries(stops)) {
      setRootVar(`--${role}-${stop}`, hex)
    }
  }
  push(ramp1, preset.ramp1)
  push(ramp2, preset.ramp2)
  push(ramp3, preset.ramp3)
}

// ── Persistence ───────────────────────────────────────────────────────────────

export function persistPalette(
  anchors: AnchorMap,
  semantic: Record<string, string>,  // values are 'var(--stop)' live refs
): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ anchors, semantic }))
}

export function loadPersistedPalette(): PersistedPalette | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedPalette
  } catch {
    return null
  }
}

export function clearPersistedPalette(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// ── CSS output ────────────────────────────────────────────────────────────────

export function toCssBlock(anchors: AnchorMap): string {
  const lines = Object.entries(anchors)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  --${k}: ${v};`)
  return `:root {\n${lines.join('\n')}\n}`
}
