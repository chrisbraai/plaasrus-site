// Improvement 1: Segment-level boundary (not global) — error here is contained to the current
// route segment; the root layout (Header, Footer, CursorProvider) stays mounted.
// Improvement 2: reset() button wired to the Next.js error boundary API — calling it retries
// the server component render without a full page reload, preserving scroll position.
// Template: none — spec build (Next.js 16 error boundary convention).

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to the browser console in dev. Production deploys should swap this
    // for a Sentry / analytics call — see Tier 3 (T3.10).
    // eslint-disable-next-line no-console
    console.error('[route-error]', error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center px-[var(--container-pad)] py-[var(--section-pad-y)]">
      <div className="max-w-[60ch] w-full">
        <p className="font-mono text-body-xs uppercase tracking-micro text-fg-quiet">
          Error {error.digest ? `· ${error.digest}` : ''}
        </p>
        <h1 className="mt-4 font-display text-display-l leading-tight text-fg">
          Something broke on this page.
        </h1>
        <p className="mt-6 text-body-lg text-fg-muted">
          The rest of the site is fine. Try again, or go back and take a different route.
        </p>
        <div className="mt-10 flex gap-3">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Back to the start
          </Button>
        </div>
      </div>
    </main>
  );
}
