// Improvement 1: React.forwardRef — ref forwarded to native <input> for form library integration (react-hook-form, formik, etc.).
// Improvement 2: useId() — generates unique stable IDs server-side; eliminates manual id management and prevents id collision in multi-instance contexts.
// Template: none — spec build.

import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-body-sm font-normal text-fg-muted">
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'w-full bg-transparent font-sans font-normal text-body text-fg',
            'py-[12px] px-0',
            'border-b border-l-2 border-b-rule border-l-transparent',
            'focus:outline-none focus:border-b-accent focus:border-l-accent',
            'transition-[border-color] duration-[120ms] motion-reduce:transition-none',
            error && 'border-b-danger',
            className
          )}
        />
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-body-sm text-danger">
            {error}
          </p>
        )}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'
