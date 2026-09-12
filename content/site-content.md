# Misty Darjeeling Tea — Site Content (single source of truth)

> Route map derived from this hierarchy (H1 = one per page):
> `/` Home · `/teas` Our Teas · `/estate` Our Estate · `/brew-guide` Brew Guide · `/contact` Contact · `/thank-you` (form success) · `404`
>
> Status: DRAFTED by the build agent per user approval (2026-09-12) — original
> preflight check #7 found this file missing. Tracked in REPORT.md under Copy
> Requested / tooling notes. All copy below is used verbatim by the site.

---

## Page: Home (`/`)

### H1: Misty Darjeeling Tea

Marquee ticker items:
- First Flush: March–April
- Second Flush: May–June
- Autumnal Flush: October–November
- Single-estate · Single-origin
- Muscatel, moss, mist

#### H2: Tea from above the clouds

Our garden sits at 1,800 metres in the Darjeeling Himalayas, where morning
mist slows the leaf and concentrates the flavour. Every lot is plucked, rolled,
and fired on the estate — then shipped direct, garden-fresh.

##### H3: What we ship

- First Flush — bright, floral, spring-green
- Second Flush — muscatel, ripe, amber
- Autumnal Flush — warm, honeyed, smooth

##### H3: Why single estate

One garden, one maker, one ledger. The lot number on your tin is the same lot
number in our withering house — no blending, no surprises.

[Button: Explore our teas] → /teas
[Button: Visit the estate] → /estate

#### H2: From bush to cup in four steps

1. Pluck — two leaves and a bud, by hand
2. Wither — 14 hours in open troughs
3. Roll & fire — orthodox, small-batch
4. Pack — lot-stamped tins, shipped weekly

---

## Page: Our Teas (`/teas`)

### H1: Our Teas

Every tea we sell is grown, made, and packed on one estate. Flushes are
seasonal; stock is honest.

#### H2: First Flush

Picked March to April at 1,800 m. Loose, leafy, and light-cupped — a green-gold
liquor with cut-grass and almond blossom notes.

- 50 g tin
- Lot-stamped and dated
- Plucked by hand

#### H2: Second Flush

Picked May to June. The classic muscatel Darjeeling: ripe grape, stone fruit,
and a warm amber cup that stands up to a second infusion.

- 50 g tin
- Lot-stamped and dated
- Plucked by hand

#### H2: Autumnal Flush

Picked October to November after the rains retreat. Rounder and honeyed, with a
smooth copper liquor — the connoisseur's quiet season.

- 50 g tin
- Lot-stamped and dated
- Plucked by hand

#### H2: How to choose

New to Darjeeling? Start with Second Flush for the famous muscatel character.
Drinking green-leaning, delicate cups? First Flush. After something rounder for
evenings? Autumnal.

[Button: Ask us for a recommendation] → /contact

---

## Page: Our Estate (`/estate`)

### H1: Our Estate

One garden on the ridgeline above the Rungbong valley. Sixty hectares of China
bush and clonal tea, worked by families who have tended this slope for three
generations.

#### H2: The garden

Terraced rows climb from 1,400 to 1,900 metres. The mist that gives the tea
its name also slows growth — slower leaf, denser flavour.

#### H2: How we make tea

Orthodox, small-batch, whole-leaf. Withering overnight, rolled gently, fired in
small drums the same day. No CTC, no blends, no flavourings.

#### H2: People and practice

Pluckers are employed year-round, housing and schooling included. Third of the
garden is under shade trees; the rest is rain-fed.

[Button: Taste the difference] → /teas
[Button: Plan a visit] → /contact

---

## Page: Brew Guide (`/brew-guide`)

### H1: Brew Guide

Darjeeling is delicate. Water too hot or steep too long and the muscatel turns
bitter. Two minutes of attention makes the whole tin.

#### H2: The basics

- Water: freshly boiled, then rested 2 minutes (about 85 °C)
- Leaf: 1 level teaspoon per cup
- Time: 3 minutes, covered
- Resteep: once, adding 1 minute

#### H2: First Flush

Cooler water, shorter steep: 80 °C, 2½ minutes. No milk, ever — you paid for
the aromatics; don't drown them.

#### H2: Second Flush

85 °C, 3 minutes. Take it plain first; a slice of lemon if you must. Stands one
resteep.

#### H2: Autumnal Flush

85 °C, 3–4 minutes. Rounded enough for a drop of milk if the evening asks for
it.

[Button: Find your flush] → /teas

---

## Page: Contact (`/contact`)

### H1: Contact

Questions about lots, shipping, or wholesale? Write to us — a human reads every
message.

#### H2: Write to us

Form fields:
- Name (text, required)
- Email (email, required)
- Topic (select: General question / Wholesale / Press / Visit the garden)
- Message (textarea, required, max 1000 characters)

[Button: Send message] → POST to Netlify Forms → /thank-you

Form microcopy (framework-required, used verbatim):
- Field error (name): "Please tell us your name."
- Field error (email): "Please enter a valid email address."
- Field error (message): "Please write a short message."
- Time-trap rejection: "That was too quick for a human — please try again."
- Send failure: "Something went wrong sending your message. Please try again."
- Submitting state: "Sending…"
- No-JS fallback: "This form needs JavaScript. Prefer post? Write to us: Singbulli Road, Darjeeling district, West Bengal, India."

#### H2: Elsewhere

- Estate office: Singbulli Road, Darjeeling district, West Bengal, India
- Visits: by appointment, March to November

---

## Page: Thank you (`/thank-you`)

### H1: Thank you

Your message is in our inbox. We reply within two working days — usually
faster, when the mist lifts.

[Button: Back to home] → /

---

## Page: Not found (`404`)

### H1: Page not found

That page has wandered off into the mist. Try one of these instead:

[Button: Back to home] → /
[Button: Browse our teas] → /teas
