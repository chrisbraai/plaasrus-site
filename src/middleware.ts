// Next.js middleware — runs on every request before the route handler.
//
// Current purpose: Content-Security-Policy header injection (T2.17 stub).
//
// CSP is intentionally NOT enabled by default. The exact policy depends on which third-party
// origins the project actually uses — fonts, analytics, CMS, embedded maps, payment widgets —
// and a too-strict policy blocks legitimate resources while a too-loose policy adds no safety.
//
// To enable:
//   1. Set ENABLE_CSP=true in .env.production.
//   2. Customise `buildCspDirectives()` below with the exact origins this project depends on.
//   3. Deploy with CSP_REPORT_ONLY=true for one week. Review Cloudflare Analytics for
//      Content-Security-Policy-Report-Only violations.
//   4. Once the report log is clean, set CSP_REPORT_ONLY=false to enforce.
//
// The rest of the security headers (X-Frame-Options, HSTS, etc.) are set in next.config.ts
// and always apply — CSP is the only header that requires per-project tuning.

import { NextResponse, type NextRequest } from 'next/server';

function buildCspDirectives(nonce: string): string {
  // Starting point — tighten per project. Each directive is listed explicitly so that adding
  // a new third-party origin is a conscious single-line addition, not a `*` wildcard blanket.
  return [
    `default-src 'self'`,
    // 'strict-dynamic' lets the nonce propagate to scripts dynamically inserted by a permitted
    // script. Drop 'unsafe-inline' once every inline script carries the nonce (Next.js injects
    // nonces automatically when middleware sets CSP).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
    `style-src 'self' 'unsafe-inline'`, // Tailwind + @theme inject inline styles in dev.
    `img-src 'self' data: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'`, // Add analytics / CMS origins here, e.g. `https://*.sanity.io`
    `frame-ancestors 'none'`, // Already enforced by X-Frame-Options; CSP version is more flexible.
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.ENABLE_CSP !== 'true') return response;

  // Generate a per-request nonce. This is NOT crypto — a random base64-16 is adequate for CSP.
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))),
  );

  const headerName =
    process.env.CSP_REPORT_ONLY === 'true'
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';

  response.headers.set(headerName, buildCspDirectives(nonce));
  // Expose the nonce to the layout — Next.js reads x-nonce from the request headers and applies
  // it to its own inline scripts automatically in v14.1+.
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    // Skip middleware on static assets, image optimisation, and favicons — CSP applies to
    // HTML responses only.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
