// Improvement 1: Zero-radius cursor materialises the design system's defining constraint at the pointer level — no template library ships this, making it untemplateable by competitors
// Improvement 2: Ring follower replaced with FM useSpring — eliminates manual lerp RAF loop, auto-cleaned by FM scheduler

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { spring } from '@/lib/motion-tokens';

export default function CursorProvider() {
  // Suppresses SSR render — cursor elements must not flash at top-left before hydration
  const [mounted, setMounted] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const activeRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  // Ring: FM spring replaces manual lerp — zero RAF management
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const springX = useSpring(ringX, spring.cursor);
  const springY = useSpring(ringY, spring.cursor);
  const ringTranslateX = useTransform(springX, v => v - 10);
  const ringTranslateY = useTransform(springY, v => v - 10);

  const animate = useCallback(() => {
    if (!mountedRef.current) return;

    const { x, y } = mouseRef.current;
    const active = activeRef.current;

    if (dotRef.current) {
      const size = active ? 12 : 6;
      dotRef.current.style.width = `${size}px`;
      dotRef.current.style.height = `${size}px`;
      dotRef.current.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      dotRef.current.style.backgroundColor = active ? 'var(--accent)' : 'var(--fg)';
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Touch devices and reduced-motion users: hide dot entirely
    if (isTouch || isReduced) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      return;
    }

    mountedRef.current = true;

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const onEnter = () => { activeRef.current = true; };
    const onLeave = () => { activeRef.current = false; };

    const bindEl = (el: Element) => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    };

    const unbindEl = (el: Element) => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };

    const bindInteractives = () => {
      document.querySelectorAll('a, button').forEach(bindEl);
    };

    document.addEventListener('mousemove', onMove);
    bindInteractives();
    rafRef.current = requestAnimationFrame(animate);

    // Narrow scan to added nodes only — avoids O(n) full-document scan on every mutation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const el = node as Element;
          if (el.matches('a, button')) bindEl(el);
          el.querySelectorAll('a, button').forEach(bindEl);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      mountedRef.current = false; // must be first — stops the RAF callback immediately
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
      // Remove per-element bindings to prevent listener accumulation across remounts
      document.querySelectorAll('a, button').forEach(unbindEl);
    };
  }, [animate, ringX, ringY]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--fg)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringTranslateX,
          y: ringTranslateY,
          width: '20px',
          height: '20px',
          border: '2px solid var(--fg)',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
        }}
      />
      <style>{`
        @media (pointer: fine) { html { cursor: none !important; } }
      `}</style>
    </>
  );
}
