'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to target over duration ms using requestAnimationFrame.
 * Serves effects: #02 (hero 4-stat grid), #15 (stat count-ups).
 *
 * @param target   — final displayed value
 * @param duration — animation length in ms (use 600 for #15, matching --dur-reveal)
 * @param trigger  — begin counting when true; resets to 0 when false
 */
export function useCountUp(target: number, duration: number, trigger: boolean): number {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (!trigger) {
      setValue(0);
      return;
    }

    startRef.current = null;

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, trigger]);

  return value;
}
