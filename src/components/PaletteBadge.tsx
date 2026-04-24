// Improvement 1: Max-width transition on the text span avoids layout reflow — width animation on fixed-position elements causes jank; expanding the text via max-width keeps the icon anchor point stationary.
// Improvement 2: Direct Lucide import rather than extending Icon.tsx's permitted union — the Palette icon is a developer-tooling exception; keeping it out of Icon.tsx preserves that component's curated client-facing type boundary.
// Template: none — spec build.

'use client'

import { useRouter } from 'next/navigation'
import { Palette } from 'lucide-react' // YIELD-FORKED — developer-tooling exception, see 07-components.md

export function PaletteBadge() {
  const router = useRouter()

  return (
    <button
      type="button"
      aria-label="Open palette editor"
      onClick={() => router.push('/palette')}
      className="group fixed bottom-6 right-6 z-[9999] flex h-10 items-center overflow-hidden bg-accent px-0 text-accent-ink transition-[padding,gap] duration-200 motion-reduce:transition-none hover:gap-2 hover:px-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
        <Palette size={20} aria-hidden="true" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-sans text-body-xs font-medium uppercase tracking-button transition-[max-width] duration-200 motion-reduce:transition-none group-hover:max-w-[8rem]">
        Palette →
      </span>
    </button>
  )
}
