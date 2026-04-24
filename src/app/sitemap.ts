import type { MetadataRoute } from 'next';

// Sitemap for every Yielde client project. Populate `routes` with the paths actually
// built for this client; leave any unused site-section routes commented out rather than
// synthesising URLs that 404. The default hub-model routes are listed below — uncomment
// the ones the current project actually ships.
//
// The base URL is read from NEXT_PUBLIC_SITE_URL (set via env-push.sh before deploy).
// See knowledge/design-system/09-page-architecture.md §10.5.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com').replace(/\/$/, '');

// Edit this list per project before shipping. Only include routes that actually exist.
const routes: { path: string; changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']; priority?: number }[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1.0 },
  // { path: '/services',  changeFrequency: 'monthly', priority: 0.9 },
  // { path: '/process',   changeFrequency: 'yearly',  priority: 0.7 },
  // { path: '/about',     changeFrequency: 'yearly',  priority: 0.7 },
  // { path: '/pricing',   changeFrequency: 'monthly', priority: 0.9 },
  // { path: '/contact',   changeFrequency: 'yearly',  priority: 0.8 },
  // { path: '/work',      changeFrequency: 'monthly', priority: 0.8 },
  // { path: '/journal',   changeFrequency: 'weekly',  priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
