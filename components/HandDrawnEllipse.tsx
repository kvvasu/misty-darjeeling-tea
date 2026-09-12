import {create as style, props} from '@stylexjs/stylex';

/**
 * HandDrawnEllipse — decorative custom component (§3.6 gap record). Astryx
 * correctly has no primitive for a decorative hand-drawn ink mark — it is not
 * an interactive or content component. aria-hidden, inline SVG, no fetch.
 */
const styles = style({
  root: {
    position: 'absolute',
    pointerEvents: 'none',
    color: 'var(--color-accent)',
    opacity: 0.55,
  },
});

export function HandDrawnEllipse({width = 260}: {width?: number}) {
  const height = Math.round(width * 0.32);
  return (
    <span {...props(styles.root)} aria-hidden="true">
      <svg
        width={width}
        height={height}
        viewBox="0 0 260 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M128 10 C 196 8, 248 26, 250 43 C 252 62, 190 76, 124 75 C 60 74, 10 58, 12 41 C 14 24, 74 12, 138 11"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
