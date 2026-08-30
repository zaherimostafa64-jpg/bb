# PAYA ORIGIN — Corporate Profile 2026

A 20-page A4 corporate profile, built as HTML/CSS and rendered to PDF by
headless Chromium.

**Outputs**

| File | What it is |
|---|---|
| `dist/PAYA-ORIGIN-Company-Profile-2026.pdf` | The profile. This is the master. |
| `dist/…-layout.docx` | Word, layout-faithful: each page placed as a full-bleed A4 picture. Looks identical, text not editable. |
| `dist/…-editable.docx` | Word, re-authored natively: real headings, tables and pictures. Fully editable, flows like a Word document. |
| `dist/PAYA-ORIGIN-Iranian-Fresh-Green-Kiwi-2026.pdf` | 19-page product catalogue for Hayward kiwi, EU market. Built from the Rev. 2 technical specification and the four-language export summary. |
| `dist/PAYA-ORIGIN-Iranian-Fresh-Apples-2026.pdf` | 19-page export catalogue for five apple varieties, EU market. |
| `dist/PAYA-ORIGIN-Iranian-Pomegranates-2026.pdf` | 17-page export catalogue for five pomegranate varieties, EU market. Dark-first, image-led. |
| `dist/PAYA-ORIGIN-Company-Paper-2026.pdf` | 10-page company paper: the whole story — company, categories, and the three product lines — condensed from the profile and the three catalogues. |

The art-direction review that produced this edition — including what was wrong
with the previous profile and what to confirm before it goes to buyers — is in
[`REVIEW.md`](REVIEW.md).

---

## Layout

```
design/
  profile.html        corporate profile — one <section class="page"> per page
  kiwi.html           kiwi product catalogue
  apples.html         apple export catalogue
  pomegranate.html    pomegranate export catalogue
  papersheet.html     10-page company paper
  styles.css          the design system: tokens, archetypes, components
  catalogue.css       shared catalogue components (gauges, cold-chain plot,
                      traceability chain, carton label, spec strips)
  kiwi.css            kiwi-only additions
  apples.css          apple-only additions (variety plate, harvest calendar,
                      benchmark chart, master data sheet)
  pomegranate.css     pomegranate-only additions (dark palette, variety colour
                      band, range charts, profile picker)
  papersheet.css      company-paper additions (fact row, variety row, packing
                      figure, calibre table, contact block)
  fonts/              Fraunces, Inter Tight, IBM Plex Mono (self-hosted woff2)
  assets/             art-directed images, logo colourways, map geometry
build/
  source-images/      raw image library, untouched
  prepare_assets.py   source-images -> design/assets
  render.mjs          design/profile.html -> dist/*.pdf, with an overflow audit
  qa.py               rasterise the built PDF for visual review
  sheet.py            side-by-side review sheet of named pages
dist/
  PAYA-ORIGIN-Company-Profile-2026.pdf
```

## Build

Requires Python (Pillow, PyMuPDF) and Node with Playwright's Chromium.

```bash
python3 build/prepare_assets.py     # raw library -> art-directed assets
node    build/render.mjs            # -> every document in dist/
node    build/render.mjs kiwi       # -> just the kiwi catalogue
python3 build/prepare_apples.py     # apple photography -> design/assets/apples
node    build/render.mjs apples     # -> just the apple catalogue
python3 build/prepare_pomegranate.py   # pomegranate photography, with dpi report
node    build/render.mjs pomegranate
node    build/render.mjs papersheet    # the 10-page company paper

python3 build/pdf-to-pages.py 170   # page rasters for the layout export
node    build/docx-layout.mjs       # -> dist/*-layout.docx
python3 build/word-figures.py       # crops the map plate out of the PDF
node    build/docx-editable.mjs     # -> dist/*-editable.docx
python3 build/verify-docx.py dist/…docx
```

`render.mjs` prints the page count, the file size, any console errors, and an
**overflow audit** — every element that spills outside its page box, with the
page number and how far it overruns. A clean build reports `overflow: none`.

## Reviewing changes

```bash
python3 build/qa.py 150            # build/qa/profile/pNN.png + a contact sheet
python3 build/qa.py kiwi 150       # same for the kiwi catalogue
python3 build/qa.py pomegranate 150
python3 build/qa.py papersheet 150
python3 build/sheet.py 11 12       # build/qa/sheet.png comparing named pages
python3 build/sheet.py kiwi 5 6    # ditto, from the kiwi catalogue
```

Review the rasterised **PDF**, not the browser preview — the PDF is the artifact
that ships, and print rendering differs from screen.

## Editing

- **Content** lives in `design/profile.html`. Each page is a `<section class="page">`
  with a `data-archetype` attribute recording which composition it uses.
- **Type, colour and components** live in `design/styles.css`. Change tokens in
  `:root` rather than hard-coding values in the HTML.
- **Images**: add the raw file to `build/source-images/`, then give it a
  `specimen(...)` or `scene(...)` line in `prepare_assets.py`. Do not reference
  raw sources from the HTML — every image in the document goes through the
  asset script so the grade and crop stay consistent.
- **The map** outline is vector geometry in `design/assets/iran-path.js`,
  normalised to a 1000 × 905.8 box. Origin pins are plotted from latitude and
  longitude; the mapping is documented in the page's comments.

## The kiwi catalogue

`design/kiwi.html` is a technical product catalogue, a different genre from the
corporate profile. It inherits the design system unchanged — page furniture,
palette, typefaces, page mark — and adds instrumentation in `kiwi.css`: a weight
chart, maturity gauges on real axes, a cold-chain plot and a carton label mock-up.

Two decisions worth keeping:

- **The document argues with data, not photography.** There is exactly one kiwi
  photograph in the asset library, so the pages are built from charts, tables and
  line-art diagrams instead of padded with images that say nothing. Packaging
  formats are drawn, not photographed, because the only carton photographs on
  file are of other products.
- **Every figure traces to the Rev. 2 specification.** Where the specification
  leaves something open — carton dimensions, cartons per container, final
  acceptance limits — the catalogue carries it through as open rather than
  filling in a plausible number.

The calibre page started as discs scaled by fruit weight. Across a 65–125 g
range no honest encoding separates nine steps enough to read, so it became a
weight axis with the three class thresholds drawn on it — which also shows
*why* calibres 54 and 60 are Class II, rather than just asserting it.

## The apple catalogue

Five varieties — Gala, Golden Delicious, Red Delicious, Granny Smith, Fuji —
built from the client's raw data sheet. Unlike the kiwi catalogue this one has
real photography for every variety, so it is photographic where the kiwi one is
diagrammatic.

Decisions worth keeping:

- **Cutouts, not frame-filling crops.** `prepare_apples.py` lifts each fruit off
  its studio sweep onto the paper tone. Shape and colour coverage are both
  specification fields for apples, so the silhouette has to survive; a
  frame-filling crop destroys exactly what the page is selling.
- **Pages 05–09 are deliberately identical.** They are read against each other,
  so comparability beats variation. The pages around them carry the rhythm.
- **The packing formats are drawn, not photographed.** Two of the three packed
  photographs on file carry another company's labels on every fruit. One
  sticker-free carton is shown as a figure; the formats themselves are line art.
- **The source's own caveats are carried through**, not tidied away: the sizing
  table is marked a working specification pending PAYA's sorting data, Brix and
  firmness are indicative benchmarks, and the class definitions are flagged for
  alignment with UNECE FFV-50 before issue.

A second photo delivery closed the Fuji gap — all five varieties now have a
studio cutout — and brought 2000–3000 px plate material, which is what makes
the full-bleed pages possible at print resolution rather than only on screen.
Every page in the catalogue now carries a photograph, and no scene photograph
is used twice. The five cutouts appear twice each by design: once on the
comparison plate, once on the variety's own page.

**One file was deleted rather than used.** `123f.jpg` in the second delivery is
a watermarked Unsplash+ preview with "unsplash+" tiled across the frame. It was
the best mixed green-and-red mass in the set and had been placed as a full-bleed
plate before the watermark was spotted at full resolution. A comp file cannot go
into a client's catalogue — the watermark means the licence has not been bought
— so it is deleted, not retouched, and the plate was rebuilt from a clean frame.
Every other image in both deliveries was checked at 1:1 and is clean.

Still outstanding: photography of PAYA's own packing line.

## The pomegranate catalogue

Five varieties — Saveh, Neyriz, Ferdows, Yazd, Badrud. The brief for this one
was explicitly bold and image-led, so it breaks the house pattern on purpose:
**dark-first**, near-black and deep crimson carrying most of the document, cream
appearing twice as a deliberate flip for the data pages, and display type two to
three times larger than anywhere else in the range.

Pomegranate is the only product here whose colour can hold a page on its own.
That is the whole argument for the treatment — and it is also what makes the
pages work at the resolutions this library actually has, because **a colour
field costs no pixels**.

Decisions worth keeping:

- **Resolution governs placement, and is printed.** `prepare_pomegranate.py`
  reports the effective dpi of every asset at the width it is placed at, so the
  decision is checkable rather than assumed. Only three frames in the library
  hold up full-bleed at A4; everything else is bounded. A floor-to-ceiling
  half-page column was the first idea for the variety pages and it fails on
  arithmetic — cropping a 525 × 700 frame to 105 : 297 leaves 247 px of width,
  which is 60 dpi. Nothing in the document runs below 137 dpi.
- **The variety band is a colour field beside the photograph**, not a photograph
  with space next to it. That is the same resolution decision made visible: the
  band is full width, the picture only occupies as much of it as it can fill at
  print resolution, and the rest is the variety's own colour.
- **The cover photograph is a light studio frame**, so type set over it is
  unreadable in any colour. It runs as a band with the title on solid ink
  beneath it, rather than the picture being darkened to rescue the type.
- **Two source files were deleted rather than used.** `badrud-market.jpg` is a
  press-agency frame with "IMNA IMAGES" burnt in; `ferdows-hand.jpg` carries
  another pomegranate exporter's logotype. Three more are kept but never placed
  because every fruit in them wears another company's sticker. Same rule as the
  watermarked Unsplash+ file in the apple catalogue: a watermark means the
  licence was not bought, and retouching it out does not buy one.

**Two gaps to close with photography**, both flagged by the asset script on
every run:

1. **Yazd has no photography at all.** Its variety page uses a general frame,
   captioned as illustrative on the page itself. Yazd is the one variety sold on
   being visibly larger and lighter in skin colour than the rest, so it is the
   variety a photograph would do the most work for.
2. **There is no grading, sorting or packhouse photography.** One file arrived
   named `ferdows-packhouse.jpg` and is a picture of fruit on a tree. The quality
   page therefore argues from the orchard and from packed fruit, and claims
   nothing about a line nobody has photographed.

## The company paper

`design/papersheet.html` is a ten-page condensation, not a fifth catalogue:
company and model (01–02), the three product categories (03–04), then two pages
each on apples, pomegranates and kiwi (05–10), closing on contact details.
It is aimed at a reader who has one sitting to understand the whole business.

- **No new claims.** Every figure comes from the corporate profile or one of the
  three catalogues, and each product section ends with a rail naming the
  catalogue that carries the full specification.
- **The source's caveats travel with the figures.** The apple sizing table is
  still marked a working specification pending PAYA's sorting data; the kiwi
  weight bands are still indicative pending the packing-house calibration
  record; pomegranate calibre is still set with the order, not published.
- **The packaging photography is the branded set** — bulk nut carton, retail
  presentation, ventilated fruit carton, vegetable carton — plus one
  sticker-free apple carton and the netted pomegranate pack.
- **The one kiwi photograph appears once.** The space a second crop of it would
  have filled carries the calibre-to-class table instead; a summary that shows
  the same fruit twice is padding.

## The Word exports

Word cannot reproduce an absolutely-positioned print canvas, so there are two
exports rather than one compromise:

- **layout** — 20 page images at exactly 210 × 297 mm, anchored to the page and
  set behind the text layer. An *inline* image at full page size fights the
  paragraph mark and spills a blank page after each one; anchoring avoids that.
  Note that docx-js sizes images in **pixels at 96 dpi**, not points.
- **editable** — the same content rebuilt in Word's idiom. Typefaces fall back
  to Georgia / Calibri / Consolas, which ship with Office; Fraunces, Inter Tight
  and IBM Plex Mono will not be on a recipient's machine. The harvest calendar
  is a real table with per-cell shading, so it stays editable.

`build/verify-docx.py` checks page geometry, that every image reference resolves
to a media part that exists, and that pandoc — a strict independent reader — can
parse the file. LibreOffice is not usable in this container (it fails to load
even a plain text file), so the exports have not been through a visual render in
a word processor; verify them once in Word before sending to a client.

## Notes

- Page size is driven by CSS (`@page { size: A4 }`) with `preferCSSPageSize`.
  All measurements are in millimetres for print predictability.
- The paper grain is a 64 px tiled PNG rather than an SVG filter — the filter
  version forced Chromium to rasterise a full-page image per page and tripled
  the file size.
