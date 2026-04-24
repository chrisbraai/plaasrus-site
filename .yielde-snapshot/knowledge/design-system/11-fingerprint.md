# Yielde Visual Fingerprint

*→ Enforced in Phase 3 Step C and Step E pre-commit checklist.*

Every Yielde site ships with every element in this file. Palette, industry, and scope change per client. The fingerprint does not.

The test: a visitor who has seen two Yielde sites should recognise the third without a logo. If that is not possible, the fingerprint elements are missing or were skipped.

---

## 1. Square cursor (CursorProvider) — mandatory, no exceptions

The browser cursor is replaced with a 6px × 6px square dot and a lagging 20px × 20px square ring. Both are zero-radius. This is the design system's defining constraint applied to the most persistent interactive element on the page — no template library ships a square cursor. It is unrecognisable as a library component and therefore unreplicable by competitors without direct study.

**Requirement:** `<CursorProvider />` must be rendered inside `<body>` before `{children}` in `app/layout.tsx` on every Yielde project without exception.

See `knowledge/templates/CursorProvider.md` for the full component implementation.

**Behaviour spec:**
- **Dot:** 6px × 6px, `var(--fg)` fill, `position: fixed`, `pointer-events: none`, `z-index: 9999`, `will-change: transform`
- **Ring:** 20px × 20px, 2px `var(--fg)` border, transparent fill, lags at 0.15 lerp factor, `z-index: 9998`
- **On `<a>` and `<button>` hover:** dot → 12px, ring → 32px, both → `var(--accent)`, in `--dur-fast: 120ms`
- **`cursor: none`** on `html` for pointer devices only (`@media (pointer: fine)`)
- **`prefers-reduced-motion: reduce`:** ring hidden entirely, dot stays static at default size

---

## 2. Zero-radius geometry

Hard edges everywhere. `border-radius: 0 !important` globally enforced in `globals.css`. The zero-radius constraint is not a style choice — it defines every visual decision this studio makes, from cards to focus rings to the cursor itself.

---

## 3. Overline above every H2

Every section heading is preceded by an `<Overline>` component: 10px / 500 / `--ls-micro` / uppercase. An H2 without an overline is an incomplete section. The overline creates the consistent visual cadence that ties pages together regardless of palette.

---

## 4. Slab section terminator

The hero section always ends with a `<Slab animated />` — 6px `--accent` horizontal rule drawing L→R via effect #03 (see `knowledge/design-system/06b-motion-specs.md`). It is the punctuation between brand statement and proof. Every hero, every project.

---

## 5. Bebas Neue at large scale

Every project has at minimum one heading at `--t-display-l` (clamp 48px → 96px) or larger. Scale contrast is the primary tool of visual confidence. A flat typographic range (all headings 14–24px) is not a Yielde site.

---

## 6. Footer wordmark at display-xxl

The `<Footer />` wordmark at `clamp(80px, 16vw, 260px)` in `--accent` appears on every project, every page. It is the unmistakable close of every scroll on every Yielde site.

---

## 7. Link hover underline animation

All `<a>` elements that are not buttons display a 1px `--accent` underline that draws L→R in 100ms on hover and undraws L→R on hover-out. Both directions originate from left — the line commits, then retreats. It never reverses direction.

Enforced globally in `globals.css` @layer base:

```css
a:not([class]) {
  position: relative;
  text-decoration: none;
}
a:not([class])::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--accent);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 100ms var(--ease);
}
a:not([class]):hover::after {
  transform: scaleX(1);
}
@media (prefers-reduced-motion: reduce) {
  a:not([class]):hover::after {
    transition: none;
    transform: scaleX(1);
  }
}
```

---

## Phase 3 Step E — Fingerprint checklist

Add these to the pre-commit checklist in `WORKFLOW.md §Phase 3 Step E`:

- [ ] `<CursorProvider />` present in `app/layout.tsx`
- [ ] Every H2 has an `<Overline>` above it
- [ ] Hero section ends with `<Slab animated />`
- [ ] At least one heading at `--t-display-l` or larger
- [ ] Footer wordmark at `--text-display-xxl`
- [ ] Link underline animation present in `globals.css` @layer base
- [ ] Every section has ≥1 scroll-triggered animation and ≥1 ambient animation (see `13-animation-mandates.md §Mandate 1`)
- [ ] Page has ≥2 full-bleed photo sections (see `13-animation-mandates.md §Mandate 2`)
- [ ] Every statistic counts up from 0 on scroll-in — no static numbers (see `13-animation-mandates.md §Mandate 4a`)
- [ ] Every text section has a fitted entrance animation on scroll-in (see `13-animation-mandates.md §Mandate 4b`)
- [ ] All `h1`–`h4`, cards, containers, and wboxes have 3D lift on hover in `globals.css` (see `13-animation-mandates.md §Mandate 5`)

---

## Cross-portfolio differentiation

Before template selection in Phase 2 Step 2b, compare proposed templates against `state/projects/*.md`. No two Yielde projects may use the same T3 (WebGL/canvas/GLSL) template for the same section type.

Commodity cap: no more than two consecutive U1-tier templates in the same vertical scroll journey (hero to footer without a U2 or U3 break).

Minimum: every project must include at least one U3 element.
