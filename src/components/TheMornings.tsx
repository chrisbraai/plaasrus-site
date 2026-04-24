// Improvement 1: clip-path inset() animation replaces border-radius expand from template source — zero-radius rule maintained; image clips symmetrically from all four sides creating a more cinematic reveal than asymmetric border-radius collapse.
// Improvement 2: Section h2 yields to the photograph — it fades out as the image expands to cover it; the pull-quote arrives only after full-bleed, making the image the sole sensory carrier before the word lands.
// Template: Hero-Zoom (U2)

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function TheMornings() {
  const wrapperRef = useRef<HTMLElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)
  const imgInnerRef = useRef<HTMLDivElement>(null)
  const quoteMainRef = useRef<HTMLParagraphElement>(null)
  const quoteEchoRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      if (!wrapperRef.current) return

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        gsap.set(imgContainerRef.current, { clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set(headingRef.current, { opacity: 1 })
        gsap.set(quoteMainRef.current, { opacity: 1 })
        gsap.set(quoteEchoRef.current, { opacity: 1 })
        return
      }

      // Ambient: slow image scale breathe — runs continuously regardless of scroll (Mandate 10)
      if (imgInnerRef.current) {
        gsap.to(imgInnerRef.current, {
          scale: 1.04,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Initial states
      gsap.set(imgContainerRef.current, {
        clipPath: 'inset(20% 28% 20% 28%)',
      })
      gsap.set([quoteMainRef.current, quoteEchoRef.current], { opacity: 0 })

      // Scroll-driven expansion timeline (Mandate 10 — scroll-triggered)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinnedRef.current,
          pinSpacing: true,
          scrub: 0.8,
        },
      })

      tl
        // Heading fades out as image begins expanding
        .to(headingRef.current, { opacity: 0, y: -16, duration: 1, ease: 'power2.in' }, 0)
        // fromTo: browsers return clip-path in px; a plain .to() reads inset(120px...) and snaps % values to 0.
        .fromTo(
          imgContainerRef.current,
          { clipPath: 'inset(20% 28% 20% 28%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 3, ease: 'power2.inOut' },
          0.4
        )
        // Pull-quote arrives after full expansion, Afrikaans echo 120ms offset
        .to(quoteMainRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 3.2)
        .to(quoteEchoRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 3.32)
    },
    { scope: wrapperRef }
  )

  return (
    <section
      id="the-mornings"
      ref={wrapperRef}
      aria-label="The Mornings"
      style={{ height: '280vh' }}
    >
      {/* Sticky panel */}
      <div ref={pinnedRef} className="sticky top-0 h-screen w-full overflow-hidden bg-bg-raised">

        {/* Screen-reader heading — always visible to AT regardless of scroll state */}
        <h2 className="sr-only">The Mornings — Die Oggende</h2>

        {/* Section heading — yields to the image as it expands (visual only) */}
        <div
          ref={headingRef}
          className="absolute top-0 left-0 right-0 pt-[var(--section-pad-y-compressed)] px-[var(--container-pad)] z-10 pointer-events-none"
          aria-hidden="true"
        >
          <div className="max-w-[var(--container-max)] mx-auto">
            <h2 className="font-display italic text-display-xs leading-none text-fg">
              The Mornings.
            </h2>
            <p className="font-display italic text-lede text-fg-muted mt-2">
              Die Oggende.
            </p>
          </div>
        </div>

        {/* Expanding image — clip-path drives the zoom reveal */}
        <div
          ref={imgContainerRef}
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: 'inset(20% 28% 20% 28%)' }}
        >
          <div
            ref={imgInnerRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: 'center center' }}
          >
            <Image
              src="/images/mornings-stoep.jpg"
              alt="Goats and donkeys grazing in the early morning at Braambos farm"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Neutral scrim for pull-quote legibility — black not brown */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Pull-quote — arrives at full-bleed */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[var(--container-pad)] text-center pointer-events-none z-10">
          <p
            ref={quoteMainRef}
            className="font-display italic text-display-2xs md:text-display-xs leading-none text-fg-inverse max-w-[16ch]"
          >
            Before the house wakes, the farm is already an hour into its day.
          </p>
          {/* motion-reduce: text-fg-muted gives contrast on bg-bg-raised; text-fg-inverse-muted (tea-green) is only safe over the dark overlay */}
          <p
            ref={quoteEchoRef}
            className="font-display italic text-lede text-fg-inverse-muted motion-reduce:text-fg-muted mt-4"
          >
            Op vyf-uur verstaan jy.
          </p>
        </div>
      </div>
    </section>
  )
}
