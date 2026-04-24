// Improvement 1: Cormorant Garamond italic wordmark (font-display resolves to Cormorant on this project) — signals rest and dwelling per brief §5; distinct from every other portfolio wordmark which uses Bebas Neue uppercase.
// Improvement 2: Mobile overlay renders nav links at text-display-2xs Cormorant italic — each link is a full-width editorial statement; TOEMAAK/MENU labels honour the bilingual brief without a separate i18n layer.
// Template: Menu (U2)

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn, btn } from '@/lib/utils'

const WHATSAPP_NUMBER = '27000000000' // TODO: confirm number with client before launch
const WHATSAPP_TEXT = encodeURIComponent(
  "Hallo, ek wil graag 'n verblyf by Plaasrus reël. / Hi, I'd like to arrange a stay at Plaasrus."
)
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`

const NAV_ITEMS = [
  { href: '#the-house',    label: 'The House' },
  { href: '#the-farm',     label: 'The Farm' },
  { href: '#the-mornings', label: 'The Mornings' },
  { href: '#book',         label: 'Book' },
  { href: '#find-us',      label: 'Find Us' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 h-[var(--header-h)] w-full',
          'border-b transition-colors duration-[var(--dur-base)] motion-reduce:transition-none',
          scrolled
            ? 'bg-bg/95 border-rule backdrop-blur-sm'
            : 'bg-bg border-transparent'
        )}
      >
        <div className="mx-auto h-full max-w-[var(--container-max)] px-[var(--container-pad)] flex items-center justify-between">
          <Link
            href="/"
            aria-label="Plaasrus — terug na tuis"
            className="font-display italic text-nav-wordmark leading-none text-fg hover:text-accent transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
          >
            Plaasrus
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Hoofnavigasie">
            {NAV_ITEMS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-overline tracking-micro uppercase text-fg hover:text-accent transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('hidden md:inline-flex', btn('ghost'))}
          >
            WhatsApp to arrange
          </a>

          <button
            className="md:hidden text-overline tracking-micro uppercase text-fg hover:text-accent transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Maak navigasie toe' : 'Maak navigasie oop'}
          >
            {open ? 'TOEMAAK' : 'MENU'}
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Mobiele navigasie"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          'md:hidden fixed inset-0 z-50 bg-bg flex flex-col',
          'pt-[var(--header-h)] px-[var(--container-pad)] pb-12',
          'transition-opacity duration-[var(--dur-base)] motion-reduce:transition-none',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col gap-8 mt-12" aria-label="Mobiele menu">
          {NAV_ITEMS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-display italic text-display-2xs leading-none text-fg hover:text-accent transition-colors duration-[var(--dur-fast)] motion-reduce:transition-none"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto border-t border-rule pt-8">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={btn('ghost', 'w-full justify-center')}
          >
            WhatsApp to arrange
          </a>
        </div>
      </div>
    </>
  )
}
