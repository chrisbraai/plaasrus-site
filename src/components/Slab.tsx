// Improvement 1: React.forwardRef — exposes the slab's ref for Intersection Observer integration; consumers watch the element directly for scroll-in entry and toggle the animated prop without a wrapper element.
// Improvement 2: color accepts a CSS custom property name (e.g. '--accent', '--rule') — backgroundColor resolves at runtime via var(), so palette swaps in globals.css propagate to every Slab instance automatically.
// Template: none — spec build.

import React from 'react'
import { cn } from '@/lib/utils'

interface SlabProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string
  h?: string
  animated?: boolean
}

export const Slab = React.forwardRef<HTMLDivElement, SlabProps>(
  ({ color = '--accent', h = '6px', animated = false, className, style, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      aria-hidden="true"
      className={cn(
        'w-full origin-left',
        animated && 'animate-slab-draw motion-reduce:animate-none',
        className
      )}
      style={{ height: h, backgroundColor: `var(${color})`, ...style }}
    />
  )
)

Slab.displayName = 'Slab'
