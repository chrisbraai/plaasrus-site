# Page Architecture

*→ Used during Phase 2 to structure the build plan. Routes and per-page design burden define build order.*

### 10.1 Hub model

`/` is a condensed scroll — hero + key proofs + section previews, each ending with a "See [section] →" link to the deep page. Every sub-page stands alone — shareable, reachable from search, no dependency on `/` for context.

*If a page's content isn't inherently high-value, its design and execution become the value. Every page is a live portfolio piece. A boring `/contact` is a missed proof point.*

### 10.2 Routes

<!-- YIELDE:START -->
| Route | Design burden |
|---|---|
| `/` | Moderate — showcase, link out |
| `/services` | High — each service earns a full-bleed section |
| `/process` | Highest — the page must demonstrate the process itself |
| `/about` | High — founder is 16 years old. Demo recipients are real clients. Manifesto, not biography. Don't soften it. |
| `/pricing` | High — huge Bebas hero, FAQ as typographic grid not accordion |
| `/contact` | Highest — the best contact form they've ever seen |
| `/work` | Minimal — the work speaks |
| `/journal` | High — editorial serif, long measure, zero chrome |
<!-- YIELDE:END -->

### 10.3 Per-page contract

Every page ships with: `<Header />` · `<Footer />` · hero band · ≥1 ramp change between adjacent sections · ≥2 full-bleed photo sections · ≥1 scroll-triggered animation per section · ≥1 ambient animation per section · exit CTA. No dead-ends.

### 10.4 Navigation

**Desktop (≥800px).** Sticky. <!-- YIELDE:START -->6 links + "Start a project" inverse Button.<!-- YIELDE:END --> Active route: accent colour + 1px underline.

**Mobile (<800px).** Header stays sticky. <!-- YIELDE:START -->Right-side label: the word `MENU` in overline style — not a hamburger icon. Tap → full-screen overlay, `--bg`, all 6 links in display-s / sentence case / left-aligned. Close via `CLOSE` label. **Hamburger is banned.**<!-- YIELDE:END -->

### 10.5 SEO / GEO baseline

- Every page: unique `<title>`, `<meta description>`, Open Graph tags, single `<h1>`.
- JSON-LD: `Organization` on `/` · `Service` on `/services` · `FAQPage` on `/pricing` · `Article` per journal entry · `ContactPoint` on `/contact`.
- Sitemap.xml auto-generated. robots.txt present.
- Core Web Vitals: LCP < 2.0s · CLS < 0.05 · INP < 150ms. Per page, not averaged.
- Journal posts: answer-first opening sentence (GEO-optimised for AI extraction).

If the site can't pass its own SEO audit, we can't sell the service.

### 10.6 Section cadence map

Every page follows a deliberate vertical rhythm using the three cadence tokens from `05-spacing.md §6.2`. The cadence map below is the required starting point — deviations must be logged in `Forms/[client].md §11`.

| Page | Section sequence | Cadence |
|---|---|---|
| `/` | Hero | generous |
| | Services preview | standard |
| | Process preview | compressed |
| | About preview | standard |
| | Pricing preview | generous |
| | Contact CTA | standard |
| `/services` | Hero | generous |
| | Service detail (each) | standard |
| | Proof stats | compressed |
| | Process teaser | standard |
| | Pricing CTA | generous |
| `/process` | Hero | generous |
| | Phase 01 | standard |
| | Phase 02 | compressed |
| | Phase 03 | standard |
| | Trust statement | generous |
| `/about` | Hero | generous |
| | Stats row | compressed |
| | Feature cards | standard |
| | Bragging slab | generous |
| `/pricing` | Hero | generous |
| | Tier grid | standard |
| | FAQ | compressed |
| | CTA | generous |
| `/contact` | Form | generous |

**Rule:** No two consecutive `generous` sections. Confirm before build.

### 10.7 Breathing section rule

After every three content-dense sections (cards, grids, lists), the page must include a breathing moment — a section whose primary visual element is space or a single typographic statement, not a content grid.

A breathing section is not a new component. It is an existing section used with restraint:
- A full-width pull-quote in Source Serif 4 at 24px (see `03-typography.md §4.7`)
- A single `<Slab>` with a one-line proof statement (e.g. "You pay after you've seen it.")
- A stat row with 3–4 numbers and no surrounding copy
- A bragging slab (the About section's rotating claims component)

**On the home page:** the Process section preview (3 compressed phase cards) is naturally a compressed breathing section after the Services cards. The About section opens with `--section-pad-y-generous` before the stats, which creates the next breathing moment.

If the build plan places four consecutive dense sections without a breathing moment, flag it in the plan review before writing code.
