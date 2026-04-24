import type { MetadataRoute } from 'next';

// Per knowledge/design-system/09-page-architecture.md §10.5 — sitemap.xml and robots.txt
// must be present on every page. Next.js generates /robots.txt from this file at build time.
//
// The default allows all public crawlers and disallows the /api/ surface (contact form should
// not be indexed). Add Disallow lines for any client-specific private routes before shipping.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/palette'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
