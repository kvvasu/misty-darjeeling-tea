import nextTs from 'eslint-config-next/typescript';

export default [
  ...nextTs,
  {
    ignores: ['out/**', '.next/**', 'node_modules/**', 'qa/**', 'logs/**', 'theme/template-out.css', '.qa-stage*/**', 'gh-pages-stage/**', 'test-results/**', 'playwright-report/**'],
  },
  {
    // CommonJS build-config files legitimately use require()
    files: ['babel.config.js', 'postcss.config.js', 'next.config.mjs'],
    rules: {'@typescript-eslint/no-require-imports': 'off'},
  },
  {
    // Node scripts: unused imports tolerated while iterating, but keep it clean
    files: ['scripts/**/*.mjs'],
    rules: {'@typescript-eslint/no-unused-vars': 'off'},
  },
];
