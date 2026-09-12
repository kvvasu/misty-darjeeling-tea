'use client';

import Link from 'next/link';
import {Link as AstryxLink} from '@astryxdesign/core/Link';
import {IconButton} from '@astryxdesign/core/IconButton';
import {useThemeMode} from '../app/theme-provider';

/**
 * Site header + footer. Astryx primitives (Link, IconButton) for all
 * interactive elements. Header is NOT sticky (SC 2.4.11 by construction).
 */

const NAV = [
  {href: '/teas/', label: 'Our Teas'},
  {href: '/estate/', label: 'Our Estate'},
  {href: '/brew-guide/', label: 'Brew Guide'},
  {href: '/contact/', label: 'Contact'},
];

const SunIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoonIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

function ThemeToggle() {
  const {mode, toggle} = useThemeMode();
  return (
    <IconButton
      label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      icon={mode === 'light' ? MoonIcon : SunIcon}
      variant="ghost"
      size="md"
      aria-pressed={mode === 'dark'}
      onClick={toggle}
    />
  );
}

export function SiteHeader() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header>
        <nav aria-label="Primary">
          <Link href="/" style={{fontWeight: 700}}>
            Misty Darjeeling Tea
          </Link>
          <ul style={{display: 'flex', gap: 'var(--spacing-5)', listStyle: 'none'}}>
            {NAV.map(item => (
              <li key={item.href}>
                <AstryxLink href={item.href}>{item.label}</AstryxLink>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <p>© Misty Darjeeling Tea · Singbulli Road, Darjeeling district, West Bengal, India</p>
      <p>
        <AstryxLink href="/contact/">Contact</AstryxLink>
      </p>
    </footer>
  );
}
