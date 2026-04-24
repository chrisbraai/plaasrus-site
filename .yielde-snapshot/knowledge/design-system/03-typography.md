# Typography

> ⚠ **Spec-notation vs. @theme-wired token names**
>
> This file documents the scale in two notations. Only one is valid in production code.
>
> | Notation | Where it appears | Valid in component code? |
> |---|---|---|
> | `--t-display-m`, `--lh-body`, `--ls-button` | Prose tables in §4.2–§4.4 below | **No — resolves to empty.** These are spec shorthand for readability. |
> | `--text-display-m`, `--leading-body`, `--tracking-button` | `@theme` block at the end of this file, `scaffold/src/app/globals.css` | **Yes — use these in every component.** |
>
> The post-edit-component hook's C6 check flags any shorthand `--t-`, `--lh-`, or `--ls-` token occurrence in component code because the values silently resolve to nothing — broken typography with no build error. If you see C6 in the hook log, you copied from the prose tables below instead of the `@theme` block.

### 4.1 Fonts

<!-- YIELDE:START -->
| Token | Family | Weights | Use |
|---|---|---|---|
| `--font-display` | Bebas Neue | 400 | All H1/H2/H3, stat values, footer wordmark, phase numbers |
| `--font-sans` | Geist | 400, 500 | Body, UI labels, buttons, paragraph copy |
| `--font-mono` | Geist Mono | 400, 500 | Step counters, index numbers, labels, metadata |
| `--font-serif` | Source Serif 4 *(variable)* | 400–600 | Journal body only. Not on marketing pages — using it on `/home` is a bug. |
<!-- YIELDE:END -->

### 4.2 Display scale (Bebas Neue)

```css
--t-display-xxl:   clamp(80px, 16vw, 260px);   /* footer wordmark */
--t-display-xl:    clamp(48px, 9vw, 128px);    /* pricing hero, full-bleed h1 */
--t-display-l:     clamp(48px, 6.2vw, 96px);   /* hero h1 */
--t-display-m:     80px;                        /* standard section h2 */
--t-display-s:     56px;                        /* bragging slab, success state */
--t-display-xs:    48px;                        /* card h3, pricing tier name */
--t-display-2xs:   40px;                        /* service card h3 */
--t-display-micro: 28px;                        /* monthly price */
```

### 4.3 Sans scale (Geist)

```css
--t-hero-lede: 22px;   /* contact step headings */
--t-lede:      18px;   /* feature card h3 */
--t-body-lg:   16px;   /* hero body, about body */
--t-body:      15px;   /* secondary body, form input */
--t-body-sm:   14px;   /* card body */
--t-body-xs:   13px;   /* tertiary, buttons, form labels */
--t-label:     12px;   /* tier info, footer small */
--t-overline:       11px;   /* nav, step tag, feature accent line */
--t-micro:          10px;   /* overline/eyebrow, Badge */
<!-- YIELDE:START -->
--t-nav-wordmark:   30px;   /* header wordmark "Yielde^" — off-scale, named token */
<!-- YIELDE:END -->
```

### 4.4 Line-height & letter-spacing

```css
/* Line-heights */
--lh-display-tight: 0.85;   /* phase numbers */
--lh-display:       0.9;    /* pricing display */
--lh-tight:         0.92;   /* hero h1 */
--lh-header:        0.95;   /* section h2 */
--lh-snug:          1.25;
--lh-normal:        1.4;
--lh-relaxed:       1.5;
--lh-body:          1.65;
--lh-loose:         1.7;    /* paragraph default */
--lh-serif:         1.75;   /* journal body */

/* Letter-spacing */
--ls-display-tight: -0.02em;
--ls-display:        0.01em;
--ls-body:           0em;
--ls-button:         0.06em;
--ls-badge:          0.16em;
--ls-micro:          0.18em;
--ls-footer:         0.10em;
--ls-wordmark:       0.02em;
```

### 4.5 Case

- Body + headings → **sentence case, always.**
- Overlines · labels · nav · step tags · badges → **uppercase + `--ls-micro`.**
- Mono index tags (`01`, `02`) → no case transformation.
- **Never ALL CAPS body copy.** Emphasis = larger Bebas, not capitals.

### 4.6 Lead paragraph

The missing token between `--t-hero-lede` (22px) and `--t-body-lg` (16px). Used for the first paragraph of body copy on any page where the opening sentence should sit above the main body scale but below the hero lede.

```css
--t-lead: 20px;
```

Add to the `@theme` block as `--text-lead: 20px`. Line-height: `--lh-relaxed: 1.5`. Geist 400. Never Bebas or Serif.

**Permitted uses:** First paragraph on `/about`, `/services` individual service pages, `/journal` article intro (before the serif body begins), opening statement on `/pricing` above the tier grid.

### 4.7 Source Serif 4 in non-Journal contexts

Source Serif 4 is restricted to `/journal` body copy by default (see §4.1). It is the most expressive typeface in the stack and must remain a contrast element — isolation is the source of its power.

It is permitted in exactly **three non-Journal contexts** per project:

| Context | Size | Style | Line-height | Token |
|---|---|---|---|---|
| Pull-quote on Services or About | 24px | italic | `--lh-serif: 1.75` | `--t-pullquote: 24px` |
| Testimonial attribution line | 16px | normal | `--lh-serif: 1.75` | reuse `--text-body-lg` |
| Pricing "what's included" narrative | 15px | normal | `--lh-serif: 1.75` | reuse `--text-body` |

Add `--text-pullquote: 24px` to the `@theme` block.

**Two-instance cap per page:** A page may use Source Serif 4 in at most two locations. If it appears more than twice, it stops reading as a contrast element and starts reading as an inconsistent body typeface. This cap applies per page, not per site.

**Linter note:** This cap is not programmatically enforced yet. The design-reviewer agent must check serif instance count during the design review pass.

---

## Tailwind wiring

Every token above is registered via a `@theme` block in `globals.css` so components write utility classes, not arbitrary values:

```css
@theme {
  --font-display: 'Bebas Neue', sans-serif;
  --font-sans: 'Geist', sans-serif;
  --font-mono: 'Geist Mono', monospace;
  --font-serif: 'Source Serif 4', serif;

  --text-display-xxl: clamp(80px, 16vw, 260px);
  --text-display-xl:  clamp(48px, 9vw, 128px);
  --text-display-l:   clamp(48px, 6.2vw, 96px);
  --text-display-m:   80px;
  --text-display-s:   56px;
  --text-display-xs:  48px;
  --text-display-2xs: 40px;
  --text-display-micro: 28px;

  --text-hero-lede:  22px;
  --text-lede:       18px;
  --text-body-lg:    16px;
  --text-body:       15px;
  --text-body-sm:    14px;
  --text-body-xs:    13px;
  --text-label:      12px;
  --text-overline:   11px;
  --text-micro:      10px;
  --text-nav-wordmark: 30px;

  --leading-display-tight: 0.85;
  --leading-display:       0.9;
  --leading-tight:         0.92;
  --leading-header:        0.95;
  --leading-snug:          1.25;
  --leading-normal:        1.4;
  --leading-relaxed:       1.5;
  --leading-body:          1.65;
  --leading-loose:         1.7;
  --leading-serif:         1.75;

  --tracking-display-tight: -0.02em;
  --tracking-display:        0.01em;
  --tracking-body:           0em;
  --tracking-button:         0.06em;
  --tracking-badge:          0.16em;
  --tracking-micro:          0.18em;
  --tracking-footer:         0.10em;
  --tracking-wordmark:       0.02em;
}
```

**Legal clamp pattern:** For display sizes that use `clamp()`, the Tailwind utility class is:
`text-[length:var(--text-display-xxl)]` — this is the approved escape hatch. The hook does NOT flag shorthand `--t-` tokens as a violation when used inside the approved arbitrary-value pattern.

**Banned:** any `text-[Npx]` or `text-[Nem]` where N is a literal number. Use the named token instead.
