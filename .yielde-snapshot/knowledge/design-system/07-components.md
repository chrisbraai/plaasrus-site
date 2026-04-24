# Components

### 8.1 Button

<!-- YIELDE:START -->
> **YIELD-FORKED** — do not run `shadcn add button` against button.tsx. See Q2 decision in state/decisions.md.
<!-- YIELDE:END -->

Four variants. No shadcn defaults. No `rounded-*`.

| Variant | bg | text | hover bg | Use |
|---|---|---|---|---|
| `primary` | `--accent` | `--accent-ink` | `--accent-hover` | Hero CTAs, pricing, form submit |
| `inverse` | `--fg` | `--bg` | `--accent` | <!-- YIELDE:START -->Header "Start a project"<!-- YIELDE:END --> |
| `ghost` | transparent | `--fg` | hover bg: `--fg` · hover text: `--bg` | Secondary hero CTA |
| `danger` | `--danger` | `--danger-ink` | darker danger | Destructive admin actions only. Never marketing. |

Padding: `14px 22px`. Font: `--font-sans` / 500 / `--t-body-xs` / `--ls-button`. Ghost: `1px solid var(--fg)`. `full` prop = 100% width.

### 8.2 Form controls

**Text input** — underlined, transparent bg. Font: Geist / 400 / `--t-body`. Padding: `12px 0`. Border-bottom: `1px solid var(--rule)`. Error state: `var(--danger)`. Focus: `var(--accent)` + effect #17.

**Textarea** — boxed. Border: `1px solid var(--rule)` all sides. Padding: 12px. Min-height: 140px. `resize: none`.

### 8.3 Badge

Zero radius. <!-- YIELDE:START -->6 tones: `typeset` · `copper` · `steel` · `newsprint` · `amber` · `outline`.<!-- YIELDE:END --> Padding: `4px 9px`. Font: `10/500/--ls-badge/uppercase`.

### 8.4 Overline

Above every section H2. `10/500/--ls-micro/uppercase`. Default `--fg-muted`. Hero uses `--accent`.

### 8.5 Stat

<!-- YIELDE:START -->
| Tone | bg | label | value |
|---|---|---|---|
| `typeset` | `--bg-raised` | `--fg-muted` | `--fg` |
| `copper` | `--accent` | `--stat-ink` | `--stat-ink` |
| `steel` | `--bg-subtle` | `--fg-quiet` | `--accent` |
| `newsprint` | `--bg-newsprint` | `--fg-muted` | `--fg` |
| `amber` | `--bg-raised` | `--fg-muted` | `--fg` |

Default row: 3× typeset + 1× copper highlight.
<!-- YIELDE:END -->
Padding: 24px. Value: `--font-display` / `clamp(36px, 3.6vw, 56px)` / 0.95 line-height.

### 8.6 Slab

Full-width rule. `color` default `--accent`. `h` default 6px. `animated` default false (effect #03 when true).

### 8.7 Icon

Lucide. Sizes: 20 / 28 / 36 / 40. `currentColor`. Do not mix with other icon sets. No emoji for decoration.

<!-- YIELDE:START -->
Permitted: `file-text` · `map-pin` · `zap` · `arrow-up-right` · `layers` · `brain-circuit` · `globe` · `mail` · `phone` · `github` · `x` · `menu`.

Developer-tooling exception: `palette` is permitted exclusively in `PaletteBadge.tsx` and `src/app/palette/`. It must not appear in client-facing UI components.
<!-- YIELDE:END -->

---

### 8.8 Accordion

Used for: FAQ sections, expandable service details, specification lists.

Zero-radius throughout. Do not use `shadcn/accordion` — it applies rounded defaults. Use `@radix-ui/react-accordion` directly.

**Trigger bar:** Full-width. Height 56px. Background `--bg-raised`. Left-border `2px solid var(--rule)`. Font: `--font-sans` / 500 / `--text-body`. Padding `0 24px`. Chevron: `arrow-up-right` at 16px, rotates 90° on open in `--dur-fast`.

**Open state:** Content panel reveals via `grid-template-rows: 0fr → 1fr` (animatable height without JS measurement). Duration `--dur-base: 200ms`. Easing `--ease`. Panel background `--bg`. Padding `16px 24px`.

**Left-border on open:** Trigger bar left-border upgrades `2px var(--rule) → 6px var(--accent)` when panel is open — the slab variant applied vertically. Duration `--dur-fast` at `steps(1)`.

**Reduced-motion:** content appears at full height immediately, no animation.

---

### 8.9 Notification / Toast

Used for: form success, async action feedback, field validation errors outside the form flow.

Hard-edged. No rounded corners. Positioned `fixed` bottom-right, 24px from edges. Multiple toasts stack upward: `bottom: calc(24px + index * (height + 8px))`.

**Success:** `2px solid var(--accent)` left-border. Background `--bg-raised`. Text `--fg`.

**Error:** `2px solid var(--danger)` left-border. Background `--bg-raised`. Error heading `--danger`, message `--fg-quiet`.

**Dimensions:** `min-width: 280px`, `max-width: 400px`. Padding `16px 20px`. Title `--font-sans` / 500 / `--text-body`. Message `--text-body-sm` / `--fg-quiet`.

**Dismiss:** Click anywhere on the notification. Auto-dismiss after 4000ms for success only. Errors do not auto-dismiss.

**Animation:** Enter: `translateY(8px) → translateY(0)` + `opacity: 0 → 1`. Exit: reverse. Duration `--dur-base`. Easing `--ease-enter`. Reduced-motion: `opacity` snap only, no translate.

The contact success state (`Received.` in Bebas 80, effect #10) is separate from this component. This is for lightweight async feedback outside the contact form.

---

### 8.10 Table

Used for: pricing feature comparisons, service tier specs, spec sheets.

Use semantic `<table>` HTML with CSS for layout control.

**Thead row:** Background `--bg-raised`. Font `--font-sans` / 500 / `--text-body-xs` / `--ls-micro` / uppercase. Padding `12px 16px`. Bottom border `1px solid var(--rule-strong)`.

**Tbody rows:** Alternating `--bg` / `--bg-subtle`. Font `--text-body-sm`. Padding `12px 16px`. Row separator `1px solid var(--rule)`. No outer border, no `box-shadow`.

**Numeric columns:** Right-aligned. Font `--font-mono` / `--text-body-sm`. This is the primary permitted use of Geist Mono in non-display contexts.

**Feature comparison cells:** `check` icon at 16px in `--accent` for included. Em dash `—` in `--fg-quiet` for excluded. Never text "Yes" / "No".

**Mobile (≤800px):** Horizontal scroll. Add `overflow-x: auto` on the wrapper div. Do not collapse to card layout — that hides the comparison value.

---

### 8.11 3D lift hover rule

All cards, tiles, wboxes, and grid cells produced by any component in this file inherit the global 3D lift from `globals.css`. You do not need to add it per-component — it fires from class selectors `.card`, `.wbox`, `.tile`, `.grid-cell`, or the `[data-lift]` attribute.

**Apply `data-lift` to any container not covered by those class names.**

Lift intensity, exempt elements, CSS spec, and `prefers-reduced-motion` fallback are in `13-animation-mandates.md §Mandate 5`. Do not add `box-shadow` to compensate — depth comes from transform only.
