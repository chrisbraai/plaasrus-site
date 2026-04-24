// Improvement 1: Directions are written as prose landmarks rather than a coordinates list — "15 minutes from George CBD via the Outeniqua Pass turnoff" is usable copy; a lat/lng address is not; the text remains functional without the map embed.
// Improvement 2: Google Maps embed is deferred via an intersection observer click-to-load pattern — the iframe only loads when the user explicitly interacts with the map placeholder; reduces Cold LCP impact from a 3rd-party embed on a page that has no other Google dependencies.
// Template: custom spec (U1)

'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Google Maps embed — Braambos Farm area, George Western Cape
// TODO: confirm exact map centre pin with client before launch
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3300!2d22.44!3d-33.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU3JzM2LjAiUyAyMsKwMjYnMjQuMCJF!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza'

const DIRECTIONS = [
  'From George CBD, take the N12 east towards Uniondale.',
  'After 12 km, turn left at the Braambos Farm sign.',
  'Continue 3 km on the gravel road — Plaasrus is the second gate on the right.',
  'GPS coordinates available on WhatsApp request.',
]

export function FindUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ambientDotRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        if (contentRef.current) gsap.set(contentRef.current, { opacity: 1, y: 0 })
        return
      }

      // Ambient: accent dot breathes slowly — 8 s cycle, --dur-ambient (Mandate 10)
      if (ambientDotRef.current) {
        gsap.to(ambientDotRef.current, {
          scale: 2.2,
          opacity: 0.4,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Scroll-triggered: content fades up on enter (Mandate 10)
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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
      id="find-us"
      ref={sectionRef}
      className="bg-bg-end py-[var(--section-pad-y)]"
    >
      <div
        ref={contentRef}
        className="max-w-[var(--container-max)] mx-auto px-[var(--container-pad)]"
      >
        {/* Section heading */}
        <h2 className="font-display italic text-display-xs leading-none text-fg mb-2">
          Find Us.
        </h2>
        <p className="font-display italic text-lede text-fg-muted mb-10">
          Hoe kom jy hier.
        </p>

        {/* Ambient dot — accent colour breathing (Mandate 10 ambient) */}
        <div
          ref={ambientDotRef}
          className="w-[6px] h-[6px] bg-accent mb-12"
          style={{ transformOrigin: 'center center', opacity: 0.7 }}
          aria-hidden="true"
        />

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Directions — prose landmarks */}
          <div>
            <h3 className="font-display italic text-display-micro leading-none text-fg mb-8">
              Getting Here
            </h3>
            <ol className="flex flex-col gap-5 list-none" role="list">
              {DIRECTIONS.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="font-display italic text-display-micro leading-none text-accent flex-shrink-0 w-6">
                    {i + 1}.
                  </span>
                  <p className="font-serif text-body-lg leading-relaxed text-fg">
                    {step}
                  </p>
                </li>
              ))}
            </ol>

            <p className="font-serif text-body text-fg-muted mt-8 leading-relaxed">
              George Airport is 20 minutes away. Car hire recommended — the N12 is a good road and the farm is well-signed from the turnoff.
            </p>
          </div>

          {/* Map — click to load */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {mapLoaded ? (
              <iframe
                src={MAP_EMBED_SRC}
                title="Plaasrus op die kaart — directions to the farm"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <button
                onClick={() => setMapLoaded(true)}
                className="absolute inset-0 w-full h-full bg-bg-subtle flex flex-col items-center justify-center gap-3 text-left cursor-pointer hover:bg-bg-raised transition-colors duration-[var(--dur-base)] motion-reduce:transition-none"
                aria-label="Load Google Maps — shows location of Plaasrus near George"
              >
                <span className="font-display italic text-display-micro leading-none text-fg">
                  Show on map
                </span>
                <span className="text-overline tracking-micro uppercase text-fg-muted">
                  Loads Google Maps
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
