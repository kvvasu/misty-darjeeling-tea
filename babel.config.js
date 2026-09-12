const path = require('path');

/**
 * Babel config per @astryxdesign/build README (Next.js source build).
 * The Astryx babel plugin splits StyleX class prefixes: library classes
 * ('astryx') vs product classes ('x') so each lands in its own CSS layer.
 */
module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@astryxdesign/build/babel',
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
};
