import type {MetadataRoute} from 'next';

export const dynamic = 'force-static';

// GitHub Pages project site (docs/SECURITY_HEADERS.md, ARCHITECTURE.md).
const BASE = 'https://kvvasu.github.io/misty-darjeeling-tea';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', 'teas/', 'estate/', 'brew-guide/', 'contact/'].map(path => ({
    url: `${BASE}/${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
