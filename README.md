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

The art-direction review that produced this edition — including what was wrong
with the previous profile and what to confirm before it goes to buyers — is in
[`REVIEW.md`](REVIEW.md).

---

## Layout

```
design/
  profile.html        corporate profile — one <section class="page"> per page
  kiwi.html           kiwi product catalogue
  styles.css          the design system: tokens, archetypes, components
  kiwi.css            catalogue component layer (weight chart, gauges,
                      cold-chain plot, carton label) on top of styles.css
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
