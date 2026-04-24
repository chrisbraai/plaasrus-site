// Improvement 1: React.forwardRef — exposes DOM ref to consumers for programmatic focus, form library integration, and animation targets.
// Improvement 2: type="button" default — HTML spec defaults to type="submit" inside <form>; this prevents accidental form submission.
// Template: none — spec build.

import React from 'react'
import { btn, type BtnVariant } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  full?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', full = false, type = 'button', className, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={btn(variant, full && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'
