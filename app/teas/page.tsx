import type {Metadata} from 'next';
import {Link as AstryxLink} from '@astryxdesign/core/Link';
import {Card} from '@astryxdesign/core/Card';

export const metadata: Metadata = {
  title: 'Our Teas',
  description:
    'Every tea we sell is grown, made, and packed on one estate. Flushes are seasonal; stock is honest.',
  alternates: {canonical: '/teas/'},
};

const TEAS = [
  {
    slug: 'first-flush',
    name: 'First Flush',
    notes:
      'Picked March to April at 1,800 m. Loose, leafy, and light-cupped — a green-gold liquor with cut-grass and almond blossom notes.',
  },
  {
    slug: 'second-flush',
    name: 'Second Flush',
    notes:
      'Picked May to June. The classic muscatel Darjeeling: ripe grape, stone fruit, and a warm amber cup that stands up to a second infusion.',
  },
  {
    slug: 'autumnal-flush',
    name: 'Autumnal Flush',
    notes:
      "Picked October to November after the rains retreat. Rounder and honeyed, with a smooth copper liquor — the connoisseur's quiet season.",
  },
];

const COMMON = ['50 g tin', 'Lot-stamped and dated', 'Plucked by hand'];

export default function TeasPage() {
  return (
    <main id="main">
      <h1>Our Teas</h1>
      <p>
        Every tea we sell is grown, made, and packed on one estate. Flushes are
        seasonal; stock is honest.
      </p>

      {TEAS.map(tea => (
        <Card key={tea.slug}>
          <section aria-labelledby={tea.slug}>
            <h2 id={tea.slug}>{tea.name}</h2>
            <p>{tea.notes}</p>
            <ul>
              {COMMON.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </Card>
      ))}

      <section aria-labelledby="how-to-choose">
        <h2 id="how-to-choose">How to choose</h2>
        <p>
          New to Darjeeling? Start with Second Flush for the famous muscatel
          character. Drinking green-leaning, delicate cups? First Flush. After
          something rounder for evenings? Autumnal.
        </p>
        <p>
          <AstryxLink href="/contact/" isStandalone>
            Ask us for a recommendation
          </AstryxLink>
        </p>
      </section>
    </main>
  );
}
