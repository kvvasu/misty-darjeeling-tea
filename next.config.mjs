import {withAstryx} from '@astryxdesign/build/next';

/**
 * Misty Darjeeling Tea — static export.
 * Astryx source build requires the webpack bundler (see @astryxdesign/build README):
 * run `next dev --webpack` / `next build --webpack` (wired in package.json scripts).
 */
const nextConfig = {
  output: 'export',
  images: {unoptimized: true}, // §3.7 — static export has no on-demand optimizer
  turbopack: {}, // Next 16 config validation requires this alongside a webpack hook
  trailingSlash: true, // stable asset paths for Netlify static hosting
};

export default withAstryx(nextConfig);
