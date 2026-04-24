import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import axe from 'axe-core'
import { TextInput } from './TextInput'

const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/TextInput.tsx'), 'utf-8')

afterEach(() => axe.reset())

// ─── Render tests ─────────────────────────────────────────────────────────────

describe('TextInput — render', () => {
  it('renders label and input', () => {
    const { getByRole, getByText } = render(<TextInput label="Name" />)
    expect(getByRole('textbox')).toBeInTheDocument()
    expect(getByText('Name')).toBeInTheDocument()
  })

  it('label is associated with input via htmlFor/id', () => {
    const { getByLabelText } = render(<TextInput label="Email address" />)
    expect(getByLabelText('Email address')).toBeInTheDocument()
  })

  it('shows error message when error prop is set', () => {
    const { getByRole } = render(<TextInput label="Name" error="This field is required" />)
    expect(getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('shows no error message by default', () => {
    const { queryByRole } = render(<TextInput label="Name" />)
    expect(queryByRole('alert')).not.toBeInTheDocument()
  })

  it('applies danger border class in error state', () => {
    const { getByRole } = render(<TextInput label="Name" error="Error" />)
    expect(getByRole('textbox').className).toContain('border-b-danger')
  })
})

// ─── Token-compliance tests ───────────────────────────────────────────────────

describe('TextInput — token compliance', () => {
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

describe('TextInput — a11y', () => {
  it('default state has no axe violations', async () => {
    const { container } = render(<TextInput label="Email" />)
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })

  it('error state has no axe violations', async () => {
    const { container } = render(
      <TextInput label="Email" error="This field is required" />
    )
    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)
  })
})
