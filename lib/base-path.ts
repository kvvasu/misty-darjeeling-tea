/**
 * GitHub Pages project-site base path (must match next.config.mjs BASE_PATH).
 *
 * Astryx `Link` renders plain <a href> and is not Next basePath-aware, so
 * every internal href from app/components goes through `withBasePath()` at
 * the call site. Static only — no runtime env access needed in the browser.
 */
export const BASE_PATH = '/misty-darjeeling-tea';

export function withBasePath(href: string): string {
  if (href.startsWith('/')) return `${BASE_PATH}${href}`;
  return href;
}
