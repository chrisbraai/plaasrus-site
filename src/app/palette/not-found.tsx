import Link from 'next/link'

export default function PaletteNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg text-fg">
      <p className="font-mono text-body-xs uppercase tracking-micro text-fg-quiet">404</p>
      <h1 className="font-display text-display-xl leading-display text-fg">Demo only.</h1>
      <p className="max-w-[40ch] text-center text-body text-fg-muted">
        The palette editor is not available on this build.
      </p>
      <Link
        href="/"
        className="text-body-xs text-accent underline-offset-4 hover:underline"
      >
        ← Back to site
      </Link>
    </main>
  )
}
