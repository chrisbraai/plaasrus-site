import React from 'react'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { Stat, type StatTone } from './Stat'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Stat.tsx'), 'utf-8')

const TONES: StatTone[] = ['typeset', 'copper', 'steel', 'newsprint', 'amber']

const EXPECTED_CLASSES: Record<StatTone, { container: string; value: string; label: string }> = {
  typeset:   { container: 'bg-bg-raised',   value: 'text-fg',       label: 'text-fg-muted' },
  copper:    { container: 'bg-accent',       value: 'text-stat-ink', label: 'text-stat-ink' },
  steel:     { container: 'bg-bg-subtle',    value: 'text-accent',   label: 'text-fg-quiet' },
  newsprint: { container: 'bg-bg-newsprint', value: 'text-fg',       label: 'text-fg-muted' },
  amber:     { container: 'bg-bg-raised',    value: 'text-fg',       label: 'text-fg-muted' },
}

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Stat — render', () => {
  for (const tone of TONES) {
    it(`${tone} tone applies correct classes to container, value, and label`, () => {
      const { getByTestId, getByText } = render(
        <Stat tone={tone} value="42k" label="Users" data-testid="stat" />
      )
      expect(getByTestId('stat').className).toContain(EXPECTED_CLASSES[tone].container)
      expect(getByText('42k').className).toContain(EXPECTED_CLASSES[tone].value)
      expect(getByText('Users').className).toContain(EXPECTED_CLASSES[tone].label)
    })
  }

  it('renders value text correctly', () => {
    const { getByText } = render(<Stat value="99%" label="Uptime" />)
    expect(getByText('99%')).toBeInTheDocument()
  })

  it('renders label text correctly', () => {
    const { getByText } = render(<Stat value="99%" label="Uptime" />)
    expect(getByText('Uptime')).toBeInTheDocument()
  })

  it('renders with default typeset tone when none supplied', () => {
    const { getByTestId } = render(
      <Stat value="1" label="Test" data-testid="stat" />
    )
    expect(getByTestId('stat').className).toContain('bg-bg-raised')
  })

  it('forwards ref to the underlying div element', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Stat ref={ref} value="1" label="Test" />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('DIV')
  })

  it('passes arbitrary html attributes and className through to the container', () => {
    const { getByTestId } = render(
      <Stat value="1" label="Test" aria-label="Stat card" className="w-full" data-testid="stat" />
    )
    const el = getByTestId('stat')
    expect(el).toHaveAttribute('aria-label', 'Stat card')
    expect(el.className).toContain('w-full')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Stat — token compliance', () => {
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

describe('Stat — a11y', () => {
  for (const tone of TONES) {
    it(`${tone}: no axe violations`, async () => {
      const { container } = render(
        <Stat tone={tone} value="42k" label="Active users" />
      )
      const results = await axe.run(container)
      expect(results.violations).toHaveLength(0)
    })
  }
})
