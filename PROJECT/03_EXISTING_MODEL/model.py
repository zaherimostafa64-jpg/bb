"""V01_EXISTING — as-built approximation, assembled from params.py.

Everything is an independently named box in a labelled hierarchy, so any
element can be moved, resized or deleted without rebuilding the model
(skill sections 17-19, 34). Walls carry their openings as data; the solid
geometry is decomposed at build time and never baked.
"""

from dataclasses import dataclass, field

from params import v

# ---------------------------------------------------------------------------
# primitives
# ---------------------------------------------------------------------------


@dataclass
class Box:
    name: str
    group: str
    x0: float
    y0: float
    z0: float
    x1: float
    y1: float
    z1: float

    def corners(self):
        return [
            (self.x0, self.y0, self.z0), (self.x1, self.y0, self.z0),
            (self.x1, self.y1, self.z0), (self.x0, self.y1, self.z0),
            (self.x0, self.y0, self.z1), (self.x1, self.y0, self.z1),
            (self.x1, self.y1, self.z1), (self.x0, self.y1, self.z1),
        ]

    def footprint(self):
        return [(self.x0, self.y0), (self.x1, self.y0),
                (self.x1, self.y1), (self.x0, self.y1)]


@dataclass
class Opening:
    """A hole in a wall. `pos` is measured along the wall's own axis."""
    ref: str
    kind: str            # door | window | passage | passthrough | balcony
    pos: float
    width: float
    sill: float
    head: float


@dataclass
class Wall:
    """Axis-aligned wall. `axis` is the direction it runs: 'x' or 'y'."""
    name: str
    group: str
    axis: str
    start: float         # along the axis
    end: float
    offset: float        # the other horizontal coordinate, wall centreline
    thickness: float
    height: float
    openings: list = field(default_factory=list)

    def _box(self, a0, a1, z0, z1, tag):
        h = self.thickness / 2.0
        if self.axis == "x":
            return Box(f"{self.name}{tag}", self.group,
                       a0, self.offset - h, z0, a1, self.offset + h, z1)
        return Box(f"{self.name}{tag}", self.group,
                   self.offset - h, a0, z0, self.offset + h, a1, z1)

    def solids(self):
        """Decompose into boxes around the openings."""
        holes = sorted(self.openings, key=lambda o: o.pos)
        out, cursor = [], self.start
        for i, o in enumerate(holes):
            a0, a1 = self.start + o.pos, self.start + o.pos + o.width
            if a0 > cursor:
                out.append(self._box(cursor, a0, 0, self.height, f"_p{i}"))
            if o.sill > 0:
                out.append(self._box(a0, a1, 0, o.sill, f"_{o.ref}_sill"))
            if o.head < self.height:
                out.append(self._box(a0, a1, o.head, self.height, f"_{o.ref}_head"))
            cursor = a1
        if cursor < self.end:
            out.append(self._box(cursor, self.end, 0, self.height, "_pN"))
        return out

    def opening_boxes(self):
        """The void of each opening, for symbols and elevations."""
        out = []
        for o in self.openings:
            a0 = self.start + o.pos
            out.append((o, self._box(a0, a0 + o.width, o.sill, o.head, f"_{o.ref}")))
        return out


# ---------------------------------------------------------------------------
# plan grid — derived from params, so editing params moves the whole plan
# ---------------------------------------------------------------------------

TE = v("Wall_Thickness_External")
TI = v("Wall_Thickness_Internal")

KW, KD = v("Kitchen_Width"), v("Kitchen_Depth")
EW = v("Entrance_Width")
HD = v("Hall_Depth")

# north row (y = ROW_Y0 .. ROW_Y1), west to east: kitchen | entrance | alcove
ROW_Y0 = HD + TI
ROW_Y1 = ROW_Y0 + KD

KIT_X0, KIT_X1 = 0, KW
ENT_X0, ENT_X1 = KIT_X1 + TI, KIT_X1 + TI + EW
ALC_X0 = ENT_X1 + TI
ALC_X1 = ALC_X0 + v("Alcove_Width")

HALL_X0, HALL_X1 = 0, ALC_X1          # hall runs the full width of the row
HALL_Y0, HALL_Y1 = 0, HD

CORR_X0 = ENT_X0 + 100                # corridor stub to the private zone
CORR_X1 = CORR_X0 + v("Passage_Corridor_Width")
CORR_Y1 = ROW_Y1 + 1800               # truncated at the scope boundary

H_SOF = v("Ceiling_Height_Hall_Soffit")
H_COVE = v("Ceiling_Height_Hall_Cove")
H_KIT = v("Ceiling_Height_Kitchen")

ROOMS = {
    "HALL":     ((HALL_X0, HALL_Y0), (HALL_X1, HALL_Y1), "HALL / RECEPTION"),
    "KITCHEN":  ((KIT_X0, ROW_Y0), (KIT_X1, ROW_Y1), "KITCHEN"),
    "ENTRANCE": ((ENT_X0, ROW_Y0), (ENT_X1, ROW_Y1), "ENTRANCE"),
    "ALCOVE":   ((ALC_X0, ROW_Y0), (ALC_X1, ROW_Y1), "SITTING ALCOVE"),
}


# ---------------------------------------------------------------------------
# ARCHITECTURE / Walls
# ---------------------------------------------------------------------------


def walls():
    W = []
    g = "ARCHITECTURE/Walls"

    # --- south facade (hall) -------------------------------------------
    south = Wall("W-EXT-S", g, "x", HALL_X0 - TE, HALL_X1 + TE, -TE / 2, TE, H_SOF)
    sh, hh = v("Window_Sill_Hall"), v("Window_Head_Hall")
    big, small = v("Window_W_Hall_Large"), v("Window_W_Hall_Small")
    south.openings = [
        Opening("W-H3", "window", 1000, big, sh, hh),
        Opening("W-H2", "window", 3900, small, sh, hh),
        Opening("BD-01", "balcony", 6600, v("Balcony_Door_Width"), 0,
                v("Balcony_Door_Height")),
        Opening("W-H1", "window", 9500, big, sh, hh),
    ]
    W.append(south)

    # --- east facade (hall + alcove) -----------------------------------
    east = Wall("W-EXT-E", g, "y", HALL_Y0 - TE, ROW_Y1 + TE, HALL_X1 + TE / 2,
                TE, H_SOF)
    east.openings = [Opening("W-H4", "window", 1500, small, sh, hh)]
    W.append(east)

    # --- west facade (hall + kitchen) ----------------------------------
    west = Wall("W-EXT-W", g, "y", HALL_Y0 - TE, ROW_Y1 + TE, HALL_X0 - TE / 2,
                TE, H_SOF)
    ks, kh, kwd = (v("Window_Sill_Kitchen"), v("Window_Head_Kitchen"),
                   v("Window_W_Kitchen"))
    pier = v("Kitchen_Pier_Width")
    k1 = ROW_Y0 - (HALL_Y0 - TE) + 200
    west.openings = [
        Opening("W-K1", "window", k1, kwd - 200, ks, kh),
        Opening("W-K2", "window", k1 + (kwd - 200) + pier, kwd - 200, ks, kh),
    ]
    W.append(west)

    # --- north facade (kitchen / entrance / alcove) --------------------
    north = Wall("W-EXT-N", g, "x", HALL_X0 - TE, HALL_X1 + TE, ROW_Y1 + TE / 2,
                 TE, H_SOF)
    north.openings = [
        Opening("O-02", "passage", CORR_X0 + TE, v("Passage_Corridor_Width"), 0,
                v("Passage_Corridor_Height")),
        Opening("D-01", "door", ENT_X1 - 1450 + TE, v("Door_Main_Width"), 0,
                v("Door_Main_Height")),
    ]
    W.append(north)

    # --- partition: hall <-> north row ---------------------------------
    part = Wall("W-INT-01", g, "x", HALL_X0, ENT_X1, HD + TI / 2, TI, H_SOF)
    part.openings = [
        Opening("O-03", "passthrough", 1500, v("Passthrough_Width"),
                v("Passthrough_Sill"), v("Passthrough_Head")),
        Opening("O-01", "passage", ENT_X0 + 300, v("Passage_Entrance_Width"), 0,
                v("Passage_Entrance_Height")),
    ]
    W.append(part)

    # the alcove is open to the hall; only the blade stands on that line.

    # --- partition: kitchen <-> entrance -------------------------------
    kw = Wall("W-INT-02", g, "y", ROW_Y0, ROW_Y1, KIT_X1 + TI / 2, TI, H_SOF)
    kw.openings = [Opening("D-02", "door", KD - 1100, v("Door_Width"), 0,
                           v("Door_Height"))]
    W.append(kw)

    # --- partition: entrance <-> alcove --------------------------------
    W.append(Wall("W-INT-03", g, "y", ROW_Y0, ROW_Y1, ENT_X1 + TI / 2, TI, H_SOF))

    # --- corridor stub (scope boundary) --------------------------------
    W.append(Wall("W-COR-W", g, "y", ROW_Y1, CORR_Y1, CORR_X0 - TI / 2, TI, H_SOF))
    W.append(Wall("W-COR-E", g, "y", ROW_Y1, CORR_Y1, CORR_X1 + TI / 2, TI, H_SOF))
    return W


# ---------------------------------------------------------------------------
# ARCHITECTURE / Floor + Ceiling
# ---------------------------------------------------------------------------


def shell():
    # one slab per room: a single scene-wide slab breaks depth sorting in any
    # painter's-algorithm view, and the kitchen has a different floor finish
    out = []
    for key, ((x0, y0), (x1, y1), _) in ROOMS.items():
        out.append(Box(f"FLOOR-{key}", "ARCHITECTURE/Floor",
                       x0, y0, -50, x1, y1, 0))
    out.append(Box("FLOOR-CORRIDOR", "ARCHITECTURE/Floor",
                   CORR_X0, ROW_Y1, -50, CORR_X1, CORR_Y1, 0))
    out.append(Box("FLOOR-THRESHOLDS", "ARCHITECTURE/Floor",
                   HALL_X0, HALL_Y1, -50, ENT_X1, ROW_Y0, 0))
    # hall ceiling: flat soffit with two coves lifted by the cove step
    out.append(Box("CEIL-HALL", "ARCHITECTURE/Ceiling",
                   HALL_X0, HALL_Y0, H_SOF, HALL_X1, HALL_Y1, H_SOF + 20))
    b = v("Cove_Border_Width")
    for i, (cx0, cx1) in enumerate([(HALL_X0 + b, HALL_X0 + HALL_X1 / 2 - b / 2),
                                    (HALL_X0 + HALL_X1 / 2 + b / 2, HALL_X1 - b)]):
        out.append(Box(f"CEIL-HALL-COVE-{i + 1}", "ARCHITECTURE/Ceiling",
                       cx0, HALL_Y0 + b, H_COVE, cx1, HALL_Y1 - b, H_COVE + 20))
    out.append(Box("CEIL-KITCHEN", "ARCHITECTURE/Ceiling",
                   KIT_X0, ROW_Y0, H_KIT, KIT_X1, ROW_Y1, H_KIT + 20))
    out.append(Box("CEIL-ENTRANCE", "ARCHITECTURE/Ceiling",
                   ENT_X0, ROW_Y0, H_SOF, ENT_X1, ROW_Y1, H_SOF + 20))
    out.append(Box("CEIL-ALCOVE", "ARCHITECTURE/Ceiling",
                   ALC_X0, ROW_Y0, H_SOF, ALC_X1, ROW_Y1, H_SOF + 20))
    return out


# ---------------------------------------------------------------------------
# FIXED_ELEMENTS / fireplace blade + column + kitchen pier
# ---------------------------------------------------------------------------

BLADE_X0 = ALC_X0
BLADE_X1 = BLADE_X0 + v("Blade_Length")
BLADE_YC = HD + TI / 2
BLADE_Y0 = BLADE_YC - v("Blade_Thickness") / 2
BLADE_Y1 = BLADE_YC + v("Blade_Thickness") / 2
COL_X0, COL_X1 = BLADE_X1, BLADE_X1 + v("Column_Size")


def fixed_elements():
    g = "FIXED_ELEMENTS"
    out = []
    fw, fh, fd = v("Firebox_Width"), v("Firebox_Height"), v("Firebox_Depth")
    mh, md, mt = v("Mantel_Height"), v("Mantel_Depth"), v("Mantel_Thickness")
    hh, hd = v("Hearth_Height"), v("Hearth_Depth")
    fx0 = (BLADE_X0 + BLADE_X1) / 2 - fw / 2
    fx1 = fx0 + fw

    # blade decomposed around the two fireboxes, so each recess stays editable
    out += [
        Box("BLADE-pier-W", g, BLADE_X0, BLADE_Y0, 0, fx0, BLADE_Y1, H_SOF),
        Box("BLADE-pier-E", g, fx1, BLADE_Y0, 0, BLADE_X1, BLADE_Y1, H_SOF),
        Box("BLADE-lintel", g, fx0, BLADE_Y0, fh, fx1, BLADE_Y1, H_SOF),
        Box("BLADE-core", g, fx0, BLADE_Y0 + fd, 0, fx1, BLADE_Y1 - fd, fh),
        Box("MANTEL-hall", g, BLADE_X0, BLADE_Y0 - (md - v("Blade_Thickness")) / 2,
            mh - mt, BLADE_X1, BLADE_YC, mh),
        Box("MANTEL-alcove", g, BLADE_X0, BLADE_YC, mh - mt,
            BLADE_X1, BLADE_Y1 + (md - v("Blade_Thickness")) / 2, mh),
        Box("HEARTH-hall", g, BLADE_X0, BLADE_Y0 - hd, 0, BLADE_X1, BLADE_Y0, hh),
        Box("HEARTH-alcove", g, BLADE_X0, BLADE_Y1, 0, BLADE_X1, BLADE_Y1 + hd, hh),
        Box("MIRROR-alcove", g, BLADE_X0 + 300, BLADE_Y1 - 20, mh + 100,
            BLADE_X1 - 300, BLADE_Y1, mh + 1100),
        Box("COLUMN-01", g, COL_X0, BLADE_Y0, 0, COL_X1, BLADE_Y1, H_SOF),
    ]
    # kitchen facade pier, between the two kitchen windows
    py0 = ROW_Y0 + 200 + (v("Window_W_Kitchen") - 200)
    out.append(Box("PIER-KITCHEN", g, KIT_X0, py0, 0,
                   KIT_X0 + v("Kitchen_Pier_Projection"),
                   py0 + v("Kitchen_Pier_Width"), H_KIT))
    # clock pier in the alcove
    out.append(Box("PIER-ALCOVE-CLOCK", g, ALC_X0 + 1600, ROW_Y1 - 400, 0,
                   ALC_X0 + 2200, ROW_Y1, H_SOF))
    # mirrored wardrobe in the entrance
    out.append(Box("WARDROBE-01", g, ENT_X1 - v("Wardrobe_Depth"),
                   ROW_Y1 - v("Wardrobe_Width") - 200, 0,
                   ENT_X1, ROW_Y1 - 200, v("Wardrobe_Height")))
    # radiators under the hall windows and the kitchen window
    rl, rh, rd = v("Radiator_Length"), v("Radiator_Height"), v("Radiator_Depth")
    for i, x in enumerate([1400, 4200, 9900]):
        out.append(Box(f"RADIATOR-H{i + 1}", g, x, 0, 150, x + rl, rd, 150 + rh))
    out.append(Box("RADIATOR-K1", g, 0, ROW_Y0 + 400, 150, rd, ROW_Y0 + 400 + rl,
                   150 + rh))
    return out


# ---------------------------------------------------------------------------
# KITCHEN
# ---------------------------------------------------------------------------


def kitchen():
    g = "KITCHEN"
    cd, ch = v("Counter_Depth"), v("Counter_Height")
    wd, wb, wt = v("Wall_Cabinet_Depth"), v("Wall_Cabinet_Bottom"), v("Wall_Cabinet_Top")
    out = []

    # --- work run on the north wall ------------------------------------
    run_x0, run_x1 = KIT_X0 + 200, KIT_X0 + 4500
    ny = ROW_Y1
    seq = [("Washer", v("Washer_Width")), ("Base-01", 900),
           ("Sink", v("Sink_Width")), ("Range", v("Range_Width")),
           ("Base-02", 700)]
    x = run_x0
    for nm, w in seq:
        grp = f"{g}/Appliances" if nm in ("Washer", "Range") else f"{g}/Base Cabinets"
        out.append(Box(f"K-{nm}", grp, x, ny - cd, 0, x + w, ny, ch))
        x += w
    out.append(Box("K-Countertop-N", f"{g}/Countertop",
                   run_x0, ny - cd, ch, run_x1, ny, ch + 40))
    out.append(Box("K-Wall-Cab-N1", f"{g}/Wall Cabinets",
                   run_x0 + 400, ny - wd, wb, run_x0 + 2400, ny, wt))
    hood_x = run_x0 + v("Washer_Width") + 900 + v("Sink_Width")
    out.append(Box("K-Hood", f"{g}/Fixtures",
                   hood_x + 150, ny - cd, wb, hood_x + 150 + v("Hood_Width"), ny, wb + 300))
    out.append(Box("K-Wall-Cab-N2", f"{g}/Wall Cabinets",
                   hood_x + 750, ny - wd, wb, run_x1, ny, wt))

    # --- counter run + bar slab on the pass-through wall ---------------
    sy = ROW_Y0
    out.append(Box("K-Base-03", f"{g}/Base Cabinets",
                   KIT_X0 + 200, sy, 0, KIT_X0 + 4000, sy + cd, ch))
    out.append(Box("K-Countertop-S", f"{g}/Countertop",
                   KIT_X0 + 200, sy, ch, KIT_X0 + 4000, sy + cd, ch + 40))
    out.append(Box("K-Wall-Cab-S", f"{g}/Wall Cabinets",
                   KIT_X0 + 200, sy, wb, KIT_X0 + 1400, sy + wd, wt))
    pt_x0 = HALL_X0 + 1500
    out.append(Box("K-Bar-Slab", f"{g}/Countertop",
                   pt_x0, sy - v("Bar_Slab_Depth") / 2, v("Passthrough_Sill") - v("Bar_Slab_Thickness"),
                   pt_x0 + v("Passthrough_Width"), sy + cd, v("Passthrough_Sill")))

    # --- fridge on the east wall ---------------------------------------
    out.append(Box("K-Fridge", f"{g}/Appliances",
                   KIT_X1 - v("Fridge_Depth"), ROW_Y0 + 400, 0,
                   KIT_X1, ROW_Y0 + 400 + v("Fridge_Width"), v("Fridge_Height")))
    out.append(Box("K-Freezer", f"{g}/Appliances",
                   KIT_X1 - v("Fridge_Depth"), ROW_Y0 + 400 + v("Fridge_Width"), 0,
                   KIT_X1, ROW_Y0 + 400 + 2 * v("Fridge_Width"), v("Fridge_Height")))
    return out


# ---------------------------------------------------------------------------
# FURNITURE — movable, kept strictly separate (skill section 09)
# ---------------------------------------------------------------------------


def furniture():
    g = "FURNITURE"
    return [
        Box("F-Dining-Table", g, 1600, 1900, 0, 3800, 3100, 780),
        Box("F-Sofa-Hall-01", g, 8300, 600, 0, 10500, 1500, 800),
        Box("F-Sofa-Hall-02", g, 11200, 1800, 0, 12100, 4000, 800),
        Box("F-Coffee-Table-01", g, 9200, 2000, 0, 10600, 2900, 420),
        Box("F-TV-Unit", g, 6300, 4900, 0, 8000, 5500, 700),
        Box("F-Armchair-01", g, 5200, 900, 0, 6000, 1700, 800),
        Box("F-Sofa-Alcove-01", g, ALC_X0 + 700, ROW_Y1 - 900, 0,
            ALC_X0 + 2600, ROW_Y1 - 50, 800),
        Box("F-Armchair-Alcove-01", g, ALC_X0 + 300, ROW_Y0 + 1400, 0,
            ALC_X0 + 1150, ROW_Y0 + 2250, 800),
        Box("F-Armchair-Alcove-02", g, ALC_X0 + 2900, ROW_Y1 - 1500, 0,
            ALC_X0 + 3750, ROW_Y1 - 650, 800),
        Box("F-Coffee-Table-Alcove", g, ALC_X0 + 1400, ROW_Y0 + 1500, 0,
            ALC_X0 + 2600, ROW_Y0 + 2300, 420),
        Box("F-Kitchen-Table", g, KIT_X0 + 900, ROW_Y0 + 1100, 0,
            KIT_X0 + 2100, ROW_Y0 + 2300, 750),
        Box("F-Console-Entrance", g, ENT_X0 + 100, ROW_Y1 - 1600, 0,
            ENT_X0 + 500, ROW_Y1 - 500, 800),
    ]


# ---------------------------------------------------------------------------
# LIGHTING
# ---------------------------------------------------------------------------


def lighting():
    g = "LIGHTING"
    c1x = HALL_X0 + HALL_X1 / 4
    c2x = HALL_X0 + 3 * HALL_X1 / 4
    cy = (HALL_Y0 + HALL_Y1) / 2
    out = [
        Box("L-Chandelier-01", g, c1x - 400, cy - 400, H_COVE - 800, c1x + 400, cy + 400, H_COVE),
        Box("L-Chandelier-02", g, c2x - 400, cy - 400, H_COVE - 800, c2x + 400, cy + 400, H_COVE),
        Box("L-Chandelier-Alcove", g, ALC_X0 + 1800, ROW_Y0 + 1700, H_SOF - 700,
            ALC_X0 + 2400, ROW_Y0 + 2300, H_SOF),
    ]
    for i, x in enumerate([ENT_X0 + 700, ENT_X0 + 2000]):
        out.append(Box(f"L-Downlight-0{i + 1}", g, x - 90, ROW_Y1 - 900, H_SOF - 30,
                       x + 90, ROW_Y1 - 720, H_SOF))
    return out


# ---------------------------------------------------------------------------
# assembly
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# OPENINGS — door leaves, glazing and frames as real objects (section 36.2)
# Doors and windows must be VISIBLE in the cutaway, not just voids.
# ---------------------------------------------------------------------------

LEAF = 45          # door leaf thickness
GLASS = 30         # glazing thickness
FRAME = 70         # window frame section


def _perp(wall, a0, a1, z0, z1, depth, swing, name, group):
    """Box perpendicular to `wall`, hinged at a0, projecting `depth` to `swing`."""
    h = wall.thickness / 2
    face = wall.offset + h if swing > 0 else wall.offset - h
    o0, o1 = sorted((face, face + depth * swing))
    if wall.axis == "x":
        return Box(name, group, a0, o0, z0, a1, o1, z1)
    return Box(name, group, o0, a0, z0, o1, a1, z1)


def _inplane(wall, a0, a1, z0, z1, thick, name, group):
    """Box lying in the plane of `wall`, centred in its thickness."""
    c = wall.offset
    if wall.axis == "x":
        return Box(name, group, a0, c - thick / 2, z0, a1, c + thick / 2, z1)
    return Box(name, group, c - thick / 2, a0, z0, c + thick / 2, a1, z1)


def openings3d():
    """Leaves, glazing and frames, derived from the same Opening data as the
    plans — so an opening can never drift between plan, elevation and 3D."""
    out = []
    for w in walls():
        for o in w.openings:
            a0 = w.start + o.pos
            a1 = a0 + o.width
            sw = SWING.get(o.ref, 1)

            if o.kind in ("door", "balcony"):
                g = "OPENINGS/Doors"
                if o.ref == "D-01":                      # unequal double leaf
                    wide = o.width * 0.64
                    out.append(_perp(w, a0, a0 + LEAF, 0, o.head, wide, sw,
                                     f"{o.ref}-leaf-A", g))
                    out.append(_perp(w, a1 - LEAF, a1, 0, o.head,
                                     o.width - wide, sw, f"{o.ref}-leaf-B", g))
                else:
                    out.append(_perp(w, a0, a0 + LEAF, 0, o.head, o.width, sw,
                                     f"{o.ref}-leaf", g))
                out.append(_inplane(w, a0 - 60, a1 + 60, o.head, o.head + 90,
                                    w.thickness + 40, f"{o.ref}-head", g))

            elif o.kind == "window":
                g = "OPENINGS/Windows"
                out.append(_inplane(w, a0 + FRAME, a1 - FRAME,
                                    o.sill + FRAME, o.head - FRAME, GLASS,
                                    f"{o.ref}-glazing", g))
                t = w.thickness * 0.8
                out.append(_inplane(w, a0, a0 + FRAME, o.sill, o.head, t,
                                    f"{o.ref}-jamb-A", g))
                out.append(_inplane(w, a1 - FRAME, a1, o.sill, o.head, t,
                                    f"{o.ref}-jamb-B", g))
                out.append(_inplane(w, a0, a1, o.sill, o.sill + FRAME, t,
                                    f"{o.ref}-cill", g))
                out.append(_inplane(w, a0, a1, o.head - FRAME, o.head, t,
                                    f"{o.ref}-head", g))
    return out


# which way each hinged leaf opens, along the wall's normal
SWING = {"D-01": -1, "D-02": 1, "BD-01": 1}


# ---------------------------------------------------------------------------
# FURNITURE / Rugs — floor finishes read far better with the rugs in place
# ---------------------------------------------------------------------------


def rugs():
    g = "FURNITURE/Rugs"
    return [
        Box("R-Hall-01", g, 8600, 1500, 0, 11400, 3600, 12),
        Box("R-Hall-02", g, 5400, 700, 0, 8200, 2600, 12),
        Box("R-Dining", g, 1200, 1500, 0, 4200, 3500, 12),
        Box("R-Alcove", g, ALC_X0 + 900, ROW_Y0 + 900, 0,
            ALC_X0 + 3300, ROW_Y0 + 2600, 12),
        Box("R-Entrance", g, ENT_X0 + 800, ROW_Y1 - 700, 0,
            ENT_X0 + 2000, ROW_Y1 - 200, 12),
    ]


# ---------------------------------------------------------------------------
# MATERIALS — section 36.11: the cutaway must not read as a monochrome mass
# ---------------------------------------------------------------------------

def material_of(box):
    n, g = box.name, box.group
    if g == "OPENINGS/Windows":
        return "glazing" if "glazing" in n else "joinery_dark"
    if g == "OPENINGS/Doors":
        return "door_dark" if n.startswith("D-01") else "door_white"
    if g == "FURNITURE/Rugs":
        return "rug"
    if n.startswith("FLOOR"):
        return "floor_tile" if "KITCHEN" in n else "floor_stone"
    if n.startswith("CEIL"):
        return "ceiling"
    if n.startswith("BLADE") or n.startswith("COLUMN"):
        return "brick" if "core" in n else "panelling"
    if n.startswith(("MANTEL", "HEARTH")):
        return "marble"
    if n.startswith("MIRROR"):
        return "mirror"
    if n.startswith("RADIATOR"):
        return "appliance"
    if n.startswith(("PIER-KITCHEN",)):
        return "tile_wall"
    if g.startswith("KITCHEN"):
        if "Countertop" in g or "Bar" in n:
            return "worktop"
        if "Appliances" in g or "Fixtures" in g:
            return "appliance"
        return "cabinet"
    if g == "FURNITURE":
        return "upholstery" if ("Sofa" in n or "Armchair" in n) else "timber"
    if g == "LIGHTING":
        return "brass"
    if g.startswith("ARCHITECTURE/Wall"):
        # kitchen walls are tiled full height
        inside_kitchen = (box.x1 <= KIT_X1 + TI and box.y0 >= ROW_Y0 - TI)
        return "tile_wall" if inside_kitchen else "plaster"
    return "plaster"


def is_exterior_wall(box):
    return box.name.startswith("W-EXT")


def is_ceiling(box):
    return box.name.startswith("CEIL")


# ---------------------------------------------------------------------------
# assembly
# ---------------------------------------------------------------------------


def build():
    W = walls()
    solids = []
    for w in W:
        solids += w.solids()
    solids += (shell() + fixed_elements() + kitchen() + furniture() + rugs()
               + openings3d() + lighting())
    return W, solids
