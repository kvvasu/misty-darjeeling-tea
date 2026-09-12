import type {MetadataRoute} from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/', disallow: '/thank-you/'},
    sitemap: 'https://misty-darjeeling-tea.netlify.app/sitemap.xml',
  };
}
