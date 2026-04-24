# Image Art Direction

*→ Read before placing any image in a Yielde project. These rules apply to all images: hero, card thumbnails, work previews, journal covers.*

> **Photo section quota (Mandate 2):** Every page ships with ≥2 full-bleed photo sections. A hero with a background image counts as one. A mid-page proof shot counts as one. See `13-animation-mandates.md §Mandate 2` for implementation spec.

---

## The proof photography rule

Every image on a Yielde site must demonstrate a specific claim made in the nearby copy. If the H1 says "in 3 days", the image shows a deliverable — a completed design, a shipped product, a real result. If the services section says "we build sites that make your phone ring", the image shows a screen with a live site, not a person at a laptop.

Images that do not prove anything are decorative. Yielde sites do not use decorative images.

Ask before placing any image: **what claim does this image support?** If the answer is "it looks nice" or "it sets the mood", find a better image or remove the image.

---

## Aspect ratios

Only three permitted ratios:

| Ratio | Token class | Use |
|---|---|---|
| 16:9 | `aspect-video` | Hero backgrounds, video previews, work thumbnails |
| 1:1 | `aspect-square` | Profile/team images, product icons, tight card images |
| 3:2 | `aspect-[3/2]` | Service page images, blog covers, feature section images |

Never use 4:3 (too snapshot-like), never use free-form crop. Consistent ratios create visual system across a page.

**Implementation:**

```tsx
<div className="relative aspect-video overflow-hidden">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>
```

---

## Colour treatment

Images on Yielde sites should be slightly desaturated (target ≤ 85% saturation) and colour-toned toward the client's primary palette ramp. A fern-palette project uses images with green undertones. A hay/copper palette uses images with warm amber undertones.

**This is done in image editing before export — not via CSS filters.** CSS `filter: saturate()` over images produces muddy colour. Properly prepared images will hold contrast at the image level; CSS filters compound rendering and introduce colour artefacts.

**Target output specs per export:**
- Format: WebP primary, AVIF where supported (let Next.js `<Image>` handle format selection)
- Compression: 80–85 quality
- Maximum dimensions: 2x the rendered max-width at the largest breakpoint (e.g. if image renders at max 640px, export at 1280px)
- Colour profile: sRGB

---

## Subject direction

**No front-facing stock portraits.** Human subjects should be photographed in context: working, using the product, in the physical environment of the service. Front-facing smiling portraits communicate nothing and signal stock photography.

**Environment over subject.** Frame to emphasise the space, the work, the context. Negative space on the side toward which the subject is looking creates compositional tension.

**Technical subjects (screens, interfaces):** photograph at a slight angle (not dead-on) to show depth. Use the device as the proof, not decoration — the screen content must be legible and relevant.

---

## Alt text

Every image has a descriptive `alt` attribute that describes the proof the image is providing, not the visual contents.

**Wrong:** `alt="Person at a desk with a laptop"`
**Right:** `alt="Garden Route Lodge site live on screen — built and shipped in 3 days"`

Decorative images (background textures, non-informational patterns) use `alt=""` and `aria-hidden="true"`.

---

## What Yielde sites never use

- Generic workspace photography (laptop, coffee, notebook combinations)
- Stock photos of shaking hands, pointing at whiteboards, or diverse teams at meetings
- Heavily filtered "moody" photography with unrelated palette tones
- Images with logos or product shots from unrelated brands unless explicitly approved
- Blurred/unfocused backgrounds as a style choice — if the background needs to be blurred, crop tighter
