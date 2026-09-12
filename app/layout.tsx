import type {Metadata} from 'next';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import '@fontsource/caveat/latin-400.css';
import './globals.css';
import {ThemeModeProvider} from './theme-provider';
import {THEME_SCRIPT} from './theme-script';
import {SiteHeader, SiteFooter} from '../components/SiteChrome';

export const metadata: Metadata = {
  metadataBase: new URL('https://misty-darjeeling-tea.netlify.app'),
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
