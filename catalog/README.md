# CB250B — Engine Product Presentation

A 16-page bilingual (EN / 简体中文) OEM engine catalog for the **CB250B 250cc
horizontally opposed twin-cylinder engine**, Zhejiang Changling Benjian
Motorcycle Co., Ltd. (浙江长铃奔健机车有限公司).

**Deliverable:** [`CB250B_Engine_Catalog.pdf`](CB250B_Engine_Catalog.pdf) — A4
landscape (297 × 210 mm), full-bleed, embedded Type0 CID fonts, searchable
Chinese text.

## Page structure

| # | Page | # | Page |
|---|------|---|------|
| 01 | Cover | 09 | Crankshaft & Rotating Assembly |
| 02 | Engine Overview | 10 | Lubrication System |
| 03 | Engineering Concept (annotated front view) | 11 | Intake & Exhaust |
| 04 | Key Specifications | 12 | Dimensions & Mounting Interface |
| 05 | Boxer Architecture | 13 | OEM Integration & Packaging |
| 06 | DOHC Four-Valve System | 14 | Performance & Durability |
| 07 | Liquid Cooling System | 15 | Technical Data Sheet |
| 08 | Fuel Injection & Engine Management | 16 | Back Cover |

## Data classification

The source material supplies a mix of confirmed, publicly reported, and proposed
figures. Rather than presenting them all as factory data, every uncertain value
carries a marker, with a legend on each page that uses one:

- **▲** — publicly reported figure (technical media), not factory-certified.
- **△** — proposed engineering value, supplied for catalog completion, pending
  factory confirmation.

Because the document is completed with proposed values, it is titled throughout
as an **ENGINE PRODUCT PRESENTATION / 发动机产品说明**, not a factory datasheet.
The back cover carries the full disclaimer.

Two claims are stated explicitly to prevent misattribution:

- The 62 hp / 100 N·m figure reported for the P51 is the **combined hybrid
  system** output, not the CB250B engine's output (page 14).
- Page 13 covers engine integration interfaces only; no vehicle specification is
  presented.

No performance curve is drawn, since no measured data was supplied. No internal
cross-sections are illustrated. The two schematics (180° opposed layout, four-valve
arrangement) are labelled **SCHEMATIC / 示意图** and stated to be conceptual.

## Design system

- **Format** — A4 landscape, 16 mm margins.
- **Type** — Inter (Latin) + Noto Sans SC (Chinese). English leads, Chinese sits
  directly beneath or beside it.
- **Colour** — black, white, metallic neutral grey, plus a single restrained
  industrial accent (`#C0461C`) reserved for section numbers, callouts,
  dimension markers, and small technical markers.
- **Imagery** — the engine is the hero on every page. The motorcycle appears
  once, on page 13, explicitly as application context.

## Build

```bash
pip install playwright pillow numpy fonttools brotli pypdf
python3 build_fonts.py      # fetch Inter; instance Noto Sans SC to static weights
python3 prepare_images.py   # derive img/ from images_raw/, print a DPI audit
python3 render.py           # -> CB250B_Engine_Catalog.pdf + proof/p01..p16.png
```

`build_fonts.py` instances the Noto Sans SC *variable* font to static 400/500/700
weights. Chromium cannot subset a variable font into a CID font and silently
falls back to Type3 glyph procedures, which makes the Chinese text unsearchable
and inflates the PDF; pinning the weights avoids that.

`render.py` points Playwright at the pre-installed Chromium
(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) — adjust that path for a
local machine.

## Source resolution

The supplied photography tops out at 1536 × 1024 and 2048 × 1152, which sets a
ceiling on print resolution. Crops are kept gentle so every image stays usable at
its placed size — `prepare_images.py` prints the audit (currently 160–375 dpi,
with the cover plate at 168 dpi). Replacing the source photography with 3000 px+
originals is the single biggest available quality improvement.

The cover cutout is a flood-fill of the flat studio backdrop from the image
edges, so only background-connected pixels are lifted to white — bolts, hoses,
fins, and the natural contact shadow are untouched.

## BENDA mark

Used small and secondary, on the back cover only, labelled *Brand context /
品牌关联*, at original proportions and never larger than the engine product name.
The white-on-dark version is a monochrome rendering of the supplied mark for a
dark ground — not redrawn or distorted. Broader use would need authorization.
