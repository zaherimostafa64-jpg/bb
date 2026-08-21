# CAMERA MATCHING — 05

Skill sections 15 – 16. Camera stations recovered for the six photographs that
carry the most geometry. Coordinates are in the model frame
(`X, Y` in mm, `Z` = eye height above FFL). Bearing is measured clockwise from
+Y (project north).

> **Method limit.** Every source image is a stitched ultra-wide panorama with a
> horizontal field of view well beyond any single rectilinear lens. A pinhole
> camera cannot reproduce these frames, so a pixel-accurate photo-match is not
> achievable from this dataset. What is recorded here is the **station and view
> direction**, which is enough to validate that the reconstructed geometry is
> arranged correctly — which is the purpose of the exercise (section 15).
> Rendered comparisons are therefore checked for **feature order and relative
> proportion**, not edge-for-edge overlay.

---

## Camera schedule

| Cam | Image | Station (X, Y) | Eye Z | Bearing | Est. HFOV | Target |
|-----|-------|----------------|-------|---------|-----------|--------|
| **C-01** | IMG_22 `131410` | 6,300 · 6,600 | 1,600 | 180° (S) | ≈ 150° | The blade, from the entrance threshold — deepest sightline in the set |
| **C-02** | IMG_01 `131104` | 2,900 · 2,600 | 1,550 | 100° (E) | ≈ 140° | Along the hall towards the balcony door |
| **C-03** | IMG_03 `131127` | 11,000 · 2,400 | 1,550 | 280° (W) | ≈ 145° | Back along the hall towards the kitchen and entrance |
| **C-04** | IMG_05 `131155` | 2,600 · 3,100 | 1,500 | 0° (N) | ≈ 120° | Frontal on the pass-through — the calibration frame |
| **C-05** | IMG_18 `131338` | 4,200 · 8,300 | 1,550 | 250° (W) | ≈ 135° | Kitchen, from the door across to the window pair |
| **C-06** | IMG_10 `131238` | 10,200 · 4,600 | 1,550 | 20° (NNE) | ≈ 130° | The alcove and the blade's alcove face |

Derivation for each station, per section 16:

1. Vertical architectural lines identified (door and window jambs, wall corners,
   the blade's arrises).
2. Horizontal lines identified (wall-floor and wall-ceiling junctions, worktop,
   mantel, skirting).
3. Vanishing points estimated in the frame's central third only — the outer
   thirds are stitch-distorted and were discarded.
4. Eye height taken as 1,500 – 1,600 (hand-held phone at chest/eye height),
   cross-checked against the standing figures in IMG_01, 04, 11 and 15.
5. Station fixed by triangulating two or more identified elements whose model
   position is already known.
6. Bearing fixed from the direction of the dominant vanishing point.

---

## Validation checklist — render vs. reference

For each camera, the reconstruction is accepted only if the **feature order
across the frame** matches the photograph:

| Cam | Expected left → right | Status |
|-----|----------------------|--------|
| C-01 | entrance reveal · alcove seating · clock pier · **blade + firebox + mantel + column** · hall beyond with two chandeliers | **PASS** |
| C-02 | blade (hall face) + column · TV zone · balcony door with AC over · hall windows · dining in the foreground | **PASS** |
| C-03 | hall windows · dining table · **pass-through** · entrance passage · corridor beyond · blade (hall face) · TV zone | **PASS** |
| C-04 | window with roman blind + radiator · **pass-through with kitchen beyond** · entrance passage · alcove seating | **PASS** |
| C-05 | pass-through counter run · **window · pier · window** · work run with hood and sink | **PASS** |
| C-06 | alcove seating · clock pier · **blade with firebox, mantel, mirror over** · column | **PASS** |

All six pass on feature order and on relative proportion. **No camera passes on
absolute dimension**, because no absolute dimension is verified.

---

## Discrepancies carried forward

| # | Camera | Observation | Action |
|---|--------|-------------|--------|
| 1 | C-02 / C-03 | The hall reads ≈11 m from one end and ≈13 m from the other | Held at 12,400 — see CONFLICT C-003 |
| 2 | C-05 | The window pier reads more slender in the render than in IMG_18 | Pier projection may exceed the assumed 300; measure on site |
| 3 | C-01 | The alcove reads slightly deeper in the render than in IMG_22 | Panoramic stretch is the likely cause; left unchanged |

---

## Reproducing a camera

The stations above are ordinary orthonormal camera placements. In any
3D application, import `07_EXPORTS/existing_model_V01.obj` (metres, Y-up,
Z forward-negative) and place a camera at:

```
position = ( X/1000,  Z/1000,  -Y/1000 )     # OBJ axis convention
rotation = bearing about the vertical axis, level (no tilt recorded)
```

Because the sources are panoramas, set a wide FOV or render an equirectangular
frame and crop, rather than trying to force a rectilinear lens to match.
