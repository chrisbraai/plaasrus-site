// Improvement 1: Footer runs on bg-bg-end (pale sky-teal) with zero-radius link rows — cooler register closes the warm harvest palette; matches the brief's restrained visual tone and the design system no-border-radius rule.
// Improvement 2: Ticker marquee repurposed as a bilingual ambient strip ("Plaasrus · Rus op die plaas ·") using globals.css --animate-ticker — brand-specific bilingual copy replaces the template's generic text loop and becomes the ambient visual moment at page end.
// Template: Footer (U2)

'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { WHATSAPP_HREF, INSTAGRAM_HANDLE, INSTAGRAM_HREF } from '@/lib/contact'
import { btn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Marquee content — duplicated for seamless loop (translateX(-50%) keyframe)
const TICKER_TEXT = 'Plaasrus · Rus op die plaas · '

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const legalRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        gsap.set([wordmarkRef.current, linksRef.current, legalRef.current], {
          opacity: 1,
          y: 0,
        })
        return
      }

      // Scroll-triggered: entrance stagger (Mandate 10)
      const els = [wordmarkRef.current, linksRef.current, legalRef.current].filter(Boolean)
      gsap.fromTo(
        els,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    },
    { scope: footerRef }
  )

  return (
    <footer ref={footerRef} className="bg-bg-end" aria-label="Site footer">

      {/* Bilingual ticker strip — ambient animation (Mandate 10) */}
      <div
        className="overflow-hidden border-b border-rule py-4"
        aria-hidden="true"
      >
        <div className="flex whitespace-nowrap animate-ticker motion-reduce:animate-none">
          <span className="font-display italic text-body-lg text-fg-muted px-8">
            {TICKER_TEXT}
          </span>
          <span className="font-display italic text-body-lg text-fg-muted px-8" aria-hidden="true">
            {TICKER_TEXT}
          </span>
          <span className="font-display italic text-body-lg text-fg-muted px-8" aria-hidden="true">
            {TICKER_TEXT}
          </span>
          <span className="font-display italic text-body-lg text-fg-muted px-8" aria-hidden="true">
            {TICKER_TEXT}
          </span>
        </div>
      </div>

      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-pad)] pt-[var(--section-pad-y)] pb-16">

        {/* Large wordmark — brand closing moment */}
        <div ref={wordmarkRef} className="mb-16">
          <h2 className="font-display italic text-display-l leading-none text-fg">
            Plaasrus.
          </h2>
          <p className="font-display italic text-lede text-fg-muted mt-2">
            Rus op die plaas.
          </p>
        </div>

        {/* Links + legal */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">

          {/* WhatsApp + Instagram — zero-radius rows */}
          <div ref={linksRef} className="flex flex-col gap-3">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={btn('ghost')}
            >
              WhatsApp to arrange
            </a>
            <a
              href={INSTAGRAM_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="text-overline tracking-micro uppercase text-fg-muted hover:text-fg transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
              aria-label={`Plaasrus on Instagram — ${INSTAGRAM_HANDLE}`}
            >
              {INSTAGRAM_HANDLE} on Instagram
            </a>
          </div>

          {/* Legal */}
          <div ref={legalRef} className="text-overline tracking-micro uppercase text-fg-muted">
            <p>© 2026 Braambos Farm (Pty) Ltd.</p>
            <p className="mt-1">No platform. No algorithm.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
