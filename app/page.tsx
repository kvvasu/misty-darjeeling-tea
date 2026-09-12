import type {Metadata} from 'next';
import {Link as AstryxLink} from '@astryxdesign/core/Link';
import {MarqueeTicker} from '../components/MarqueeTicker';
import {HandDrawnEllipse} from '../components/HandDrawnEllipse';

export const metadata: Metadata = {
  title: 'Misty Darjeeling Tea',
  description:
    'Our garden sits at 1,800 metres in the Darjeeling Himalayas, where morning mist slows the leaf and concentrates the flavour.',
  alternates: {canonical: '/'},
};

const TICKER = [
  'First Flush: March–April',
  'Second Flush: May–June',
  'Autumnal Flush: October–November',
  'Single-estate · Single-origin',
  'Muscatel, moss, mist',
];

const STEPS = [
  'Pluck — two leaves and a bud, by hand',
  'Wither — 14 hours in open troughs',
  'Roll & fire — orthodox, small-batch',
  'Pack — lot-stamped tins, shipped weekly',
];

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1}>
      <h1>
        Misty Darjeeling Tea
        <HandDrawnEllipse width={220} />
      </h1>

      <MarqueeTicker items={TICKER} />

      <section aria-labelledby="home-intro">
        <h2 id="home-intro">Tea from above the clouds</h2>
        <p>
          Our garden sits at 1,800 metres in the Darjeeling Himalayas, where
          morning mist slows the leaf and concentrates the flavour. Every lot is
          plucked, rolled, and fired on the estate — then shipped direct,
          garden-fresh.
        </p>

        <h3>What we ship</h3>
        <ul>
          <li>First Flush — bright, floral, spring-green</li>
          <li>Second Flush — muscatel, ripe, amber</li>
          <li>Autumnal Flush — warm, honeyed, smooth</li>
        </ul>

        <h3>Why single estate</h3>
        <p>
          One garden, one maker, one ledger. The lot number on your tin is the
          same lot number in our withering house — no blending, no surprises.
        </p>

        <p>
          <AstryxLink href="/teas/" isStandalone>
            Explore our teas
          </AstryxLink>
          {' · '}
          <AstryxLink href="/estate/" isStandalone>
            Visit the estate
          </AstryxLink>
        </p>
      </section>

      <section aria-labelledby="home-process">
        <h2 id="home-process">From bush to cup in four steps</h2>
        <ol>
          {STEPS.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
