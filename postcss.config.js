const path = require('path');

/**
 * PostCSS pipeline:
 * 1. @astryxdesign/build/postcss — compiles StyleX from Astryx library source
 *    AND product source, emitting each into its own @layer
 *    (astryx-base / product). Triggered by the `@stylex;` at-rule.
 * 2. @tailwindcss/postcss — Tailwind v4 (theme/preflight/utilities imports
 *    in app/globals.css are assigned to explicit layers there).
 */
module.exports = {
  plugins: {
    '@astryxdesign/build/postcss': {
      appDir: 'app',
      babelPlugins: [
        [
          '@stylexjs/babel-plugin',
          {
            dev: process.env.NODE_ENV !== 'production',
            runtimeInjection: false,
            treeshakeCompensation: true,
            enableInlinedConditionalMerge: true,
            aliases: {
              '@astryxdesign/core/*': [
                path.join(__dirname, 'node_modules/@astryxdesign/core/*'),
              ],
              '@astryxdesign/core': [
                path.join(__dirname, 'node_modules/@astryxdesign/core'),
              ],
            },
            unstable_moduleResolution: {type: 'commonJS'},
          },
        ],
      ],
    },
    '@tailwindcss/postcss': {},
  },
};
