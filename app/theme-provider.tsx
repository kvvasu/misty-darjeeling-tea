'use client';

/**
 * Client theme-mode provider (§3.3).
 *
 * Owns the visible light/dark state. The inline <head> script resolves the
 * initial mode pre-paint (localStorage → prefers-color-scheme) and sets
 * data-theme on <html>; this provider syncs React state to the DOM after
 * hydration, and the toggle writes localStorage + updates the attribute via
 * <Theme mode={...}> (Astryx Theme keeps data-theme and color-scheme in sync).
 */
import {createContext, useContext, useState, type ReactNode} from 'react';
// Subpath import — the root barrel pulls all 163 components into the client
// bundle (Lighthouse: 312 KiB unused JS). The theme subpath exports Theme,
// MediaTheme, and the theme authoring APIs without the component barrel.
import {Theme} from '@astryxdesign/core/theme';
import {wadaTheme} from '../theme/wada-theme';

type Mode = 'light' | 'dark';

const ModeContext = createContext<{mode: Mode; toggle: () => void}>({
  mode: 'light',
  toggle: () => {},
});

export const useThemeMode = () => useContext(ModeContext);

export function ThemeModeProvider({children}: {children: ReactNode}) {
  // Initial state is read from the DOM during the hydration render — BEFORE
  // any effects run. Reading in a useEffect would be too late: Astryx's
  // <Theme> child effect syncs data-theme from React state first, clobbering
  // the value the blocking <head> script set pre-paint (verified in QA).
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof document === 'undefined') return 'light';
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'dark' ? 'dark' : 'light';
  });

  const toggle = () => {
    setMode(m => {
      const next: Mode = m === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', next);
      } catch {}
      return next;
    });
  };

  return (
    <ModeContext.Provider value={{mode, toggle}}>
      {/* mode="system" is avoided deliberately: it removes data-theme, which
          would fight the pre-paint script. We always pass an explicit mode. */}
      <Theme theme={wadaTheme} mode={mode}>
        {children}
      </Theme>
    </ModeContext.Provider>
  );
}
