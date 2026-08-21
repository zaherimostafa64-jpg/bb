# SPATIAL RELATIONSHIPS — A/02

Skill steps 03 – 04. Establishes which photographs see the same architecture,
so the 22 images are treated as **one scene**, not 22 independent scenes.

---

## 1. Topology recovered from the photographs

The public zone reads as **three rooms plus one alcove**, all hanging off a
single large hall:

```
                      ┌──────────────────────────────┐
   private zone  ←──── │  CORRIDOR (out of scope)     │
   (bedrooms)          └──────────────┬───────────────┘
                                      │  1100 opening
   ┌───────────────┐   D-02   ┌───────┴────────┐
   │   KITCHEN     ├──────────┤  ENTRANCE HALL │←── D-01 main entrance door
   │     Z03       │  900 dr  │      Z01       │
   └───────┬───────┘          └───────┬────────┘
           │ PASS-THROUGH             │ open passage 2200
           │ 2100 × 1150, sill 1000   │
   ┌───────┴──────────────────────────┴────────────────────────┐
   │                                                            │
   │   DINING ZONE  Z04   ←──────────→   LIVING ZONE  Z02       │
   │                                                            │
   │                              ┌───[ FIREPLACE BLADE ]───┐   │
   │                              │   + panelled column     │   │
   └──────────────────────────────┴─────────┬───────────────┴───┘
                                            │ open
                                   ┌────────┴────────┐
                                   │ SITTING  Z05    │
                                   │ نشیمن (alcove)  │
                                   └─────────────────┘
```

**Key finding — the hall is one continuous room.** Dining (Z04) and living
(Z02) are not separated by any wall; they are read as one volume with two
tray-ceiling coves and one chandelier each (IMG_01, IMG_04, IMG_22 all show
both chandeliers in a single frame with no partition between them).

**Key finding — the fireplace blade is free-standing at one end.** It does not
run wall-to-wall. IMG_22 and IMG_11 both show floor continuing past its end,
and IMG_10 shows the panelled column terminating the blade. The alcove (Z05)
therefore opens to the hall on both sides of the blade.

---

## 2. Correspondence matrix

Which images see the same architectural element (§04):

| Element | Images | Cross-check | Conf. |
|---------|--------|-------------|-------|
| **Fireplace blade — hall face** | IMG_01, 02, 03, 04, 07 | Brick firebox + white marble mantel + raised marble hearth step, TV unit always immediately to its east | **High** |
| **Fireplace blade — alcove face** | IMG_10, 11, 12, 20, 21, 22 | Brick firebox + marble mantel + mirror panel above + hearth step | **High** |
| **Panelled column (ستون)** | IMG_01, 04, 07, 10, 11, 22 | White classical panelling, full height to the tray soffit, terminates the blade | **High** |
| **Pass-through opening** | IMG_05 (frontal, dining side), 06, 07, 19 (kitchen side) | Same wooden frame, same bi-fold shutter stacks at both jambs, same white bar slab | **High** |
| **Kitchen door D-02** | IMG_13, 14 (frontal), 16, 19 | Same white 3-panel leaf; range + hood visible through it in both 14 and 19 | **High** |
| **Main entrance door D-01** | IMG_13, 17 (frontal), 20, 21 | Dark stained double leaf, unequal leaves, brass furniture, intercom to its east | **High** |
| **Kitchen work wall** | IMG_08, 09, 16, 18 | washer → sink → gas range → hood → short counter + microwave, uppers over the whole run | **High** |
| **Kitchen window pair + pier** | IMG_16, 18 | Two windows with a projecting tiled pier between them | **High** |
| **Kitchen large W window** | IMG_09 only | Radiator beneath; **single view only** | **Low** |
| **Hall balcony door** | IMG_01, 02, 03, 04 | Double-leaf glazed, dark frame, X-braced balcony railing beyond, split AC directly above | **High** |
| **Hall facade windows** | IMG_01, 02, 04 (E run), IMG_05, 15 (dining end) | Roman blinds, radiators beneath, sill above radiator | **Medium** |
| **Clock pier (alcove)** | IMG_10, 12, 22 | Roman-numeral clock on a projecting corner pier | **High** |
| **Tray ceiling, 2 coves** | IMG_01, 02, 04, 10, 22 | Stepped soffit, chamfered corners, one chandelier per cove | **High** |
| **Corridor to private zone** | IMG_11, 13, 20 | Doors down both sides, room visible at the far end | Medium (out of scope) |
| **Ceiling height** | inferred in every image | see `dimension_assumptions.md` | **Medium** |

---

## 3. Adjacency chain used to close the plan

Each link is supported by at least one photograph that sees **both** ends:

| # | Link | Evidence |
|---|------|----------|
| 1 | Entrance ↔ Kitchen | IMG_13 (kitchen door on the left of the entrance hall), IMG_14 (frontal) |
| 2 | Entrance ↔ Corridor | IMG_13, IMG_20 |
| 3 | Entrance ↔ Sitting alcove | IMG_22 (uninterrupted sightline from the threshold) |
| 4 | Sitting alcove ↔ Hall | IMG_10, IMG_11 (floor runs past the blade on both sides) |
| 5 | Kitchen ↔ Dining | IMG_05 + IMG_19 (same opening, both faces) |
| 6 | Dining ↔ Living | IMG_01, IMG_03 (single volume, no partition) |
| 7 | Hall ↔ Balcony | IMG_01, IMG_03, IMG_04 |

Links 1 – 7 close a consistent loop:
`entrance → kitchen → dining → living → alcove → entrance`.
This loop is what fixes the plan topology; it is **DERIVED**, not measured.

---

## 4. Conflicts and how they were resolved (§23)

### CONFLICT C-001 — Number of fireplaces
- IMG_03 / IMG_04 show a brick firebox facing **into the hall**.
- IMG_10 / IMG_22 show a brick firebox facing **into the alcove**.
- Camera positions for these two groups are on opposite sides of the blade,
  so a single-sided fireplace cannot explain both.
- **Resolution:** modelled as a **double-sided blade — one recess per long
  face**, sharing one flue. Status: **DERIVED — VERIFY ON SITE.**

### CONFLICT C-002 — Kitchen window count
- IMG_18 clearly shows **two** windows with a pier between them.
- IMG_09 shows a **large** window that does not obviously match either.
- Likely cause: IMG_09 is shot from the opposite end, so its "large" window is
  the same pair read across the panorama seam, **or** a third window on the
  return wall.
- **Resolution:** two windows modelled on the north facade (high confidence);
  the west window is modelled as **ASSUMED** and flagged. Status:
  **ESTIMATED — VERIFY ON SITE.**

### CONFLICT C-003 — Hall length
- IMG_01 (dining end, looking east) suggests a hall run of ≈ 11 m.
- IMG_03 (living end, looking west) suggests ≈ 13 m.
- Likely cause: panoramic stitch stretch at the frame edges, plus different
  camera standpoints.
- **Resolution:** the mid-value **12 200 mm** is carried in the model.
  Status: **ESTIMATED — VERIFY ON SITE. This is the single largest
  uncertainty in the reconstruction.**

### CONFLICT C-004 — Orientation
- No compass information exists in the set. Kitchen windows show mountains;
  hall windows show mid-rise roofscape — consistent with a corner unit, but
  the absolute bearing cannot be recovered.
- **Resolution:** the drawings carry a **project north** arrow only, marked
  `ASSUMED — NOT TRUE NORTH`.
