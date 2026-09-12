import type {Metadata} from 'next';
import {ContactForm} from '../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Questions about lots, shipping, or wholesale? Write to us — a human reads every message.',
  alternates: {canonical: '/contact/'},
};

export default function ContactPage() {
  return (
    <main id="main">
      <h1>Contact</h1>
      <p>
        Questions about lots, shipping, or wholesale? Write to us — a human
        reads every message.
      </p>

      <section aria-labelledby="write-to-us">
        <h2 id="write-to-us">Write to us</h2>
        <ContactForm />
      </section>

      <section aria-labelledby="elsewhere">
        <h2 id="elsewhere">Elsewhere</h2>
        <ul>
          <li>Estate office: Singbulli Road, Darjeeling district, West Bengal, India</li>
          <li>Visits: by appointment, March to November</li>
        </ul>
      </section>
    </main>
  );
}
