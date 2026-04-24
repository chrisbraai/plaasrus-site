// Improvement 1: Bilateral left/right label navigation removed entirely — the single declarative sentence stack (one beat per scroll position) replaces the multi-column label mechanism; distinct from every other Full-Screen-Scroll-FX usage in the portfolio which retains bilateral columns.
// Improvement 2: Afrikaans echo "Rus op die plaas." enters 120 ms after the English h1 wordmark via a GSAP offset — bilingual brief §8 honoured at the animation layer without mirrored text or a separate i18n layer.
// Template: Full-Screen-Scroll-FX (U3)

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { btn } from '@/lib/utils'
import { WHATSAPP_HREF } from '@/lib/contact'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function HeroStoep() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const s1Ref = useRef<HTMLParagraphElement>(null)
  const s2Ref = useRef<HTMLParagraphElement>(null)
  const s3Ref = useRef<HTMLParagraphElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const echoRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        gsap.set(
          [s1Ref.current, s2Ref.current, s3Ref.current, wordmarkRef.current, echoRef.current, ctaRef.current],
          { opacity: 1, yPercent: 0 }
        )
        return
      }

      // Ambient: slow overlay breathing — 8 s cycle, tied to --dur-ambient (Mandate 10)
      gsap.to(overlayRef.current, {
        opacity: 0.32,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Ambient image parallax — moves at half the scroll rate over the pinned section
      gsap.to(imgWrapRef.current, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      // Initial hidden states
      gsap.set([s1Ref.current, s2Ref.current, s3Ref.current], { opacity: 0, yPercent: 30 })
      gsap.set([wordmarkRef.current, echoRef.current, ctaRef.current], { opacity: 0 })

      // Scroll-driven sentence timeline (Mandate 10 — scroll-triggered)
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
        // Beat 1 — sentence 1 arrives
        .to(s1Ref.current, { opacity: 1, yPercent: 0, duration: 1, ease: 'power3.out' }, 0)
        // Beat 2 — sentence 2 arrives; sentence 1 drifts up slightly
        .to(s1Ref.current, { yPercent: -6, duration: 1, ease: 'power2.out' }, 1.5)
        .to(s2Ref.current, { opacity: 1, yPercent: 0, duration: 1, ease: 'power3.out' }, 1.5)
        // Beat 3 — sentence 3 arrives; stack drifts up
        .to([s1Ref.current, s2Ref.current], { yPercent: '-=6', duration: 1, ease: 'power2.out' }, 3.0)
        .to(s3Ref.current, { opacity: 1, yPercent: 0, duration: 1, ease: 'power3.out' }, 3.0)
        // Beat 4 — wordmark, then echo 120 ms after, then CTA
        .to(wordmarkRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 4.2)
        .to(echoRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 4.32) // 120 ms stagger
        .to(ctaRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 4.8)
    },
    { scope: wrapperRef }
  )

  return (
    <section
      id="hero"
      ref={wrapperRef}
      aria-label="Hero — Die Stoep"
      style={{ height: '250vh' }}
    >
      {/* Sticky panel — pinned by GSAP ScrollTrigger */}
      <div ref={pinnedRef} className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* Full-bleed background image (parallax wrapper oversized ±10% to prevent reveal gaps) */}
        <div
          ref={imgWrapRef}
          className="absolute will-change-transform"
          style={{ top: '-10%', bottom: '-10%', left: 0, right: 0 }}
          aria-hidden="true"
        >
          <Image
            src="/images/hero-stoep.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Neutral scrim — ambient breathing animation; black not brown so photo colours read clean */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.42 }}
          aria-hidden="true"
        />

        {/* Sentence stack — vertically centred */}
        <div className="absolute inset-0 flex flex-col justify-center" aria-hidden="false">
          <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-pad)] flex flex-col gap-6 md:gap-8">
            <p
              ref={s1Ref}
              className="font-display italic leading-none text-fg-inverse"
              style={{ fontSize: 'clamp(var(--text-display-micro), 4.5vw, var(--text-display-s))' }}
            >
              The stoep faces north.
            </p>
            <p
              ref={s2Ref}
              className="font-display italic leading-none text-fg-inverse"
              style={{ fontSize: 'clamp(var(--text-display-micro), 4.5vw, var(--text-display-s))' }}
            >
              Three bedrooms behind it. Six can sleep.
            </p>
            <p
              ref={s3Ref}
              className="font-display italic leading-none text-fg-inverse"
              style={{ fontSize: 'clamp(var(--text-display-micro), 4.5vw, var(--text-display-s))' }}
            >
              The Outeniqua Mountains don't move.
            </p>
          </div>
        </div>

        {/* Wordmark + echo + CTA — bottom anchor */}
        <div className="absolute bottom-0 left-0 right-0 pb-16 md:pb-[var(--section-pad-y-compressed)]">
          <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-pad)]">
            <h1
              ref={wordmarkRef}
              className="font-display italic text-display-micro leading-none text-fg-inverse mb-1"
            >
              Plaasrus.
            </h1>
            <p
              ref={echoRef}
              className="font-display italic text-lede text-fg-inverse-muted mb-8"
            >
              Rus op die plaas.
            </p>
            <div ref={ctaRef}>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={btn('primary')}
              >
                WhatsApp to arrange
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
