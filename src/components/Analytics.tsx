// Improvement 1: Single env-gate at the module boundary — `NEXT_PUBLIC_ANALYTICS_ENABLED`
// is read once at evaluation time. When off, the component is a zero-cost null render and
// neither @vercel/analytics nor next/web-vitals code ships to the client bundle (Next.js
// tree-shakes the unreachable branch when the env var is statically false at build time).
// Improvement 2: web-vitals reporting is a sendBeacon call to a custom endpoint. The endpoint
// is configurable via `NEXT_PUBLIC_WEB_VITALS_ENDPOINT` so the project can swap between
// Vercel Speed Insights, Plausible, a custom logger, or a Grafana Cloud Frontend Observability
// receiver without code changes.
// Template: none — spec build (T3.9).

'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useReportWebVitals } from 'next/web-vitals';

const ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
const ENDPOINT = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT;

type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  rating?: string;
  delta?: number;
  navigationType?: string;
};

function WebVitalsReporter() {
  useReportWebVitals((metric: WebVitalsMetric) => {
    // Always log in dev for visibility; real delivery only happens when ENDPOINT is set.
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[web-vitals]', metric.name, metric.value.toFixed(1), metric.rating);
    }
    if (!ENDPOINT) return;

    // sendBeacon is non-blocking, won't keep the page alive, and fires on page unload
    // (the moment CLS is finalised). JSON.stringify + a Blob with the correct content-type
    // makes the body CORS-compatible with most ingest APIs.
    const body = JSON.stringify({
      ...metric,
      url: window.location.href,
      timestamp: Date.now(),
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, { body, method: 'POST', keepalive: true }).catch(() => {});
    }
  });
  return null;
}

export function Analytics() {
  if (!ENABLED) return null;
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      <WebVitalsReporter />
    </>
  );
}
