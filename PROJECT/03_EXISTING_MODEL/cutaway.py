"""VIEW_CUTAWAY_INTERIOR — display configuration, section 36.

This is a *display rule*, not a second model. It never edits the underlying
geometry: it decides, per element and per camera direction, whether that
element is drawn in full, drawn cut down, or hidden. The complete model
(VIEW A) is the same object list with the rule switched off.

Method, per section 36.3: exterior walls that stand between the camera and the
interior are **cut down to a low sill**, not made transparent. The result reads
as a physical architectural cutaway model. Far walls keep full height so the
apartment still reads as an enclosed room rather than a floating floor plate.
"""

import math

import model as M

# Height the near exterior walls are cut down to. Low enough to see over,
# high enough to still read as a wall and to show sills and skirtings.
CUT_HEIGHT = 950


def near_walls(az_deg):
    """Which exterior facades face the camera, for an azimuth in degrees.

    Azimuth 0 looks from -Y towards +Y (from the south). The camera sits on
    the outside of the facades whose outward normal points towards it.
    """
    a = math.radians(az_deg)
    # the projection puts the camera on the -w side, so from the target the
    # camera lies towards (-sin az, -cos az). A facade is "near" - and so
    # obstructs - when its outward normal points towards the camera.
    cam = (-math.sin(a), -math.cos(a))
    facing = {"W-EXT-S": (0, -1), "W-EXT-N": (0, 1),
              "W-EXT-W": (-1, 0), "W-EXT-E": (1, 0)}
    return {n for n, nml in facing.items()
            if nml[0] * cam[0] + nml[1] * cam[1] > 0.06}


def apply(boxes, az_deg, enabled=True):
    """Yield (box, z_top, hidden) for the given camera azimuth.

    `z_top` may be lower than the box's own z1 where the cutaway trims it.
    Nothing is mutated; callers draw to `z_top` instead of `box.z1`.
    """
    cut = near_walls(az_deg) if enabled else set()
    for b in boxes:
        if not enabled:
            yield b, b.z1, False
            continue
        if M.is_ceiling(b):                      # 36.2 — roof/ceiling hidden
            yield b, b.z1, True
            continue
        if b.name.startswith("L-Chandelier") or b.name.startswith("L-Down"):
            yield b, b.z1, True                  # hangs in the sightline
            continue
        if M.is_exterior_wall(b) and b.name.split("_")[0] in cut:
            if b.z0 >= CUT_HEIGHT:               # heads and upper panels go
                yield b, b.z1, True
            else:
                yield b, min(b.z1, CUT_HEIGHT), False
            continue
        # glazing and frames in a cut facade go with it
        head = b.name.split("-")[0] + "-" + b.name.split("-")[1] \
            if b.name.count("-") >= 1 else b.name
        if b.group.startswith("OPENINGS") and _in_cut_facade(b, cut):
            if b.z0 >= CUT_HEIGHT:
                yield b, b.z1, True
            else:
                yield b, min(b.z1, CUT_HEIGHT), False
            continue
        yield b, b.z1, False


_FACADE_OF = {}


def _in_cut_facade(b, cut):
    """True when an opening object sits in one of the cut exterior facades."""
    if not _FACADE_OF:
        for w in M.walls():
            if not w.name.startswith("W-EXT"):
                continue
            for o in w.openings:
                _FACADE_OF[o.ref] = w.name
    ref = b.name.split("-glazing")[0].split("-jamb")[0] \
        .split("-cill")[0].split("-head")[0].split("-leaf")[0]
    return _FACADE_OF.get(ref) in cut


# ---------------------------------------------------------------------------
# CAM_INTERIOR_AXONOMETRIC and the photo-matched interior cameras
# ---------------------------------------------------------------------------

CAM_INTERIOR_AXONOMETRIC = {
    "id": "CAM_INTERIOR_AXONOMETRIC",
    "kind": "orthographic",
    "az": 32, "el": 38,
    "note": "Primary presentation view - interior cutaway axonometric",
}

AXO_CORNERS = [
    ("CAM_AXO_SW", 32, 38, "from the dining / kitchen corner"),
    ("CAM_AXO_SE", -32, 38, "from the living / alcove corner"),
    ("CAM_AXO_NE", -148, 40, "from behind the alcove"),
    ("CAM_AXO_NW", 148, 40, "from behind the kitchen"),
]

# section 36.13 — photo-matched interior cameras, same underlying geometry
PHOTO_CAMERAS = [
    ("CAM_ENTRANCE_01", 6300, 6600, 1600, 180, "IMG_22 - entrance towards the blade"),
    ("CAM_LIVING_01", 2900, 2600, 1550, 100, "IMG_01 - hall towards the balcony"),
    ("CAM_LIVING_02", 11000, 2400, 1550, 280, "IMG_03 - hall towards the kitchen"),
    ("CAM_DINING_01", 2600, 3100, 1500, 0, "IMG_05 - frontal on the pass-through"),
    ("CAM_KITCHEN_01", 4200, 8300, 1550, 250, "IMG_18 - kitchen towards the windows"),
    ("CAM_ALCOVE_01", 10200, 4600, 1550, 20, "IMG_10 - alcove and the blade"),
]
