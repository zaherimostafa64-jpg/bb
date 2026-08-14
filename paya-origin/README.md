# PAYA ORIGIN — Website

Next.js implementation of the PAYA ORIGIN site: an agricultural sourcing,
quality and export partner presented as a commercial specification interface
rather than a brochure.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hero → commercial idea → categories → signature products → origin → model → quality → markets → CTA |
| `/products` | The full portfolio (40 lines in 3 categories) plus the harvest calendar |
| `/products/[slug]` | Product specification page — origin, season, varieties, spec, packaging, markets |
| `/origins` | Five sourcing regions, the per-line sourcing footprint, the harvest calendar |
| `/how-we-work` | The sourcing problem, the five-stage model, quality verification, packaging, engagement |
| `/company` | Company, at a glance, scope of responsibility, markets, commercial terms |
| `/contact` | The inquiry experience — "Send your requirement" |

`/who-we-are`, `/what-we-do` and `/how-we-build-trust` from the previous site
301-redirect to `/company`, `/products` and `/how-we-work`.

## Stack

- Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4
- Framer Motion for one reveal primitive (`components/motion/Reveal.tsx`)
- Self-hosted variable fonts: Manrope (display) + Inter (body) via Fontsource
- No 3D, no charting library, no icon set — structure and photography carry
  the design

## Where the content comes from

Every commercial value on the site is transcribed from an approved source and
nothing is inferred:

| File | Source |
| --- | --- |
| `lib/products.ts` | Fresh Produce Catalogue (Edition 01) · Dry Fruits & Nuts Catalogue (v1.0) |
| `lib/origins.ts` | Corporate Profile 2026, §08 · Fresh Produce Catalogue sourcing footprint |
| `lib/harvest.ts` | Product-page seasons, with storage extensions from Corporate Profile §09 |
| `lib/company.ts` | Corporate Profile 2026, §01–14 |
| `lib/site.ts` | Corporate Profile and both catalogues (contact details) |

Rules the data layer enforces:

- A field with no confirmed value is **not rendered**. Buyer-set fields are
  listed under `specifiedToRequirement` instead of being given a plausible
  default.
- Where a source flags a value as unconfirmed (saffron grade, the Astaneh
  peanut growing area), it is carried as a `sourceNote` and not printed as
  specification.
- Per-product export markets appear only for lines whose catalogue page states
  them.
- The harvest calendar reads the same season data the product pages use, so
  the two can never drift apart.

## Photography

All imagery is extracted from the approved PAYA ORIGIN catalogues and the
Corporate Profile. Images are never used to imply a fact that is not verified:
photographs on `/origins` carry captions stating what they actually show
rather than asserting a province, and only the Kerman pistachio harvest is
captioned with a location, because the Corporate Profile captions it that way.

## Running it locally

Requires Node.js 20+.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (51 static routes)
npm run lint
```

## Conventions

- `lib/` holds data only; `components/` holds presentation; `sections/` holds
  page-specific compositions.
- One CTA component and one wording — "Send your requirement" — wherever
  commercial intent is high. Secondary actions stay visually quiet.
- Each Button variant owns its own display/size/type utilities; utilities are
  never split between a shared base and a variant, because competing classes
  resolve by stylesheet order rather than authoring order.
- Wide content (the harvest calendar) scrolls inside its own container; the
  page never scrolls horizontally.
