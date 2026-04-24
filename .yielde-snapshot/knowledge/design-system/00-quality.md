# Quality Standards

*→ Enforced during Phase 3 Step D (build) and Step E (pre-commit checklist).*

Positive requirements. Every project, no exceptions.

### Typography

- Design the typographic system before touching colour or layout. A page that works in black and white will work better with colour — a page that doesn't will still not work with colour added.
- Every page has **one typographic dominant** — one heading at one size and weight that outranks everything else. Two headlines competing for the same visual tier cancel each other out.
- **Line length.** Body copy: 55–75 characters per line. Never let a text block span the full viewport width at desktop. A 1440px-wide paragraph is always wrong.
- **Tracking.** Uppercase labels: 0.12–0.18em. Body: 0em. Large display: tight negative. Tracking is a deliberate tool — do not apply it at random to make things "look designed."
- **Scale contrast.** The gap between your largest and smallest text communicates confidence. A flat scale (everything 14–18px) reads as timid. Extremes are preferred.

### Hierarchy

- Every viewport has **one primary focal point**. When two elements compete equally for attention, neither wins and the user stalls.
- Size, weight, colour, and space are all hierarchy tools. When one isn't enough, add a second — but never all four at once. Overuse flattens hierarchy instead of intensifying it.
- Restraint creates contrast. The element that dominates does so because everything around it steps back. Design the surroundings, not just the hero element.

### Colour

- Every colour in the active palette earns its place by doing a job: surface, accent, semantic stop, emphasis. Decorative colour is colour without a job.
- **Default restraint:** one dominant surface, one supporting accent, one reserve for semantic states (error, success). A fourth colour requires a written reason before it ships.
- Colour communicates before copy does. A user reads colour hierarchy before reading a single word. Design accordingly — don't let colour be an afterthought applied at the end.

### Space

- Whitespace is not the absence of design. It is a decision. Know why you chose the padding you chose. "It looks cleaner" is a starting point, not a reason.
- Use a spacing scale and stay on it. Deviating from the scale requires a reason. Arbitrary values compound into visual inconsistency.
- **Tight vs. loose.** Tight spacing reads editorial and confident. Open spacing reads approachable and light. Know which one serves this client — and commit to it across the whole project.

### Motion

- Every animation must answer: *what does this communicate?* "It looks good" is not an answer. If you cannot answer, remove the animation.
- Reserve entrance animation for elements that earn it. `opacity + translateY` staggered across every card on every scroll is visual noise — it communicates nothing because it applies to everything.
- **Performance is quality.** An animation that causes layout shift, paint jank, or drops frames on mid-range mobile is a bad animation, regardless of how it renders on a fast machine at 60fps.
- All motion ships with a `prefers-reduced-motion: reduce` fallback. Motion is enhancement — never load-bearing for comprehension.

### Specificity

- Every project should have at least one detail that could only exist for this client. Not a colour swap — something in the layout treatment, the typographic composition, the way an interaction works, or the spatial rhythm of a section.
- A finished site should not be liftable and droppable onto a competitor's content unchanged. That is the failure condition.
- Generic design that is well-executed is fine. **Interchangeable design is not.**

### Copy

- Replace every adjective with a number or a proof point. "Fast" → "3 days." "Affordable" → "You pay after you've seen it."
- Never design to lorem ipsum past wireframe stage. Copy length, rhythm, and sentence structure change the design. Get real copy early.
- Every CTA is a specific action. The user must know exactly what happens when they press it. "Get started" fails this test. "See the demo →" passes it.
