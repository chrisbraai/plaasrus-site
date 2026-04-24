# Template Index

Use this file to select a template without reading the source. Each entry describes the visual effect, interaction model, required dependencies, and the exact scenario it fits.

The two-improvement rule applies to every template. See `CLAUDE.md §7` for the rule. Structural, visual, or behavioural improvements only — colour swaps and renames do not qualify.

All templates are React + TypeScript + Tailwind + shadcn/ui. All go in `/components/ui/`.

---

## Uniqueness tiers

Every template carries a **U-score** indicating how common it is in the current agency web landscape:

| Score | Meaning | Frequency |
|---|---|---|
| **U1 — commodity** | Appears on 30–50% of modern agency / SaaS sites | High |
| **U2 — distinctive** | Appears on <10% of agency sites | Low |
| **U3 — rare** | Requires custom implementation; almost never seen in production | Very low |

**Minimum distinctiveness rule (enforced in `/plan-build`):**
- Every project must include at least one **U3** element.
- No more than **two consecutive U1 templates** in the same vertical scroll journey (hero to footer without a U2 or U3 break).

**Cross-portfolio rule:** Before assigning a U3 template to a section, verify it is not already used for the same section type in an existing project (`state/projects/*.md`). If it is, select a different U3 or modify the template significantly enough that the two projects cannot be mistaken for each other.

---

---

## 1. AI-Interface
**Uniqueness:** U2 — distinctive
**File:** `AI-Interface.md`
**Visual:** Dark floating input box (neutral-900) with auto-resizing textarea, attach button, send button that activates on content. Below: a row of action chips (Clone Screenshot, Import Figma, Upload Project, Landing Page, Sign Up Form).
**Interaction:** Textarea grows as user types (min 60px to max 200px). Enter submits, Shift+Enter newlines.
**Dependencies:** shadcn/textarea, lucide-react
**Choose when:** The page has an AI prompt entry point, chat interface, or command bar. SaaS dashboard with generative or assistant features.
**Avoid when:** Page has no AI feature. Purpose-built for chat/prompt UX only.

---

## 2. Background-Paths
**Uniqueness:** U2 — distinctive
**File:** `Background-Paths.md`
**Visual:** Full-screen SVG layer of 36 animated Bezier paths flowing diagonally across the viewport. Paths vary in opacity and stroke weight. Loops infinitely. Light/dark mode aware.
**Interaction:** Purely ambient, no pointer response. Paths animate pathLength and pathOffset over 20-30s loops.
**Dependencies:** framer-motion, shadcn/button
**Choose when:** A hero section needs motion depth and the effect has been confirmed to pass the AI-default test for this specific project. Works as a background layer beneath a centred headline and CTA.
**Avoid when:** Defaulting to it because it looks good. This is one of the most replicated animated-line patterns in templates. It must be adapted (stroke colour, speed, density) to feel intentional for the brand, not dropped in as-is.

---

## 3. Hero-Zoom
**Uniqueness:** U2 — distinctive
**File:** `Hero-Zoom.md`
**Visual:** A video or image starts as a small centred window, then expands to full-screen as the user scrolls. Content appears beneath after full expansion. Scroll is locked during expansion phase.
**Interaction:** Scroll-hijacking: page scroll intercepted until media reaches 100% expansion. Touch-supported.
**Dependencies:** framer-motion, next/image
**Choose when:** The hero asset (video reel, product screenshot) IS the message. Cinematic product launches, portfolio reveal heroes, video-forward landing pages.
**Avoid when:** The page needs immediately scannable above-fold content. Not for contact or pricing pages.

---

## 4. Menu
**Uniqueness:** U2 — distinctive (zero-radius + MENU label is non-standard)
**File:** `Menu.md`
**Visual:** Sticky header that starts flush and on scroll transitions to: backdrop blur, border, shadow, and narrowed max-width (floats as a pill). Mobile: full-screen overlay nav triggered by animated hamburger toggle icon.
**Interaction:** useScroll(10) threshold triggers the floating state. Mobile overlay locks body scroll while open.
**Dependencies:** shadcn/button, lucide-react
**Choose when:** Any page with a sticky top nav that needs mobile responsiveness. Default choice for headers.
**Brand note:** Hamburger icon conflicts with design system spec (word MENU required). Swap MenuToggleIcon for plain text label before shipping on any Yielde brand page.

---

## 5. Pricing
**Uniqueness:** U1 — commodity (3-column + toggle is the standard SaaS pricing pattern)
**File:** `Pricing.md`
**Visual:** Three-column pricing card grid with monthly/yearly frequency toggle (animated pill switcher). Each card shows plan name, price, feature list with optional tooltips, and CTA button. One card can be highlighted (visually elevated).
**Interaction:** Toggle switches frequency, prices animate between values. Tooltips on feature items.
**Dependencies:** shadcn/button, shadcn/tooltip, framer-motion, lucide-react
**Choose when:** Any pricing section. Accepts a plans array, fully data-driven. Override display styles to match brand typography (Bebas Neue, accent colour).

---

## 6. Projects-Showcase
**Uniqueness:** U2 — distinctive (cursor-following thumbnail list is uncommon in production)
**File:** `Projects-Showcase.md`
**Visual:** Vertical list of project rows (title, description, year, arrow icon). On hover, a floating thumbnail image appears near the cursor and follows it with smooth lerp interpolation.
**Interaction:** Mouse-follow with lerp at 0.15 factor, smooth lag behind cursor. No click navigation built in by default.
**Dependencies:** None beyond React (uses requestAnimationFrame lerp, not framer-motion)
**Choose when:** Portfolio or work page where project screenshots should be revealed on hover without navigating. Dense list format where the work speaks for itself.
**Avoid when:** The page already uses a grid layout or requires built-in click-through navigation.

---

## 7. Scroll-Container
**Uniqueness:** U2 — distinctive (3D tilt-to-upright scroll effect is uncommon)
**File:** `Scroll-Container.md`
**Visual:** A content container (product screenshot or dashboard) that enters the viewport tilted at 20 degrees in 3D perspective, then straightens to 0 degrees as the user scrolls. Creates a screen-tilting-upright cinematic reveal.
**Interaction:** Scroll-linked via useScroll on the container ref. Mobile gets a smaller scale range.
**Dependencies:** framer-motion
**Choose when:** Showcasing a UI screenshot, app dashboard, or product demo. Best at full-width on a dark background.
**Avoid when:** Content inside the container is interactive.

---

## 8. Silk-Background
**Uniqueness:** U3 — rare (raw pixel-level canvas noise; no library equivalent)
**File:** `Silk-Background.md`
**Visual:** Full-screen canvas animation of flowing silk-like noise texture. Dark base (#1a1a1a to #2a2a2a). Pixel-level imageData manipulation using sine-based noise creates shimmering colour bands that drift over time. Raw Canvas 2D API, not framer-motion.
**Interaction:** Purely ambient. Fades in after 300ms on mount.
**Dependencies:** None beyond React
**Choose when:** Hero or section background needs a rich non-generic animated texture. Passes the AI-default test better than gradient blobs because it uses raw pixel math.
**Performance note:** Iterates every pixel every frame. Use only on hero-level sections.

---

## 9. Spotlight-Cards
**Uniqueness:** U1 — commodity (cursor-gradient cards are ubiquitous since 2023)
**File:** `Spotlight-Cards.md`
**Visual:** Cards with a cursor-reactive radial gradient glow spotlight. As the pointer moves globally, the glow tracks to the nearest point on each card. Glow colour variants: blue, purple, green, red, orange. Sizes: sm, md, lg, or custom.
**Interaction:** pointermove listener on document. CSS custom properties drive the gradient.
**Dependencies:** None beyond React
**Choose when:** Feature grid, service card grid, or any card layout that needs interactive tactile depth on a dark background. Use orange variant to approximate accent colour on dark surfaces.

---

## 10. System-Explanation
**Uniqueness:** U2 — distinctive (radial orbital diagram with expandable nodes is uncommon)
**File:** `System-Explanation.md`
**Visual:** Radial orbital diagram. Numbered items orbit a central point and auto-rotate. Clicking a node expands a detail card, pauses rotation, and highlights connections to related nodes. Status indicators (completed, in-progress, pending) colour the nodes.
**Interaction:** Click node expands card and pauses rotation. Click background collapses all and resumes rotation.
**Dependencies:** shadcn/badge, shadcn/button, shadcn/card, lucide-react
**Choose when:** Explaining an interconnected multi-step system, process with branching relationships, or service architecture.
**Avoid when:** The process is strictly linear (3 sequential steps). Orbital complexity is only justified when real relationships between nodes exist.

---

## 11. Animated-Hero
**Uniqueness:** U1 — commodity (rotating word heroes are the single most replicated hero pattern of 2022–2025)
**File:** `Animated-Hero.md`
**Visual:** Centred hero with a static text prefix and one rotating word that cycles through an array every 2 seconds. The word slides in vertically using a Framer Motion spring (from above and below). Two CTA buttons below. No background effect, plain surface only.
**Interaction:** Fully automatic, no user trigger. Word animates on a 2s interval timer.
**Dependencies:** framer-motion, shadcn/button, lucide-react
**Choose when:** The rotating words carry specific, concrete proof that earns the animation. Example: cycling through real outcomes ("3 days", "R700 flat", "ranked #1") not generic adjectives.
**Avoid in almost every case:** This is the single most replicated hero pattern on the web (2023-2025). The rotating-word trick fails the AI-default test instantly when the words are vague. The animation draws the eye directly to the copy, so weak copy is amplified into a red flag. Only use if every word in the rotation is a hard, specific, defensible claim.

---

## 12. Aurora-Background
**Uniqueness:** U1 — commodity (aurora / gradient backgrounds ubiquitous in 2024; banned on Yielde brand)
**File:** `Aurora-Background.md`
**Visual:** Full-screen animated aurora (northern lights) using CSS Tailwind keyframe animation. Blue, indigo, and violet colour bands shift and breathe behind content. Optional radial mask focuses the glow top-right. Pure CSS, no canvas, no framer-motion in the effect itself.
**Interaction:** Purely ambient CSS animation. Requires tailwind.config.js extension to register the aurora keyframe.
**Dependencies:** framer-motion (demo wrapper only), tailwind config extension
**Banned on all Yielde brand pages:** Aurora colours are blue/indigo/violet, a direct conflict with the no-purple rule and the Garden Route palette. Do not use on any Yielde page under any circumstance.
**Permitted for client sites only:** Type 3 Coastal/Nordic (wellness, beauty, lifestyle) or Type 2A/2B tech where a cool-blue palette is already established. Colour stops must be overridden to match the client palette before shipping.

---

## 13. Background-Shapes
**Uniqueness:** U1 — commodity (floating rounded blobs are ubiquitous; hard conflict with zero-radius rule)
**File:** `Background-Shapes.md`
**Visual:** Full-screen hero on a near-black (#030303) background with 3-6 large translucent pill/ellipse shapes that animate in from above on load, then slowly bob on a 12s easeInOut loop. Shapes have backdrop-blur, gradient fill, and white semi-transparent border. Subtle corner gradient (indigo/rose tint) behind everything.
**Interaction:** Load animation only. Shapes bob indefinitely. No pointer response.
**Dependencies:** framer-motion, lucide-react
**Hard conflict, zero-radius rule:** The shapes are rounded-full. The design system bans all border-radius globally. These shapes are the core visual element, not decoration. Removing their radius defeats the template entirely. Do not use on any Yielde brand page.
**Use for client sites only:** Type 3 Coastal/Nordic or Type 4 Warm Bohemian clients where rounded, soft organic shapes align with the brand identity. Default indigo/rose corner tints must be replaced with client palette colours.

---

## 14. Background-Strings
**Uniqueness:** U3 — rare (raw WebGL GLSL shader; purple must be overridden before use)
**File:** `Background-Strings.md`
**Visual:** Full-screen WebGL canvas running a raw GLSL fragment shader. Renders 16 wavy sinusoidal lines per group with noise-based warp and a faint grid overlay. Lines animate continuously. Default colours: purple/violet lines on a dark navy-to-purple gradient.
**Interaction:** Purely ambient. Runs every frame on the GPU.
**Dependencies:** None beyond React (raw WebGL, no libraries)
**Critical colour conflict:** Default shader constants are hardcoded purple (lineColor vec4: 0.4, 0.2, 0.8). Purple is banned. These values must be overridden in the GLSL source before use on any Yielde page. After recolouring to copper/steel, this is one of the most technically distinctive backgrounds available.
**Choose when:** A GPU-rendered ambient background is needed and you are willing to override the GLSL colour constants. Ideal for a hero or full-bleed section where raw technical credibility is the message.
**Avoid when:** You cannot edit the GLSL shader. Shipping the default purple version on any page is a brand violation.

---

## 15. Bento-Grid
**Uniqueness:** U1 — commodity (most replicated SaaS feature layout of 2024)
**File:** `Bento-Grid.md`
**Visual:** Responsive 3-column CSS grid of information cards with variable column spans (1 or 2 columns wide). Each card: icon, status badge (Live/Updated/Beta), title, description, tag pills, and meta text. On hover: card lifts and a dot-grid overlay fades in. One card can have hasPersistentHover to always show the active state.
**Interaction:** CSS hover only. No animation library required.
**Dependencies:** lucide-react
**Use with restraint:** Bento grid is the most replicated SaaS feature layout of 2024. It signals "modern startup" to the point of invisibility. Only use it when cards genuinely have metadata worth displaying (status, version, region) and the variable column spans are earned by content hierarchy.
**Choose when:** The page must communicate 4-6 parallel capabilities where each has a distinct status tag and real differences in importance.
**Avoid when:** The features are equally weighted or the page already uses Spotlight-Cards. Two card patterns on one page is always wrong.

---

## 16. Component-Collection
**Uniqueness:** U1 — commodity (tabbed feature section with screenshot is standard SaaS pattern)
**File:** `Component-Collection.md`
**Visual:** Centred section heading with badge, then a horizontal tab bar of 3 tabs (each with icon and label). The active tab reveals a two-column layout: left has badge, headline, description, and CTA button; right has a large screenshot or image. Content swaps on tab switch.
**Interaction:** Tab click switches content. Uses @radix-ui/react-tabs directly.
**Dependencies:** shadcn/badge, shadcn/button, @radix-ui/react-tabs, lucide-react
**Generic risk:** This is a standard SaaS feature tab section. The template ships with placeholder copy. These labels must be replaced with real, specific feature names or the section is worthless.
**Choose when:** There are exactly 3-4 distinct features where each genuinely requires its own image and a paragraph of explanation, and the features are parallel in importance.
**Avoid when:** The features could share a scrollable page without tabs. Tabs hide content by default. Never use them to shorten a page.

---

## 17. Footer
**Uniqueness:** U2 — distinctive (GSAP-animated cinematic footer is uncommon; requires full reskin for Yielde brand)
**File:** `Footer.md`
**Visual:** Cinematic GSAP-animated footer with a large central glowing wordmark, surrounding glass-morphism pill navigation links, scrolling ticker marquee beneath the wordmark, animated dot-grid background with gradient fade, radial aurora glow behind the wordmark, and an animated heartbeat icon. Uses Plus Jakarta Sans via Google Fonts. GSAP ScrollTrigger drives entrance animations.
**Interaction:** Scroll-triggered entrance via GSAP ScrollTrigger. Glass pills have hover state transitions.
**Dependencies:** gsap, gsap/ScrollTrigger (heaviest dependency in the library, approximately 40KB gzipped)
**Brand conflicts on Yielde pages:** Glass morphism pills (rounded), aurora glow, Plus Jakarta Sans, and the radial gradient all conflict with design system spec. Do not use on any Yielde page without a complete reskin to Bebas Neue wordmark, zero-radius link rows, accent colour, and GSAP-only entrance logic.
**Choose when:** A client site needs the footer to function as a brand moment, not just a nav block. High-design contexts (Type 2 editorial, Type 4 warm bohemian) where the client has approved an elevated, visually complex footer.
**Avoid when:** Performance budget is tight. GSAP adds weight and the glass/aurora effects add paint complexity.

---

## 18. Gooey-Text
**Uniqueness:** U3 — rare (SVG feColorMatrix liquid morph; almost never seen in production work)
**File:** `Gooey-Text.md`
**Visual:** Two absolutely-positioned text spans layered on top of each other. They morph between words using CSS blur and opacity, filtered through an SVG feColorMatrix threshold filter. The transition looks liquid, text appears to melt and reform into the next word. Configurable: texts array, morphTime (default 1s), cooldownTime (default 0.25s).
**Interaction:** Runs automatically on requestAnimationFrame. No user trigger needed.
**Dependencies:** None beyond React (SVG filter and rAF loop, no libraries)
**This is the most unconventional text effect in the library.** Most viewers have never seen it. It passes the AI-default test cleanly.
**Choose when:** A single prominent display word needs to cycle through values in a way that stops scrolling. Works best with Bebas Neue at large sizes (60px and above). Hero accent word, rotating service name, or CTA verb are ideal placements.
**Avoid when:** Using more than one instance per page. Never use on body copy. Every word in the rotation must be specific and meaningful.

---

## 19. Image-Card-Gallery
**Uniqueness:** U1 — commodity (horizontal image carousel with arrows is a standard pattern)
**File:** `Image-Card-Gallery.md`
**Visual:** Full-section horizontal carousel of large cards. Each card has a full-bleed background image with a text overlay at the bottom (title and description). Left/right arrow buttons navigate between slides. Dot indicator row shows current position and total count.
**Interaction:** Manual prev/next navigation via arrow buttons. shadcn Carousel (Embla) under the hood. Touch-swipe capable.
**Dependencies:** shadcn/carousel, shadcn/button, lucide-react
**Choose when:** A case study section, client work gallery, or article preview row needs visible navigation with images. Good for 3-8 items where each item deserves headline-level prominence.
**Avoid when:** You are building the work page. The design system explicitly bans carousels on the work page. Projects-Showcase (hover-reveal list) is the correct pattern there.

---

## 20. Lamp
**Uniqueness:** U2 — distinctive (conic-gradient spotlight is uncommon in production; cyan must be overridden)
**File:** `Lamp.md`
**Visual:** Dramatic conic-gradient spotlight effect simulating a stage lamp shining downward from center-top. Two fan-shaped gradient elements (mirrored left/right) expand from the center. Default colour is cyan/teal on a slate-950 near-black background. On scroll-in, the lamp width expands from 15rem to 30rem via Framer Motion.
**Interaction:** Scroll-in width expansion animation on mount/viewport entry. No pointer response after.
**Dependencies:** framer-motion
**Colour conflict:** Default is cyan. For Yielde brand, override gradient stops to accent colour before use.
**Choose when:** A single product, headline, or CTA needs to feel spotlit and theatrical. Works well as a wrapper for a section header on a dark page where the lamp colour matches the brand accent.
**Avoid when:** Using it as a substitute for a full hero section. Stacking multiple lamps on one page kills the effect.

---

## 21. Sparkles
**Uniqueness:** U1 — commodity (BANNED — particle sparkle/star fields are explicitly prohibited)
**File:** `Sparkles.md`
**Visual:** tsParticles-powered sparkle/star field. Small glowing dots float and drift across the background. On click, a burst of new particles spawns at the cursor. Default background is blue (#0d47a1). Configurable: particle size (1-3px), colour, density, and speed.
**Interaction:** Click spawns a particle burst. Otherwise purely ambient drift.
**Dependencies:** @tsparticles/react, @tsparticles/slim, framer-motion (three packages, non-trivial bundle)
**Banned:** Sparkles, stars, confetti, and snow are explicitly banned (see `knowledge/design-system/06-motion.md#73-banned`). Do not use on any Yielde or client page.
**Only permitted after complete redesign:** If the particle behaviour is redesigned to be non-round, non-sparkle, and non-generic and passes the AI-default test, the tsParticles engine itself can be reused. The default configuration cannot ship.

---

## 22. Trusted-By
**Uniqueness:** U1 — commodity (auto-scrolling logo marquee ubiquitous since 2022)
**File:** `Trusted-By.md`
**Visual:** A single row of brand logo images that auto-scrolls left continuously as an infinite marquee. "Trusted by these companies" heading above.
**Interaction:** Auto-scroll via embla-carousel-auto-scroll. No user interaction.
**Dependencies:** shadcn/carousel, embla-carousel-auto-scroll
**This section is credibility-critical:** It only adds value when the logos are real clients or real partners. Placeholder tech-brand logos actively damage credibility.
**Choose when:** The client has 5 or more real, recognisable organisations to display and has approved their logos being shown publicly.
**Avoid when:** The site is new and has no proven clients, or when logos are technology tools (frameworks, hosting providers) rather than actual customers.

---

## 23. WebGl-Shader
**Uniqueness:** U3 — rare (Three.js chromatic aberration GLSL shader; high craft signal)
**File:** `WebGl-Shader.md`
**Visual:** Three.js WebGL renderer with a GLSL fragment shader producing animated glowing sine wave lines. The RGB channels are independently phase-shifted (chromatic aberration) via a distortion uniform, creating a full-spectrum neon wave effect. Full-screen canvas.
**Interaction:** Purely ambient. No pointer or scroll response.
**Dependencies:** three (Three.js)
**Choose when:** Maximum technical-impression background is required and the design can accommodate full-spectrum colour output.
**Colour reality:** Default output is full RGB spectrum. Use for client sites only unless you are comfortable modifying GLSL. Palette-agnostic by default.

---

## 24. Section-With-Mockup
**Uniqueness:** U1 — commodity (2-column copy + overlapping screenshots is standard product section)
**File:** `Section-With-Mockup.md`
**Visual:** Two-column split section on a black background. Left column: headline and description paragraph. Right column: two overlapping mockup screenshots (primary on top, secondary beneath and offset). Both columns animate in on scroll with staggered Framer Motion entrance. A reverseLayout prop mirrors the column order.
**Interaction:** Scroll-triggered entrance animation only. Static after load.
**Dependencies:** framer-motion
**Choose when:** A feature or service section needs copy alongside a visual proof, and two overlapping screenshots tell a layered story.
**Brand note:** Background is hardcoded black, compatible with `--fg`. Text is hardcoded white, replace with `--fg-inverse` and semantic tokens before use.

---

## 25. blog-posts
**Uniqueness:** U1 — commodity (3-column blog card grid is a commodity layout)
**File:** `blog-posts.md`
**Visual:** Three-column responsive card grid for articles. Each card: full-width cover image at top, label badge, headline, summary paragraph, author name, publish date, and a "Read more" arrow link.
**Interaction:** Static layout. No animation.
**Dependencies:** shadcn/badge, shadcn/button, shadcn/card, lucide-react
**Choose when:** The journal index page needs a visible article grid. Fully data-driven via a posts array.
**Brand notes:** Cards use rounded-xl, override to radius-0. Replace "View all articles" with specific copy per CTA rules. Author and date fields should be populated with real data.

---

## 26. hero-section-blocks
**Uniqueness:** U1 — commodity (centred hero + screenshot + 3 proof blocks is a standard SaaS landing page pattern)
**File:** `hero-section-blocks.md`
**Visual:** Centred hero with badge and headline, then a full-width product screenshot with a bottom-gradient fade. Two faint radial dot-grid corner accents frame the image. Below: a horizontal row of 3 feature blocks separated by vertical dividers, each with a Lucide icon, title, and short description.
**Interaction:** Static. No animation.
**Dependencies:** shadcn/badge, shadcn/separator, lucide-react
**Choose when:** A landing page needs a hero that pairs a product screenshot with 3 supporting proof points in a clean, structured layout.
**Brand notes:** Screenshot has rounded-xl, override to radius-0. Feature icons can be replaced with mono index numbers (01/02/03 in Geist Mono). Feature descriptions must be proof-based claims with numbers, not adjectives.

---

## 27. Infinite-Grid
**Uniqueness:** U2 — distinctive (dual-layer mouse-reveal grid with ambient scroll is uncommon in production)
**File:** `Infinite-Grid.md`
**Visual:** Full-screen animated grid of 40px squares that scrolls diagonally at 0.5px/frame using `useAnimationFrame`. A dim base layer (5% opacity) sits permanently; a second identical layer (40% opacity) is revealed only beneath a 300px radial gradient mask that follows the cursor. Three soft radial glow blobs (orange, primary, blue) add colour depth behind the grid.
**Interaction:** Mouse move repositions the reveal mask in real time. Grid scrolls continuously regardless of pointer position.
**Dependencies:** framer-motion
**Choose when:** A hero section needs ambient directional motion and tactile cursor feedback without a heavy canvas or WebGL layer. Works behind minimal centred typography.
**Avoid when:** The page already has a mouse-reactive element (cursor, spotlight cards). Two pointer-following effects on the same page cancel each other out.
**Brand conflicts:** Hardcoded `orange-500/40` and `blue-500/40` glow blobs must be replaced with semantic tokens (e.g. `--accent/40`, `--ramp1-4/40`). The `rounded-full` class on the blur elements violates the zero-radius rule — replace with `clip-path: circle(50%)` or remove entirely.

---

## 28. Text-Scramble
**Uniqueness:** U2 — distinctive (hover-triggered character scramble with progressive reveal is kinetic typography; uncommon in production)
**File:** `Text-Scramble.md`
**Visual:** Inline text in monospace uppercase. On hover, characters randomly cycle through `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*` at 30ms intervals, revealing real characters progressively from left to right. An animated underline expands from the left edge on hover. A faint primary glow surrounds the element.
**Interaction:** Mouse enter triggers scramble and underline expansion. Mouse leave halts scramble (text remains resolved). Cleanup clears the interval on unmount.
**Dependencies:** none (pure React, `setInterval` only)
**Choose when:** Navigation links, section overline labels, or standalone CTA text where hover should feel decoding/technical. The mono uppercase constraint means it only suits labels, not paragraph text.
**Avoid when:** Using on body copy or any text longer than ~20 characters. Scramble duration scales with text length and feels sluggish above that threshold.
**CSS extension:** Add `--primary: oklch(0.85 0.15 55)` (warm amber) to globals.css so the scramble highlight colour and glow match the brand accent rather than the default blue.

---

## 29. Pricing-Section-4
**Uniqueness:** U2 — distinctive (scroll-timeline entrance with animated number transitions and vertical cut reveal header is uncommon in production)
**File:** `Pricing-Section-4.md`
**Visual:** Dark (bg-black) three-column pricing grid. Header text slides in via `VerticalCutReveal` spring animation. Prices animate between monthly and yearly values using `@number-flow/react` number morphing. Each card and the header enter the viewport through `TimelineContent` scroll-reveal variants (blur + y-offset). Toggle switch uses a spring-animated active pill.
**Interaction:** Monthly/yearly toggle switches plan prices with morphing number animation. Scroll drives the entrance of each section element sequentially.
**Dependencies:** motion, @number-flow/react, @tsparticles/slim, @tsparticles/react, framer-motion
**MISSING DEPENDENCY:** Imports `TimelineContent` from `@/components/ui/timeline-animation` — this component is **not included** in the template and must be sourced separately before shipping. Without it the template will not compile.
**SPARKLES BANNED:** The template renders `<SparklesComp>` (tsParticles particle field) which is explicitly banned on all Yielde and client pages (see `knowledge/design-system/06-motion.md`). Remove and replace with a permitted ambient background (e.g. Silk-Background, Infinite-Grid, Background-Paths).
**Brand conflicts:** Hardcoded `#3131f5` blue in border/blur elements; `rounded-xl` CTA buttons; `rounded-full` toggle track. All must be overridden.
**Choose when:** The pricing section needs theatrical scroll-reveal entrance and real-time price animation. The `NumberFlow` number morphing is the strongest visual differentiator here — use it.

---

## 30. Slide-Button
**Uniqueness:** U2 — distinctive (drag-to-confirm gesture button is a mobile-native pattern; rare on web)
**File:** `Slide-Button.md`
**Visual:** A horizontal pill track (bg-gray-100) with a draggable icon button on the left. As the user drags right, a coloured fill (bg-accent) expands behind the handle via a spring-animated width transform. At 90% drag completion, the action fires: the pill morphs to a narrower completion state displaying a loading spinner that resolves to a success or error icon.
**Interaction:** Framer Motion drag constraint: x-axis only, 0–155px. Spring snaps back if released below threshold. Completion animates the outer pill width and swaps content via `AnimatePresence`.
**Dependencies:** framer-motion, lucide-react, @radix-ui/react-slot, class-variance-authority
**Choose when:** A form submission, booking confirmation, or delete action benefits from a gesture that makes accidental triggering impossible. Particularly effective on contact forms and appointment schedulers where the sliding gesture reinforces commitment.
**Brand conflicts:** The track container uses `rounded-full` (violates zero-radius rule — the track is not a button). Custom `shadow-button-inset` and `shadow-button` Tailwind classes are non-standard; add their definitions to globals.css before use. See template file for the shadow definitions.

---

## 31. Sticky-Scroll
**Uniqueness:** U2 — distinctive (CSS sticky three-column gallery with Lenis momentum scroll is uncommon)
**File:** `Sticky-Scroll.md`
**Visual:** Three-column photo grid (12-column CSS grid, each outer column 4 spans, centre column 4 spans). Outer columns scroll freely while the centre column is `position: sticky, top: 0, height: 100vh` — creating a visual split where the sides flow past a fixed anchor column. Lenis provides momentum-smooth inertia scrolling. Footer has a large display wordmark with a curved top-border reveal.
**Interaction:** Pure CSS sticky — no JavaScript animation beyond Lenis smooth scroll. Scrolling drives the entire visual effect through native browser layout.
**Dependencies:** lenis
**Choose when:** A portfolio, gallery, or work section needs a multi-column sticky showcase without JavaScript-driven parallax. The CSS sticky approach keeps paint complexity low.
**Brand conflicts:** `rounded-md` on all image figures violates zero-radius rule — remove entirely. `rounded-tr-full rounded-tl-full` on the footer div conflicts — remove and use a straight-edge or angled transition instead. Hardcoded `bg-slate-950` and `bg-black` must be replaced with `--bg` or `--surface` semantic tokens. Footer wordmark is placeholder "ui-layout" — replace with client wordmark.

---

## 32. Hero-Section-9
**Uniqueness:** U1 — commodity (fixed nav + centred headline + perspective screenshot + logo trust-bar is a standard modern SaaS landing page composite)
**File:** `Hero-Section-9.md`
**Visual:** Fixed-position nav with transparent background and `border-dashed` bottom border. Mobile hamburger with animated Menu/X icon swap via Tailwind `group-data-[state]` attribute toggle. Centred hero: headline, subtext paragraph, one CTA button. Full-width product screenshot rendered with CSS `perspective: 1200px` and `rotateX(20deg)` tilt and a right-side gradient mask. Horizontal logo row beneath: 11 brand logos with `dark:invert`.
**Interaction:** Mobile nav toggle controls open/close. Screenshot is static — no scroll-linked behaviour by default.
**Dependencies:** lucide-react, @radix-ui/react-slot, class-variance-authority
**Choose when:** A composite self-contained hero block is needed (nav + hero + trust-bar in one component) rather than separately composed sections. Useful when a standalone page section rather than site-wide layout is the requirement.
**Avoid when:** The project already uses the Menu template for navigation — combining the two duplicates header logic. Prefer composing Menu + hero-section-blocks separately for full-site builds.
**Brand conflicts:** `rounded-3xl` on the mobile nav menu panel violates zero-radius rule — remove. Purple gradient (`#9B99FE`) in the embedded `Logo` SVG must be replaced with the client's wordmark SVG. Product screenshot images are Tailark-branded placeholders — replace with real client screenshots. CTA "Start Building" is generic — override with a specific client CTA per `knowledge/copy-voice/banned-phrases.yml`.

---

## 33. Radar-Effect
**Uniqueness:** U2 — distinctive (rotating GSAP-free radar sweep over concentric rings with animated icon nodes is uncommon in production)
**File:** `Radar-Effect.md`
**Visual:** Eight concentric circles expanding from a central point (opacity decreasing outward). A rotating sweep line (`radar-spin` CSS keyframe, 10s linear infinite) extends 400px from the origin, coloured as a sky-600 gradient. Icon nodes (`IconContainer`) sit at fixed positions in 3 rows around the radar, each fading in with a staggered framer-motion delay. The entire assembly sits on a dark background.
**Interaction:** Purely ambient — the sweep line rotates continuously. Icon nodes animate in on mount. No pointer response.
**Dependencies:** framer-motion, tailwind-merge
**Choose when:** A services or capabilities section needs a spatial, radar-scanning visual metaphor — particularly for tech, security, data-monitoring, or agency positioning ("we cover these areas"). Icon nodes map service categories to orbital positions.
**Avoid when:** The page already has a rotating or scanning element. The radar metaphor is specific — it only earns its place when "scanning/covering/monitoring" matches the brand narrative.
**Brand conflicts:** `rounded-2xl` on `IconContainer` icon boxes violates zero-radius rule — remove border-radius or change to `rounded-none`. Default icon colour `text-slate-600` should map to a semantic token. Demo uses lucide-react icons (do NOT install react-icons — already substituted in the template).

---

## 34. Horizon-Hero-Section
**Uniqueness:** U3 — rare (Three.js + EffectComposer + UnrealBloomPass + GSAP ScrollTrigger cinematic multi-section hero; almost never seen in production agency work)
**File:** `Horizon-Hero-Section.md`
**Visual:** Full-height black canvas with a Three.js scene: 15,000 star particles across 3 depth layers, a nebula PlaneGeometry with a luminance-mapped texture, 4 mountain ShapeGeometry silhouette layers, and an atmospheric SphereGeometry rim. Post-processing: EffectComposer → RenderPass → UnrealBloomPass gives the entire scene bloom glow. Above canvas: a fixed-position hero with a character-by-character GSAP entrance animation on `.title-char` elements. Scroll-linked GSAP ScrollTrigger interpolates camera position across 3 sections pinned below the hero.
**Interaction:** Scroll drives camera position through 3 content panels. GSAP ScrollTrigger scrubs the camera between `[section1Pos, section2Pos, section3Pos]` interpolation points. A vertical side menu with animated icons and scroll-progress bar overlays the right edge. Scroll sections beneath the hero trigger section transitions.
**Dependencies:** gsap, three
**CRITICAL — MISSING CSS:** The component uses 15+ custom class names (`.hero-container`, `.hero-canvas`, `.hero-content`, `.hero-title`, `.side-menu`, `.scroll-progress`, `.scroll-sections`, `.content-section`, etc.) with zero CSS provided in the source. A full minimum-viable CSS block is embedded in the template file and **must** be added to globals.css or a CSS module before use. Without it the layout is completely broken.
**Performance warning:** Three.js renderer + EffectComposer (bloom post-pass) + 15,000 particles + GSAP ScrollTrigger running simultaneously. This is the heaviest template in the library. Always test FPS on mid-range hardware before shipping. On mobile, reduce particle count and disable bloom.
**Choose when:** The project brief explicitly calls for a cinematic, immersive, high-craft hero and the client has approved heavy visual weight. Ideal for high-end architecture, landscape/travel, or premium tech brands where the horizon and depth of field signal scale and ambition.
**Avoid when:** Performance budget is limited, the section is not the hero, or the site has any other Three.js or WebGL section. One canvas per page maximum.
**Cross-portfolio rule:** Verify this template is not already used as the hero for an existing project in `state/projects/*.md`. Its visual signature is distinctive enough that two clients sharing it are visually identical.

---

## 35. Animate-Card
**Uniqueness:** U2 — distinctive (spring-animated stacked card deck with bottom-draw shuffle is uncommon in production)
**File:** `Animate-Card.md`
**Visual:** Three stacked cards arranged in a perspective fan (front card: `scale: 1, y: 12`; middle: `scale: 0.95, y: -16`; back: `scale: 0.9, y: -44`). Each card is 280px tall × 324px wide (512px on sm+), rounded-top, bordered, with `bg-card`. Cards contain a full-bleed image thumbnail, title, description, and a "Read" chevron button. An "Animate" button below the stack triggers a shuffle.
**Interaction:** "Animate" click removes the front card via `AnimatePresence exit` (slides down 340px) and rotates the array — middle becomes front, back becomes middle, a new card enters at the back position via `initial: { y: -16, scale: 0.9 }`. Spring transition: `{ type: "spring", duration: 1, bounce: 0 }`.
**Dependencies:** framer-motion
**Choose when:** A work showcase, testimonial sequence, or service preview needs a tactile deck metaphor — physically "dealing" through content. The shuffle gesture conveys curation and depth without a full carousel.
**Avoid when:** Content items are not visually distinct enough to earn individual card reveal. If items all look similar, the shuffle animation feels arbitrary.
**Brand conflicts:** `rounded-t-xl` on cards violates zero-radius rule — remove top border-radius. `rounded-full` on the "Read" chevron button conflicts — the button must use `rounded-none` or omit radius. `cardData` image URLs and titles are placeholder (shadway.online, wrizzai.online, 21st.dev) — **must** be replaced with real client screenshots and content before shipping.

---

## 36. Full-Screen-Scroll-FX
**Uniqueness:** U3 — rare (GSAP-pinned editorial scroll with bilateral label lists, masked-word headline reveal, and background wipe is almost never seen in production)
**File:** `Full-Screen-Scroll-FX.md`
**Visual:** A pinned full-screen section (GSAP ScrollTrigger `pin: true`). Centre: a large headline where each word is masked (`overflow: hidden`) and revealed upward as scroll progresses. Left and right columns: vertical label lists that centre-align vertically via a Y transform (`translateY(-50%)`) driven by scroll progress. Background image cross-fades between sections with a clip-path wipe transition. A horizontal progress bar tracks position across all sections.
**Interaction:** Scroll drives all transitions via a single GSAP ScrollTrigger scrub. An imperative `FullScreenFXAPI` ref exposes `next()`, `prev()`, `goTo(i)`, `getIndex()`, and `refresh()` methods for programmatic control from parent components.
**Dependencies:** gsap
**Conversion note:** Source used `<style jsx>` (Next.js Pages Router only). Template converts all styles to a regular `<style>{\`...\`}</style>` template literal — compatible with both App Router and React outside Next.js.
**Choose when:** A homepage needs a high-craft editorial scroll moment that stops visitors — equivalent to a magazine spread in motion. Works for agencies, studios, and premium product sites where the hero scroll is the primary brand statement.
**Avoid when:** The section is not the primary scroll anchor. Pinned sections force scroll-hijacking behaviour that breaks page flow if used anywhere except a deliberate full-page editorial moment.
**Brand conflicts:** Background `<img>` src values in the demo are placeholder Unsplash URLs — replace with real, licensed client photography. Label list items default to lorem structure — replace with real section chapter names. Headline words must be specific and meaningful; the mask-reveal effect amplifies vague copy into a red flag.

---

## 37. Scroll-Morph-Hero
**Uniqueness:** U3 — rare (20 FlipCard components morphing through 4 phases — scatter → line → circle → arc — via virtual scroll and framer-motion springs is almost never seen in production)
**File:** `Scroll-Morph-Hero.md`
**Visual:** 20 `FlipCard` components (each 64×96px, with a 3D rotateY-180 hover flip between front and back faces). Cards exist in four morph phases as virtual scroll progresses: **Scatter** (random `x/y` offsets across the viewport), **Line** (evenly spaced horizontal row), **Circle** (360° distribution on a 280px radius), **Arc** (cards spread within a 220° arc and rotate as a unit). Each phase interpolation uses `useSpring({ stiffness: 80, damping: 15 })` + `useTransform` for smooth lerp between positions.
**Interaction:** Virtual scroll: the container captures `wheel` and `touchmove` events and accumulates into a `virtualScroll` MotionValue (0–3000 range, not native page scroll). Mouse parallax shifts all arc positions by `±100px` on the x-axis relative to cursor normalised position. Individual cards have 3D rotateY hover-flip with perspective wrapper.
**Dependencies:** framer-motion
**Lenis conflict:** The virtual scroll implementation captures `wheel` events directly on the container element. If Lenis is active on the same page, it will intercept these events before they reach the component. Isolate this component from the Lenis scroll context (e.g., wrap in a Lenis `<ReactLenis root={false}>` boundary or detach Lenis on this section's mount).
**Choose when:** A project portfolio, product feature grid, or services section needs a hero-level scroll-driven reveal that stops the visitor cold. The morphing deck is a signature moment — use it once per project, as the primary above-fold or mid-page centrepiece.
**Avoid when:** The page already has another scroll-hijacking or virtual-scroll element. Card content must be visually distinct and short (2–3 words per face) — the flip reveal only works when the content surprise earns it.
**Brand conflicts:** `rounded-xl` on `FlipCard` faces violates zero-radius rule — remove. Hardcoded gradient `from-slate-900/50 to-slate-800/50` on card faces must be replaced with semantic surface tokens. FlipCard back-face content is placeholder text (`projectData` titles/categories) — replace with real client work before shipping.

---

## 38. Text-Parallax-Scroll
**Uniqueness:** U2 — distinctive (sticky-image parallax sections with scale-out and overlay text fade-in are an editorial scroll pattern; uncommon in standard agency sites but recognized)
**File:** `Text-Parallax-Scroll.md`
**Visual:** Multiple full-height sections, each with a sticky background image that scales from 1→0.85 and fades opacity 1→0 as the user scrolls past it (tracked via `useScroll offset: ["end end", "end start"]`). Centered overlay text (`subheading` + `heading`) parallaxes vertically (y: 250→-250px) and fades in at scroll 0.25→0.5 then out at 0.5→0.75. A 12px gutter on both sides gives each image a page-within-page framing effect. A `children` content block (2-column copy grid) renders beneath each sticky image.
**Interaction:** Entirely scroll-driven via framer-motion `useScroll` + `useTransform`. No pointer response. Each `StickyImage` and `OverlayCopy` maintain independent scroll trackers on their own refs.
**Dependencies:** framer-motion, lucide-react
**Choose when:** An editorial content page — services, process, or portfolio breakdown — needs multiple equal-weight sections where the photo IS the section heading and supporting copy lives below. The scaling image signals "we've moved past this section" organically.
**Avoid when:** More than 3 sections are needed (each adds two simultaneous motion values; performance degrades on mobile). Avoid when the page has other scroll-hijacking or scroll-linked elements — competing transforms fragment the reading rhythm.
**Brand conflicts:** `rounded-3xl` on `StickyImage` violates zero-radius rule — remove entirely (it is not a button). `bg-white` wrapper must be replaced with `--bg` semantic token. `bg-neutral-950/70` image overlay must use `--fg/70` or equivalent. `text-neutral-600` body copy must use `--muted-fg` token. Button retains `rounded` (buttons are the design system exception to zero-radius). Image URLs and `ExampleContent` copy are placeholder lorem — replace entirely with real client assets.

---

## 39. Dot-Pattern
**Uniqueness:** U1 — commodity (SVG dot grid overlays are ubiquitous in the shadcn/magic-ui ecosystem since 2023)
**File:** `Dot-Pattern.md`
**Visual:** An `absolute inset-0` SVG element that fills its parent with a configurable tiled `<circle>` dot grid. Default: 24×24px spacing, dots at (1, 0.5) with 0.5px radius — extremely subtle. Dense configuration (`width={5} height={5}`) gives a 5px grid with visibly dense dot texture. Fill colour is overridable via `className` prop. `useId()` scopes the `<pattern>` id so multiple instances on the same page don't conflict.
**Interaction:** None — `pointer-events-none` prevents any mouse interaction. Purely decorative.
**Dependencies:** None beyond React (`@/lib/utils cn` — always present in shadcn projects)
**Choose when:** A container, hero, or quote panel needs a low-cost textured background without canvas or animation overhead. Pairs well with a coloured border + corner accent squares as a "technical drafting" or "grid paper" aesthetic. The `className` prop makes dot colour and opacity fully overridable per usage.
**Avoid when:** The parent surface already has a non-neutral background (gradient, image, coloured fill) — dots over busy backgrounds disappear or look muddy. Do not use as a standalone section background; it needs a containing element with defined dimensions.
**Brand conflicts:** Default `fill-slate-500/50` is hardcoded — must be overridden via `className` prop to a semantic token (e.g. `fill-fg/10`, `fill-accent/20`). Demo corner accents use `border-red-500` and `bg-red-500` — replace with `--accent` or `--border` semantic tokens. `rounded-[40px]` on the inner content wrapper in demo violates zero-radius rule — remove. Demo quote copy is placeholder — replace with a real client testimonial or brand statement.

---

## Quick-pick cheat sheet

| Need | Template |
|---|---|
| AI chat or prompt input | AI-Interface |
| Animated hero background with flowing lines | Background-Paths (audit before use) |
| Video or image that expands full-screen on scroll | Hero-Zoom |
| Sticky navigation with mobile overlay | Menu |
| Pricing tiers with monthly/yearly toggle | Pricing |
| Portfolio list with hover-reveal image thumbnails | Projects-Showcase |
| Product screenshot with 3D scroll-tilt reveal | Scroll-Container |
| Rich canvas noise texture background | Silk-Background |
| Cards with cursor-reactive glow spotlight | Spotlight-Cards |
| Multi-node orbital process or system diagram | System-Explanation |
| Hero with a single cycling word in the headline | Animated-Hero (read avoid-when first) |
| Cool-blue aurora/northern-lights background | Aurora-Background (client sites only, never Yielde brand) |
| Floating pill shapes drifting in hero background | Background-Shapes (client sites only, rounded shapes conflict) |
| WebGL animated wave lines via raw GLSL shader | Background-Strings (must override purple GLSL colour constants) |
| Feature cards grid with status badges and spans | Bento-Grid (high genericness risk, use sparingly) |
| Tabbed feature section with image per tab | Component-Collection (replace all placeholder copy first) |
| Cinematic GSAP-animated footer as brand moment | Footer (heavy dependency, full reskin needed for Yielde) |
| Liquid text morphing between words | Gooey-Text |
| Horizontal image carousel with nav arrows | Image-Card-Gallery (banned on work page) |
| Spotlight conic-gradient lamp wrapper | Lamp (override cyan to brand accent colour) |
| Floating particle or star field | Sparkles (BANNED — see entry) |
| Auto-scrolling logo marquee for social proof | Trusted-By (only with real client logos) |
| Full-screen Three.js chromatic aberration waves | WebGl-Shader (palette-agnostic, needs shader edit for brand) |
| Two-column copy and overlapping mockup screenshots | Section-With-Mockup |
| Journal or blog article card grid | blog-posts |
| Hero with product screenshot and 3 feature proofs | hero-section-blocks |
| Animated scrolling grid with mouse-reveal radial mask | Infinite-Grid (fix orange/blue tokens + rounded-full blobs) |
| Hover-triggered character scramble on mono uppercase text | Text-Scramble (add --primary amber override to globals.css) |
| Dark pricing with scroll-reveal entrance and animated number transitions | Pricing-Section-4 (source timeline-animation; remove sparkles first) |
| Drag-to-confirm gesture button with spring fill and status icon | Slide-Button (track rounded-full conflicts; add custom shadows) |
| Three-column sticky-centre photo gallery with Lenis smooth scroll | Sticky-Scroll (remove rounded-md on images; fix footer radius) |
| Self-contained nav + hero + trust-bar composite for standalone pages | Hero-Section-9 (U1; prefer composing Menu + hero-section-blocks instead) |
| Rotating radar sweep over concentric rings with service icon nodes | Radar-Effect (remove rounded-2xl on icon boxes; use lucide-react not react-icons) |
| Cinematic Three.js + bloom + GSAP scroll-linked multi-section hero | Horizon-Hero-Section (U3; add critical CSS block; test FPS on mid-range hardware) |
| Spring-animated stacked card deck with bottom-draw shuffle | Animate-Card (remove rounded-t-xl on cards + rounded-full on Read button; replace placeholder content) |
| GSAP-pinned editorial scroll with masked-word reveal and background wipe | Full-Screen-Scroll-FX (U3; replace placeholder backgrounds; use only as primary scroll anchor) |
| 20 FlipCards morphing scatter → line → circle → arc via virtual scroll | Scroll-Morph-Hero (U3; isolate from Lenis; remove rounded-xl; replace placeholder card content) |
| Multi-section editorial scroll with sticky images that scale out and overlay text that parallaxes in/out | Text-Parallax-Scroll (remove rounded-3xl on image; replace bg-white + neutral tokens with semantic; 2–3 sections max on mobile) |
| Configurable SVG dot grid overlay for container texture without canvas cost | Dot-Pattern (U1; override fill-slate-500 via className prop; replace red demo accents + rounded-[40px] with semantic tokens) |
