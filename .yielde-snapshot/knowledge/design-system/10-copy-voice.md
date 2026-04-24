# Copy Voice

*→ CTA rules and claim standards are enforced in Phase 3 Step D (build) and Step E (pre-commit checklist).*

### 11.1 Rules

- Replace every adjective with a number or a proof point.
- Sentence case always.
<!-- YIELDE:START -->
- First person plural: "we build," not "Yielde Web builds."
- Cite exact figures: "3 days" not "a few days." "R700" not "around R700."
<!-- YIELDE:END -->
- Declarative sentences. Full stops. No exclamations.
- One idea per sentence.

### 11.2 Never / Always

| Never | Always |
|---|---|
| Passionate about helping your business grow | We build sites that make your phone ring. |
| Cutting-edge technology | Same tools the best studios use. We're faster. |
| Feel free to reach out! | See the demo. If it's not right, we change it. |
<!-- YIELDE:START -->
| Affordable web solutions | You pay after you've seen it. |
| Let's chat! | Tell us what you need. |
| Innovative approach | We ship day one. You approve day three. |
| Dedicated team | One person. All of it. |
<!-- YIELDE:END -->

### 11.3 CTA rules

Every CTA is a specific action. The user must know exactly what happens next.

<!-- YIELDE:START -->
**Allowed:** "See the demo →" · "Book the 30-minute call" · "Start the brief" · "See pricing" · "Email us directly"

**Banned:** "Get started" · "Click here" · "Learn more" · "Contact us" · "Submit" · "Next step" (except as a literal form-step label)
<!-- YIELDE:END -->

### 11.4 Heading length rules

Length limits apply to the rendered text content of heading elements, not the JSX markup.

| Level | Max words | Enforcement |
|---|---|---|
| H1 | 14 characters (balanced via `text-wrap: balance`) | Existing rule in `00-quality.md` |
| H2 | 8 words | copy-cop agent check |
| H3 | 12 words | copy-cop agent check |
| H4 | 16 words | advisory only |

An H2 that exceeds 8 words is almost always a statement that needs to be split, shortened, or rewritten as a sentence rather than a title. An 8-word H2 maximum forces clarity.

Exception: pull-quotes in Source Serif 4 (see `03-typography.md §4.7`) may be up to 20 words — they are statement fragments, not section headings.

### 11.5 Second-person consistency

Within a single page, the voice must be consistent: either "you/your" (addressing the client's customer) or "we/our" (the studio speaking). Mixing both within the same page context creates a schizophrenic voice.

**Rule:** Pick one mode per page. The home page (`/`) uses "you/your" (the client's customer is the audience). Studio pages (`/about`, `/process`) use "we/our" (the studio is the speaker). Contact uses "you/your".

The copy-cop agent flags any page that contains both "you" and "we" as first-person subjects in the same body-copy context.

### 11.6 Numbers and quantities

- Always use numerals for quantities: "3 days" not "three days", "R700" not "seven hundred rand"
- Numbers at the start of a sentence are the exception: "Three clients approved in week one" (avoid starting sentences with numbers where possible)
- Percentages: always numeral + symbol: "40% faster" not "forty percent faster"
- Ranges: "2–4 days" with an en dash (–), not a hyphen (-) or the word "to"
- Money: always include currency if there is any ambiguity: "R700" not "700"
