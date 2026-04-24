// Improvement 1: Single useEffect with both anchor and semantic re-application keeps hydration deterministic — no flash of wrong palette on navigation between pages.
// Improvement 2: No Context API required — the effect writes directly to :root, which is the source of truth for all components via CSS variables; avoiding React state prevents a render cycle that would flicker the UI on mount.
// Template: none — spec build.

'use client'

import { useEffect } from 'react'
import { loadPersistedPalette, setRootVar } from '@/lib/palette'

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = loadPersistedPalette()
    if (!stored) return

    for (const [key, hex] of Object.entries(stored.anchors)) {
      setRootVar(`--${key}`, hex)
    }

    // Semantic values are stored as 'var(--stop)' refs — browser resolves live.
    for (const [token, ref] of Object.entries(stored.semantic)) {
      setRootVar(`--${token}`, ref)
    }
  }, [])

  return <>{children}</>
}
