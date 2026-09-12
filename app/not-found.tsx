import {Link as AstryxLink} from '@astryxdesign/core/Link';

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1}>
      <h1>Page not found</h1>
      <p>That page has wandered off into the mist. Try one of these instead:</p>
      <p>
        <AstryxLink href="/" isStandalone>
          Back to home
        </AstryxLink>
        {' · '}
        <AstryxLink href="/teas/" isStandalone>
          Browse our teas
        </AstryxLink>
      </p>
    </main>
  );
}
