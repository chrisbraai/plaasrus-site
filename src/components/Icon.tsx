// Improvement 1: ICON_MAP typed Record<IconName, typeof Zap> — centralizes all 11 permitted Lucide icons (structural/utility only); IconName union type enforces the permitted set at compile time; adding an icon requires spec approval + one Record entry. Brand icons (github, linkedin, etc.) require simple-icons as a separate dependency — see state/decisions.md CF-github.
// Improvement 2: Labelled/decorative split via aria-label prop — Icon always sets aria-hidden explicitly: decorative icons receive aria-hidden="true"; labelled icons receive aria-hidden={undefined} (omitted from DOM), role="img", and the aria-label. Consumer-supplied aria-hidden is intentionally overridden — Icon owns its accessibility state.
// Template: none — spec build.

import React from 'react'
import {
  FileText, MapPin, Zap, ArrowUpRight, Layers, BrainCircuit,
  Globe, Mail, Phone, X, Menu,
} from 'lucide-react'

export type IconName =
  | 'file-text' | 'map-pin' | 'zap' | 'arrow-up-right'
  | 'layers' | 'brain-circuit' | 'globe' | 'mail'
  | 'phone' | 'x' | 'menu'

export type IconSize = 20 | 28 | 36 | 40

const ICON_MAP: Record<IconName, typeof Zap> = {
  'file-text':      FileText,
  'map-pin':        MapPin,
  'zap':            Zap,
  'arrow-up-right': ArrowUpRight,
  'layers':         Layers,
  'brain-circuit':  BrainCircuit,
  'globe':          Globe,
  'mail':           Mail,
  'phone':          Phone,
  'x':              X,
  'menu':           Menu,
}

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color' | 'size'> {
  name: IconName
  size?: IconSize
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 20, 'aria-label': ariaLabel, ...props }, ref) => {
    const LucideIcon = ICON_MAP[name]
    return (
      <LucideIcon
        ref={ref}
        {...props}
        size={size}
        color="currentColor"
        aria-hidden={ariaLabel ? undefined : 'true'}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
      />
    )
  }
)

Icon.displayName = 'Icon'
