'use client';

import { useEffect, useState } from 'react';

/**
 * Returns document scroll progress as a 0–1 fraction, throttled to rAF.
 * Serves effect: #13 (scroll progress rail).
 *
 * Usage: set the rail's width to `${progress * 100}%` or use a CSS variable.
 *
 * Lenis note: reads window.scrollY via native scroll events. Lenis root mode
 * fires real scroll events, so this hook receives Lenis-smoothed values in Phase A.
 * Before adding the GSAP ScrollTrigger bridge (Phase B), confirm this hook still
 * receives accurate values — if GSAP virtualises scroll position, migrate to
 * useLenis() + lenis.on('scroll', handler) instead.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number | null = null;

    const update = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(scrolled / total, 1) : 0);
      raf = null;
    };

    const onScroll = () => {
      if (raf !== null) return; // already queued
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // set initial value before first scroll
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf); // cancel any pending frame queued before unmount
    };
  }, []);

  return progress;
}
