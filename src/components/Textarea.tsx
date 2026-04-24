// Improvement 1: React.forwardRef — ref forwarded to native <textarea> for form library integration (react-hook-form, formik, etc.).
// Improvement 2: useId() — generates unique stable IDs server-side; eliminates manual id management and prevents id collision in multi-instance contexts.
// Template: none — spec build.

import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={textareaId} className="text-body-sm font-normal text-fg-muted">
          {label}
        </label>
        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={cn(
            'w-full bg-transparent font-sans font-normal text-body text-fg',
            'p-[12px] min-h-[140px] resize-none',
            'border border-rule',
            'focus:outline-none focus:border-accent focus:border-l-2',
            'transition-[border-color] duration-[120ms] motion-reduce:transition-none',
            error && 'border-danger',
            className
          )}
        />
        {error && (
          <p id={`${textareaId}-error`} role="alert" className="text-body-sm text-danger">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
