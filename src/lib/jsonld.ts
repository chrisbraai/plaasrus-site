// JSON-LD schema helpers for the routes named in knowledge/design-system/09-page-architecture.md §10.5:
//   Organization on /      — home page brand identity
//   Service      on /services
//   FAQPage      on /pricing
//   Article      per /journal entry
//   ContactPoint on /contact
//
// Usage:
//   import { organizationSchema, renderJsonLd } from '@/lib/jsonld';
//   export default function HomePage() {
//     return (
//       <>
//         {renderJsonLd(organizationSchema({ name: '...', url: '...', ... }))}
//         <main>...</main>
//       </>
//     );
//   }
//
// The `renderJsonLd` helper returns a React element via `createElement` (no JSX) so this
// stays a `.ts` file alongside the other utilities under `lib/`.
//
// The payload is stringified with JSON.stringify (no user input is concatenated as raw HTML)
// and defensively escaped against `</script>` sequences before being passed to
// `dangerouslySetInnerHTML`.

import { createElement, type ReactElement } from 'react';

// Minimal shared fields. Kept loose (Record<string, unknown>) rather than tightly typed
// against schema.org — over-typing fights Google's evolving requirements.
type Schema = Record<string, unknown>;

export function organizationSchema(input: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: { email?: string; telephone?: string; contactType?: string };
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
    ...(input.contactPoint
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: input.contactPoint.contactType ?? 'customer service',
            ...(input.contactPoint.email ? { email: input.contactPoint.email } : {}),
            ...(input.contactPoint.telephone
              ? { telephone: input.contactPoint.telephone }
              : {}),
          },
        }
      : {}),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  provider: { name: string; url: string };
  areaServed?: string | string[];
  serviceType?: string;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    provider: {
      '@type': 'Organization',
      name: input.provider.name,
      url: input.provider.url,
    },
    ...(input.areaServed ? { areaServed: input.areaServed } : {}),
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
  };
}

export function faqPageSchema(
  questions: { question: string; answer: string }[],
): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  author: string;
  datePublished: string; // ISO 8601
  dateModified?: string;
  image?: string;
  url: string;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    author: { '@type': 'Person', name: input.author },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(input.image ? { image: input.image } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
  };
}

export function contactPointSchema(input: {
  email?: string;
  telephone?: string;
  contactType?: string;
  availableLanguage?: string | string[];
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    contactType: input.contactType ?? 'customer service',
    ...(input.email ? { email: input.email } : {}),
    ...(input.telephone ? { telephone: input.telephone } : {}),
    ...(input.availableLanguage ? { availableLanguage: input.availableLanguage } : {}),
  };
}

// Emit a JSON-LD script block. Google prefers application/ld+json in <script> over meta tags.
// Built with createElement (no JSX) so the file stays a `.ts` utility.
export function renderJsonLd(schema: Schema | Schema[]): ReactElement {
  const payload = JSON.stringify(schema).replace(/<\/script>/gi, '<\\/script>');
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: payload },
  });
}
