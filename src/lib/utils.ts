import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Extend twMerge with the Yielde custom Tailwind 4 @theme typography scale.
// Without this, twMerge treats text-micro, text-body-xs, etc. as color tokens
// and drops them when a text-{semantic-color} class appears in the same cn() call.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{
        text: [
          // Display scale (Bebas Neue)
          'display-xxl', 'display-xl', 'display-l', 'display-m',
          'display-s', 'display-xs', 'display-2xs', 'display-micro',
          // Sans scale (Geist)
          'hero-lede', 'lede', 'body-lg', 'body', 'body-sm',
          'body-xs', 'label', 'overline', 'micro', 'nav-wordmark',
        ],
      }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Button variants — padding/type/transition shared; colour layer per variant.
const BTN_BASE =
  'inline-flex items-center px-[22px] py-[14px] text-body-xs font-medium tracking-button uppercase transition-colors duration-[120ms] motion-reduce:transition-none';

const BTN_VARIANTS = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover hover:text-fg-inverse',
  inverse: 'bg-fg text-fg-inverse hover:bg-accent hover:text-accent-ink',
  ghost:   'border border-fg text-fg hover:bg-fg hover:text-fg-inverse',
  danger:  'bg-danger text-danger-ink hover:bg-danger-hover hover:text-danger-ink',
} as const;

export type BtnVariant = keyof typeof BTN_VARIANTS;

export function btn(variant: BtnVariant, ...extra: ClassValue[]): string {
  return cn(BTN_BASE, BTN_VARIANTS[variant], ...extra);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
