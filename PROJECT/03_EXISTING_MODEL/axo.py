"""A-004 — INTERIOR CUTAWAY AXONOMETRIC (sections 36.1, 36.9, 36.10).

Orthographic parallel projection, looking diagonally down into the apartment
with the ceiling removed and the near facades cut down. Same geometry as every
other drawing; only the display rule differs.
"""

import math
import os

import cutaway as CUT
import model as M
from draw import Sheet
from params import v

# material -> (light fill, dark fill) — section 36.11, materials from A/05
MAT = {
    "floor_stone": "#DCD3C2", "floor_tile": "#D9DFDD", "rug": "#B9A891", "plaster": "#EFEEEA",
    "tile_wall": "#E8ECEC", "panelling": "#F4F3EF", "marble": "#E9E4D8",
    "brick": "#A9634A", "mirror": "#CFD8D8", "ceiling": "#F7F7F5",
    "cabinet": "#9A6440", "worktop": "#EDEDE8", "appliance": "#E6E8E8",
    "door_dark": "#6B3B2A", "door_white": "#F0EFEA", "joinery_dark": "#6E4334",
    "glazing": "#CBDCE2", "upholstery": "#BFC4BC", "timber": "#9C7A55",
    "brass": "#C6A24B",
}
# top faces lighten, side faces step down — a simple, legible shading ramp
CUT_POCHE = "#5C5A55"      # section poche on any surface the cut passes through
SHADE = {"top": 1.00, "s1": 0.90, "s2": 0.80, "s3": 0.72, "bot": 0.64}
FACES = [(0, 1, 2, 3, "bot"), (4, 7, 6, 5, "top"), (0, 4, 5, 1, "s1"),
         (1, 5, 6, 2, "s2"), (2, 6, 7, 3, "s3"), (3, 7, 4, 0, "s2")]


def _shade(hexcol, f):
    n = int(hexcol[1:], 16)
    c = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    return "#%02X%02X%02X" % tuple(min(255, round(x * f)) for x in c)


def project(x, y, z, az, el):
    """Orthographic axonometric. Returns (u, v, depth).

    Basis in the azimuth-rotated frame (u, w, z), camera elevated by `el`
    and looking down: forward = (0, cos el, -sin el), up = (0, sin el, cos el).
    """
    a, e = math.radians(az), math.radians(el)
    ca, sa, ce, se = math.cos(a), math.sin(a), math.cos(e), math.sin(e)
    u = x * ca - y * sa
    w = x * sa + y * ca          # into the scene, before the tilt
    vv = w * se + z * ce         # screen up
    depth = w * ce - z * se      # larger = farther from the camera
    return u, vv, depth


def render(sh, solids, az, el, cut=True, labels=True):
    polys = []
    for b, ztop, hidden in CUT.apply(solids, az, enabled=cut):
        if hidden or ztop <= b.z0:
            continue
        c = [(b.x0, b.y0, b.z0), (b.x1, b.y0, b.z0), (b.x1, b.y1, b.z0),
             (b.x0, b.y1, b.z0), (b.x0, b.y0, ztop), (b.x1, b.y0, ztop),
             (b.x1, b.y1, ztop), (b.x0, b.y1, ztop)]
        p = [project(*q, az, el) for q in c]
        col = MAT.get(M.material_of(b), "#DDDDDD")
        flat = ztop <= 60
        trimmed = ztop < b.z1 - 1        # the cutaway plane passes through it
        for f in FACES:
            q = [p[f[0]], p[f[1]], p[f[2]], p[f[3]]]
            area = ((q[1][0] - q[0][0]) * (q[2][1] - q[0][1])
                    - (q[2][0] - q[0][0]) * (q[1][1] - q[0][1]))
            if area <= 0:                       # back-face cull
                continue
            # sort on the nearest corner: a centroid key mis-orders large
            # elements against the small ones standing on them
            fill = (CUT_POCHE if (trimmed and f[4] == "top")
                    else _shade(col, SHADE[f[4]]))
            polys.append((min(t[2] for t in q), 0 if flat else 1, q, fill))
    # floors and rugs lie flat at z=0 and always sit behind what stands on
    # them, so they form their own pass and never fight the depth sort
    polys.sort(key=lambda t: (t[1], -t[0]))

    for _, _, q, fill in polys:
        pts = " ".join(f"{sh.tx(a):.2f},{sh.ty(b):.2f}" for a, b, _ in q)
        sh.body.append(f'<polygon points="{pts}" fill="{fill}" stroke="#33393A" '
                       f'stroke-width="0.10" stroke-linejoin="round"/>')

    if not labels:
        return
    for key, ((x0, y0), (x1, y1), name) in M.ROOMS.items():
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        if key == "HALL":
            cx, cy = x0 + 3000, y0 + 2600
        u, vv, _ = project(cx, cy, 30, az, el)
        sh.text(u, vv + 90, name, 3.4, "middle", weight="bold")
        a = (x1 - x0) * (y1 - y0) / 1e6
        sh.text(u, vv - 200, f"{a:.1f} m2 (E)", 2.3, "middle")


def bounds(solids, az, el, cut=True):
    us, vs = [], []
    for b, ztop, hidden in CUT.apply(solids, az, enabled=cut):
        if hidden:
            continue
        for q in ((b.x0, b.y0, b.z0), (b.x1, b.y1, ztop), (b.x1, b.y0, b.z0),
                  (b.x0, b.y1, ztop), (b.x0, b.y0, ztop), (b.x1, b.y1, b.z0)):
            u, vv, _ = project(*q, az, el)
            us.append(u)
            vs.append(vv)
    return min(us), min(vs), max(us), max(vs)


def sheet(solids, out_dir, notes_common):
    az, el = CUT.CAM_INTERIOR_AXONOMETRIC["az"], CUT.CAM_INTERIOR_AXONOMETRIC["el"]
    sh = Sheet("INTERIOR CUTAWAY AXONOMETRIC", "A-004", 25)
    x0, y0, x1, y1 = bounds(solids, az, el)
    m = 25 * 22
    sh.fit((x0 - m, y0 - m, x1 + m, y1 + m), (20, 26, 668, 566))
    render(sh, solids, az, el, cut=True)

    sh.paper_text(690, 44, "CAM_INTERIOR_AXONOMETRIC", 3.0, weight="bold")
    for i, t in enumerate([
            "Orthographic parallel projection",
            f"Azimuth {az}deg / elevation {el}deg",
            "VIEW_CUTAWAY_INTERIOR",
            "Ceiling hidden - near facades cut",
            f"Cut height {CUT.CUT_HEIGHT:,} mm above FFL"]):
        sh.paper_text(690, 52 + i * 4.6, t, 2.3, color="#444")
    sh.scalebar(690, 92)
    sh.titleblock(notes_common + [
        "6. PRESENTATION VIEW. THE UNDERLYING MODEL IS NOT MODIFIED:",
        "   THE CEILING AND THE CUT WALL PORTIONS REMAIN AS EDITABLE OBJECTS.",
        "7. SEE A-001 FOR THE FLOOR PLAN AT THE SAME SCALE."])
    sh.save(os.path.join(out_dir, "A-004_interior_cutaway_axonometric.svg"))


def sheet_corners(solids, out_dir, notes_common):
    """A-005 — the same cutaway from all four corners, on one sheet."""
    sh = Sheet("CUTAWAY AXONOMETRIC - FOUR CORNERS", "A-005", 62)
    az0, el0 = CUT.AXO_CORNERS[0][1], CUT.AXO_CORNERS[0][2]
    x0, y0, x1, y1 = bounds(solids, az0, el0)
    span = max(x1 - x0, y1 - y0) * 1.12
    sh.fit((-span, -span * 0.62, span, span * 0.62), (20, 26, 668, 566))
    cw = span * 0.98
    for i, (cid, az, el, note) in enumerate(CUT.AXO_CORNERS):
        ox = (-cw / 2 + cw * (i % 2)) * 1.02
        oy = (span * 0.30 - span * 0.60 * (i // 2))
        bx0, by0, bx1, by1 = bounds(solids, az, el)
        sub = Sheet("", "", sh.scale)
        sub.ox, sub.oy, sub.w, sub.h = sh.ox, sh.oy, sh.w, sh.h
        sub.ox += (ox - (bx0 + bx1) / 2)
        sub.oy += (oy - (by0 + by1) / 2)
        render(sub, solids, az, el, cut=True, labels=False)
        sh.body += sub.body
        sh.text(ox, oy - span * 0.245, cid, 3.0, "middle", weight="bold")
        sh.text(ox, oy - span * 0.275, note, 2.3, "middle")
    sh.scalebar(690, 92)
    sh.titleblock(notes_common + [
        "6. FOUR CUTAWAY DIRECTIONS. THE NEAR FACADES ARE CUT PER VIEW,",
        "   SO EVERY WALL IS READ AT FULL HEIGHT IN AT LEAST ONE VIEW."])
    sh.save(os.path.join(out_dir, "A-005_cutaway_four_corners.svg"))
