import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { Button } from './Button'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Button.tsx'), 'utf-8')

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Button — render', () => {
  it('primary variant renders with accent background class', () => {
    const { getByRole } = render(<Button variant="primary">Click</Button>)
    const el = getByRole('button')
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('bg-accent')
  })

  it('inverse variant renders with fg background class', () => {
    const { getByRole } = render(<Button variant="inverse">Click</Button>)
    const el = getByRole('button')
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('bg-fg')
  })

  it('ghost variant renders with fg border class', () => {
    const { getByRole } = render(<Button variant="ghost">Click</Button>)
    const el = getByRole('button')
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('border-fg')
  })

  it('danger variant renders with danger background class', () => {
    const { getByRole } = render(<Button variant="danger">Click</Button>)
    const el = getByRole('button')
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('bg-danger')
  })

  it('applies w-full class when full prop is true', () => {
    const { getByRole } = render(<Button full>Click</Button>)
    expect(getByRole('button').className).toContain('w-full')
  })

  it('omits w-full class when full prop is false', () => {
    const { getByRole } = render(<Button>Click</Button>)
    expect(getByRole('button').className).not.toContain('w-full')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Button — token compliance', () => {
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

describe('Button — a11y', () => {
  const variants = ['primary', 'inverse', 'ghost', 'danger'] as const

  for (const variant of variants) {
    it(`${variant}: no axe violations`, async () => {
      const { container } = render(<Button variant={variant}>Submit</Button>)
      const results = await axe.run(container)
      expect(results.violations).toHaveLength(0)
    })
  }
})
