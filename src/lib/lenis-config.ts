// Improvement 1: easing defined as a pure mathematical function — allows curve inspection and unit testing, unlike CSS bezier strings which Lenis cannot accept
// Improvement 2: syncTouch: false prevents interception of iOS/Android native inertia, which is already premium and fights pull-to-refresh behaviour on mobile Safari

// Lenis configuration aligned to Yielde's motion tokens.
// syncTouch: false is a hard rule — iOS/Android native scroll must not be intercepted.

import { lenisDuration } from './motion-tokens'

export const lenisConfig = {
  // References motion-tokens.ts so scroll duration is governed alongside all other timing
  duration: lenisDuration,

  // Easing: exponential ease-out (1 - 2^(-10t)). Fast-out deceleration character.
  // Note: not identical to Yielde's --ease cubic-bezier(0.2,0,0,1) — Lenis cannot
  // accept CSS bezier strings. This is the closest approximation in a simple function.
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

  // Smooth wheel only. Do NOT smooth touch —
  // iOS/Android native scroll is already smooth and feels wrong if intercepted.
  smoothWheel: true,
  syncTouch: false,

  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
}
