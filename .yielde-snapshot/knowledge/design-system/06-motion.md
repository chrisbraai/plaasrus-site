# Motion & Effects

### 7.1 The rule

> Every effect must be deliberate and answerable.
> If it looks like it shipped as a default in any UI library, starter kit, or Figma template — it doesn't ship here.
> If a user would stop scrolling for it — it does.

Flatness is enforced at the surface level (buttons, cards, inputs). Texture and motion are allowed in backgrounds and ambient layers, under the constraints below.

### 7.2 Permitted

- Particle / star fields with **unconventional behaviour** (cursor-reactive, counter-scroll drift, grid-snap on hover).
<!-- YIELDE:START -->
- Geometric lines with character (single copper line tracing a headline into the margin).
<!-- YIELDE:END -->
- Scroll-driven atmospheric shifts (`--typeset-0` → newsprint over 4000px scroll).
- Texture that feels intentional — faint letterpress grain on a newsprint band (real tiled asset, not a CSS filter).
- Ambient motion that rewards a second visit: small, slow, persistent.

### 7.3 Banned

- Floating blobs. Mesh gradients. Radial halos behind headlines.
- Generic particle snow, confetti, hearts, sparkles.
- Looping stock video backgrounds.
- Aurora / holographic / rainbow gradients.
- Anything shipping as a default in MUI, Tailwind UI, shadcn, Chakra, Vercel templates, or Framer components.

### 7.4 Accessibility

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

No border-radius on focus rings (inherits global zero-radius). Keyboard only — never triggered by mouse click. Test with `Tab` on every page before ship.

**Edge case:** `--accent` focus ring on an `--accent` surface is invisible. Use `var(--fg-inverse)` outline on any interactive element sitting on an accent-coloured background.

Every animated effect ships with a `prefers-reduced-motion: reduce` fallback — usually a state-only swap with no transition. Motion is never load-bearing for comprehension.

### 7.5 Motion tokens

```css
--ease:        cubic-bezier(0.2, 0, 0, 1);
--ease-enter:  cubic-bezier(0.1, 0.6, 0.2, 1);
--dur-instant: 80ms;
--dur-fast:    120ms;
--dur-base:    200ms;
--dur-slow:    400ms;
--dur-reveal:  600ms;
--dur-ambient: 8s;
```

No bounces, elastics, or overshoots. Speed is the brand.

### 7.6 Effect catalogue

<!-- YIELDE:START -->
T1 ships in v1. T2 enhances in v2. T3 is nice-to-have.

| # | Location | Effect | Tier |
|---|---|---|---|
| 01 | Hero H1 emphasis word | Enters 120ms after main line. 2-frame sharp scale 0.92 → 1.0. No fade. | T1 |
| 02 | Hero 4-stat grid | Cells cut in L→R at 60ms each. Count-up to zero. | T1 |
| 03 | Hero bottom slab | 6px copper slab draws L→R over 200ms on scroll-in. | T1 |
| 04 | Services card hover | 2px top-rule expands to 6px slab. Bg dims. Instant. | T1 |
| 05 | Process phase spotlight | Scroll-linked: active phase lights copper, others dim to `--typeset-3`. | T1 |
| 06 | About bragging slab | 3 claims cycle via 1-frame inversion every 2s. | T2 |
| 07 | Pricing "Most popular" badge | Horizontal marquee inside badge at 30px/s. | T2 |
| 08 | Pricing Standard tile hover | Full tile inverts. Zero transition. | T2 |
| 09 | Contact step indicator | Completed step gains `--typeset-3` diagonal hatch overlay. | T2 |
| 10 | Contact success state | Typewriter reveal at 40ms per character. No fade. | T1 |
| 11 | Footer wordmark | Letter-by-letter sharp entrance on scroll-in. Drift variant banned. | T2 |
| 12 | Nav active underline | Width-only L→R on hover. 120ms. No colour fade. | T1 |
| 13 | Scroll progress rail | 2px `--typeset-3` top rail fills with `--copper-3` on scroll. | T1 |
| 14 | Services section bg | Faint mono ticker: `UI · AI · SEO-GEO` at `--typeset-1` on `--typeset-0`. | T3 |
| 15 | Stat count-ups | Odometer 0 → target in 600ms on scroll-in. | T1 |
| 16 | Overline way-markers | Leading digit flashes copper for 400ms on section enter. | T3 |
| 17 | Form field focus | 2px copper vertical bar left + underline colour swap. | T1 |
| 18 | Footer amber band | 40px `--amber-1` strip. One statement. No softening. | T2 |
<!-- YIELDE:END -->

> **Effect #15 (stat count-up) is now mandatory, not T1 optional.** See `13-animation-mandates.md §Mandate 4a`.

### 7.7 Ambient backgrounds

**Mandate (updated):** Every section ships with ≥1 ambient animation. The old "one effect per page, max" cap is superseded by `13-animation-mandates.md §Mandate 1`. The ban on two *layered* effects within a single section still holds. Each must pass the deliberate-and-answerable test.

<!-- YIELDE:START -->
| Page | Effect | Tier |
|---|---|---|
| `/` | Vertical-drift particle field. 1–2px `--typeset-3` squares (not dots), max 40, rising against scroll. | T2 |
| `/services` | Faint mono ticker (effect #14 extended full-page behind cards). | T3 |
| `/process` | Single copper polyline tracing active phase `01 → 02 → 03`. No curves. | T2 |
| `/about` | Static 30%-opacity diagonal copper line across hero band. No motion. | T2 |
| `/pricing` | None. Typography carries it. | T1 |
| `/contact` | `--typeset-3` graph-paper grid behind form. 32px squares. 20% opacity. Static. | T3 |
| `/work` | Subtle vignette from `--typeset-0` centre to `--typeset-1` edges. | T2 |
| `/journal` | Newsprint grain at article top. Tiled raster asset, 8% opacity. Not filter-generated. | T3 |
<!-- YIELDE:END -->
