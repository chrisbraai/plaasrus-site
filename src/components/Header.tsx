// Improvement 1: wordmark accepts ReactNode — decouples brand identity from layout; a text lockup, SVG logo, or image all slot in without structural changes.
// Improvement 2: navItems and cta props replace hardcoded Yielde routes — any client's navigation and CTA copy slots in at the call site; the component ships as a reusable layout primitive.
// Template: Menu

"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { btn, cn } from '@/lib/utils'

export interface NavItem {
  href: string
  label: string
}

export interface HeaderProps {
  /** [COPY: brand wordmark — text lockup, image logo, or combined mark] */
  wordmark: React.ReactNode
  navItems: NavItem[]
  cta: {
    label: string
    href: string
  }
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ wordmark, navItems, cta }, ref) => {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    useEffect(() => {
      document.body.style.overflow = open ? 'hidden' : ''
      return () => { document.body.style.overflow = '' }
    }, [open])

    useEffect(() => { setOpen(false) }, [pathname])

    // Guard non-root hrefs only — '/' would startsWith-match every pathname.
    const isActive = (href: string) =>
      pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

    return (
      <>
        <header
          ref={ref}
          className="sticky top-0 z-40 h-[var(--header-h)] w-full bg-bg border-b border-rule flex items-center"
        >
          <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-pad)] flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-nav-wordmark leading-none tracking-wordmark uppercase text-fg hover:text-accent transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
            >
              {wordmark}
            </Link>

            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-overline font-medium tracking-micro uppercase transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none',
                    isActive(href)
                      ? 'text-accent underline underline-offset-4 decoration-[1px]'
                      : 'text-fg hover:text-accent'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <Link href={cta.href} className={`hidden md:inline-flex ${btn('inverse')}`}>
              {cta.label}
            </Link>

            <button
              className="md:hidden text-overline font-medium tracking-micro uppercase text-fg hover:text-accent transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
            >
              {open ? 'CLOSE' : 'MENU'}
            </button>
          </div>
        </header>

        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          // aria-hidden mirrors inert for AT that does not yet honour the inert attribute
          aria-hidden={!open}
          // inert blocks keyboard focus and AT discovery when the overlay is hidden
          inert={!open ? true : undefined}
          className={cn(
            'md:hidden fixed inset-0 z-50 bg-bg flex flex-col pt-[var(--header-h)] px-[var(--container-pad)] pb-8',
            'transition-opacity duration-[var(--dur-base)] motion-reduce:transition-none',
            open ? 'opacity-100' : 'opacity-0'
          )}
        >
          <nav className="flex flex-col gap-6 mt-8" aria-label="Mobile menu">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'font-display text-display-s leading-none tracking-display',
                  'transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none',
                  isActive(href) ? 'text-accent' : 'text-fg hover:text-accent'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-rule pt-8">
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className={btn('primary', 'w-full justify-center')}
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </>
    )
  }
)

Header.displayName = 'Header'
