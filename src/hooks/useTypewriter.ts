'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveals a string character-by-character at a fixed speed.
 * Serves effect: #10 (contact success state — typewriter reveal, 40ms/char).
 *
 * @param text    — full string to reveal
 * @param speed   — ms per character (spec: 40)
 * @param trigger — begin reveal when true; resets to '' when false
 */
export function useTypewriter(text: string, speed: number, trigger: boolean): string {
  const [revealed, setRevealed] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!trigger) {
      setRevealed('');
      return;
    }

    let index = 0;
    setRevealed('');

    // Capture the ID locally so the self-cancel path inside the callback
    // never dereferences intervalRef.current after cleanup may have nulled it.
    const id = setInterval(() => {
      index++;
      setRevealed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(id);
        intervalRef.current = null;
      }
    }, speed);
    intervalRef.current = id;

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed, trigger]);

  return revealed;
}
