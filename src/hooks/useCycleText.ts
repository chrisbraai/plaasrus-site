'use client';

import { useEffect, useState } from 'react';

/**
 * Cycles through an array of strings at a fixed interval with an instant swap
 * (no transition — matches the "1-frame inversion" spec).
 * Serves effect: #06 (about bragging slab — 3 claims cycle every 2s).
 *
 * @param items    — strings to cycle through
 * @param interval — ms between swaps (spec: 2000)
 */
export interface CycleTextResult {
  item: string;
  index: number;
}

export function useCycleText(items: string[], interval: number): CycleTextResult {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Guard: reset to first item and skip timer if nothing to cycle.
    // Always returns a cleanup to prevent interval leak when transitioning
    // from items.length > 1 to items.length <= 1.
    if (items.length <= 1) {
      setIndex(0);
      return;
    }

    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(id);
  }, [items.length, interval]);

  return { item: items[index] ?? '', index };
}
