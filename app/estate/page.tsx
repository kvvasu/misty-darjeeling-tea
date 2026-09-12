import type {Metadata} from 'next';
import {Link as AstryxLink} from '@astryxdesign/core/Link';

export const metadata: Metadata = {
  title: 'Our Estate',
  description:
    'One garden on the ridgeline above the Rungbong valley. Sixty hectares of China bush and clonal tea, worked by families who have tended this slope for three generations.',
  alternates: {canonical: '/estate/'},
};

export default function EstatePage() {
  return (
    <main id="main">
      <h1>Our Estate</h1>
      <p>
        One garden on the ridgeline above the Rungbong valley. Sixty hectares of
        China bush and clonal tea, worked by families who have tended this slope
        for three generations.
      </p>

      <section aria-labelledby="the-garden">
        <h2 id="the-garden">The garden</h2>
        <p>
          Terraced rows climb from 1,400 to 1,900 metres. The mist that gives
          the tea its name also slows growth — slower leaf, denser flavour.
        </p>
      </section>

      <section aria-labelledby="how-we-make-tea">
        <h2 id="how-we-make-tea">How we make tea</h2>
        <p>
          Orthodox, small-batch, whole-leaf. Withering overnight, rolled gently,
          fired in small drums the same day. No CTC, no blends, no flavourings.
        </p>
      </section>

      <section aria-labelledby="people-and-practice">
        <h2 id="people-and-practice">People and practice</h2>
        <p>
          Pluckers are employed year-round, housing and schooling included.
          Third of the garden is under shade trees; the rest is rain-fed.
        </p>
      </section>

      <p>
        <AstryxLink href="/teas/" isStandalone>
          Taste the difference
        </AstryxLink>
        {' · '}
        <AstryxLink href="/contact/" isStandalone>
          Plan a visit
        </AstryxLink>
      </p>
    </main>
  );
}
