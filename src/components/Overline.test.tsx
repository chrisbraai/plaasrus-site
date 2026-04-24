import React from 'react'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { Overline } from './Overline'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Overline.tsx'), 'utf-8')

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Overline — render', () => {
  it('renders children', () => {
    const { getByText } = render(<Overline>Services</Overline>)
    expect(getByText('Services')).toBeInTheDocument()
  })

  it('renders a <p> element', () => {
    const { getByText } = render(<Overline>Services</Overline>)
    expect(getByText('Services').tagName).toBe('P')
  })

  it('applies default fg-muted color class', () => {
    const { getByText } = render(<Overline>Services</Overline>)
    expect(getByText('Services').className).toContain('text-fg-muted')
  })

  it('does not apply accent class in default state', () => {
    const { getByText } = render(<Overline>Services</Overline>)
    expect(getByText('Services').className).not.toContain('text-accent')
  })

  it('applies accent color class when hero is true', () => {
    const { getByText } = render(<Overline hero>Hero Label</Overline>)
    expect(getByText('Hero Label').className).toContain('text-accent')
  })

  it('forwards ref to the underlying p element', () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(<Overline ref={ref}>Services</Overline>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('P')
  })

  it('passes arbitrary html attributes through to the p element', () => {
    const { getByText } = render(
      <Overline aria-label="Section label" data-testid="overline">Services</Overline>
    )
    const el = getByText('Services')
    expect(el).toHaveAttribute('aria-label', 'Section label')
    expect(el).toHaveAttribute('data-testid', 'overline')
  })

  it('merges caller className while preserving built-in classes', () => {
    const { getByText } = render(<Overline className="mt-8">Services</Overline>)
    const el = getByText('Services')
    expect(el.className).toContain('mt-8')
    expect(el.className).toContain('text-fg-muted')
    expect(el.className).toContain('text-micro')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Overline — token compliance', () => {
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

  it('contains no named Tailwind palette color classes', () => {
    // Catches text-gray-500, bg-zinc-100, etc. — ramp tokens that bypass the semantic layer
    expect(SOURCE).not.toMatch(
      /\b(text|bg|border|ring)-(gray|zinc|slate|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/
    )
  })
})

// ─── A11y tests ───────────────────────────────────────────────────────────────

describe('Overline — a11y', () => {
  it('default state has no axe violations', async () => {
    const { container } = render(<Overline>Services</Overline>)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })

  it('hero state has no axe violations', async () => {
    const { container } = render(<Overline hero>Build with intent.</Overline>)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })
})
