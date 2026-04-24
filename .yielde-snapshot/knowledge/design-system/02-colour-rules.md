# Colour System

*→ Gate B2 in Phase 1 verifies the colour ramp is complete before build begins. Token-only enforcement applies in Phase 3 Step D.*

> Colour values are defined in `Forms/[client].md`, not here.
> This section defines token names, semantic roles, and usage rules only.

### 3.1 Semantic tokens

Components always consume semantic tokens — never raw palette values. The semantic layer is stable across every project; only the values behind the tokens change per client.

<!-- YIELDE:START -->
> **Yielde palette note:** On the Yielde brand, `--fg-muted` and `--bg-newsprint` resolve to the same hex (`#e8e4dc` / `--typeset-5`). Never place `--fg-muted` text on an `--bg-newsprint` surface — the tokens share a value and produce zero contrast. Use `--fg-quiet` or `--fg-inverse` for text on newsprint bands instead.
<!-- YIELDE:END -->

```
/* Surfaces */
--bg            page background
--bg-raised     cards, elevated surfaces
--bg-subtle     secondary surfaces
--bg-inverse    inverse / light-on-dark band
--bg-newsprint  editorial inverse band (warm off-white)

/* Ink */
--fg            primary text
--fg-muted      secondary text
--fg-quiet      tertiary, labels, timestamps
--fg-inverse    text on inverse surfaces

/* Structure */
--rule          borders, dividers
--rule-strong   emphasised borders

/* Action */
--accent        primary CTA, brand emphasis — "yes"
--accent-ink    text sitting on --accent
--accent-hover  hover state of --accent

/* Proof */
--stat          stat/data tile surface
--stat-ink      text on --stat

/* Stop */
--danger        errors, warnings, hard limits — "no"
--danger-ink    text sitting on --danger
```

### 3.2 Semantic separation

Two accent families serve opposite roles. Their boundary must never blur.

- **`--accent` = brand-positive.** CTAs, hero moments, proof, forward motion, "yes."
- **`--danger` = brand-stop.** Errors, refusals, hard limits, "no."

<!-- YIELDE:START -->
When both are warm-family colours (as in the Yielde brand), never let them share a surface. Always use `--danger` at its darkest end — it must read as a deliberate stop, not as a competing accent colour.
<!-- YIELDE:END -->

**No purple. Ever.**

### 3.3 Usage rules

- **Three colour families maximum per page.** The neutral/surface family counts as one. Audit every page before ship.
- **`--accent`-only pages are preferred.** Adding `--stat` must earn its place — real data, real proof. `--danger` only appears when a genuine hard stop is present.
- **One inverse band per page maximum.** Counts against the three-family limit. Exception: `/journal` article pages may use `--bg-newsprint` as the full-page background — this does not count against the limit since it is a page-level surface, not a contrast band within a page.
- Never use a colour decoratively. Every colour does a job. If you can't name the job, cut the colour.

### 3.4 Approved combinations

| # | Combination | Best used for | Max per page |
|---|---|---|---|
| 1 | `--bg` + `--accent` | Hero, primary CTAs, brand moments | Unlimited |
| 2 | `--bg` + `--stat` | Statistics, proof, tech surfaces | ≤ 2 |
| 3 | `--bg-inverse` + `--bg` | Editorial inverse band | ≤ 1 |
| 4 | `--bg` + `--danger` | Hard stops, error surfaces | ≤ 1 |

### 3.5 Where colour values are defined

| Project | Source |
|---|---|
<!-- YIELDE:START -->
| Yielde's own site | `Forms/YIELD.md` — full ramp definitions + semantic mapping |
<!-- YIELDE:END -->
| Every client project | `Forms/[client].md` — palette chosen from `Palettes/PALETTES.html` + semantic mapping |

**Palette selection guidance** — `Palettes/PALETTES.html`

Match palette type to business type:
- **Type 1 — Earthy Naturals.** Food, hospitality, craft, agriculture.
- **Type 2 — High Contrast Editorial.** Tech, finance, law, startups.
- **Type 3 — Coastal / Nordic.** Wellness, beauty, tourism, lifestyle.
- **Type 4 — Warm Bohemian.** Restaurants, culture, fashion, interiors.

Match to the business's **copy voice**, not the owner's personal taste. If a client fits two types, choose the palette that supports the voice. Anchor stops alone are not production-ready — extend each into a full 7-stop ramp before building.

### 3.6 Surface contrast requirements

The semantic layer defines roles but the system must also enforce relationships between surfaces. Minimum luminance difference:

- `--bg` → `--bg-raised`: minimum **3% relative luminance difference**
- `--bg-raised` → `--bg-subtle`: minimum **2% relative luminance difference**
- Any text on any surface: WCAG AA minimum — **4.5:1 for body text** (≤18px), **3:1 for large display** (>18px bold or >24px)

The `generate-palette.js` validator checks contrast on ramp anchors. Before mapping anchors to semantic tokens in `globals.css`, verify the semantic mapping produces sufficient surface separation — particularly `--bg` vs `--bg-raised`, which is the most common failure mode on dark earthy palettes.

### 3.7 Accent-hover specification

`--accent-hover` must differ from `--accent` by a minimum of **8 lightness steps in HSL** — perceptible but not jarring. The shift direction is always toward black (darker) for the Yielde dark-palette brand. On light client palettes, the shift is toward white (lighter).

`generate-palette.js` should validate: `Math.abs(hsl(accent-hover).l - hsl(accent).l) >= 8`. If the difference is less than 8, the hover state is invisible to most users.

### 3.8 Colour temperature map

When defining the semantic mapping in `globals.css`, the surface tokens should follow a consistent temperature relationship to create natural visual depth without adding extra colours.

| Palette type | --bg temperature | --bg-raised | --bg-subtle |
|---|---|---|---|
| Type 1 Earthy / Type 4 Warm | Coolest tone in ramp | Neutral | Warmest (most earthy) |
| Type 2 Editorial | Coldest (near-black) | Cool mid-tone | Slightly warmer |
| Type 3 Coastal / Nordic | Neutral cool | Slightly warm | Warmest |

Record the temperature assignment in `Forms/[client].md §5` alongside the semantic mapping. "Warmest" and "coolest" refer to the relative position within the client's ramp — not absolute temperature.
