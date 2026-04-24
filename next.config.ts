import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// Bundle analyzer — runs only when ANALYZE=true. `npm run analyze` produces
// .next/analyze/*.html reports (client, edge, nodejs). Review before every
// significant dependency addition. See Tier 2 item T2.3.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // React Compiler 1.0 (stable in React 19 / Next.js 16). Automatic memoisation; replaces
  // the need for manual useMemo/useCallback/React.memo in most components.
  // Opt out per-file with the `"use no memo"` directive at the top of a component.
  // See https://react.dev/blog/2025/10/07/react-compiler-1
  reactCompiler: true,

  // Image optimisation — formats are negotiated client-side; AVIF preferred where supported.
  // remotePatterns is empty by default: every client project must add its own CDN domains
  // (Sanity CDN, Cloudflare Images, Unsplash, etc.) before shipping photography.
  // See https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Add client-specific remote hosts here before deploying, e.g.:
      // { protocol: "https", hostname: "cdn.sanity.io" },
      // { protocol: "https", hostname: "images.example.com" },
    ],
  },

  // Security headers applied to every route. These are the industry-standard baseline;
  // a production-ready deploy also needs a Content-Security-Policy — defined per-project
  // in middleware.ts because CSP depends on analytics, fonts, and CMS origins used.
  // See scaffold/src/middleware.ts (add when the project introduces a CMS/analytics).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Clickjacking defence — deny framing entirely.
          { key: "X-Frame-Options", value: "DENY" },
          // MIME-sniffing defence.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer policy — strictest setting that still supports standard analytics.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable sensor APIs by default; re-enable per-route if a feature needs them.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Force HTTPS for 2 years, include subdomains, eligible for HSTS preload list.
          // Remove `preload` if the site has any HTTP-only subdomain this will reach.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
