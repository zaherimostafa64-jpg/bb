# PRESENTATION VIEWS — 3D REPRESENTATION MODE

Skill section 36. Records how the two required 3D representations are produced
and why nothing was duplicated to produce them.

---

## 1. The rule: one model, two display configurations

Section 36.8 requires two 3D representations and section 36.4 requires that the
underlying existing-condition geometry is **not** modified destructively. Both
are satisfied by making the cutaway a **display rule evaluated at draw time**,
not a second model.

`03_EXISTING_MODEL/cutaway.py` exposes one function:

```python
apply(boxes, az_deg, enabled=True) -> yields (box, z_top, hidden)
```

It never mutates a box. It returns, per element and per camera direction, the
height that element should be drawn to and whether it should be drawn at all.
Callers draw to `z_top` instead of `box.z1`. Switch `enabled` off and you have
VIEW A back, byte for byte.

| | **VIEW A — complete editable model** | **VIEW B — interior cutaway** |
|---|---|---|
| Purpose | the actual editable model | primary presentation (36.1) |
| Ceiling | present | hidden (36.2) |
| Near facades | full height | cut to 950 mm (36.3) |
| Far facades | full height | full height |
| Interior walls | full height | full height |
| Floor, doors, windows, kitchen, furniture | visible | visible (36.5) |
| Pendant lighting | present | hidden — hangs in the sightline |
| Geometry | identical | identical |

## 2. Which facades get cut

Chosen per camera direction, so it stays correct as the model is swung:

```
cam  = (-sin az, -cos az)          # direction from the model to the camera
cut  = { facade : outward_normal . cam > 0.06 }
```

An exterior wall is cut only when it actually stands between the viewer and the
interior. At the default azimuth of 32° that is the south and west facades; the
north and east facades keep full height, so the apartment still reads as an
enclosed room rather than a floating floor plate.

Cut walls are **not** made transparent (36.3). They are physically shortened,
and every surface the cut passes through is drawn in a dark section poché — the
same convention as a cut on a plan or section. The result reads as a physical
architectural cutaway model.

Every wall is cut in at least one direction and full height in at least one
other, which is what drawing **A-005** is for.

## 3. Cameras

### `CAM_INTERIOR_AXONOMETRIC` — primary (36.9, 36.10)

| | |
|---|---|
| Projection | **orthographic parallel** — preferred by 36.10 |
| Azimuth | 32° |
| Elevation | 38° — inside the 30–50° band required by 36.1 |
| Framing | fitted to the visible geometry; the whole unit in one composition |
| Distortion | none — parallel projection, so the axonometric measures the same as A-001 |

Four further corners, so no wall is permanently hidden:

| Camera | Azimuth | Elevation | Reads |
|--------|---------|-----------|-------|
| `CAM_AXO_SW` | 32° | 38° | dining / kitchen corner |
| `CAM_AXO_SE` | −32° | 38° | living / alcove corner |
| `CAM_AXO_NE` | −148° | 40° | behind the alcove — hall facade at full height |
| `CAM_AXO_NW` | 148° | 40° | behind the kitchen — kitchen windows at full height |

### Photo-matched interior cameras (36.13)

Perspective, placed at the recovered photographic stations. These are interior
views, not cutaways: the ceiling stays on and the near facades stay full height,
because that is what the camera saw.

| Camera | Station (X, Y) | Eye | Bearing | Source |
|--------|----------------|-----|---------|--------|
| `CAM_ENTRANCE_01` | 6,300 · 6,600 | 1,600 | 180° | IMG_22 |
| `CAM_LIVING_01` | 2,900 · 2,600 | 1,550 | 100° | IMG_01 |
| `CAM_LIVING_02` | 11,000 · 2,400 | 1,550 | 280° | IMG_03 |
| `CAM_DINING_01` | 2,600 · 3,100 | 1,500 | 0° | IMG_05 |
| `CAM_KITCHEN_01` | 4,200 · 8,300 | 1,550 | 250° | IMG_18 |
| `CAM_ALCOVE_01` | 10,200 · 4,600 | 1,550 | 20° | IMG_10 |

Both validation systems run on the same object list — see `cameras.md` for the
derivation of the stations and the panoramic limitation that applies to them.

## 4. Interior materials (36.11)

The cutaway is not a monochrome technical mass. Every element carries a material
from the schedule in `02_ANALYSIS/materials.md`, assigned by
`model.material_of()`:

`floor_stone` · `floor_tile` · `rug` · `plaster` · `tile_wall` · `panelling` ·
`marble` · `brick` · `mirror` · `ceiling` · `cabinet` · `worktop` · `appliance` ·
`door_dark` · `door_white` · `joinery_dark` · `glazing` · `upholstery` ·
`timber` · `brass`

Doors and windows are modelled as real objects rather than voids, so they read
in the cutaway: door leaves are drawn swung open, and windows carry glazing,
jambs, cill and head. They are generated from the **same** `Opening` records
that produce the plans and elevations, so an opening cannot drift between
drawings and 3D.

The floor is one slab per room — the kitchen's ceramic tile is a different
finish from the stone elsewhere, and a single scene-wide slab would also break
depth sorting in any painter's-algorithm view.

## 5. Where each view is produced

| Output | Representation |
|--------|----------------|
| `04_DRAWINGS/A-004_interior_cutaway_axonometric.svg` | VIEW B, `CAM_INTERIOR_AXONOMETRIC` |
| `04_DRAWINGS/A-005_cutaway_four_corners.svg` | VIEW B, all four corners |
| `reconstruction_review.html` | both, switchable; **VIEW B is the default** |
| `07_EXPORTS/existing_model_V01.obj` | VIEW A — the complete model, all objects |

The OBJ export is deliberately VIEW A. It is the editable model, and the ceiling
and the full-height walls must survive in it (36.4). Any 3D application can
reproduce VIEW B from it by hiding the `ARCHITECTURE/Ceiling` group and applying
a section box.

## 6. Exterior facade

Not a subject of this project (36.5, 36.12). No exterior massing, roof, street
or landscape is modelled. Where interior accuracy and exterior accuracy
competed, interior accuracy won every time. The facades exist only as the
enclosure of the rooms, and their outer faces carry no detail at all.
