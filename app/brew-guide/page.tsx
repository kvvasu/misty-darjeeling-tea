import type {Metadata} from 'next';
import {Link as AstryxLink} from '@astryxdesign/core/Link';

export const metadata: Metadata = {
  title: 'Brew Guide',
  description:
    'Darjeeling is delicate. Water too hot or steep too long and the muscatel turns bitter. Two minutes of attention makes the whole tin.',
  alternates: {canonical: '/brew-guide/'},
};

const BASICS = [
  'Water: freshly boiled, then rested 2 minutes (about 85 °C)',
  'Leaf: 1 level teaspoon per cup',
  'Time: 3 minutes, covered',
  'Resteep: once, adding 1 minute',
];

const GUIDES = [
  {
    slug: 'first-flush',
    name: 'First Flush',
    text: 'Cooler water, shorter steep: 80 °C, 2½ minutes. No milk, ever — you paid for the aromatics; don\'t drown them.',
  },
  {
    slug: 'second-flush',
    name: 'Second Flush',
    text: '85 °C, 3 minutes. Take it plain first; a slice of lemon if you must. Stands one resteep.',
  },
  {
    slug: 'autumnal-flush',
    name: 'Autumnal Flush',
    text: '85 °C, 3–4 minutes. Rounded enough for a drop of milk if the evening asks for it.',
  },
];

export default function BrewGuidePage() {
  return (
    <main id="main" tabIndex={-1}>
      <h1>Brew Guide</h1>
      <p>
        Darjeeling is delicate. Water too hot or steep too long and the muscatel
        turns bitter. Two minutes of attention makes the whole tin.
      </p>

      <section aria-labelledby="basics">
        <h2 id="basics">The basics</h2>
        <ul>
          {BASICS.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {GUIDES.map(guide => (
        <section key={guide.slug} aria-labelledby={guide.slug}>
          <h2 id={guide.slug}>{guide.name}</h2>
          <p>{guide.text}</p>
        </section>
      ))}

      <p>
        <AstryxLink href="/teas/" isStandalone>
          Find your flush
        </AstryxLink>
      </p>
    </main>
  );
}
