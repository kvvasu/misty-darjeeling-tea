import {Link as AstryxLink} from '@astryxdesign/core/Link';
import {withBasePath} from '../lib/base-path';

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1}>
      <h1>Page not found</h1>
      <p>That page has wandered off into the mist. Try one of these instead:</p>
      <p>
        <AstryxLink href={withBasePath('/')} isStandalone>
          Back to home
        </AstryxLink>
        {' · '}
        <AstryxLink href={withBasePath('/teas/')} isStandalone>
          Browse our teas
        </AstryxLink>
      </p>
    </main>
  );
}
