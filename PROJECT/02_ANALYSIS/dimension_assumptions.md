# DIMENSION ASSUMPTIONS — A/03

Skill steps 05 – 07. Units **millimetre**. Coordinate system
`X = horizontal, Y = depth, Z = vertical`, `Z = 0 = FFL`.

Confidence tags per §12: `[VERIFIED] [DERIVED] [ESTIMATED] [ASSUMED]`

> **No dimension in this document is [VERIFIED].** The user supplied no
> measurements, so Level 1 of §06 is empty. Everything below is Level 2
> (standard element), Level 3 (photographic proportion) or Level 4 (visual
> estimate). **Every number must be confirmed on site before it is built from.**

---

## 1. Calibration chain

The whole dataset is scaled off **three** standard elements that appear
square-on in at least one photograph, then propagated by proportion.

| # | Anchor | Value | Source image | Basis | Tag |
|---|--------|-------|--------------|-------|-----|
| **A1** | Kitchen door opening | **900 × 2100** | IMG_14 (frontal) | Standard Iranian interior door leaf 900 | `[ESTIMATED]` — standard/inferred |
| **A2** | Kitchen counter depth | **600** | IMG_08, 16, 18 | Universal base-unit depth | `[ESTIMATED]` — standard/inferred |
| **A3** | Free-standing gas range | **900 × 600** | IMG_08, 16, 18 | 5-burner range, standard width | `[ESTIMATED]` — standard/inferred |

Secondary cross-checks that agreed with A1–A3 within ±4 %:

| Cross-check | Assumed | Read from | Result |
|-------------|---------|-----------|--------|
| Side-by-side refrigerator | 910 W × 1780 H | IMG_06, 19 | agrees |
| Front-load washing machine | 600 W × 850 H | IMG_08, 16, 18 | agrees |
| Cooker hood | 600 W | IMG_16, 18 | agrees |
| Microwave | 500 W | IMG_08, 16 | agrees |
| Dining chair back height | 1000 | IMG_01, 05 | agrees |
| Alcove wall clock diameter | 700 | IMG_10, 12, 22 | agrees |
| Wall-mounted split AC body | 800 W | IMG_01, 04 | agrees |

Because A1–A3 are mutually consistent, **one global scale** is used across the
whole model (§07). No image carries its own scale.

---

## 2. Vertical dimensions

| Element | Value | Tag | Reasoning |
|---------|-------|-----|-----------|
| FFL | `0` | datum | — |
| **FCL — hall, flat soffit (perimeter)** | **2750** | `[ESTIMATED]` | Door head 2100 : soffit ≈ 1 : 1.31 across IMG_01/04/15 |
| **FCL — hall, inside tray cove** | **2950** | `[ESTIMATED]` | Cove step reads ≈ 200 in IMG_01, 10, 22 |
| FCL — entrance hall | 2750 | `[ESTIMATED]` | Flat, with recessed downlights (IMG_13, 17) |
| **FCL — kitchen (PVC slat ceiling)** | **2600** | `[ESTIMATED]` | Suspended slat ceiling, clearly lower than the hall (IMG_08, 16, 18) |
| Structural slab soffit | *unknown* | `NOT VERIFIED FROM PHOTOGRAPHS` | §30 |
| Interior door height | 2100 | `[ESTIMATED]` | standard |
| Main entrance door height | 2250 | `[ESTIMATED]` | Reads taller than the interior doors in IMG_13 |
| Window sill — hall | 900 | `[ESTIMATED]` | Sits directly above the radiators (IMG_05, 15) |
| Window head — hall | 2200 | `[ESTIMATED]` | Aligns with the balcony-door head (IMG_01) |
| Balcony door height | 2200 | `[ESTIMATED]` | Full height, no sill (IMG_01, 03) |
| Window sill — kitchen | 1000 | `[ESTIMATED]` | Just above the 900 counter (IMG_18) |
| Window head — kitchen | 2150 | `[ESTIMATED]` | Just under the slat ceiling (IMG_18) |
| Kitchen worktop | 900 | `[ESTIMATED]` | standard |
| Kitchen wall-cabinet underside | 1450 | `[ESTIMATED]` | 550 splashback, standard |
| Kitchen wall-cabinet top | 2050 | `[ESTIMATED]` | 600 carcass |
| Pass-through bar slab | 1000 | `[ESTIMATED]` | Reads one course above the 900 worktop (IMG_05, 19) |
| Pass-through head | 2150 | `[ESTIMATED]` | Aligns with the kitchen window head |
| Fireplace mantel shelf | 1100 | `[ESTIMATED]` | Chest height against the standing figures in IMG_11 |
| Fireplace hearth step | 300 h × 500 d | `[ESTIMATED]` | One generous step (IMG_10, 22) |
| Skirting | 100 | `[ESTIMATED]` | IMG_15 |
| Socket centre | 300 | `[ESTIMATED]` | IMG_15 |
| Switch centre | 1100 | `[ESTIMATED]` | IMG_14 |

---

## 3. Plan dimensions

### 3.1 Wall thicknesses — all `[ASSUMED]`

| Wall type | Value | Note |
|-----------|-------|------|
| External / facade | 300 | `NOT VERIFIED FROM PHOTOGRAPHS` (§30) |
| Internal partition | 200 | `NOT VERIFIED FROM PHOTOGRAPHS` |
| Fireplace blade | 600 | Reads far thicker than a partition; houses a flue |
| Panelled column | 600 × 600 | Suspected structural — `NOT VERIFIED FROM PHOTOGRAPHS` |
| Kitchen facade pier | 600 × 300 projection | Suspected structural — `NOT VERIFIED` |

### 3.2 Room clear dimensions

| Room | Clear size | Area | Tag | Basis |
|------|-----------|------|-----|-------|
| **Main hall** (dining + living) | **12 200 × 5 600** | 68.3 m² | `[ESTIMATED]` | see CONFLICT C-003 — ±800 mm on the long axis |
| **Sitting alcove** (نشیمن) | **4 400 × 3 400** | 15.0 m² | `[ESTIMATED]` | 3-seat sofa + 2 armchairs + table fit envelope (IMG_10, 12) |
| **Kitchen** | **4 800 × 3 400** | 16.3 m² | `[DERIVED]` | Work run = washer 600 + counter 900 + sink 1200 + range 900 + counter 700 ≈ 4 300 + returns |
| **Entrance hall** | **2 800 × 3 400** | 9.5 m² | `[ESTIMATED]` | Door 1250 + wardrobe + circulation (IMG_17, 20) |

### 3.3 Openings

| Ref | Opening | W × H | Sill | Tag |
|-----|---------|-------|------|-----|
| D-01 | Main entrance, double leaf (unequal 800 + 450) | 1250 × 2250 | 0 | `[ESTIMATED]` |
| D-02 | Kitchen door, single leaf | 900 × 2100 | 0 | `[ESTIMATED]` A1 |
| D-03 | Secondary white door off entrance | 900 × 2100 | 0 | `[ESTIMATED]` |
| O-01 | Entrance → hall passage | 2200 × 2400 | 0 | `[ESTIMATED]` |
| O-02 | Corridor to private zone | 1100 × 2200 | 0 | `[ESTIMATED]` |
| **O-03** | **Kitchen ↔ dining pass-through** | **2100 × 1150** | **1000** | `[DERIVED]` — width read against the 910 fridge in IMG_06 |
| BD-01 | Balcony door, double glazed leaf | 1600 × 2200 | 0 | `[ESTIMATED]` |
| W-H1 | Hall window (large, roman blind) | 1800 × 1300 | 900 | `[ESTIMATED]` |
| W-H2 | Hall window | 1400 × 1300 | 900 | `[ESTIMATED]` |
| W-H3 | Hall window, dining end | 1800 × 1300 | 900 | `[ESTIMATED]` |
| W-K1 | Kitchen window (N, left of pier) | 1400 × 1150 | 1000 | `[ESTIMATED]` |
| W-K2 | Kitchen window (N, right of pier) | 1400 × 1150 | 1000 | `[ESTIMATED]` |
| W-K3 | Kitchen window (W) | 1600 × 1150 | 1000 | `[ASSUMED]` — single view only, see C-002 |

### 3.4 Fixed elements

| Element | Size | Tag |
|---------|------|-----|
| Fireplace blade | 2400 L × 600 T × full height | `[DERIVED]` |
| Firebox recess (× 2, one per face) | 1100 W × 900 H × 250 D | `[ESTIMATED]` |
| Marble mantel shelf | 2400 × 750 × 60, top at 1100 | `[ESTIMATED]` |
| Raised hearth step (× 2) | 2400 × 500 × 300 | `[ESTIMATED]` |
| Panelled column | 600 × 600 × full height | `[ESTIMATED]` |
| Kitchen base run (work wall) | 4300 L × 600 D × 900 H | `[DERIVED]` |
| Kitchen wall cabinets (work wall) | 4300 L × 350 D, 1450 → 2050 | `[ESTIMATED]` |
| Kitchen base run (pass-through wall) | 3600 L × 600 D × 900 H | `[ESTIMATED]` |
| Bar slab at pass-through | 2100 × 400 × 40, top at 1000 | `[ESTIMATED]` |
| Mirrored wardrobe (entrance) | 1200 W × 600 D × 2200 H | `[ESTIMATED]` |
| Radiators (hall ×3, kitchen ×1) | 1000 × 100 × 600 | `[ESTIMATED]` |

---

## 4. Explicitly NOT established (§30)

The following are **`NOT VERIFIED FROM PHOTOGRAPHS`** and are represented in the
model only as placeholder geometry:

- Which walls are structural, and the true wall thicknesses.
- Whether the panelled column and the kitchen facade pier are structural.
- Any beam, slab or shaft dimension.
- All concealed plumbing and electrical routing.
- The flue route of the fireplace.
- The balcony's depth and extent.
- Everything beyond the corridor threshold.

---

## 5. Requested site measurements (§25)

Seven measurements would move most of this document from `[ESTIMATED]` to
`[VERIFIED]`, in priority order:

1. **Finished floor to finished ceiling in the hall** (both under the flat soffit and inside the tray cove).
2. **Main entrance door — structural opening width.**
3. **Hall long dimension** — dining-end wall to living-end wall. *(resolves C-003, the largest single uncertainty)*
4. **Hall depth** — facade to the entrance/kitchen partition.
5. **Kitchen — both internal dimensions.**
6. **Pass-through opening — clear width and sill height.**
7. **Fireplace blade — overall length and thickness, and the width of the panelled column.**
