'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Returns the index of the currently active section as the user scrolls.
 * Active = the section whose top edge is closest to (and not past) the
 * vertical midpoint of the viewport.
 * Serves effect: #05 (process phase spotlight — active phase lights copper).
 *
 * @param sectionRefs — array of element refs, one per section. Must be stable
 *   across renders — create with useMemo([]) or at module level.
 *
 * Lenis note: reads window.scrollY via native scroll events. Lenis root mode
 * fires real scroll events, so this hook receives Lenis-smoothed values in Phase A.
 * Before adding the GSAP ScrollTrigger bridge (Phase B), confirm this hook still
 * receives accurate values — if GSAP virtualises scroll position, migrate to
 * useLenis() + lenis.on('scroll', handler) instead.
 */
export function useScrollActive(
  sectionRefs: Array<React.RefObject<Element | null>>,
): number {
  const [activeIndex, setActiveIndex] = useState(0);

  // Keep a mutable ref to the latest array so the scroll handler never
  // captures a stale closure, without needing to re-register the listener.
  const refsRef = useRef(sectionRefs);
  useEffect(() => {
    refsRef.current = sectionRefs;
  });

  useEffect(() => {
    let raf: number | null = null;

    const compute = () => {
      raf = null;
      const midpoint = window.scrollY + window.innerHeight / 2;
      let next = 0;
      for (let i = 0; i < refsRef.current.length; i++) {
        const el = refsRef.current[i]?.current;
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (midpoint >= top) next = i;
      }
      setActiveIndex(next);
    };

    // Throttle getBoundingClientRect calls to one per animation frame,
    // matching the pattern used in useScrollProgress.
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    compute(); // compute initial active section without waiting for scroll
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf); // cancel any pending frame
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uses refsRef pattern; empty deps is intentional
  }, []);

  return activeIndex;
}
