# PAYA ORIGIN — Corporate Profile 2026

A 20-page A4 corporate profile, built as HTML/CSS and rendered to PDF by
headless Chromium.

**Output:** [`dist/PAYA-ORIGIN-Company-Profile-2026.pdf`](dist/PAYA-ORIGIN-Company-Profile-2026.pdf)

The art-direction review that produced this edition — including what was wrong
with the previous profile and what to confirm before it goes to buyers — is in
[`REVIEW.md`](REVIEW.md).

---

## Layout

```
design/
  profile.html        the document — one <section class="page"> per page
  styles.css          the design system: tokens, archetypes, components
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
python3 build/prepare_assets.py
node    build/render.mjs
```

`render.mjs` prints the page count, the file size, any console errors, and an
**overflow audit** — every element that spills outside its page box, with the
page number and how far it overruns. A clean build reports `overflow: none`.

## Reviewing changes

```bash
python3 build/qa.py 150       # build/qa/pNN.png at 150 dpi + a contact sheet
python3 build/sheet.py 11 12  # build/qa/sheet.png comparing named pages
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

## Notes

- Page size is driven by CSS (`@page { size: A4 }`) with `preferCSSPageSize`.
  All measurements are in millimetres for print predictability.
- The paper grain is a 64 px tiled PNG rather than an SVG filter — the filter
  version forced Chromium to rasterise a full-page image per page and tripled
  the file size.
