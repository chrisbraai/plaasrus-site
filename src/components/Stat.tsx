// Improvement 1: React.forwardRef — exposes div ref for scroll-triggered entrance animations (GSAP, Framer Motion) and Intersection Observer visibility tracking.
// Improvement 2: STAT_TONES Record<StatTone, {container, value, label}> — three-slot typed token prescription per tone; TypeScript enforces exhaustiveness; adding a tone requires one Record entry.
// Improvement 3: Fluid value font-size via clamp(36px, 3.6vw, 56px) — scales the proof figure with viewport without a breakpoint cascade; leading-header (0.95) tightens vertical rhythm on the display figure.
// Template: none — spec build.

import React from 'react'
import { cn } from '@/lib/utils'

export type StatTone = 'typeset' | 'copper' | 'steel' | 'newsprint' | 'amber'

interface StatToneClasses {
  container: string
  value: string
  label: string
}

const STAT_TONES: Record<StatTone, StatToneClasses> = {
  typeset:   { container: 'bg-bg-raised',   value: 'text-fg',     label: 'text-fg-muted' },
  copper:    { container: 'bg-accent',       value: 'text-stat-ink', label: 'text-stat-ink' },
  steel:     { container: 'bg-bg-subtle',    value: 'text-accent', label: 'text-fg-quiet' },
  newsprint: { container: 'bg-bg-newsprint', value: 'text-fg',     label: 'text-fg-muted' },
  amber:     { container: 'bg-bg-raised',    value: 'text-fg',     label: 'text-fg-muted' },
}

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: StatTone
  value: string
  label: string
}

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ tone = 'typeset', value, label, className, ...props }, ref) => {
    const toneClasses = STAT_TONES[tone]
    return (
      <div
        ref={ref}
        className={cn('p-[24px]', toneClasses.container, className)}
        {...props}
      >
        <div
          className={cn(
            'font-display text-[clamp(36px,3.6vw,56px)] leading-header',
            toneClasses.value
          )}
        >
          {value}
        </div>
        <div className={cn('text-label uppercase tracking-button mt-[8px]', toneClasses.label)}>
          {label}
        </div>
      </div>
    )
  }
)

Stat.displayName = 'Stat'
