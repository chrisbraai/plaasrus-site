// Improvement 1: Section uses bg-bg-end (pale sky-teal) — a cool tonal break from the warm harvest palette above; the cooler register signals shift from narrative to action without the weight of a dark background.
// Improvement 2: Accent line below the h2 carries the only ambient animation in the section — it breathes slowly while the copy holds still; keeps Mandate 10 without competing with the conversion text.
// Template: custom spec (U1)

'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { btn } from '@/lib/utils'
import { WHATSAPP_HREF } from '@/lib/contact'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function BookSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const accentLineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        if (contentRef.current) gsap.set(contentRef.current, { opacity: 1, y: 0 })
        return
      }

      // Ambient: accent line breathes slowly — 8 s cycle, --dur-ambient (Mandate 10)
      if (accentLineRef.current) {
        gsap.to(accentLineRef.current, {
          scaleX: 1.8,
          opacity: 0.9,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Scroll-triggered: content block fades up on section enter (Mandate 10)
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="book"
      ref={sectionRef}
      className="bg-bg-end py-[var(--section-pad-y-generous)]"
    >
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-pad)]">

        {/* Section heading */}
        <h2 className="font-display italic text-display-xs leading-none text-fg">
          Book.
        </h2>
        <p className="font-display italic text-lede text-fg-muted mt-2">
          Bespreek.
        </p>

        {/* Ambient accent line */}
        <div
          ref={accentLineRef}
          className="h-px w-12 bg-accent mt-6 mb-16"
          style={{ transformOrigin: 'left center', opacity: 0.5 }}
          aria-hidden="true"
        />

        {/* Conversion copy + CTA */}
        <div ref={contentRef} className="max-w-[52ch]">
          <p className="font-serif text-lede leading-relaxed text-fg mb-6">
            No booking platform. No minimum-night algorithm. No service fee on top of a service fee.
          </p>
          <p className="font-serif text-lede leading-relaxed text-fg mb-4">
            WhatsApp us, tell us your dates, and we'll sort it out like neighbours.
          </p>
          <p className="font-display italic text-body-lg text-fg-muted mb-12">
            Stuur vir ons 'n WhatsApp — ons reël dit soos bure.
          </p>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={btn('ghost')}
          >
            WhatsApp to arrange
          </a>
        </div>
      </div>
    </section>
  )
}
