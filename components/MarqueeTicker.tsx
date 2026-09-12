import {create as style, props} from '@stylexjs/stylex';

/**
 * MarqueeTicker — CUSTOM component (§3.6 gap record in docs/ARCHITECTURE.md).
 * Astryx has no marquee primitive (verified against the 163-component inventory).
 *
 * Accessibility: the moving track is aria-hidden; a visually-hidden static list
 * carries the content for screen readers. `prefers-reduced-motion: reduce`
 * disables the animation (see app/globals.css `[data-marquee-track]`).
 *
 * Loop: the component self-serialises its content — the author passes each
 * item ONCE; the aria-hidden track repeats it for seamlessness.
 * The track animation lives in app/globals.css (project layer, token-only).
 */
const styles = style({
  root: {
    overflow: 'hidden',
    width: '100%',
    borderTopWidth: '1px',
    borderStyle: 'solid',
    borderBottomWidth: '1px',
    borderColor: 'var(--color-border-subtle)',
    backgroundColor: 'var(--color-surface-sunken)',
    padding: 'var(--spacing-2) 0',
  },
  item: {
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.08em',
  },
});

const STATIC_LIST = 'visually-hidden';

export function MarqueeTicker({items}: {items: string[]}) {
  const doubled = [...items, ...items];
  return (      <div {...props(styles.root)}>
      {/* Screen-reader content: static list, announced once */}
      <ul className={STATIC_LIST}>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {/* Visual loop: duplicated + aria-hidden; animation in globals.css */}
      <div data-marquee-track aria-hidden="true">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} {...props(styles.item)}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
