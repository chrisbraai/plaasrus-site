// Next.js client instrumentation — runs once per page in the browser, before any React code.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
//
// This is the client-side counterpart to src/instrumentation.ts. When NEXT_PUBLIC_SENTRY_DSN
// is absent, the module is still imported but init() is skipped — zero telemetry, zero network.

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
    // Capture browser-level unhandled errors and promise rejections automatically.
    integrations: [Sentry.browserTracingIntegration()],
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    // Session replay is opt-in per project: uncomment and configure replay filters/masking
    // before enabling in production, otherwise DOM content (including form inputs) may leak.
    // replaysSessionSampleRate: 0,
    // replaysOnErrorSampleRate: 1.0,
  });
}

// Expose a safe capture helper that other client components can import without needing to
// know whether Sentry is active — global-error.tsx uses this to avoid importing @sentry/nextjs
// directly in a file that must render even when Sentry has no DSN.
export function captureException(error: unknown): void {
  if (!dsn) return;
  Sentry.captureException(error);
}
