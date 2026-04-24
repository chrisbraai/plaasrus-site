// Improvement 1: priority-gated — the first HeroPhoto per page passes `priority` to next/image
// to eagerly preload the LCP candidate; subsequent proof photos lazy-load. One prop choice
// enforces the correct LCP discipline at the call site instead of leaving it to each author.
// Improvement 2: aspect-ratio props limited to the three design-system-permitted ratios
// (16:9, 3:2, 1:1) — the type system rejects any other crop at compile time, preventing
// drift from 12-image-direction.md §Aspect ratios.
// Template: none — spec build (enforces Mandate 2 full-bleed photo pattern).

import Image from 'next/image';
import { cn } from '@/lib/utils';

export type HeroPhotoRatio = '16/9' | '3/2' | '1/1';

const RATIO_CLASS: Record<HeroPhotoRatio, string> = {
  '16/9': 'aspect-video',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
};

interface HeroPhotoProps {
  src: string;
  /** Alt text must describe the proof this image supports, not the visual contents.
   *  See knowledge/design-system/12-image-direction.md §Alt text. */
  alt: string;
  /** Aspect ratio token — only the three permitted ratios are accepted. */
  ratio?: HeroPhotoRatio;
  /** Set `priority` on the first full-bleed photo per page (LCP candidate). */
  priority?: boolean;
  /** Optional overlay — accepts semantic token name (e.g. 'var(--bg)') and opacity 0–1. */
  overlay?: { color?: string; opacity?: number };
  /** Optional children rendered on top of the photo (headline, overline, etc.). */
  children?: React.ReactNode;
  className?: string;
}

export function HeroPhoto({
  src,
  alt,
  ratio = '16/9',
  priority = false,
  overlay,
  children,
  className,
}: HeroPhotoProps) {
  const overlayOpacity = overlay?.opacity ?? 0;
  const overlayColor = overlay?.color ?? 'var(--bg)';

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        RATIO_CLASS[ratio],
        // Mandate 2 specifies clamp(400px, 55vw, 720px) for a typical 16:9 hero; for 1:1 and 3:2
        // the aspect ratio controls height. The minimum height prevents an aspect-ratio hero
        // from collapsing when placed inside a flex parent with insufficient width.
        ratio === '16/9' && 'min-h-[clamp(400px,55vw,720px)]',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        // `sizes` is required when `fill` is true — conservative guess for a full-bleed hero.
        // Override at the call site if the parent constrains width.
        sizes="100vw"
        className="object-cover"
      />
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        />
      )}
      {children && (
        <div className="relative z-10 flex h-full items-center justify-center px-[var(--container-pad)]">
          {children}
        </div>
      )}
    </section>
  );
}
