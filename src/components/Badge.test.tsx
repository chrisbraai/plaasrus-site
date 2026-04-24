import React from 'react'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { Badge, type BadgeTone } from './Badge'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Badge.tsx'), 'utf-8')

const TONES: BadgeTone[] = ['typeset', 'copper', 'steel', 'newsprint', 'amber', 'outline']

const EXPECTED_CLASSES: Record<BadgeTone, string> = {
  typeset:   'bg-bg-inverse',
  copper:    'bg-accent',
  steel:     'bg-bg-subtle',
  newsprint: 'bg-bg-newsprint',
  amber:     'bg-bg-raised',
  outline:   'border-rule',
}

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Badge — render', () => {
  for (const tone of TONES) {
    it(`${tone} tone renders with correct class`, () => {
      const { getByText } = render(<Badge tone={tone}>{tone}</Badge>)
      const el = getByText(tone)
      expect(el).toBeInTheDocument()
      expect(el.className).toContain(EXPECTED_CLASSES[tone])
    })
  }

  it('renders with default typeset tone when none supplied', () => {
    const { getByText } = render(<Badge>Default</Badge>)
    const el = getByText('Default')
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('bg-bg-inverse')
  })

  it('forwards ref to the underlying span element', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>Label</Badge>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('SPAN')
  })

  it('passes arbitrary html attributes through to the span', () => {
    const { getByText } = render(
      <Badge aria-label="Status: new" data-testid="badge">New</Badge>
    )
    const el = getByText('New')
    expect(el).toHaveAttribute('aria-label', 'Status: new')
    expect(el).toHaveAttribute('data-testid', 'badge')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Badge — token compliance', () => {
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

describe('Badge — a11y', () => {
  for (const tone of TONES) {
    it(`${tone}: no axe violations`, async () => {
      const { container } = render(<Badge tone={tone}>New</Badge>)
      const results = await axe.run(container)
      expect(results.violations).toHaveLength(0)
    })
  }
})
