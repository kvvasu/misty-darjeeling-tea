import type {Metadata} from 'next';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import '@fontsource/caveat/latin-400.css';
import './globals.css';
import {ThemeModeProvider} from './theme-provider';
import {THEME_SCRIPT} from './theme-script';
import {SiteHeader, SiteFooter} from '../components/SiteChrome';

// GitHub Pages project site — canonical/OG URLs must include the basePath.
const SITE = 'https://kvvasu.github.io/misty-darjeeling-tea';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Misty Darjeeling Tea',
    template: '%s · Misty Darjeeling Tea',
  },
  description:
    'Single-estate Darjeeling teas from the mists of the Himalayas — first flush, second flush, autumnal flush, shipped garden-fresh.',
  alternates: {canonical: '/'},
  openGraph: {
    title: 'Misty Darjeeling Tea',
    description:
      'Single-estate Darjeeling teas from the mists of the Himalayas — first flush, second flush, autumnal flush, shipped garden-fresh.',
    url: '/',
    siteName: 'Misty Darjeeling Tea',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Misty Darjeeling Tea',
    description:
      'Single-estate Darjeeling teas from the mists of the Himalayas.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning data-astryx-theme="wada">
      <head>
        {/* §3.4 — CSP is delivered via <meta> on GitHub Pages (no custom HTTP
            headers). The tag is INJECTED POST-BUILD by
            scripts/inject-csp-meta.mjs — deliberately NOT rendered by React:
            a React-managed meta would be re-created at hydration from the RSC
            payload, replacing the hash-patched static tag (verified in QA).
            Never add 'unsafe-inline' to script-src. */}
        {/* §3.3 — blocking pre-paint theme resolution. Authorised in CSP by an
            auto-computed SHA-256 hash (§3.4); never add 'unsafe-inline'. */}
        <script dangerouslySetInnerHTML={{__html: THEME_SCRIPT}} />
      </head>
      <body>
        <ThemeModeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeModeProvider>
      </body>
    </html>
  );
}
