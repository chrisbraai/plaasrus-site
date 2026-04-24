// Improvement 1: CSS-variable-first with inline hex fallback — every colour is `var(--token, #hex)`
// so when globals.css has loaded the component tracks the project palette; when the root layout
// has failed and CSS is absent, the hex fallback still renders a legible error page.
// Improvement 2: Self-contained <html><body> that does not depend on CursorProvider, MotionConfig,
// or next/font — global-error is the last line of defence and must not require any provider tree.
// Template: none — spec build (Next.js 16 global error convention).

// This file intentionally embeds raw hex values as fallbacks to the CSS variables. Each coloured
// style line below is marked `// YIELD-FORKED` so the post-edit C1 check treats the fallback
// hexes as documented exceptions rather than palette drift. Do not remove the fallbacks:
// they are the whole point of this file — it renders when globals.css has not loaded.

'use client';

import { useEffect } from 'react';
import { captureException } from '@/instrumentation-client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[global-error]', error);
    // captureException is a no-op when NEXT_PUBLIC_SENTRY_DSN is unset — safe to call always.
    captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          backgroundColor: 'var(--bg-inverse, #0d1117)', // YIELD-FORKED — CSS-var fallback
          color: 'var(--fg-inverse, #e8edf4)', // YIELD-FORKED — CSS-var fallback
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '60ch' }}>
          <p
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--fg-quiet, #8a9db8)', // YIELD-FORKED — CSS-var fallback
              margin: 0,
            }}
          >
            Critical error {error.digest ? `· ${error.digest}` : ''}
          </p>
          <h1
            style={{
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontSize: '40px',
              lineHeight: 1.05,
              fontWeight: 700,
              marginTop: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            The site failed to load.
          </h1>
          <p
            style={{
              marginTop: '20px',
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--fg-inverse-muted, #cfd6e0)', // YIELD-FORKED — CSS-var fallback
            }}
          >
            Something went wrong before the design system could initialise. Retry, or reload
            the page — if this keeps happening, email chris@yielde.dev.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '28px',
              padding: '14px 22px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              backgroundColor: 'var(--accent, #d4aa6a)', // YIELD-FORKED — CSS-var fallback
              color: 'var(--accent-ink, #0d1117)', // YIELD-FORKED — CSS-var fallback
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
