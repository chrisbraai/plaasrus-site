# Design System — Knowledge Index

> Load only the files relevant to your task. Do not load everything at once.
> Pull `00-quality.md` and `01-bans.md` for any design decision.
> Add section-specific files as the task requires.

| File | Scope | Est. size | When to read |
|---|---|---|---|
| 00-quality.md | Universal quality rules — typography, hierarchy, colour, space, motion, copy | ~1,400 tok | Before any design decision |
| 01-bans.md | Banned patterns with rationale | ~400 tok | Before template selection |
| 02-colour-rules.md | Colour token names, semantic roles, usage rules, contrast requirements | ~1,200 tok | When touching globals.css or a surface |
| 03-typography.md | Type scale + all tokens + @theme wiring + serif breakout spec | ~1,000 tok | When writing globals.css or any heading |
| 04-geometry.md | Radius, rule widths, shadow rules | ~300 tok | Every component |
| 05-spacing.md | 4px scale + container tokens + section cadence system | ~600 tok | Every layout |
| 05b-grid.md | Grid variants A/B/C — columns, gutters, asymmetric layouts, off-grid bleed | ~800 tok | Before any section layout decision |
| 06-motion.md | Motion tokens, effect catalogue, banned effects, ambient backgrounds | ~1,100 tok | Any animation |
| 06b-motion-specs.md | Full keyframe + timing spec for all 18 catalogued effects + stagger library | ~1,200 tok | Implementing any named effect |
| 07-components.md | Button / form / badge / stat / accordion / toast / table specs | ~1,400 tok | Writing a reusable primitive |
| 08-section-patterns.md | Spatial + visual starting point for each section type | ~1,600 tok | Building a section |
| 09-page-architecture.md | Routes, per-page design burden, cadence map, breathing rule, SEO baseline | ~1,000 tok | Planning |
| 10-copy-voice.md | Voice rules, Never/Always, CTAs, heading length, consistency, numbers | ~800 tok | Writing any text |
| 11-fingerprint.md | Mandatory fingerprint elements — cursor, geometry, overline, slab, wordmark | ~600 tok | Beginning of every project (checklist) |
| 12-image-direction.md | Photography art direction — ratios, colour treatment, proof photography | ~400 tok | Any section with images |
| 13-animation-mandates.md | Five non-negotiable mandates — scroll animations, ambient per section, photo quota, spacing floors, stat count-ups, text entrances, 3D lift hover | ~900 tok | Every section build — load with `08-section-patterns.md` |

**Quick-load combos:**
- Hero section: `00-quality.md` + `04-geometry.md` + `08-section-patterns.md` + `06-motion.md` + `06b-motion-specs.md` + `13-animation-mandates.md`
- globals.css: `02-colour-rules.md` + `03-typography.md` + `04-geometry.md` + `05-spacing.md` + `13-animation-mandates.md`
- Any section build: `08-section-patterns.md` + `06-motion.md` + `13-animation-mandates.md`
- Any component: `04-geometry.md` + `07-components.md` + `01-bans.md` + `13-animation-mandates.md`
- Copy/CTA review: `10-copy-voice.md` + `00-quality.md` §Copy
- Section layout: `05b-grid.md` + `05-spacing.md` + `08-section-patterns.md`
- Effect implementation: `06-motion.md` + `06b-motion-specs.md` + `13-animation-mandates.md`
- Project start / fingerprint: `11-fingerprint.md` + `13-animation-mandates.md`
- Image placement: `12-image-direction.md` + `13-animation-mandates.md`

---

## Open Questions — v4 candidates

Deferred until real-world usage forces the decision.

<!-- YIELDE:START -->
1. **Accent ⇄ Danger in warm palettes.** If users confuse them on Garden Route, push `--danger` darker before considering a hue change.
2. **Serif face.** Source Serif 4 is provisional. Reassess against Fraunces / IBM Plex Serif / Crimson Pro when `/journal` ships its first article.
<!-- YIELDE:END -->
3. **Client palette ramp extension.** Colour rules ship as anchor-sets. Codify a 7-stop ramp for each client type as sites are built — fold proven ramps back into the system.
<!-- YIELDE:START -->
4. **Mobile breakpoints.** Currently one (800px). Add 1024px tablet step if pricing tiles stack unreadably.
<!-- YIELDE:END -->
5. **Focus ring on accent surfaces.** `--accent` ring on `--accent` bg is invisible. Use `--fg-inverse` outline for interactive elements on accent backgrounds.
<!-- YIELDE:START -->
6. **`/work` videos.** Static screenshots for v1. Upgrade to muted/autoplay `<video>` only if each clip passes the deliberate-and-answerable test (see 06-motion.md).
7. **Dual-palette `/work`.** If demos look visually inconsistent across client palette types, spec a Yielde chrome layer around each demo.
<!-- YIELDE:END -->
