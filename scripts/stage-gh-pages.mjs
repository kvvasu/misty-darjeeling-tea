/**
 * Stages the static export exactly as GitHub Pages serves a project site:
 * out/* becomes gh-pages-stage/misty-darjeeling-tea/, so pages appear at
 * /misty-darjeeling-tea/... and /misty-darjeeling-tea/_next/... asset URLs
 * resolve — identical to the production URL shape. Used before Lighthouse CI
 * runs (Playwright's config performs its own equivalent staging).
 */
import {cpSync, rmSync, mkdirSync} from 'node:fs';

const REPO = 'misty-darjeeling-tea';
const STAGE = 'gh-pages-stage';

rmSync(STAGE, {recursive: true, force: true});
mkdirSync(`${STAGE}/${REPO}`, {recursive: true});
cpSync('out', `${STAGE}/${REPO}`, {recursive: true});
console.log(`[stage-gh-pages] staged out/ at ${STAGE}/${REPO}/`);
