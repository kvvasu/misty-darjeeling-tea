import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'qa-*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'npx --yes serve out -l 4173',
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  retries: 0,
  reporter: [['list'], ['json', {outputFile: 'qa/test-results/playwright-report.json'}]],
});
