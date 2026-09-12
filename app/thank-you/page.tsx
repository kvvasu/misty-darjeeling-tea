import type {Metadata} from 'next';
import {Link as AstryxLink} from '@astryxdesign/core/Link';

export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Your message is in our inbox.',
  alternates: {canonical: '/thank-you/'},
  robots: {index: false},
};

export default function ThankYouPage() {
  return (
    <main id="main">
      <h1>Thank you</h1>
      <p>
        Your message is in our inbox. We reply within two working days —
        usually faster, when the mist lifts.
      </p>
      <p>
        <AstryxLink href="/" isStandalone>
          Back to home
        </AstryxLink>
      </p>
    </main>
  );
}
