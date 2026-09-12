import type {MetadataRoute} from 'next';

export const dynamic = 'force-static';

// GitHub Pages project site — disallow path must include the basePath.
const BASE = 'https://kvvasu.github.io/misty-darjeeling-tea';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/', disallow: '/misty-darjeeling-tea/thank-you/'},
    sitemap: `${BASE}/sitemap.xml`,
  };
}
