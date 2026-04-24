'use client';

import { useEffect, useState } from 'react';
import { useInView } from './useInView';

/**
 * Fires a one-shot flash-copper animation when an element first enters the viewport.
 * Returns [ref, hasFlashed]. Apply `animate-flash-copper` class when hasFlashed is true.
 * Serves effect: #16 (overline way-markers — leading digit flashes copper on section enter).
 *
 * Usage:
 *   const [ref, hasFlashed] = useOverlineFlash<HTMLSpanElement>();
 *   <span ref={ref} className={hasFlashed ? 'animate-flash-copper' : ''}>01</span>
 */
export function useOverlineFlash<T extends Element = HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
] {
  const [ref, inView] = useInView<T>({ threshold: 0.5, once: true });
  const [hasFlashed, setHasFlashed] = useState(false);

  // once:true on useInView means inView only ever becomes true once,
  // so hasFlashed is a one-way latch. No need to guard against re-fire.
  useEffect(() => {
    if (inView) setHasFlashed(true);
  }, [inView]);

  return [ref, hasFlashed];
}
