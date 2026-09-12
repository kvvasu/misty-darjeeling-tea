import {defineConfig} from '@playwright/test';

// Mirrors next.config.mjs: GitHub Pages project site serves under a basePath.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/misty-darjeeling-tea';

// GitHub Pages maps the deploy artifact at <project-url>/ (i.e. out/index.html
// IS served at /misty-darjeeling-tea/). Emulate exactly: stage out/* under a
// directory named for the base path and serve its parent.
const STAGE = `.qa-stage${BASE_PATH.replaceAll('/', '-')}`;
const stageAndServe =
  BASE_PATH && BASE_PATH !== '/'
    ? `sh -c "rm -rf ${STAGE} && mkdir -p ${STAGE}${BASE_PATH} && cp -r out/* ${STAGE}${BASE_PATH}/ && npx --yes serve ${STAGE} -l 4173"`
    : 'npx --yes serve out -l 4173';

export default defineConfig({
  testDir: '.',
  testMatch: 'qa-*.spec.ts',
  use: {
    baseURL: `http://127.0.0.1:4173${BASE_PATH}`,
  },
  webServer: {
    command: stageAndServe,
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  retries: 0,
  reporter: [['list'], ['json', {outputFile: 'qa/test-results/playwright-report.json'}]],
});
