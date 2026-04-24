// Improvement 1: Right-column photo is position:sticky — it holds in frame as the prose scrolls past rather than reacting to scroll; distinct from parallax-heavy farm editorial patterns elsewhere in the portfolio.
// Improvement 2: Section background shifts from linen (--bg-subtle) to stoep-wash (--bg) via a CSS gradient at the 65% mark — a tonal signal mid-section that moves from the house's register to the land's register.
// Template: custom spec (U2)

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PROSE: string[] = [
  "You won't be alone here. Donkeys work the lower paddock. Goats browse the scrub margin. Pigs rotate through the pasture on a schedule the land sets. The hens will find you before the coffee does.",
  "This is not a farm-themed guesthouse. It is a farm with a guesthouse on it. The difference is audible at 5am.",
  "Braambos runs on regenerative principles: no synthetic inputs, rotational grazing, water harvesting from the mountain stream. The animals are not set dressing — they are the labour force.",
  "Guests are welcome to walk the paddocks, watch the morning feed, or do none of that. The farm carries on either way.",
]

export function TheFarm() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        paraRefs.current.forEach(el => el && gsap.set(el, { opacity: 1, y: 0 }))
        return
      }

      // Ambient: slow scale breathe on the sticky photo — image lives, does not react to scroll (Mandate 10)
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          scale: 1.03,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Scroll-triggered: each paragraph fades up independently (Mandate 10)
      paraRefs.current.forEach(el => {
        if (!el) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="the-farm"
      ref={sectionRef}
      style={{ background: 'linear-gradient(to bottom, var(--bg-subtle) 0%, var(--bg) 55%, var(--bg-end) 100%)' }}
    >
      <div className="max-w-[var(--container-max)] mx-auto grid md:grid-cols-2">

        {/* Prose column */}
        <div className="px-[var(--container-pad)] pt-[var(--section-pad-y)] pb-[var(--section-pad-y)]">
          <h2 className="font-display italic text-display-xs leading-none text-fg mb-2">
            The Farm.
          </h2>
          <p className="font-display italic text-lede text-fg-muted mb-16">
            Die Plaas.
          </p>

          <div className="flex flex-col gap-8 max-w-[65ch]">
            {PROSE.map((text, i) => (
              <p
                key={i}
                ref={el => { paraRefs.current[i] = el }}
                className="font-serif text-lede leading-serif text-fg"
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Photo column — sticky on desktop, stacked below on mobile */}
        <div className="hidden md:block relative">
          <div
            className="sticky overflow-hidden"
            style={{ top: 'var(--header-h)', height: 'calc(100vh - var(--header-h))' }}
          >
            <div
              ref={imgRef}
              className="absolute inset-0 will-change-transform"
              style={{ transformOrigin: 'center center' }}
            >
              <Image
                src="/images/farm-paddock.jpg"
                alt="Four donkeys resting under a tree with the Outeniqua Mountains behind at Braambos farm"
                fill
                sizes="50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Mobile-only photo — below prose, full-bleed to viewport edge */}
        <div className="md:hidden relative h-[55vw] overflow-hidden mb-[var(--section-pad-y-compressed)]">
          <Image
            src="/images/farm-paddock.jpg"
            alt="Four donkeys resting under a tree with the Outeniqua Mountains behind at Braambos farm"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}
