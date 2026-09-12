import type {Metadata} from 'next';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import '@fontsource/caveat/latin-400.css';
import './globals.css';
import {ThemeModeProvider} from './theme-provider';
import {THEME_SCRIPT} from './theme-script';

export const metadata: Metadata = {
  title: 'Misty Darjeeling Tea',
  description: 'Single-estate Darjeeling teas from the mists of the Himalayas.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* §3.3 — blocking pre-paint theme resolution. Authorised in CSP by an
            auto-computed SHA-256 hash (§3.4); never add 'unsafe-inline'. */}
        <script dangerouslySetInnerHTML={{__html: THEME_SCRIPT}} />
      </head>
      <body>
        <ThemeModeProvider>{children}</ThemeModeProvider>
      </body>
    </html>
  );
}
