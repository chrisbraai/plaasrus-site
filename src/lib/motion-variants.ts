// Improvement 1: slabDraw sets transformOrigin: 'left' inside the variant — consumers never carry this implicit dependency; the variant is self-contained
// Improvement 2: overlineFlash references t.pulse rather than a raw duration — consistent with the no-raw-numbers rule, colour-oscillation timing changes in one place

import { t, snap1, snap2, staggerTokens } from './motion-tokens'
import type { Variants } from 'motion/react'

// Cut-in: opacity only, no translate. Used for stat cells, letter entrances.
export const cutIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: t.fast },
}

// Reveal: opacity + slight Y lift. Used for section intros, card groups.
export const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: t.reveal },
}

// Staggered container — wraps cutIn or reveal children
export const staggerContainer = (stagger = staggerTokens.cascade): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
})

// Slab draw: scaleX from left edge. Used for the copper slab effect (#03).
// transformOrigin: 'left' is set in the variant so consumers don't need to know.
export const slabDraw: Variants = {
  hidden: { scaleX: 0, transformOrigin: 'left' },
  visible: { scaleX: 1, transformOrigin: 'left', transition: { ...t.reveal, delay: 0.2 } },
}

// Scale punch: 0.92 → 1.0 over 2 steps. Used for H1 emphasis word (#01).
export const scalePunch: Variants = {
  hidden: { scale: 0.92 },
  visible: { scale: 1, transition: snap2 },
}

// Letter entrance: snap opacity. Used for footer wordmark (#11).
export const letterSnap: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: snap1 },
}

// Overline flash: accent colour pulse then return. Used for section digits (#16).
export const overlineFlash = (accentColor: string, quietColor: string): Variants => ({
  hidden: { color: quietColor },
  visible: {
    color: [quietColor, accentColor, quietColor],
    transition: { ...t.pulse, times: [0, 0.5, 1] as number[] },
  },
})
