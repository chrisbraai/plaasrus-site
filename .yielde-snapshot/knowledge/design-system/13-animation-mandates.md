# Animation Mandates

> These five rules are non-negotiable. Every section, every page, every project — no exceptions.
> Cross-check against `11-fingerprint.md §Phase 3 Step E` before any commit.
> Read this file any time you build a section, add a stat, write a heading, or place a container.

---

## Mandate 1 — Section animation contract

Every section ships with **both** of the following. A section missing either is incomplete — do not commit it.

### 1a. Scroll-triggered animation (≥1 per section)

A Framer Motion `whileInView` or GSAP `ScrollTrigger` that fires when the section enters the viewport.

```tsx
// Framer Motion — minimum viable pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
>
```

More specific fitted variants are in Mandate 4.

### 1b. Ambient animation (≥1 per section)

At minimum, one element within each section has persistent non-interactive motion that exists regardless of user scroll position. Valid options:

- Slow background drift (particle field, grain, grid at reduced opacity)
- A continuously pulsing or slowly rotating decorative mark
- A looping marquee of secondary text behind cards
- A scroll-linked opacity or colour shift in the section's background layer
- A persistently animated overline counter or ticker

The ambient element must pass the deliberate-and-answerable test from `06-motion.md §7.1`. It must also have a `prefers-reduced-motion` fallback — static state, not hidden entirely.

> **Override:** This mandate supersedes the "one ambient effect per page, max" cap in `06-motion.md §7.7`. That cap was designed for single-page scroll demos. Yielde's multi-section architecture requires per-section ambient presence. The cap against two *layered* effects in a single section remains.

---

## Mandate 2 — Photo sections per page

Every page ships with **≥2 full-bleed photo sections** — sections where a real photograph occupies 100vw, either as a background layer or as a primary content block.

**Full-bleed implementation:**

```tsx
<section className="relative w-full overflow-hidden" style={{ height: 'clamp(400px, 55vw, 720px)' }}>
  <Image src={src} alt={alt} fill className="object-cover" priority />
  {/* overlay only if copy sits on top */}
  <div className="absolute inset-0" style={{ background: 'var(--bg)', opacity: 0.4 }} />
</section>
```

Rules:
- Image must satisfy `12-image-direction.md` — it must prove a specific claim, not decorate.
- Preferred ratio: 16:9. Acceptable: 3:2 for portrait-dominant content.
- Two sections anywhere on the route counts. They do not both need to be the same type.
- A hero with a background photograph counts as one. A mid-page proof shot counts as one.
- A page that cannot reach two without forcing it needs more proof content, not fewer photos.

---

## Mandate 3 — Section spacing minimums

```css
/* globals.css — @layer base */
--section-pad-y-compressed:  80px;
--section-pad-y:             144px;
--section-pad-y-generous:    200px;
```

These are floors, not targets. If content feels cramped at 144px standard, remove content — do not compress spacing. Generous pages breathe. The cadence rules from `05-spacing.md §6.2` (no two consecutive generous) still apply at the new values.

---

## Mandate 4 — Stat count-ups and text entrance animations

### 4a. Every statistic counts up on scroll-in

Effect #15 from `06-motion.md §7.6` is no longer optional (T1). It is **mandatory** for every `<Stat>` component and any numeric display anywhere on the page. Static numbers are banned.

- Count direction: 0 → target, or high → target for countdown stats
- Duration: 600ms
- Easing: ease-out cubic
- Trigger: viewport entry, `once: true`

```tsx
function useCountUp(target: number, duration = 600, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return value
}
```

`prefers-reduced-motion`: display target value immediately with no transition.

### 4b. Every text section has a fitted entrance animation on scroll-in

When a section enters the viewport, its primary text must animate in. The animation must match the character of the section — there is no one-size-fits-all.

**Standard stagger (default for body copy and feature cards):**

```tsx
const textVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.2, 0, 0, 1] }
  })
}

{blocks.map((block, i) => (
  <motion.p
    key={i}
    custom={i}
    variants={textVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
  >
    {block}
  </motion.p>
))}
```

**Fitted variants by section type:**

| Section | Entrance style |
|---|---|
| Hero H1 | Sharp scale 0.92 → 1.0, 120ms — effect #01 from `06-motion.md §7.6` |
| Section H2 + overline | Overline in at t=0 (opacity + y), H2 follows at t=80ms |
| Stat row | Cells cut in L→R at 60ms each — effect #02 |
| Body copy | Opacity + translateY(16px) stagger per paragraph, 80ms apart |
| Process phases | Slide from left, 40ms stagger between phases |
| Feature cards | Stagger cut-in from bottom, 60ms apart |
| Pull-quote | Opacity + scale(0.97 → 1.0), single 500ms reveal |
| Pricing tiers | L→R cut-in at 80ms stagger |

`prefers-reduced-motion`: all text visible at full opacity from load. No transitions. No layout shift.

---

## Mandate 5 — 3D lift hover on headings and containers

Every `h1`, `h2`, `h3`, `h4`, card, grid cell, tile, and wbox has a 3D lift on hover.

**Explicitly exempt:** `p`, `small`, `span`, captions, `nav` elements, `<button>`, `<a>` links (those have the underline animation from `11-fingerprint.md §7`).

### Global CSS (add to `globals.css` @layer base):

```css
/* 3D lift — headings */
h1, h2, h3, h4 {
  transition: transform var(--dur-base) var(--ease);
  transform-style: preserve-3d;
  will-change: transform;
}
h1:hover, h2:hover, h3:hover, h4:hover {
  transform: perspective(800px) translateZ(8px) translateY(-3px);
}

/* 3D lift — containers */
.card,
.wbox,
.tile,
.grid-cell,
[data-lift] {
  transition: transform var(--dur-base) var(--ease);
  transform-style: preserve-3d;
  will-change: transform;
}
.card:hover,
.wbox:hover,
.tile:hover,
.grid-cell:hover,
[data-lift]:hover {
  transform: perspective(800px) translateZ(10px) translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  h1:hover, h2:hover, h3:hover, h4:hover,
  .card:hover, .wbox:hover, .tile:hover, .grid-cell:hover, [data-lift]:hover {
    transform: none;
  }
}
```

**`[data-lift]`:** Any container not covered by the class selectors above receives `data-lift` on its outermost wrapper. This makes opt-in explicit and auditable in code review.

**Intensity guide:**

| Element | Transform |
|---|---|
| `h2`, `h3`, `h4` | `perspective(800px) translateZ(8px) translateY(-3px)` |
| `h1` (hero) | `perspective(800px) translateZ(14px) translateY(-5px)` |
| Cards / wboxes / tiles | `perspective(800px) translateZ(10px) translateY(-4px)` |
| Dense grid cells | `perspective(800px) translateZ(6px) translateY(-2px)` — reduce intensity at high density |

Do not add `box-shadow` to any hover state. The 3D lift is the depth cue. The system uses no shadows anywhere.
