// Next.js instrumentation hook — runs once per runtime (node + edge) at server boot.
// Docs: https://nextjs.org/docs/app/guides/instrumentation
//
// Purpose: initialise Sentry for the two non-browser runtimes Next.js supports.
// Client-side init lives in scaffold/src/instrumentation-client.ts (same convention).
//
// The DSN is read from NEXT_PUBLIC_SENTRY_DSN. When the env var is absent the instrumentation
// becomes a no-op — no SDK code is imported dynamically, so builds that skip Sentry pay
// zero runtime cost.

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  const tracesSampleRate = Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1');

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn,
      tracesSampleRate,
      // Performance monitoring is enabled but at a low sample rate; errors are always 1.0.
      // Session replay is disabled by default — enable per project once PII filters are set.
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn,
      tracesSampleRate,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    });
  }
}

// onRequestError is called by Next.js when a server/edge runtime request throws. Bridging
// it to Sentry.captureRequestError gives every thrown exception a stack trace + request
// context (route, params, user agent) without any app code changes.
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string | string[] | undefined> },
  context: { routerKind: 'Pages Router' | 'App Router'; routePath: string; routeType: string },
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  const Sentry = await import('@sentry/nextjs');
  Sentry.captureRequestError(err, request, context);
}
