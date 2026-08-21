# RECONSTRUCTION STATUS

Skill `residential-photo-to-cad-3d` v1.0 — section 33
Model **V01_EXISTING** · 2026-08-21 · Rev A

---

```
Overall Confidence:  55 %

Verified Geometry:    0 %
Derived Geometry:    34 %
Estimated Geometry:  51 %
Assumed Geometry:    15 %
```

**Existing Model:** READY — as an approximation
**2D Drawings:** READY — as an approximation
**3D Presentation:** READY — interior cutaway axonometric, section 36
**Camera Matching:** READY — with the panoramic limitation stated below
**Redesign:** NOT STARTED — awaiting approval, per section 19

---

## Critical unknowns

1. **Hall length.** The two end-to-end views disagree by roughly two metres
   (conflict C-003). The mid-value 12,400 is carried, and every area, every
   elevation length and the whole facade layout inherits that error.
2. **Every absolute dimension.** No measurement was supplied, so the entire
   model is scaled off standard elements — a 900 mm door leaf, a 600 mm counter
   depth, a 900 mm range. If any one of those anchors is wrong, the model is
   uniformly wrong by the same ratio.
3. **All structure.** Wall thicknesses, whether the panelled column and the
   kitchen facade pier are structural, beam and slab dimensions, and the
   fireplace flue are `NOT VERIFIED FROM PHOTOGRAPHS` and are placeholders.
4. **Whether the fireplace really is double-sided** (conflict C-001).
5. **The kitchen's third window** (conflict C-002).
6. **Orientation.** No compass data exists; project north is assumed
   (conflict C-004).

## Recommended site measurements

1. Hall floor-to-ceiling — under the flat soffit **and** inside the tray cove
2. Hall length, dining-end wall to living-end wall *(resolves C-003)*
3. Hall depth, facade to the kitchen/entrance partition
4. Main entrance door — structural opening width
5. Kitchen — both internal dimensions
6. Pass-through — clear width and sill height
7. Fireplace blade — length, thickness, and the panelled column's width

Taking all seven is projected to lift overall confidence to **≈ 88 %**.

---

## What was produced

```
PROJECT/
├── 01_REFERENCE_PHOTOS/     22 source photographs
├── 02_ANALYSIS/             photo_inventory · spatial_relationships
│                            dimension_assumptions · confidence_map · materials
├── 03_EXISTING_MODEL/       params.py · model.py · draw.py · build.py
├── 04_DRAWINGS/             A-001..A-005 · E-001..E-004 · S-001..S-002 (SVG + DXF)
├── 05_CAMERA_MATCH/         cameras.md — 6 photo stations
│                            presentation_views.md — VIEW A / VIEW B, axo cameras
├── 06_REDESIGN/             empty — not started
├── 07_EXPORTS/              OBJ + MTL · DXF · scene JSON
└── reconstruction_review.html
```

**143 independently named objects. 70 named parameters.** Regenerate everything
with:

```bash
python3 PROJECT/03_EXISTING_MODEL/build.py
```

## Quality control (section 22)

| Check | Result |
|-------|--------|
| Walls continuous | PASS |
| Rooms connect correctly | PASS — adjacency loop closes |
| Openings consistent between plan, elevation and 3D | PASS — one source |
| Doors correctly located | PASS |
| Windows consistent across photographs | PASS, except W-K3 (C-002) |
| Ceiling height consistent | PASS — one value per room |
| Kitchen dimensions internally consistent | PASS — work run resolves to the room width |
| One global scale | PASS — no per-image scale anywhere |
| Assumptions identified | PASS — every parameter carries a tag |
| Objects independently editable | PASS — no merged mesh |
| Walls separate objects | PASS |
| Kitchen cabinets separate | PASS |
| Movable furniture separate | PASS — own group, excluded from sections |
| Cameras saved | PASS — 6 photo stations + 5 axonometric |
| Cutaway does not duplicate architecture (36.8) | PASS — display rule, one object list |
| Underlying geometry unmodified by the cutaway (36.4) | PASS — nothing is mutated |
| Ceiling still an editable object (36.2) | PASS — hidden, not deleted |
| Interior materials preserved (36.11) | PASS — 20 materials, not a monochrome mass |
| Doors and windows visible in 3D (36.2) | PASS — leaves, glazing, jambs, cill, head |

## 3D representation (section 36)

The primary 3D presentation is an **interior cutaway axonometric**, not an
exterior model: orthographic, elevated 38 degrees, ceiling removed and the near
facades cut down to 950 mm with a section poché on every cut surface. The
complete model (VIEW A) and the cutaway (VIEW B) are the **same 143 objects** —
the cutaway is a display rule evaluated per camera direction, so it duplicates
no architecture and modifies nothing. Full method in
`05_CAMERA_MATCH/presentation_views.md`.

No exterior massing, roof, street or landscape is modelled: this is an interior
reconstruction, and interior accuracy took priority throughout (sections 36.5,
36.12).

## Method limitation

All 22 sources are stitched ultra-wide panoramas, roughly 2.16:1. A pinhole
camera cannot reproduce these frames, so a pixel-accurate photo-match is not
achievable from this dataset. Camera matching was therefore validated on
**feature order and relative proportion**, which all six stations pass. This is
a limitation of the input, not of the reconstruction.

## Primary success criterion (section 34)

> *Can the reconstructed space be edited later without rebuilding the model from
> the photographs?*

**Yes.** Every dimension is a named parameter, every element an independent
object in a labelled hierarchy. Supplying the seven measurements is an edit to
`params.py` and one command — not a rebuild.

---

## Next step

Sections 19 and 31 require approval of the existing-condition model before any
redesign begins. **V03_REDESIGN is not started and should not be started until
the existing model is either approved or corrected against site measurements.**
