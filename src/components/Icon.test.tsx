import React from 'react'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { Icon, type IconName, type IconSize } from './Icon'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Icon.tsx'), 'utf-8')

const SIZES: IconSize[] = [20, 28, 36, 40]

// Typed to IconName so a typo or removed icon is caught at compile time.
const PERMITTED_NAMES: ReadonlyArray<IconName> = [
  'file-text', 'map-pin', 'zap', 'arrow-up-right', 'layers', 'brain-circuit',
  'globe', 'mail', 'phone', 'x', 'menu',
]

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Icon — render', () => {
  for (const size of SIZES) {
    it(`renders at size ${size}px with correct width and height`, () => {
      const { container } = render(<Icon name="zap" size={size} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', String(size))
      expect(svg).toHaveAttribute('height', String(size))
    })
  }

  it('renders with default size 20 when none supplied', () => {
    const { container } = render(<Icon name="zap" />)
    expect(container.querySelector('svg')).toHaveAttribute('width', '20')
  })

  it('renders with stroke="currentColor"', () => {
    const { container } = render(<Icon name="zap" />)
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor')
  })

  it('decorative icon has aria-hidden="true"', () => {
    const { container } = render(<Icon name="zap" />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('labelled icon has aria-label and role="img" with no aria-hidden', () => {
    const { container } = render(<Icon name="zap" aria-label="Lightning bolt" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'Lightning bolt')
    expect(svg).toHaveAttribute('role', 'img')
    expect(svg).not.toHaveAttribute('aria-hidden')
  })

  it('ignores consumer-supplied aria-hidden — Icon always controls its own aria state', () => {
    const { container } = render(<Icon name="zap" aria-hidden="false" />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards ref to the underlying svg element', () => {
    const ref = React.createRef<SVGSVGElement>()
    render(<Icon name="zap" ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName.toLowerCase()).toBe('svg')
  })

  it('passes arbitrary svg attributes through to the svg element', () => {
    const { container } = render(
      <Icon name="zap" data-testid="icon" data-section="hero" />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('data-testid', 'icon')
    expect(svg).toHaveAttribute('data-section', 'hero')
  })

  it('renders all 11 permitted icon names without error', () => {
    for (const name of PERMITTED_NAMES) {
      expect(() => render(<Icon name={name} />)).not.toThrow()
    }
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Icon — token compliance', () => {
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

describe('Icon — a11y', () => {
  it('decorative state has no axe violations', async () => {
    const { container } = render(<Icon name="zap" />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })

  it('labelled state has no axe violations', async () => {
    const { container } = render(<Icon name="mail" aria-label="Email" />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })
})
