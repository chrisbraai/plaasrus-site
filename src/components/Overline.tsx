// Improvement 1: React.forwardRef — exposes the p ref for entrance animation targets (effect #01 overline flash) and scroll-linked section way-markers.
// Improvement 2: hero prop switches color from --fg-muted to --accent at the call site without a separate component; section vs hero context is declared by the consumer, keeping the API flat and the component small.
// Template: none — spec build.

import React from 'react'
import { cn } from '@/lib/utils'

interface OverlineProps extends React.HTMLAttributes<HTMLParagraphElement> {
  hero?: boolean
}

export const Overline = React.forwardRef<HTMLParagraphElement, OverlineProps>(
  ({ hero = false, className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-micro font-medium tracking-micro uppercase',
        hero ? 'text-accent' : 'text-fg-muted',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
)

Overline.displayName = 'Overline'
