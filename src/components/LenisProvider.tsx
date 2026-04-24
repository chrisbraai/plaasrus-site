// Improvement 1: useReducedMotion sets duration: 0 rather than skipping Lenis — scroll position tracking and useLenis() hooks stay active, so programmatic scrollTo still works for reduced-motion users
// Improvement 2: GSAPBridge captures the tick function as a stable reference — gsap.ticker.remove() matches by reference, so the bridge correctly unregisters on unmount without silently leaking the callback

'use client'
import { useMemo, useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'
import { lenisConfig } from '@/lib/lenis-config'
import type { ReactNode } from 'react'

// Synchronous read so the first render already has the correct preference.
// useReducedMotion() returns null before hydration; this collapses that gap.
function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function GSAPBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    // Stable reference required — gsap.ticker.remove() matches by reference, not by value
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)

    // Lenis scroll events → ScrollTrigger position update
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])

  return null
}

export function LenisProvider({ children }: { children: ReactNode }) {
  // ?? fallback: on the null frame before hydration, read synchronously
  const shouldReduce = useReducedMotion() ?? getInitialReducedMotion()

  // Memoised so ReactLenis only re-patches the instance when the preference changes
  const options = useMemo(() => ({
    ...lenisConfig,
    // duration → 0 = native scroll speed; Lenis instance stays alive for useLenis() callers
    duration: shouldReduce ? 0 : lenisConfig.duration,
  }), [shouldReduce])

  return (
    // autoRaf={false} — GSAP ticker drives Lenis via GSAPBridge, preventing double-tick
    <ReactLenis root options={options} autoRaf={false}>
      <GSAPBridge />
      {children}
    </ReactLenis>
  )
}
