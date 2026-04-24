import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Palette — Demo',
  robots: 'noindex, nofollow',
}

export default function PaletteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
