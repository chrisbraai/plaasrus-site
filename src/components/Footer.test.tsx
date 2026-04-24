import React from 'react'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { vi } from 'vitest'
import axe from 'axe-core'
import { Footer, type FooterProps } from './Footer'

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    onClick,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    className?: string
    onClick?: () => void
    [key: string]: unknown
  }) => (
    <a href={href} className={className} onClick={onClick} {...(rest as object)}>
      {children}
    </a>
  ),
}))

// ─── IntersectionObserver spy override ───────────────────────────────────────
// The global setup (src/test/setup.ts) provides a no-throw stub for all tests.
// Footer needs call-count assertions, so override with tracked vi.fn() spies.

const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

class MockIntersectionObserver {
  observe = mockObserve
  disconnect = mockDisconnect
  unobserve = vi.fn()
  constructor() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// ─── Test fixtures ────────────────────────────────────────────────────────────

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Footer.tsx'), 'utf-8')

const DEFAULT_PROPS: FooterProps = {
  wordmarkLetters: ['A', 'C', 'M', 'E', '^'],
  wordmarkAriaLabel: 'Acme — home',
  nav: {
    heading: 'Pages',
    links: [
      { href: '/services', label: 'Services' },
      { href: '/work', label: 'Work' },
      { href: '/about', label: 'About' },
    ],
  },
  contact: {
    heading: 'Contact',
    email: 'hello@acme.co',
    phone: { display: '012 345 6789', href: '+27123456789' },
    cta: { label: 'Start a project', href: '/contact' },
  },
  location: {
    heading: 'Where',
    lines: ['Cape Town', 'South Africa', 'acme.co'],
  },
  tagline: 'We build things that last.',
  copyrightText: '© 2026 Acme Corp',
  copyrightLocation: 'Cape Town, South Africa',
}

afterEach(() => {
  axe.reset()
  mockObserve.mockClear()
  mockDisconnect.mockClear()
})

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Footer — render', () => {
  it('renders a <footer> element', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('renders all wordmark letters as [data-letter] spans', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    const letters = container.querySelectorAll('[data-letter]')
    expect(letters).toHaveLength(DEFAULT_PROPS.wordmarkLetters.length)
  })

  it('wordmark link has correct aria-label', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    const wordmarkLink = container.querySelector('a[href="/"]')
    expect(wordmarkLink).toHaveAttribute('aria-label', 'Acme — home')
  })

  it('nav column heading renders', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    expect(getByText('Pages')).toBeInTheDocument()
  })

  it('footer nav has aria-label="Footer navigation"', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    expect(container.querySelector('nav[aria-label="Footer navigation"]')).toBeInTheDocument()
  })

  it('renders all nav links with correct hrefs', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    const nav = container.querySelector('nav[aria-label="Footer navigation"]')!
    const links = nav.querySelectorAll('a')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '/services')
    expect(links[1]).toHaveAttribute('href', '/work')
    expect(links[2]).toHaveAttribute('href', '/about')
  })

  it('contact column heading renders', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    expect(getByText('Contact')).toBeInTheDocument()
  })

  it('contact email renders as a mailto: link', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    const emailLink = container.querySelector('a[href="mailto:hello@acme.co"]')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveTextContent('hello@acme.co')
  })

  it('contact phone renders with correct tel: href and display text', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    const phoneLink = container.querySelector('a[href="tel:+27123456789"]')
    expect(phoneLink).toBeInTheDocument()
    expect(phoneLink).toHaveTextContent('012 345 6789')
  })

  it('contact CTA renders with correct href and label', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    const ctaLink = getByText('Start a project')
    expect(ctaLink.closest('a')).toHaveAttribute('href', '/contact')
  })

  it('location column heading renders', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    expect(getByText('Where')).toBeInTheDocument()
  })

  it('renders all location lines', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    expect(getByText('Cape Town')).toBeInTheDocument()
    expect(getByText('South Africa')).toBeInTheDocument()
    expect(getByText('acme.co')).toBeInTheDocument()
  })

  it('last location line receives mt-1 class when 3+ lines', () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    const locationDiv = container.querySelectorAll('.grid > div')[3]!
    const paras = locationDiv.querySelectorAll('p:not(.text-overline)')
    const lastPara = paras[paras.length - 1]
    expect(lastPara.className).toContain('mt-1')
  })

  it('last location line does not receive mt-1 when only 2 lines', () => {
    const { container } = render(
      <Footer {...DEFAULT_PROPS} location={{ heading: 'Where', lines: ['Cape Town', 'South Africa'] }} />
    )
    const locationDiv = container.querySelectorAll('.grid > div')[3]!
    const paras = locationDiv.querySelectorAll('p:not(.text-overline)')
    const lastPara = paras[paras.length - 1]
    expect(lastPara.className).not.toContain('mt-1')
  })

  it('tagline renders in the amber band', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    const taglineEl = getByText('We build things that last.')
    expect(taglineEl.closest('div')?.className).toContain('bg-bg-raised')
  })

  it('copyright text renders', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    expect(getByText('© 2026 Acme Corp')).toBeInTheDocument()
  })

  it('copyright location renders', () => {
    const { getByText } = render(<Footer {...DEFAULT_PROPS} />)
    expect(getByText('Cape Town, South Africa')).toBeInTheDocument()
  })

  it('IntersectionObserver is initialised on mount', () => {
    render(<Footer {...DEFAULT_PROPS} />)
    expect(mockObserve).toHaveBeenCalledTimes(1)
  })

  it('forwards ref to the <footer> element', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Footer {...DEFAULT_PROPS} ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName.toLowerCase()).toBe('footer')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Footer — token compliance', () => {
  it('contains no raw hex color values', () => {
    expect(SOURCE).not.toMatch(/#[0-9a-fA-F]{3,6}\b/)
  })

  it('contains no shadow-* classes', () => {
    expect(SOURCE).not.toMatch(/\bshadow-[a-z]/)
  })

  it('contains no disallowed rounded-* classes', () => {
    const matches = SOURCE.match(/\brounded-[a-z0-9-]+/g) ?? []
    const disallowed = matches.filter((m) => m !== 'rounded-none')
    expect(disallowed).toHaveLength(0)
  })
})

// ─── A11y tests ───────────────────────────────────────────────────────────────

describe('Footer — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Footer {...DEFAULT_PROPS} />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })
})
