"""Generate the whole V01_EXISTING output package from the parametric model.

    python3 build.py

Writes:
  04_DRAWINGS/  A-001..A-003, E-001..E-004, S-001..S-002   (SVG + DXF)
  07_EXPORTS/   existing_model_V01.obj + .mtl, plan.dxf
"""

import os

import ezdxf

import axo
import cutaway as CUT
import model as M
from draw import Sheet, project

VIEW_SIGN = {"N": 1, "S": -1, "E": 1, "W": -1}
from params import P, v

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRW = os.path.join(ROOT, "04_DRAWINGS")
EXP = os.path.join(ROOT, "07_EXPORTS")
for d in (DRW, EXP):
    os.makedirs(d, exist_ok=True)

WALLS, SOLIDS = M.build()

NOTES_COMMON = [
    "1. RECONSTRUCTED FROM 22 PANORAMIC PHOTOGRAPHS. NO SITE SURVEY HAS BEEN CARRIED OUT.",
    "2. NO DIMENSION ON THIS DRAWING IS VERIFIED. ALL ARE DERIVED, ESTIMATED OR ASSUMED.",
    "3. DIMENSIONS SUFFIXED (E) ESTIMATED  (D) DERIVED  (A) ASSUMED.",
    "4. WALL THICKNESSES AND ALL STRUCTURAL ELEMENTS: NOT VERIFIED FROM PHOTOGRAPHS.",
    "5. DO NOT SCALE. DO NOT BUILD FROM THIS DRAWING WITHOUT ON-SITE VERIFICATION.",
]

BOUNDS = (M.HALL_X0 - M.TE, M.HALL_Y0 - M.TE, M.HALL_X1 + M.TE, M.CORR_Y1)
BOUNDS_DIM = (BOUNDS[0] - 500, BOUNDS[1] - 3400, BOUNDS[2] + 3400, BOUNDS[3])


# ---------------------------------------------------------------------------
# plan helpers
# ---------------------------------------------------------------------------

def wall_footprints(sh, weight="cut"):
    for w in WALLS:
        for b in w.solids():
            if b.z0 < 10:
                sh.rect(b.x0, b.y0, b.x1, b.y1, weight, fill="#d8d8d8")


def opening_symbols(sh):
    for w in WALLS:
        for o, b in w.opening_boxes():
            along = "x" if w.axis == "x" else "y"
            a0, a1 = getattr(b, along + "0"), getattr(b, along + "1")
            t0 = w.offset - w.thickness / 2
            t1 = w.offset + w.thickness / 2
            if w.axis == "x":
                rect = (a0, t0, a1, t1)
            else:
                rect = (t0, a0, t1, a1)
            sh.rect(*rect, "fine", fill="#fff")
            if o.kind == "window":
                # three-line window symbol
                for f in (0.35, 0.5, 0.65):
                    c = t0 + (t1 - t0) * f
                    if w.axis == "x":
                        sh.line(a0, c, a1, c, "fine")
                    else:
                        sh.line(c, a0, c, a1, "fine")
            elif o.kind in ("door", "balcony"):
                r = a1 - a0
                if w.axis == "x":
                    sh.line(a0, t1, a0, t1 + r, "fine")
                    sh.body.append(_arc(sh, a0, t1, r, 0, 90))
                else:
                    sh.line(t0, a0, t0 - r, a0, "fine")
                    sh.body.append(_arc(sh, t0, a0, r, 90, 180))
            sh.text(*_mid(rect), o.ref, 2.0, "middle", color="#111")


def _mid(r):
    return ((r[0] + r[2]) / 2, (r[1] + r[3]) / 2)


def _arc(sh, cx, cy, r, a0, a1):
    import math
    p = []
    for i in range(13):
        a = math.radians(a0 + (a1 - a0) * i / 12)
        p.append(f"{sh.tx(cx + r * math.cos(a)):.2f},{sh.ty(cy + r * math.sin(a)):.2f}")
    return (f'<polyline points="{" ".join(p)}" fill="none" stroke="#111" '
            f'stroke-width="0.18"/>')


def fixed_plan(sh):
    for b in SOLIDS:
        if b.group == "FIXED_ELEMENTS" and b.z0 < 1200:
            sh.rect(b.x0, b.y0, b.x1, b.y1, "fine",
                    fill="#eeeeee" if "RADIATOR" not in b.name else "#fff")
    for b in SOLIDS:
        if b.group.startswith("KITCHEN") and b.z0 < 1000:
            sh.rect(b.x0, b.y0, b.x1, b.y1, "fine", fill="#f4f4f4")


def room_labels(sh, areas=True):
    for key, ((x0, y0), (x1, y1), name) in M.ROOMS.items():
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        if key == "HALL":
            cy = y0 + 1100
        sh.text(cx, cy + 220, name, 4.0, "middle", weight="bold")
        if areas:
            a = (x1 - x0) * (y1 - y0) / 1e6
            sh.text(cx, cy - 250, f"{a:.1f} m2  (E)", 2.6, "middle")
    sh.text((M.CORR_X0 + M.CORR_X1) / 2, M.ROW_Y1 + 900, "CORRIDOR", 3.0,
            "middle", weight="bold", rotate=-90)
    sh.text((M.CORR_X0 + M.CORR_X1) / 2, M.CORR_Y1 - 250,
            "SCOPE BOUNDARY", 2.2, "middle", color="#900")
    sh.line(M.CORR_X0, M.CORR_Y1, M.CORR_X1, M.CORR_Y1, "cut", dash="6,3")


AREA = (20, 26, 668, 566)          # clear drawing area, left of the title block


def new_plan(title, number, scale=25, bounds=None):
    sh = Sheet(title, number, scale)
    sh.fit(bounds or BOUNDS, AREA)
    return sh


# ---------------------------------------------------------------------------
# A-001  existing floor plan
# ---------------------------------------------------------------------------

def a001():
    sh = new_plan("EXISTING FLOOR PLAN", "A-001")
    wall_footprints(sh)
    fixed_plan(sh)
    opening_symbols(sh)
    room_labels(sh)
    sh.text(M.BLADE_X0 + 200, M.BLADE_Y1 + 900, "FIREPLACE BLADE - DOUBLE SIDED", 2.4)
    sh.text(M.COL_X0, M.BLADE_Y0 - 700, "COLUMN (A)", 2.4)
    sh.north_arrow(755, 60)
    sh.scalebar(690, 130)
    sh.titleblock(NOTES_COMMON)
    sh.save(os.path.join(DRW, "A-001_existing_floor_plan.svg"))
    return sh


# ---------------------------------------------------------------------------
# A-002  dimensioned plan
# ---------------------------------------------------------------------------

def a002():
    sh = new_plan("DIMENSIONED FLOOR PLAN", "A-002", bounds=BOUNDS_DIM)
    wall_footprints(sh)
    fixed_plan(sh)
    opening_symbols(sh)
    room_labels(sh, areas=False)

    y = M.HALL_Y0 - M.TE
    sh.dim_h(M.HALL_X0, M.HALL_X1, y, f"{M.HALL_X1:,} (E)", off=-900)
    sh.dim_h(M.KIT_X0, M.KIT_X1, y, f"{M.KW:,} (D)", off=-1900)
    sh.dim_h(M.ENT_X0, M.ENT_X1, y, f"{M.EW:,} (E)", off=-1900)
    sh.dim_h(M.ALC_X0, M.ALC_X1, y, f"{M.ALC_X1 - M.ALC_X0:,} (E)", off=-1900)

    x = M.HALL_X1 + M.TE
    sh.dim_v(M.HALL_Y0, M.HALL_Y1, x, f"{M.HD:,} (E)", off=900)
    sh.dim_v(M.ROW_Y0, M.ROW_Y1, x, f"{M.KD:,} (D)", off=900)
    sh.dim_v(M.HALL_Y0 - M.TE, M.ROW_Y1 + M.TE, x,
             f"{M.ROW_Y1 + 2 * M.TE:,} (E)", off=1900)

    pt = M.HALL_X0 + 1500
    sh.dim_h(pt, pt + v("Passthrough_Width"), M.ROW_Y0,
             f'{v("Passthrough_Width"):,} (D)', off=700)
    sh.dim_h(M.BLADE_X0, M.BLADE_X1, M.BLADE_Y0,
             f'{v("Blade_Length"):,} (D)', off=-700)
    sh.north_arrow(755, 60)
    sh.scalebar(690, 130)
    sh.titleblock(NOTES_COMMON + [
        "6. C-003: HALL LENGTH IS THE LARGEST UNCERTAINTY, +/- 800 mm."])
    sh.save(os.path.join(DRW, "A-002_dimensioned_floor_plan.svg"))


# ---------------------------------------------------------------------------
# A-003  furniture plan
# ---------------------------------------------------------------------------

def a003():
    sh = new_plan("FURNITURE PLAN", "A-003")
    wall_footprints(sh)
    fixed_plan(sh)
    opening_symbols(sh)
    for b in SOLIDS:
        if b.group == "FURNITURE":
            sh.rect(b.x0, b.y0, b.x1, b.y1, "fine", fill="#fafafa")
            sh.text((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2,
                    b.name.replace("F-", "").replace("-", " "), 1.9, "middle")
    room_labels(sh, areas=False)
    sh.north_arrow(755, 60)
    sh.scalebar(690, 130)
    sh.titleblock(NOTES_COMMON + [
        "6. FURNITURE IS MOVABLE AND IS NOT ARCHITECTURAL GEOMETRY.",
        "   IT IS SHOWN AS RECORDED AND WAS USED ONLY AS A SCALE REFERENCE."])
    sh.save(os.path.join(DRW, "A-003_furniture_plan.svg"))


# ---------------------------------------------------------------------------
# elevations + sections
# ---------------------------------------------------------------------------

def elevation(number, title, view, keep=None, cut=None, scale=25,
              notes=(), furniture=False):
    """`cut` is (axis, value): drop everything on the near side of the plane,
    and draw whatever the plane passes through with the heavy cut lineweight."""
    sh = Sheet(title, number, scale)
    items = []
    for b in SOLIDS:
        if not furniture and b.group in ("FURNITURE", "LIGHTING"):
            continue
        is_cut = False
        if cut:
            ax, val = cut
            lo, hi = getattr(b, ax + "0"), getattr(b, ax + "1")
            if (VIEW_SIGN[view] > 0 and hi <= val) or \
               (VIEW_SIGN[view] < 0 and lo >= val):
                continue
            is_cut = lo < val < hi
        if keep and not keep(b):
            continue
        u0, z0, u1, z1, depth = project(b, view)
        if u1 - u0 < 1 or z1 - z0 < 1:
            continue
        items.append((depth, (u1 - u0) * (z1 - z0), u0, z0, u1, z1, b, is_cut))
    if not items:
        raise SystemExit(f"{number}: nothing to draw")

    # farthest first; larger elements behind smaller ones at equal depth
    items.sort(key=lambda t: (-t[0], -t[1]))
    front = max(i[0] for i in items)
    us = [i[2] for i in items] + [i[4] for i in items]
    zs = [i[3] for i in items] + [i[5] for i in items]
    lo, hi = min(us), max(us)
    zlo, zhi = min(zs), max(zs)
    m = scale                     # 1 paper mm expressed in model mm
    sh.fit((lo - 26 * m, zlo - 34 * m, hi + 96 * m, zhi + 14 * m), AREA)

    for depth, _, u0, z0, u1, z1, b, is_cut in items:
        near = depth > front - 1500
        if is_cut:
            w, fill = "cut", "#b9b9b9"
        elif b.group.startswith("ARCHITECTURE"):
            w, fill = ("edge", "#ffffff") if near else ("fine", "#fbfbfb")
        elif b.group == "FIXED_ELEMENTS":
            w, fill = "edge", "#efefef"
        elif b.group.startswith("KITCHEN"):
            w, fill = "fine", "#f5f5f5"
        else:
            w, fill = "fine", "#fdfdfd"
        sh.rect(u0, z0, u1, z1, w, fill=fill)

    for z, lbl in ((0, "FFL  +0"),
                   (v("Ceiling_Height_Hall_Soffit"), "FCL SOFFIT  +2,750 (E)"),
                   (v("Ceiling_Height_Hall_Cove"), "FCL COVE  +2,950 (E)")):
        if zlo - 200 <= z <= zhi + 200:
            sh.line(lo - 700, z, hi + 1000, z, "dim", dash="10,2,2,2")
            sh.text(hi + 1150, z + 70, lbl, 2.3)
    sh.dim_v(0, v("Ceiling_Height_Hall_Soffit"), lo, "2,750 (E)", off=-800)
    sh.dim_h(lo, hi, zlo, f"{int(hi - lo):,} (E)", off=-900)
    sh.scalebar(690, 130)
    sh.titleblock(NOTES_COMMON + list(notes))
    fn = title.lower().replace(" ", "_").replace("/", "_").replace("-", "")
    sh.save(os.path.join(DRW, f"{number}_{fn}.svg"))


def elevations_and_sections():
    HY0, HY1 = M.HALL_Y0, M.HALL_Y1
    RY0, RY1 = M.ROW_Y0, M.ROW_Y1

    elevation("E-001", "HALL SOUTH FACADE ELEVATION", "S",
              keep=lambda b: b.y0 < HY0 + 700 and b.z0 < 3000,
              notes=("6. INTERNAL ELEVATION OF THE HALL FACADE, LOOKING SOUTH.",))

    elevation("E-002", "KITCHEN WORK WALL ELEVATION", "N",
              keep=lambda b: b.y1 > RY1 - 900 and b.x1 <= M.KIT_X1 + 10 and b.z0 < 2800,
              scale=20,
              notes=("6. WORK RUN: WASHER / BASE / SINK / RANGE / BASE.",
                     "7. WALL CABINETS 1,450-2,050 (E). WORKTOP 900 (E)."))

    elevation("E-003", "KITCHEN PASS-THROUGH ELEVATION", "S",
              keep=lambda b: b.y0 < RY0 + 700 and b.x1 <= M.KIT_X1 + 10 and b.z0 < 2800,
              scale=20,
              notes=("6. PASS-THROUGH O-03: 2,100 x 1,150 (D), SILL 1,000 (E).",
                     "7. BI-FOLD TIMBER SHUTTERS TO BOTH JAMBS, NOT MODELLED."))

    blade_parts = ("BLADE", "MANTEL", "HEARTH", "MIRROR", "COLUMN")
    elevation("E-004", "FIREPLACE BLADE ELEVATION - ALCOVE FACE", "S",
              keep=lambda b: b.name.startswith(blade_parts),
              scale=10,
              notes=("6. DOUBLE-SIDED BLADE, SEE CONFLICT C-001.",
                     "7. COLUMN STRUCTURAL STATUS: NOT VERIFIED FROM PHOTOGRAPHS."))

    elevation("S-001", "SECTION AA - HALL LONGITUDINAL", "N",
              cut=("y", (HY0 + HY1) / 2),
              notes=("6. SECTION AA CUT THROUGH THE HALL, LOOKING NORTH.",
                     "7. TRAY CEILING COVE +200 (E) ABOVE THE FLAT SOFFIT."))

    elevation("S-002", "SECTION BB - KITCHEN CROSS SECTION", "E",
              keep=lambda b: b.y1 > HY1 - 400 and b.x0 <= M.KIT_X1 + 400,
              cut=("x", M.KIT_X1 / 2), scale=20,
              notes=("6. SECTION BB CUT THROUGH THE KITCHEN, LOOKING EAST.",
                     "7. SUSPENDED PVC SLAT CEILING AT 2,600 (E)."))


# ---------------------------------------------------------------------------
# DXF
# ---------------------------------------------------------------------------

def dxf_plan():
    doc = ezdxf.new("R2010", setup=True)
    doc.header["$INSUNITS"] = 4  # millimetres
    msp = doc.modelspace()
    for name, color in (("A-WALL", 7), ("A-WALL-OPEN", 4), ("A-FIXED", 3),
                        ("A-KITCHEN", 5), ("A-FURN", 8), ("A-ANNO", 2),
                        ("A-DIMS", 1)):
        doc.layers.add(name, color=color)

    for w in WALLS:
        for b in w.solids():
            if b.z0 < 10:
                msp.add_lwpolyline(b.footprint(), close=True,
                                   dxfattribs={"layer": "A-WALL"})
        for o, b in w.opening_boxes():
            msp.add_lwpolyline(b.footprint(), close=True,
                               dxfattribs={"layer": "A-WALL-OPEN"})
            msp.add_text(o.ref, height=90,
                         dxfattribs={"layer": "A-ANNO"}).set_placement(
                             ((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2))

    layer_of = {"FIXED_ELEMENTS": "A-FIXED", "FURNITURE": "A-FURN"}
    for b in SOLIDS:
        lay = layer_of.get(b.group, "A-KITCHEN" if b.group.startswith("KITCHEN") else None)
        if lay and b.z0 < 1200:
            msp.add_lwpolyline(b.footprint(), close=True, dxfattribs={"layer": lay})

    for key, ((x0, y0), (x1, y1), nm) in M.ROOMS.items():
        msp.add_text(nm, height=180, dxfattribs={"layer": "A-ANNO"}).set_placement(
            ((x0 + x1) / 2, (y0 + y1) / 2))

    msp.add_text("EXISTING FLOOR PLAN - V01 - NO DIMENSION VERIFIED",
                 height=220, dxfattribs={"layer": "A-ANNO"}).set_placement(
                     (M.HALL_X0, M.CORR_Y1 + 800))
    doc.saveas(os.path.join(EXP, "A-001_existing_floor_plan.dxf"))
    doc.saveas(os.path.join(DRW, "A-001_existing_floor_plan.dxf"))


# ---------------------------------------------------------------------------
# OBJ  (grouped, one object per element - nothing merged)
# ---------------------------------------------------------------------------

FACES = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
         (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]

MATS = {
    "ARCHITECTURE/Walls": ("wall", (0.91, 0.90, 0.86)),
    "ARCHITECTURE/Floor": ("floor", (0.86, 0.84, 0.78)),
    "ARCHITECTURE/Ceiling": ("ceiling", (0.96, 0.96, 0.95)),
    "FIXED_ELEMENTS": ("stone", (0.88, 0.86, 0.82)),
    "KITCHEN/Base Cabinets": ("timber", (0.55, 0.33, 0.20)),
    "KITCHEN/Wall Cabinets": ("timber", (0.55, 0.33, 0.20)),
    "KITCHEN/Countertop": ("worktop", (0.90, 0.89, 0.86)),
    "KITCHEN/Appliances": ("appliance", (0.93, 0.93, 0.92)),
    "KITCHEN/Fixtures": ("appliance", (0.93, 0.93, 0.92)),
    "FURNITURE": ("furniture", (0.70, 0.68, 0.66)),
    "LIGHTING": ("brass", (0.72, 0.60, 0.30)),
}


def obj():
    lines, mtl, vi = [], {}, 1
    lines.append("# V01_EXISTING - photographic reconstruction")
    lines.append("# units: millimetre   Z=0 = FFL")
    lines.append("mtllib existing_model_V01.mtl")
    current = None
    for b in sorted(SOLIDS, key=lambda s: s.group):
        mat, rgb = MATS.get(b.group, ("default", (0.8, 0.8, 0.8)))
        mtl[mat] = rgb
        if b.group != current:
            lines.append(f"g {b.group.replace('/', '_')}")
            current = b.group
        lines.append(f"o {b.name}")
        lines.append(f"usemtl {mat}")
        for x, y, z in b.corners():
            lines.append(f"v {x / 1000:.4f} {z / 1000:.4f} {-y / 1000:.4f}")
        for f in FACES:
            lines.append("f " + " ".join(str(vi + i) for i in f))
        vi += 8

    with open(os.path.join(EXP, "existing_model_V01.obj"), "w") as f:
        f.write("\n".join(lines) + "\n")
    with open(os.path.join(EXP, "existing_model_V01.mtl"), "w") as f:
        for name, (r, g, b_) in mtl.items():
            f.write(f"newmtl {name}\nKd {r:.3f} {g:.3f} {b_:.3f}\nKa 0.1 0.1 0.1\n"
                    f"Ks 0.05 0.05 0.05\nNs 20\nd 1.0\nillum 2\n\n")
    return len(SOLIDS)


# ---------------------------------------------------------------------------

def main():
    a001()
    a002()
    a003()
    axo.sheet(SOLIDS, DRW, NOTES_COMMON)
    axo.sheet_corners(SOLIDS, DRW, NOTES_COMMON)
    elevations_and_sections()
    dxf_plan()
    n = obj()
    scene_json()
    est = sum(1 for k in P if P[k][1] == "ESTIMATED")
    print(f"objects: {n}   parameters: {len(P)} ({est} ESTIMATED)")
    print(f"hall {M.HALL_X1:,} x {M.HD:,}   kitchen {M.KW:,} x {M.KD:,}")
    print("drawings ->", DRW)
    print("exports  ->", EXP)




def scene_json():
    """Compact scene for the validation viewer."""
    import json
    groups = sorted({b.group for b in SOLIDS})
    data = {
        "units": "mm",
        "groups": groups,
        "rooms": {k: {"x0": a[0], "y0": a[1], "x1": b_[0], "y1": b_[1], "label": lab}
                  for k, (a, b_, lab) in M.ROOMS.items()},
        "materials": sorted({M.material_of(b) for b in SOLIDS}),
        "cutHeight": CUT.CUT_HEIGHT,
        "boxes": [[b.name, groups.index(b.group),
                   round(b.x0), round(b.y0), round(b.z0),
                   round(b.x1), round(b.y1), round(b.z1),
                   sorted({M.material_of(x) for x in SOLIDS}).index(M.material_of(b)),
                   (1 if M.is_ceiling(b) else 0)
                   | (2 if M.is_exterior_wall(b) else 0)
                   | (4 if b.group.startswith("OPENINGS") else 0)
                   | (8 if b.group == "LIGHTING" else 0)] for b in SOLIDS],
        "facadeOf": {o.ref: w.name for w in M.walls()
                     if w.name.startswith("W-EXT") for o in w.openings},
        "axo": CUT.CAM_INTERIOR_AXONOMETRIC,
        "axoCorners": [list(c) for c in CUT.AXO_CORNERS],
        "cameras": [list(c) for c in CUT.PHOTO_CAMERAS],
    }
    with open(os.path.join(EXP, "scene_V01.json"), "w") as f:
        json.dump(data, f, separators=(",", ":"))
    return len(data["boxes"])

if __name__ == "__main__":
    main()
