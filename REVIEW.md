# PAYA ORIGIN — Corporate Profile: art-direction review and redesign

This repository contains a rebuilt corporate profile for PAYA ORIGIN, together
with the review that produced it.

The previous profile (16 pages) was tidy but templated. This document records
what was wrong, what was decided, and where each decision landed in the new
20-page edition.

---

## 1. Diagnosis

The feedback document listed twenty problems. They collapse into four root
causes — fixing the roots fixes the symptoms.

| # | Root cause | Symptoms it produced |
|---|---|---|
| A | **One layout formula reused on every page** — eyebrow → headline → paragraph → cards → footer | Problems 1, 15, 17, 18: no rhythm, mechanical footer, "too clean and too predictable", pages that are text-on-a-page rather than composed |
| B | **Images used as filler, not as evidence** | Problems 2, 3, 6, 12, 19: photographs that only say "agriculture", generic stock trade visuals, mixed image languages, the same blurred tree twice, no selection between candidates |
| C | **Composition solved by overlay and shrinking** | Problems 4, 10, 11, 13, 14: a small map on a big page, a darkened photo used as background texture, an infographic reduced until it no longer reads, unused space mistaken for negative space |
| D | **Information that stops at the label** | Problems 5, 7, 8, 9: products as photos in cards with no commercial story, a landing-page CTA outweighing the product, "Selected" presented as if it were a metric |

---

## 2. What changed

### A — Rhythm: nine archetypes instead of one template

Every page declares an archetype and the archetype owns the composition. The
sequence is designed so that no two adjacent pages share one:

```
01 plate      02 index      03 editorial  04 data       05 diagram (dark)
06 diagram    07 matrix     08 plate      09 process    10 diagram
11 map        12 table      13 calendar   14 specimen   15 specimen
16 specimen   17 product    18 data       19 editorial  20 dark
```

The reader now moves between full-bleed photography, quiet typographic pages,
data pages, diagrams, a cartographic plate and product specimen pages. The
footer stays constant on purpose — it is the only repeated element, and it no
longer reads as a template because the compositions around it differ.

Page 05 is set on ink rather than paper. The problem is stated in the dark; the
model that answers it arrives on paper on page 06. The tonal switch does
narrative work, not decorative work.

### B — Two image languages, and a rejection list

`build/prepare_assets.py` reduces the whole library to two languages:

- **SPECIMEN** — square, product fills the frame edge to edge, no visible
  background, one warm grade. This is what unified the mixed sources: bowl
  shots, white-background cutouts and on-the-vine lifestyle shots all become
  the same kind of object once the frame is filled with product.
- **SCENE** — photographic evidence (people, regions, cartons, transport),
  same grade, cropped to a declared aspect ratio.

Anything that cannot be pushed into one of those two is **rejected rather than
used anyway**. The rejections are listed in the script and repeated here:

| Asset | Why it is not in the document |
|---|---|
| 3D relief world map + ship + produce | Generic corporate trade visual. Says "international trade", says nothing about Iranian agriculture. |
| Raster of the earlier process infographic | A screenshot of a previous layout, not an image asset. Rebuilt as live vector and type. |
| Composited truck / orchard / produce montage | Reads synthetic; three subjects fighting in one frame. |
| Duplicate apricot-tree and vine frames | Same photograph twice. Used once, or not at all. |

Two further recoveries: the five process photographs that the old profile had
baked into a single tall composite (with its numbers and icons attached) were
sliced back out and cleaned, and the real warehouse pallet photograph — a
genuine asset, previously a thumbnail — now carries a full figure on the
packaging page.

No photograph appears twice in the new document.

### C — Composition before overlay

- **The map** (p11) is now the plate it should have been: the country runs the
  full measure, origins are numbered on the map, and the data sits in a ruled
  legend rail above it rather than as loose labels. The outline was extracted
  as vector geometry from the previous file, so it stays geographically
  identical — including the two subpaths, whose accidental joining was drawing
  a chord across the country.
- **At a glance** (p04) no longer sits on a darkened photograph. It is a data
  page: hanging numerals, ruled rows, no image to fight.
- **The process diagram** (p06) is no longer shrunk to fit. It runs at full
  measure and gained a second tier — *what each stage produces* — which turns a
  decorative flow into a process chart a buyer can actually use.
- **Dead space was converted into content, not stretched.** Where a page ran out
  of material it was given more: the cost of fragmentation (p05), the three
  claims the document then has to earn (p02), the deliverable per stage (p06),
  calendar planning guidance (p13), a closing statement (p10).

### D — Information that finishes the thought

- Products (p14–16) now carry origin, harvest window, what they are specified
  by, and how they are packed. Pistachio names its varieties.
- A **harvest calendar** (p13) was added — twelve months against fourteen
  products, distinguishing harvest, availability from storage, and year-round
  protected cultivation. This is the page a buyer will photograph.
- **Origins** gained a second page (p12): why each region, what grows there,
  and the growing condition that explains it.
- The **CTA was demoted** from a black box with an orange button to a ruled line
  at the foot of the page. It is present; it no longer outranks the product.
- **"Selected" was removed as a metric.** The at-a-glance page now carries four
  honest counts and one qualitative statement labelled as structure, not as a
  number.
- **Packaging** was promoted from thumbnails to its own page, which is where the
  private-label proposition actually belongs.

### E — Logo discipline

The wordmark appears on **all twenty pages**. Discipline here is not about
restraint in frequency — it is about the mark landing in the same place, at the
same size, every time:

| Use | Colourway | Size | Placement |
|---|---|---|---|
| Running page mark (pp. 2–19) | burgundy, or white on ink and photography | 22 mm | top right, aligned to the section marker opposite |
| Cover | burgundy on paper | 34 mm | top of the title panel |
| Closing | white on ink | 28 mm | bottom left of the frame |

Two rules follow from this and are enforced in the layout: the mark never
appears twice on a page (the cover and closing carry it at their own scale
instead of the running one), and where a page bleeds a photograph into the
top-right corner, the composition yields rather than the mark. On page 3 the
image column starts below the head band so the mark sits on paper; on page 8,
the full-bleed plate, the mark switches to white over a top scrim.

---

## 3. Typography and colour

| Role | Face |
|---|---|
| Display | Fraunces (SOFT 0, WONK 0) — warm, editorial, agricultural without being rustic |
| Text | Inter Tight — neutral and precise at small sizes |
| Labels, data, folios | IBM Plex Mono — the document's instrument panel |

Palette sampled directly from the existing wordmark and profile, so the
redesign stays on-brand:

| Token | Value | Use |
|---|---|---|
| Burgundy | `#831D23` | primary, sampled from the wordmark |
| Amber | `#F49E0C` | brand accent, small use only |
| Harvest gold | `#C08018` | structural labels, calendar |
| Ink | `#17130F` | text and dark pages |
| Paper | `#F6F2EA` | stock |

A fine paper grain sits over every paper page. It is the controlled "life" the
review asked for — texture without clutter — and it is why the pages no longer
read as screens.

---

## 4. Build

```bash
python3 build/prepare_assets.py    # raw library -> art-directed asset set
node    build/render.mjs           # HTML -> dist/…pdf (A4, with an overflow audit)
python3 build/qa.py [dpi]          # rasterise the built PDF for visual review
python3 build/sheet.py 3 7 9 10    # side-by-side sheet of named pages
```

`render.mjs` fails loudly on any element that spills outside its page box, so
the clipping class of problem cannot silently return.

---

## 5. Points to confirm before this goes to buyers

Everything below is drawn from public agronomic fact or from the previous
profile. None of it is invented, but all of it is *yours to confirm*:

1. **Harvest windows** (p13, p12, p14–16) — indicative for Iranian production.
   Confirm against your own seasons and varieties.
2. **Sourcing regions** — the five regions carried over from the previous
   profile. Growing conditions are described qualitatively on purpose.
3. **Market focus** (p18) — priority categories per market are a positioning
   claim; adjust to match what you actually ship where.
4. **Document set** (p10) and **Incoterms** (p19) — stated as "typically" and
   "on request". Confirm what you routinely provide.
5. **Pistachio varieties** (p14) — Akbari, Ahmad Aghaei, Kaleh Ghouchi,
   Fandoghi. Confirm which you actually supply.
6. **15+ years** — carried over unchanged from the previous profile.

## 6. Photography

One frame has since been replaced: the selection plate on page 8 was rebuilt
around a client-supplied 1299 × 1672 photograph, in place of the ~700 px frame
that had been sliced out of the old composite and was visibly soft at full-bleed
A4. The page was re-art-directed around it rather than simply swapping the file:
the headline moved from the foot of the page to the **top**, where the
photograph is already dark, so no scrim is doing work the composition should be
doing. That is the general rule to apply to any future replacement — put the
type where the picture is dark, do not darken the picture to take type.

The rest of the library still tops out around 1000–1900 px on the long edge,
which is below true 300 dpi for the sizes used here. It is sharp on screen and
acceptable in print, but a premium profile deserves a commissioned shoot:
producers at work, the regions themselves, packhouse and loading, and a proper
product still-life session on one background. Everything else in this document
is now built to receive better photographs the moment they exist — the asset
script is where they would go in.
