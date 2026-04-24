import React from 'react'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { Slab } from './Slab'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Slab.tsx'), 'utf-8')

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Slab — render', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(<Slab data-testid="slab" />)
    expect(getByTestId('slab')).toBeInTheDocument()
  })

  it('applies default height and color via inline style', () => {
    const { getByTestId } = render(<Slab data-testid="slab" />)
    const styleAttr = getByTestId('slab').getAttribute('style') ?? ''
    expect(styleAttr).toContain('height: 6px')
    expect(styleAttr).toContain('var(--accent)')
  })

  it('applies custom color via inline style', () => {
    const { getByTestId } = render(<Slab color="--rule" data-testid="slab" />)
    const styleAttr = getByTestId('slab').getAttribute('style') ?? ''
    expect(styleAttr).toContain('var(--rule)')
  })

  it('applies custom h via inline style', () => {
    const { getByTestId } = render(<Slab h="12px" data-testid="slab" />)
    const styleAttr = getByTestId('slab').getAttribute('style') ?? ''
    expect(styleAttr).toContain('height: 12px')
  })

  it('merges consumer style onto the element without losing default height', () => {
    const { getByTestId } = render(
      <Slab style={{ opacity: '0.5' }} data-testid="slab" />
    )
    const styleAttr = getByTestId('slab').getAttribute('style') ?? ''
    expect(styleAttr).toContain('opacity')
    expect(styleAttr).toContain('height: 6px')
  })

  it('applies animate-slab-draw and motion-reduce:animate-none classes when animated is true', () => {
    const { getByTestId } = render(<Slab animated data-testid="slab" />)
    const className = getByTestId('slab').className
    expect(className).toContain('animate-slab-draw')
    expect(className).toContain('motion-reduce:animate-none')
  })

  it('does not apply animate-slab-draw class when animated is false', () => {
    const { getByTestId } = render(<Slab data-testid="slab" />)
    expect(getByTestId('slab').className).not.toContain('animate-slab-draw')
  })

  it('forwards ref to the underlying div element', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Slab ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('DIV')
  })

  it('passes arbitrary html attributes through to the div', () => {
    const { getByTestId } = render(
      <Slab data-testid="slab" data-section="hero" />
    )
    expect(getByTestId('slab')).toHaveAttribute('data-section', 'hero')
  })

  it('merges consumer className onto the element', () => {
    const { getByTestId } = render(<Slab className="my-custom" data-testid="slab" />)
    expect(getByTestId('slab').className).toContain('my-custom')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Slab — token compliance', () => {
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

describe('Slab — a11y', () => {
  it('default state has no axe violations', async () => {
    const { container } = render(<Slab />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })

  it('animated state has no axe violations', async () => {
    const { container } = render(<Slab animated />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })
})
