import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { Textarea } from './Textarea'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/Textarea.tsx'), 'utf-8')

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('Textarea — render', () => {
  it('renders label and textarea', () => {
    const { getByRole, getByText } = render(<Textarea label="Message" />)
    expect(getByRole('textbox')).toBeInTheDocument()
    expect(getByText('Message')).toBeInTheDocument()
  })

  it('label is associated with textarea via htmlFor/id', () => {
    const { getByLabelText } = render(<Textarea label="Your message" />)
    expect(getByLabelText('Your message')).toBeInTheDocument()
  })

  it('shows error message when error prop is set', () => {
    const { getByRole } = render(<Textarea label="Message" error="This field is required" />)
    expect(getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('shows no error message by default', () => {
    const { queryByRole } = render(<Textarea label="Message" />)
    expect(queryByRole('alert')).not.toBeInTheDocument()
  })

  it('applies danger border class in error state', () => {
    const { getByRole } = render(<Textarea label="Message" error="Error" />)
    expect(getByRole('textbox').className).toContain('border-danger')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('Textarea — token compliance', () => {
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

describe('Textarea — a11y', () => {
  it('default state has no axe violations', async () => {
    const { container } = render(<Textarea label="Message" />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })

  it('error state has no axe violations', async () => {
    const { container } = render(
      <Textarea label="Message" error="This field is required" />
    )
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })
})
