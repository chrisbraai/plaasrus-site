// Improvement 1: Each panel fills 70vh with copy anchored at the lower quarter — text reads from within the scene rather than alongside it; this is structurally distinct from the Braambos Alternating-Editorial side-by-side column layout.
// Improvement 2: The single counted stat (6 guests) replaces the amenities-list format — one datum, counted from 0 on scroll-enter, resists resort-style inventory framing per brief §8.
// Template: custom spec (U2)

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Panel = {
  id: string
  image: string
  imgAlt: string
  heading: string
  body: string
  stat?: { value: number; label: string }
}

const PANELS: Panel[] = [
  {
    id: 'bedrooms',
    image: '/images/house-bedrooms.jpg',
    imgAlt: 'Cattle herd moving through a gate with Outeniqua Mountains behind — the view from the farmhouse windows',
    heading: 'Three Bedrooms',
    body: 'A king, a queen, two singles. Each window faces out — mountain one side, paddock the other. The house sleeps six without putting anyone in a fold-out.',
    stat: { value: 6, label: 'guests' },
  },
  {
    id: 'braai',
    image: '/images/house-braai.jpg',
    imgAlt: 'Brick braai area with mountain views and dam at Braambos farm',
    heading: 'The Braai',
    body: 'A kameeldoring braai in the yard. The wood comes from the farm. Use it until the fire dies — nobody asks you to check out by ten.',
  },
  {
    id: 'kitchen',
    image: '/images/house-kitchen.jpg',
    imgAlt: 'Modern farm kitchen with dark marble island at Braambos farmhouse',
    heading: 'The Kitchen',
    body: 'Full kitchen, stocked with the basics at arrival. No breakfast service. No daily housekeeping. Cook on your own schedule.',
  },
]

export function TheHouse() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([])
  const textBlockRefs = useRef<(HTMLDivElement | null)[]>([])
  const statRefs = useRef<(HTMLSpanElement | null)[]>([])

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        textBlockRefs.current.forEach(el => el && gsap.set(el, { opacity: 1, y: 0 }))
        statRefs.current.forEach((el, i) => {
          if (el && PANELS[i]?.stat) el.textContent = String(PANELS[i].stat!.value)
        })
        return
      }

      // Ambient: each overlay breathes slowly with staggered phase offset (Mandate 10)
      overlayRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, {
          opacity: 0.22,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 2.6,
        })
      })

      // Scroll-triggered: text block slides up on panel enter (Mandate 10)
      textBlockRefs.current.forEach(el => {
        if (!el) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // Mandate 13: stat counts up from 0 on scroll-enter (integer-safe via Math.round)
      statRefs.current.forEach((el, i) => {
        if (!el || !PANELS[i]?.stat) return
        const { value } = PANELS[i].stat!
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const obj = { val: 0 }
            gsap.to(obj, {
              val: value,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                if (el) el.textContent = String(Math.round(obj.val))
              },
            })
          },
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="the-house"
      ref={sectionRef}
      className="bg-bg pb-[var(--section-pad-y)]"
    >
      {/* Section header — sky-teal strip; first echo of the cool palette thread */}
      <div className="bg-bg-end">
        <div className="pt-[var(--section-pad-y)] px-[var(--container-pad)] max-w-[var(--container-max)] mx-auto pb-16">
          <h2 className="font-display italic text-display-xs leading-none text-fg">
            The House.
          </h2>
          <p className="font-display italic text-lede text-fg-muted mt-2">
            Die Huis.
          </p>
        </div>
      </div>

      {/* Feature panels — 70vh each, text anchored at lower quarter */}
      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          className="relative overflow-hidden"
          style={{ height: '70vh' }}
        >
          {/* Full-bleed background image — all panels below fold, no priority */}
          <Image
            src={panel.image}
            alt={panel.imgAlt}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Neutral scrim — ambient breathing; black not brown so image colours stay true */}
          <div
            ref={el => { overlayRefs.current[i] = el }}
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.32 }}
            aria-hidden="true"
          />

          {/* Text block — lower quarter */}
          <div
            ref={el => { textBlockRefs.current[i] = el }}
            className="absolute bottom-0 left-0 right-0 pb-10 md:pb-16 px-[var(--container-pad)]"
          >
            <div className="max-w-[var(--container-max)] mx-auto flex items-end justify-between gap-8">

              {/* Copy block */}
              <div>
                <h3 className="font-display italic text-display-2xs leading-none text-fg-inverse mb-3">
                  {panel.heading}
                </h3>
                <p className="font-serif text-body-lg leading-relaxed text-fg-inverse-muted max-w-[52ch]">
                  {panel.body}
                </p>
              </div>

              {/* Stat — bedrooms panel only */}
              {panel.stat && (
                <div className="hidden md:flex flex-col items-end flex-shrink-0">
                  <span
                    ref={el => { statRefs.current[i] = el }}
                    className="font-display italic text-display-m leading-none text-fg-inverse"
                    aria-label={`${panel.stat.value} ${panel.stat.label}`}
                  >
                    0
                  </span>
                  <span className="text-overline tracking-micro uppercase text-fg-inverse-muted mt-1">
                    {panel.stat.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
