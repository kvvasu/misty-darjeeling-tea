import {withAstryx} from '@astryxdesign/build/next';

/**
 * Misty Darjeeling Tea — static export.
 * Astryx source build requires the webpack bundler (see @astryxdesign/build README):
 * run `next dev --webpack` / `next build --webpack` (wired in package.json scripts).
 *
 * Hosting: GitHub Pages, project site at /misty-darjeeling-tea/ — basePath
 * prefixes every route and asset URL. Override with PAGES_BASE_PATH='' for a
 * custom-domain root deploy.
 */
const BASE_PATH = process.env.PAGES_BASE_PATH ?? '/misty-darjeeling-tea';

const nextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  images: {unoptimized: true}, // §3.7 — static export has no on-demand optimizer
  turbopack: {}, // Next 16 config validation requires this alongside a webpack hook
  trailingSlash: true, // stable asset paths for static hosting
};

export default withAstryx(nextConfig);
