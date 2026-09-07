import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const baseUrl = 'https://hotel.studiomeyer.io';
const locales = ['en', 'de', 'es'];
const pages = ['', '/rooms', '/wellness', '/dining', '/experiences', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      });
    }
  }

  return entries;
}
