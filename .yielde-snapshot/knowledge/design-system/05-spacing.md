# Spacing

4px base. Extremes favoured — never the safe middle.

```css
--s-0:   0px;
--s-0-5: 2px;
--s-1:   4px;
--s-1-5: 6px;
--s-2:   8px;
--s-3:   12px;
--s-4:   16px;
--s-5:   20px;
--s-6:   24px;
--s-7:   28px;
--s-8:   32px;
--s-10:  40px;
--s-12:  48px;
--s-14:  56px;
--s-16:  64px;
--s-20:  80px;
--s-24:  96px;   /* standard section vertical rhythm */
--s-32:  128px;
```

### 6.1 Container

<!-- YIELDE:START -->
```css
--container-max: 1280px;
--container-pad: 32px;
--section-pad-y: 144px;
--header-h:      64px;
--scroll-margin: 80px;
```

**Responsive container padding:** `≥800px → 32px · 600–799px → 24px · 400–599px → 20px · <400px → 16px`. Never below 16px — the edge is part of the composition.
<!-- YIELDE:END -->

### 6.2 Section cadence tokens

Uniform 96px between every section produces metronomic rhythm — every section feels equidistant, reducing page drama. Strong editorial design uses varied vertical cadence.

Three deliberate variants:

```css
--section-pad-y-compressed:  80px;   /* scannable content: stats, logos, simple lists */
--section-pad-y:             144px;  /* standard narrative — the default */
--section-pad-y-generous:    200px;  /* hero, pricing, brand statement, contact */
```

These are floors enforced by Mandate 3 in `13-animation-mandates.md`. Never reduce below them.

**Cadence rule:** No two consecutive `generous` sections. A `generous` section must be followed by `standard` or `compressed`. This push-pull is what makes pages feel rhythmically alive.

**Required cadence per page type:**

| Section | Cadence |
|---|---|
| Hero | generous |
| Services cards | standard |
| Process phases | compressed |
| About stats + features | standard |
| Pricing | generous |
| Contact | standard |
| Work grid | compressed |
| Footer | — (footer has its own internal padding) |

Record any deviation from this cadence map in `Forms/[client].md §11` with a rationale.
