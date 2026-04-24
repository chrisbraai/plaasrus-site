import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { vi } from 'vitest'
import axe from 'axe-core'
import { usePathname } from 'next/navigation'
import { Header, type NavItem } from './Header'

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

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

// ─── Test fixtures ────────────────────────────────────────────────────────────

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Header.tsx'), 'utf-8')

const DEFAULT_NAV: NavItem[] = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
]

const DEFAULT_PROPS = {
  wordmark: 'Yielde',
  navItems: DEFAULT_NAV,
  cta: { label: 'Get started', href: '/contact' },
}

beforeEach(() => {
  vi.mocked(usePathname).mockReturnValue('/')
})

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Header — render', () => {
  it('renders a <header> element', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('renders the wordmark text', () => {
    const { getAllByText } = render(<Header {...DEFAULT_PROPS} />)
    expect(getAllByText('Yielde').length).toBeGreaterThanOrEqual(1)
  })

  it('renders a ReactNode wordmark slot', () => {
    const { getByTestId } = render(
      <Header
        wordmark={<span data-testid="wordmark-node">YIELDE</span>}
        navItems={DEFAULT_NAV}
        cta={DEFAULT_PROPS.cta}
      />
    )
    expect(getByTestId('wordmark-node')).toBeInTheDocument()
  })

  it('desktop nav has aria-label="Main navigation"', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    expect(container.querySelector('nav[aria-label="Main navigation"]')).toBeInTheDocument()
  })

  it('renders all nav items in the desktop nav', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const nav = container.querySelector('nav[aria-label="Main navigation"]')!
    const links = nav.querySelectorAll('a')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '/services')
    expect(links[1]).toHaveAttribute('href', '/work')
    expect(links[2]).toHaveAttribute('href', '/about')
  })

  it('inactive nav link has text-fg class and not bare text-accent', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const nav = container.querySelector('nav[aria-label="Main navigation"]')!
    const servicesLink = nav.querySelector('a[href="/services"]')!
    const classes = servicesLink.className.split(/\s+/)
    expect(classes).toContain('text-fg')
    // hover:text-accent is present; bare text-accent (active state) must not be
    expect(classes).not.toContain('text-accent')
  })

  it('active nav link gets text-accent and underline when pathname matches', () => {
    vi.mocked(usePathname).mockReturnValue('/services')
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const nav = container.querySelector('nav[aria-label="Main navigation"]')!
    const servicesLink = nav.querySelector('a[href="/services"]')!
    expect(servicesLink.className).toContain('text-accent')
    expect(servicesLink.className).toContain('underline')
  })

  it('active state triggers for sub-paths (startsWith match)', () => {
    vi.mocked(usePathname).mockReturnValue('/services/seo')
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const nav = container.querySelector('nav[aria-label="Main navigation"]')!
    const servicesLink = nav.querySelector('a[href="/services"]')!
    expect(servicesLink.className).toContain('text-accent')
  })

  it('root "/" href is active only on exact match, not on every sub-path', () => {
    vi.mocked(usePathname).mockReturnValue('/services')
    const navWithHome: NavItem[] = [{ href: '/', label: 'Home' }, ...DEFAULT_NAV]
    const { container } = render(<Header {...DEFAULT_PROPS} navItems={navWithHome} />)
    const nav = container.querySelector('nav[aria-label="Main navigation"]')!
    const homeLink = nav.querySelector('a[href="/"]')!
    const classes = homeLink.className.split(/\s+/)
    expect(classes).not.toContain('text-accent')
  })

  it('renders the desktop CTA as a link with correct href', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const header = container.querySelector('header')!
    const ctaLink = header.querySelector('a[href="/contact"]')
    expect(ctaLink).toBeInTheDocument()
    expect(ctaLink).toHaveTextContent('Get started')
  })

  it('mobile toggle button is present with aria-controls="mobile-nav"', () => {
    const { getByRole } = render(<Header {...DEFAULT_PROPS} />)
    const btn = getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-controls', 'mobile-nav')
  })

  it('mobile toggle shows MENU text by default', () => {
    const { getByRole } = render(<Header {...DEFAULT_PROPS} />)
    expect(getByRole('button')).toHaveTextContent('MENU')
  })

  it('mobile toggle has aria-expanded="false" by default', () => {
    const { getByRole } = render(<Header {...DEFAULT_PROPS} />)
    expect(getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('mobile overlay has aria-hidden="true" when closed', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    expect(container.querySelector('#mobile-nav')).toHaveAttribute('aria-hidden', 'true')
  })

  it('mobile overlay has inert attribute when closed', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    expect(container.querySelector('#mobile-nav')).toHaveAttribute('inert')
  })

  it('mobile overlay does not have inert attribute when open', () => {
    const { container, getByRole } = render(<Header {...DEFAULT_PROPS} />)
    fireEvent.click(getByRole('button'))
    expect(container.querySelector('#mobile-nav')).not.toHaveAttribute('inert')
  })

  it('clicking the toggle opens the mobile overlay (aria-hidden="false")', () => {
    const { getByRole, container } = render(<Header {...DEFAULT_PROPS} />)
    fireEvent.click(getByRole('button'))
    expect(container.querySelector('#mobile-nav')).toHaveAttribute('aria-hidden', 'false')
  })

  it('toggle switches to CLOSE when overlay is open', () => {
    const { getByRole } = render(<Header {...DEFAULT_PROPS} />)
    fireEvent.click(getByRole('button'))
    expect(getByRole('button')).toHaveTextContent('CLOSE')
  })

  it('toggle has aria-expanded="true" when overlay is open', () => {
    const { getByRole } = render(<Header {...DEFAULT_PROPS} />)
    fireEvent.click(getByRole('button'))
    expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('second click on toggle closes the overlay', () => {
    const { getByRole, container } = render(<Header {...DEFAULT_PROPS} />)
    fireEvent.click(getByRole('button'))
    fireEvent.click(getByRole('button'))
    expect(container.querySelector('#mobile-nav')).toHaveAttribute('aria-hidden', 'true')
  })

  it('mobile overlay has role="dialog" and aria-modal="true"', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const overlay = container.querySelector('#mobile-nav')!
    expect(overlay).toHaveAttribute('role', 'dialog')
    expect(overlay).toHaveAttribute('aria-modal', 'true')
  })

  it('mobile overlay contains all nav items', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const mobileNav = container.querySelector('#mobile-nav nav')!
    const links = mobileNav.querySelectorAll('a')
    expect(links[0]).toHaveAttribute('href', '/services')
    expect(links[1]).toHaveAttribute('href', '/work')
    expect(links[2]).toHaveAttribute('href', '/about')
  })

  it('mobile overlay contains a CTA link', () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const overlay = container.querySelector('#mobile-nav')!
    expect(overlay.querySelector('a[href="/contact"]')).toBeInTheDocument()
  })

  it('clicking a mobile nav link closes the overlay', () => {
    const { getByRole, container } = render(<Header {...DEFAULT_PROPS} />)
    fireEvent.click(getByRole('button'))
    expect(container.querySelector('#mobile-nav')).toHaveAttribute('aria-hidden', 'false')
    const mobileNav = container.querySelector('#mobile-nav nav')!
    fireEvent.click(mobileNav.querySelectorAll('a')[0])
    expect(container.querySelector('#mobile-nav')).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards ref to the <header> element', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Header {...DEFAULT_PROPS} ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName.toLowerCase()).toBe('header')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Header — token compliance', () => {
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

describe('Header — a11y', () => {
  it('closed state has no axe violations', async () => {
    const { container } = render(<Header {...DEFAULT_PROPS} />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })

  it('open state has no axe violations', async () => {
    const { container, getByRole } = render(<Header {...DEFAULT_PROPS} />)
    fireEvent.click(getByRole('button'))
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })
})
