// Improvement 1: React.forwardRef — exposes span ref for animation libraries (Framer Motion layoutId, GSAP targets) and measurement without wrapper elements.
// Improvement 2: BADGE_TONES Record — tone-to-class mapping is a typed Record; TypeScript enforces exhaustiveness; extending tones requires one new entry.
// Template: none — spec build.

import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeTone = 'typeset' | 'copper' | 'steel' | 'newsprint' | 'amber' | 'outline'

const BADGE_BASE =
  'inline-flex items-center px-[9px] py-[4px] text-micro font-medium tracking-badge uppercase'

const BADGE_TONES: Record<BadgeTone, string> = {
  typeset:   'bg-bg-inverse text-fg-inverse',
  copper:    'bg-accent text-accent-ink',
  steel:     'bg-bg-subtle text-fg-muted',
  newsprint: 'bg-bg-newsprint text-fg-muted',
  amber:     'bg-bg-raised text-fg',
  outline:   'border border-rule text-fg',
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone = 'typeset', className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(BADGE_BASE, BADGE_TONES[tone], className)}
      {...props}
    >
      {children}
    </span>
  )
)

Badge.displayName = 'Badge'
