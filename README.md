# PAYA ORIGIN — Corporate Profile 2026

A 20-page A4 corporate profile, built as HTML/CSS and rendered to PDF by
headless Chromium.

**Outputs**

| File | What it is |
|---|---|
| `dist/PAYA-ORIGIN-Company-Profile-2026.pdf` | The profile. This is the master. |
| `dist/…-layout.docx` | Word, layout-faithful: each page placed as a full-bleed A4 picture. Looks identical, text not editable. |
| `dist/…-editable.docx` | Word, re-authored natively: real headings, tables and pictures. Fully editable, flows like a Word document. |

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
python3 build/prepare_assets.py     # raw library -> art-directed assets
node    build/render.mjs            # -> dist/*.pdf  (the master)

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
