# Grid System

*→ Read before any section layout decision. Extends `05-spacing.md` with column structure and composition rules.*

Yielde sections do not use arbitrary layouts. Every section uses one of three named grids. Naming the grid forces the decision to be intentional — if you cannot say which grid you are using, you are improvising.

---

## Grid A — Standard editorial (default)

12 columns, 24px gutter. The default grid for all sections unless a stronger compositional statement is needed.

**Tailwind implementation:**

```tsx
// 12-col grid container
<div className="grid grid-cols-12 gap-6">
  {/* 3-col card: col-span-4 */}
  {/* 2-col split: left col-span-7, right col-span-5 */}
  {/* Full-width: col-span-12 */}
</div>
```

**Standard column assignments:**

| Layout pattern | Left | Right |
|---|---|---|
| 3-column cards | `col-span-4` each | — |
| 2-column equal | `col-span-6` | `col-span-6` |
| Content + sidebar | `col-span-8` | `col-span-4` |
| Full-width band | `col-span-12` | — |

**When to use Grid A:** Services card grid, stat rows, journal article lists, footer columns, any layout where the content weight is equal across columns.

---

## Grid B — Weighted asymmetric

7-column primary / 5-column secondary. The primary column carries the brand argument: heading, proof statement, CTA. The secondary column carries a supporting proof element: stat grid, image, diagram, or testimonial.

**The rule:** the secondary column (5-col) must never carry more text than the primary column (7-col). If it does, invert the column assignment.

**Tailwind implementation:**

```tsx
<div className="grid grid-cols-12 gap-6 items-start">
  {/* Primary — brand argument */}
  <div className="col-span-12 md:col-span-7">
    <Overline>Service name</Overline>
    <h2 className="font-display text-display-m">...</h2>
    <p className="text-body-lg text-fg-muted">...</p>
    <Button variant="primary">See the work →</Button>
  </div>

  {/* Secondary — proof support */}
  <div className="col-span-12 md:col-span-5">
    {/* stat grid, image, or diagram */}
  </div>
</div>
```

**When to use Grid B:** Services deep page (copy + image), About split (text + stats), Process detail (phase heading + step cards), any section where one argument dominates and the other illustrates.

**Avoid Grid B for:** anything where both sides have equal narrative weight — use Grid A instead. Never use Grid B more than twice on the same page without a full-width Grid A section between them.

---

## Grid C — Off-grid display bleed

`--t-display-l` headings and above (clamp 48px → 96px, or larger) are permitted to overflow the right edge of the container by `--container-pad * 2 = 64px`. The heading's left edge is anchored to the standard container. Only its right visual extent bleeds into the margin.

**The effect:** type that fills the compositional space of the page, not just the content column. It reads as editorial confidence rather than template conformity.

**Hard rules:**
- Maximum **one** bleed instance per page — two bleed headings collapse the effect
- Only at `--t-display-l` or larger
- Only on the primary heading of a major section — never on supporting copy or subheads
- The overflow is clipped on mobile (≤800px): use `overflow-x: hidden` on the section

**Tailwind / CSS implementation:**

```tsx
<h2
  className="font-display text-[length:var(--text-display-l)] leading-tight"
  style={{
    marginRight: 'calc(-1 * var(--container-pad) * 2)',
    paddingRight: 0,
    overflow: 'visible',
  }}
>
  The heading that owns the room
</h2>
```

On mobile, the parent section should have `overflow-x: hidden` to prevent horizontal scroll:

```tsx
<section className="overflow-x-hidden md:overflow-x-visible">
```

**When to use Grid C:** The hero H1 on a long-form service page, the opening heading on `/about`, the pricing H1 (which already uses `--t-display-xl`). Never for H3 or below.

---

## Grid selection guide

| Section | Default grid | Consider upgrading to |
|---|---|---|
| Hero | Grid C (H1 bleed) + Grid A (below) | — |
| Services card grid | Grid A (3 equal cols) | Grid B if one service is primary |
| Process phases | Grid A (3 equal cols) | — |
| About — copy + stats | Grid B (7/5) | — |
| Pricing tiers | Grid A (3 equal cols) | — |
| Contact form | Grid A (centred, max-width 900) | — |
| Work grid | Grid A (dense, 4-col) | — |
| Footer | Grid A (4-col) | — |

---

## Gutter reference

| Token | Value | Tailwind |
|---|---|---|
| `--s-3` | 12px | `gap-3` |
| `--s-6` | 24px | `gap-6` (standard gutter) |
| `--s-8` | 32px | `gap-8` (generous gutter) |

Standard gutter for all grids is `gap-6` (24px). Use `gap-8` only when cards are full-height and dense gutters would feel compressed.
