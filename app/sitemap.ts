import type {MetadataRoute} from 'next';

export const dynamic = 'force-static';

const BASE = 'https://misty-darjeeling-tea.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', 'teas/', 'estate/', 'brew-guide/', 'contact/'].map(path => ({
    url: `${BASE}/${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
