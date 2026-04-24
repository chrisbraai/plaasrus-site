import { notFound } from 'next/navigation'
import { PaletteEditor } from './PaletteEditor'

export default function PalettePage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    notFound()
  }
  return <PaletteEditor />
}
