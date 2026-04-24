# Motion Effect Specifications

*→ This file provides the concrete implementation spec for each effect in the catalogue (`06-motion.md §7.6`). Read `06-motion.md` first for constraints and the tiering system.*

Every effect entry uses this format:
- **Trigger:** what causes the animation to start
- **Element:** the DOM element being animated
- **Keyframe:** the animation values (from → to)
- **Duration:** using tokens from `06-motion.md §7.5`
- **Easing:** using tokens from `06-motion.md §7.5`
- **Delay:** any offset before the animation begins
- **Reduced-motion:** the fallback behaviour under `prefers-reduced-motion: reduce`

---

### Stagger token library

Add to `globals.css` `:root` block alongside motion tokens:

```css
--stagger-cascade: 60ms;   /* cards entering left → right, standard grid */
--stagger-reveal:  80ms;   /* top → bottom list items, sequential reveals */
--stagger-snap:    40ms;   /* sharp entrance, footer wordmark letters */
--stagger-drift:  120ms;   /* slow ambient, background elements */
```

---

## T1 — CSS transitions

### Effect #01 — Hero H1 emphasis word

- **Trigger:** Component mount, no scroll required
- **Element:** Emphasis `<span>` inside H1 (the one word rendered in `--accent`)
- **Keyframe:** `scale(0.92) → scale(1.0)` — sharp punch, no fade, no translate
- **Duration:** `--dur-instant: 80ms`
- **Easing:** `steps(2)` — 2-frame snap, not a smooth curve
- **Delay:** 120ms after H1 is painted (use `animation-delay: 120ms`)
- **Reduced-motion:** word visible at `scale(1)` immediately, no animation

```css
.hero-emphasis {
  display: inline-block;
  animation: scale-punch var(--dur-instant) steps(2) 120ms both;
}
/* scale-punch keyframe already defined in globals.css */
```

---

### Effect #02 — Hero stat grid cut-in

- **Trigger:** `useInView` hook, 20px threshold, fires once on first intersection
- **Element:** Each stat cell in the 4-stat hero grid, individually
- **Keyframe:** `opacity: 0 → 1`, no translate (cut in, not slide in)
- **Duration:** `--dur-fast: 120ms` per cell
- **Easing:** `--ease`
- **Delay:** `--stagger-cascade: 60ms` between cells, left-to-right order (cell index × 60ms)
- **Reduced-motion:** all cells visible immediately at `opacity: 1`

```tsx
style={{ animationDelay: `${index * 60}ms` }}
```

---

### Effect #03 — Hero bottom slab draw

- **Trigger:** `useInView` on the slab element, 20px threshold, fires once
- **Element:** `<Slab animated />` — the 6px `--accent` full-width rule at the base of the hero
- **Keyframe:** `scaleX(0) → scaleX(1)`, `transform-origin: left`
- **Duration:** `--dur-reveal: 600ms`
- **Easing:** `--ease-enter: cubic-bezier(0.1, 0.6, 0.2, 1)`
- **Delay:** 200ms after the hero H1 enters viewport
- **Reduced-motion:** slab visible at `scaleX(1)` immediately

```css
.slab-animated {
  transform-origin: left;
  animation: slab-draw var(--dur-reveal) var(--ease-enter) 200ms both;
}
/* slab-draw keyframe already defined in globals.css */
```

---

### Effect #04 — Services card hover state

- **Trigger:** `mouseenter` / `mouseleave` on the service card
- **Element:** 2px top-rule on each service card + card background
- **Keyframe:** top-rule height `2px → 6px`, card background `--bg-raised → --bg-subtle`
- **Duration:** `--dur-instant: 80ms`
- **Easing:** `steps(1)` — one-frame snap, no interpolation
- **Delay:** none
- **Reduced-motion:** same behaviour (no motion involved — only a state change)

```css
.service-card { transition: background-color var(--dur-instant) steps(1); }
.service-card::before { height: 2px; transition: height var(--dur-instant) steps(1); }
.service-card:hover::before { height: 6px; }
.service-card:hover { background-color: var(--bg-subtle); }
```

---

### Effect #10 — Contact success state typewriter

- **Trigger:** Form submission success response received
- **Element:** Success message — Bebas Neue "Received." at 80px
- **Keyframe:** Characters revealed one at a time, 40ms per character, via `useTypewriter` hook
- **Duration:** 40ms per character × character count (e.g. "Received." = 9 chars × 40ms = 360ms total)
- **Easing:** `steps(1)` per character — instant reveal per character, no fade
- **Delay:** none — begins immediately on success
- **Reduced-motion:** full text visible immediately, no typewriter

```tsx
const { text } = useTypewriter('Received.', 40);
// useTypewriter hook already exists in scaffold/src/hooks/useTypewriter.ts
```

---

### Effect #12 — Nav active underline

- **Trigger:** `mouseenter` / `mouseleave` on nav link
- **Element:** 1px underline beneath each nav link text
- **Keyframe:** `scaleX(0) → scaleX(1)`, `transform-origin: left` (L→R on enter, L→R on leave — both from left)
- **Duration:** `--dur-fast: 120ms`
- **Easing:** `--ease`
- **Delay:** none
- **Reduced-motion:** underline visible at `scaleX(1)` on `:hover`, no animation

Note: This differs from the fingerprint link animation (`11-fingerprint.md §7`) in that the nav link uses the active state for the current route, not just hover. Active nav links remain at `scaleX(1)` persistently.

---

### Effect #13 — Scroll progress rail

- **Trigger:** `window.scroll` event, continuous (use `useScrollProgress` hook)
- **Element:** 2px full-width fixed rail at top of viewport (positioned above the header)
- **Keyframe:** `width: 0% → 100%` as the page scrolls from top to bottom
- **Duration:** real-time (updates every scroll event, no animation — it is the scroll)
- **Easing:** direct mapping (`scrollY / (documentHeight - viewportHeight)`)
- **Colors:** `--accent` fill on a `--bg-subtle` track at 30% opacity
- **Reduced-motion:** rail hidden entirely (`display: none`) — it has no informational value without motion

```tsx
const progress = useScrollProgress();
// useScrollProgress hook already exists in scaffold/src/hooks/useScrollProgress.ts
<div style={{ width: `${progress * 100}%`, height: '2px', background: 'var(--accent)' }} />
```

---

### Effect #15 — Stat count-ups

- **Trigger:** `useInView` on the stat grid, 10px threshold, fires once
- **Element:** The numeric value inside each `<Stat>` component
- **Keyframe:** Count from `0` to `target` value (use `useCountUp` hook)
- **Duration:** `--dur-reveal: 600ms`
- **Easing:** `ease-out` applied inside the countUp interpolation function
- **Delay:** `--stagger-cascade: 60ms` between stat cells (prevents simultaneous counting)
- **Reduced-motion:** value shown at target immediately, no counting animation

```tsx
const count = useCountUp(target, isInView ? 600 : 0);
// useCountUp hook already exists in scaffold/src/hooks/useCountUp.ts
```

---

### Effect #17 — Form field focus indicator

- **Trigger:** `:focus` on `<TextInput>` or `<Textarea>`
- **Element:** The underline border and a 2px left-border copper bar
- **Keyframe:**
  - Underline: `border-bottom-color: var(--rule) → var(--accent)`
  - Left bar: appears via `::before` pseudo, `height: 0 → 100%`
- **Duration:** `--dur-fast: 120ms`
- **Easing:** `--ease`
- **Delay:** none
- **Reduced-motion:** state change immediate, no transition

```css
.text-input { transition: border-bottom-color var(--dur-fast) var(--ease); }
.text-input:focus { border-bottom-color: var(--accent); }
.text-input::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 0;
  background: var(--accent);
  transition: height var(--dur-fast) var(--ease);
}
.text-input:focus::before { height: 100%; }
```

---

## T2 — JS scroll-linked

### Effect #05 — Process phase spotlight

- **Trigger:** `useScrollActive` hook — activates the phase card whose corresponding section is in the centre of the viewport
- **Element:** 3 phase cards on `/process`
- **Keyframe:**
  - Active phase: heading color `--fg-quiet → --fg`, card background `--bg → --bg-raised`
  - Inactive phases: `--fg` → `--fg-quiet`, `--bg-raised → --bg`
- **Duration:** `--dur-base: 200ms` on activation, `--dur-fast: 120ms` on deactivation
- **Easing:** `--ease`
- **Reduced-motion:** active state shown without transition — state change only

```tsx
const activePhase = useScrollActive(['#phase-01', '#phase-02', '#phase-03']);
// useScrollActive hook already exists in scaffold/src/hooks/useScrollActive.ts
```

---

### Effect #06 — About bragging slab cycling

- **Trigger:** Interval timer, 2000ms period
- **Element:** 3 rotating claim statements inside the bragging slab
- **Keyframe:** Instantaneous full inversion — `1 frame` at steps(1). Background and text colours swap simultaneously. Not a fade.
- **Duration:** `steps(1)` — zero transition time, single frame
- **Easing:** none (frame swap)
- **Delay:** 2000ms between each claim
- **Reduced-motion:** first claim only, static, no cycling

```tsx
const { text } = useCycleText(claims, 2000);
// useCycleText hook already exists in scaffold/src/hooks/useCycleText.ts
```

---

### Effect #07 — Pricing badge marquee

- **Trigger:** Always running (ambient)
- **Element:** "Most popular" text inside the badge on the Standard pricing tier
- **Keyframe:** `translateX(0) → translateX(-50%)`, using duplicated text for seamless loop
- **Duration:** `--dur-ambient: 8s`
- **Easing:** `linear`
- **Reduced-motion:** static text "Most popular", no marquee (`animation: none`)

```css
.badge-marquee { animation: var(--animate-marquee); }
/* marquee keyframe already defined in globals.css */
@media (prefers-reduced-motion: reduce) { .badge-marquee { animation: none; } }
```

---

### Effect #08 — Pricing Standard tile full inversion on hover

- **Trigger:** `mouseenter` / `mouseleave` on the Standard pricing tile
- **Element:** Entire Standard pricing tile — background, all text, button
- **Keyframe:** `--bg → --accent`, all text `--fg → --accent-ink` — complete inversion
- **Duration:** `steps(1)` — zero transition, instantaneous
- **Easing:** none
- **Reduced-motion:** same (no motion involved — only a state change)

```css
.pricing-standard { transition: background-color steps(1), color steps(1); }
.pricing-standard:hover { background-color: var(--accent); color: var(--accent-ink); }
```

---

### Effect #09 — Contact step completion indicator

- **Trigger:** Step validation passes (form field group validated)
- **Element:** Completed step number in the 3-step progress indicator
- **Keyframe:** SVG diagonal-hatch pattern overlay fades in at `var(--fg-quiet)`, `opacity: 0 → 0.4`
- **Duration:** `--dur-base: 200ms`
- **Easing:** `--ease`
- **Implementation:** SVG `<pattern>` element for diagonal lines — not a CSS filter or background-image
- **Reduced-motion:** immediate state change — hatch appears at full opacity instantly

---

### Effect #11 — Footer wordmark letter entrance

- **Trigger:** `useInView` on the footer wordmark, 40px threshold
- **Element:** Each letter of the footer wordmark, individually
- **Keyframe:** `opacity: 0 → 1` — pure opacity, no translate, no blur
- **Duration:** `--dur-base: 200ms` per letter
- **Easing:** `steps(1)` — sharp snap, not eased
- **Delay:** `--stagger-snap: 40ms` per letter (index × 40ms)
- **Reduced-motion:** wordmark visible immediately at full opacity

---

### Effect #16 — Overline way-marker flash

- **Trigger:** `useInView` on section entry, 60px threshold
- **Element:** Leading mono digit of the section overline (e.g. the `01` before `Services`)
- **Keyframe:** `color: var(--fg-quiet) → var(--accent) → var(--fg-quiet)` — single flash
- **Duration:** `--dur-slow: 400ms` total (200ms in, 200ms out)
- **Easing:** `--ease`
- **Fires once only** — not a looping animation
- **Reduced-motion:** digit stays `--fg-quiet`, no flash

```css
.overline-digit.flash { animation: var(--animate-flash-copper); }
/* flash-copper keyframe already defined in globals.css */
```

---

### Effect #18 — Footer amber band

- **Trigger:** Static — no animation
- **Element:** 40px `--amber` surface strip at footer base with one declarative statement
- **Keyframe:** None. This is a visual effect (flat colour band with strong copy), not a motion effect.
- **Reduced-motion:** N/A

---

## T3 — WebGL / canvas / SVG complex

### Effect #14 — Services section background ticker

- **Trigger:** Always running (ambient background, behind service cards)
- **Element:** Faint mono text string `UI · AI · SEO-GEO · ` repeating, full-width
- **Keyframe:** `translateX(0) → translateX(-50%)` looping, using duplicated string for seamless loop
- **Duration:** `12s` loop (use `--animate-ticker` defined in globals.css)
- **Easing:** `linear`
- **Color:** `var(--fg-quiet)` at `opacity: 0.15`
- **Font:** `--font-mono` / `--text-overline` (11px) / uppercase
- **Positioning:** absolute, behind the cards grid, full-width, vertically centred in the section
- **Reduced-motion:** `display: none` — remove the element entirely

```css
.services-ticker { animation: var(--animate-ticker); }
@media (prefers-reduced-motion: reduce) { .services-ticker { display: none; } }
```
