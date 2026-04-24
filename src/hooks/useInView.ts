'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver wrapper. Returns a [ref, inView] tuple.
 * Serves effects: #03 (hero slab IO trigger), #05, #06, #11, #15, #16.
 *
 * @param options.threshold  — 0–1 visibility fraction required. Default: 0.
 * @param options.rootMargin — margin around the root. Default: '0px'.
 * @param options.once       — disconnect after first intersection. Default: false.
 */
export interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
  /** Disconnect after first intersection so the animation fires once only. */
  once?: boolean;
}

export function useInView<T extends Element = HTMLElement>(
  options: InViewOptions = {},
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0, rootMargin = '0px', once = false } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- observer is constructed inside the effect; it is not a dep
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
