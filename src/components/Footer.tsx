// Improvement 1: wordmarkLetters prop drives the staggered letter-entrance animation — any glyph sequence slots in; IntersectionObserver cascade is entirely internal, with prefers-reduced-motion guard.
// Improvement 2: nav, contact, and location columns are fully prop-driven — headings, links, and copy all slot in without touching the layout; the asymmetric 2fr 1fr 1fr 1fr grid is a structural constant.
// Template: none — spec build.

"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Slab } from './Slab'
import { cn } from '@/lib/utils'

export interface FooterNavLink {
  href: string
  label: string
}

export interface FooterNavColumn {
  heading: string
  links: FooterNavLink[]
}

export interface FooterContactColumn {
  heading: string
  email: string
  phone: {
    /** Display string shown to users, e.g. "063 611 2952" */
    display: string
    /** tel: href value (digits + country code), e.g. "+27636112952" */
    href: string
  }
  cta: { label: string; href: string }
}

export interface FooterLocationColumn {
  heading: string
  /** Lines rendered top-to-bottom; the last line receives a small top-margin separator */
  lines: string[]
}

export interface FooterProps {
  /** [COPY: brand wordmark as individual letter/glyph tokens — each rendered in its own animated span] */
  wordmarkLetters: string[]
  /** Accessible label for the wordmark link. Defaults to visible text if omitted. */
  wordmarkAriaLabel?: string
  nav: FooterNavColumn
  contact: FooterContactColumn
  location: FooterLocationColumn
  /** [COPY: amber band brand tagline — bold single-sentence brand promise] */
  tagline: string
  /** [COPY: copyright notice, e.g. "© 2026 Acme Corp"] */
  copyrightText: string
  /** [COPY: copyright location line, e.g. "New York, USA"] */
  copyrightLocation: string
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      wordmarkLetters,
      wordmarkAriaLabel,
      nav,
      contact,
      location,
      tagline,
      copyrightText,
      copyrightLocation,
    },
    ref
  ) => {
    const wordmarkRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
      const container = wordmarkRef.current
      if (!container) return

      const letters = Array.from(
        container.querySelectorAll<HTMLSpanElement>('[data-letter]')
      )
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        letters.forEach((l) => { l.style.opacity = '1' })
        return
      }

      letters.forEach((l) => { l.style.opacity = '0' })

      let disconnected = false
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          letters.forEach((letter, i) => {
            setTimeout(() => { letter.style.opacity = '1' }, i * 60)
          })
          disconnected = true
          observer.disconnect()
        },
        { threshold: 0.3 }
      )

      observer.observe(container)
      return () => { if (!disconnected) observer.disconnect() }
    }, [])

    return (
      <footer ref={ref} className="bg-bg">
        {/* 6px accent slab — uses Slab component */}
        <Slab />

        {/* Main grid */}
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-pad)] pt-12 pb-8">
          <div className="grid grid-cols-1 gap-8 md:[grid-template-columns:2fr_1fr_1fr_1fr] md:gap-16">

            {/* Col 1 — Wordmark */}
            <div>
              <Link
                href="/"
                aria-label={wordmarkAriaLabel}
                className="font-display text-display-xxl leading-none tracking-display-tight text-accent hover:text-accent-hover transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
              >
                <span ref={wordmarkRef}>
                  {wordmarkLetters.map((letter, i) => (
                    <span key={i} data-letter style={{ display: 'inline-block' }}>
                      {letter}
                    </span>
                  ))}
                </span>
              </Link>
            </div>

            {/* Col 2 — Nav */}
            <div>
              <p className="text-overline font-medium tracking-micro uppercase text-fg-quiet mb-5">
                {nav.heading}
              </p>
              <nav className="flex flex-col gap-3" aria-label="Footer navigation">
                {nav.links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-body-sm text-fg-muted hover:text-fg transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3 — Contact */}
            <div>
              <p className="text-overline font-medium tracking-micro uppercase text-fg-quiet mb-5">
                {contact.heading}
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-body-sm text-fg-muted hover:text-fg transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
                >
                  {contact.email}
                </a>
                <a
                  href={`tel:${contact.phone.href}`}
                  className="text-body-sm text-fg-muted hover:text-fg transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
                >
                  {contact.phone.display}
                </a>
                <Link
                  href={contact.cta.href}
                  className="text-body-sm text-accent hover:text-accent-hover transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none mt-1"
                >
                  {contact.cta.label}
                </Link>
              </div>
            </div>

            {/* Col 4 — Location */}
            <div>
              <p className="text-overline font-medium tracking-micro uppercase text-fg-quiet mb-5">
                {location.heading}
              </p>
              <div className="flex flex-col gap-3">
                {location.lines.map((line, i) => (
                  <p
                    key={i}
                    className={cn(
                      'text-body-sm text-fg-muted',
                      location.lines.length > 2 && i === location.lines.length - 1 && 'mt-1'
                    )}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Amber band */}
        <div className="h-10 bg-bg-raised flex items-center px-[var(--container-pad)]">
          <p className="text-overline font-medium tracking-micro uppercase text-fg">
            {tagline}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-rule px-[var(--container-pad)] py-4">
          <div className="mx-auto max-w-[var(--container-max)] flex flex-col md:flex-row md:justify-between gap-2">
            <p className="text-overline tracking-footer uppercase text-fg-muted">
              {copyrightText}
            </p>
            <p className="text-overline tracking-footer uppercase text-fg-muted">
              {copyrightLocation}
            </p>
          </div>
        </div>
      </footer>
    )
  }
)

Footer.displayName = 'Footer'
