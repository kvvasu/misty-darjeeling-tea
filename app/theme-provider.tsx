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
import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {Theme} from '@astryxdesign/core';
import {wadaTheme} from '../theme/wada-theme';

type Mode = 'light' | 'dark';

const ModeContext = createContext<{mode: Mode; toggle: () => void}>({
  mode: 'light',
  toggle: () => {},
});

export const useThemeMode = () => useContext(ModeContext);

export function ThemeModeProvider({children}: {children: ReactNode}) {
  const [mode, setMode] = useState<Mode>('light');

  // Adopt whatever the blocking script already resolved on <html>.
  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') setMode(attr);
  }, []);

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
