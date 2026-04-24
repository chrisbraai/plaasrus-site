// Improvement 1: All transitions typed as named constants — components import tokens, making global timing a one-file edit with zero grep-and-replace
// Improvement 2: snap2 uses explicit number[] cast rather than as const — satisfies FM's mutable times[] requirement without losing type safety on other fields

// Maps CSS motion tokens (globals.css) to Framer Motion transition objects.
// Rule: no bounce, no elastic, no overshoot. Speed is the brand.

export const ease = [0.2, 0, 0, 1] as const
export const easeEnter = [0.1, 0.6, 0.2, 1] as const

// Tween transitions — direct CSS token mappings
export const t = {
  instant: { type: 'tween', duration: 0.08, ease } as const,
  fast:    { type: 'tween', duration: 0.12, ease } as const,
  base:    { type: 'tween', duration: 0.20, ease } as const,
  slow:    { type: 'tween', duration: 0.40, ease } as const,
  reveal:  { type: 'tween', duration: 0.60, ease: easeEnter } as const,
  ambient: { type: 'tween', duration: 8,    ease: 'linear' } as const,
  // pulse: same duration as slow but easeInOut — used for colour oscillation variants
  pulse:   { type: 'tween', duration: 0.40, ease: 'easeInOut' } as const,
}

// Snap transitions — replicate CSS steps() for 1-frame and 2-frame effects
// steps(1): zero-duration state change
export const snap1 = { type: 'tween', duration: 0, ease: 'linear' } as const
// steps(2): 2-frame punch (80ms over 2 discrete steps)
// times must stay mutable (number[]) to satisfy FM's Transition type — can't use `as const` on the whole object
export const snap2 = { type: 'tween' as const, duration: 0.08, times: [0, 0.5, 1] as number[], ease: 'linear' as const }

// Spring — used only for cursor ring follower and drag inertia
// Deliberately over-damped so there is NO bounce
export const spring = {
  cursor: { type: 'spring', stiffness: 400, damping: 40, mass: 0.8, restDelta: 0.001 } as const,
  layout: { type: 'spring', stiffness: 300, damping: 35, mass: 1, restDelta: 0.001 } as const,
}

// Stagger values — match globals.css stagger token library
export const staggerTokens = {
  cascade: 0.06,  // --stagger-cascade: 60ms
  reveal:  0.08,  // --stagger-reveal: 80ms
  snap:    0.04,  // --stagger-snap: 40ms
  drift:   0.12,  // --stagger-drift: 120ms
}

// Lenis scroll duration — governs smooth-scroll feel (0.6–1.2s is the premium range)
// Defined here so all motion timing lives in one place, even for non-FM libraries.
export const lenisDuration = 1.1
