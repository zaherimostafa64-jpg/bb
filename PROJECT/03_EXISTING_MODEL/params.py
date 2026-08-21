"""V01_EXISTING — parametric dimension set.

Single source of truth for the reconstruction. Units: millimetre.
X = horizontal, Y = depth, Z = vertical, Z=0 = FFL.

Confidence per skill section 12: VERIFIED / DERIVED / ESTIMATED / ASSUMED.
No value here is VERIFIED: the user supplied no site measurements.
Edit values in P, re-run build.py, and every drawing and the 3D model follow.
"""

CONFIDENCE = {
    "VERIFIED": "supported by measurement or unambiguous photographic evidence",
    "DERIVED": "calculated from several photographs plus a standard element",
    "ESTIMATED": "architectural estimate from visual proportion",
    "ASSUMED": "placeholder; information is missing",
}

# name -> (value_mm, confidence, note)
P = {
    # ---- vertical -------------------------------------------------------
    "Ceiling_Height_Hall_Soffit":   (2750, "ESTIMATED", "flat perimeter soffit"),
    "Ceiling_Height_Hall_Cove":     (2950, "ESTIMATED", "inside the tray cove"),
    "Ceiling_Height_Entrance":      (2750, "ESTIMATED", "flat, recessed downlights"),
    "Ceiling_Height_Kitchen":       (2600, "ESTIMATED", "suspended PVC slat ceiling"),
    "Cove_Border_Width":             (900, "ESTIMATED", "flat border around each cove"),

    # ---- wall thickness -------------------------------------------------
    "Wall_Thickness_External":       (300, "ASSUMED", "NOT VERIFIED FROM PHOTOGRAPHS"),
    "Wall_Thickness_Internal":       (200, "ASSUMED", "NOT VERIFIED FROM PHOTOGRAPHS"),
    "Blade_Thickness":               (600, "ASSUMED", "houses a flue; NOT VERIFIED"),
    "Column_Size":                   (600, "ESTIMATED", "panelled column; structural status NOT VERIFIED"),
    "Kitchen_Pier_Width":            (600, "ESTIMATED", "pier between the kitchen windows"),
    "Kitchen_Pier_Projection":       (300, "ESTIMATED", "NOT VERIFIED"),

    # ---- room clear sizes ----------------------------------------------
    "Hall_Length":                 (12200, "ESTIMATED", "CONFLICT C-003, +/-800"),
    "Hall_Depth":                   (5600, "ESTIMATED", ""),
    "Alcove_Width":                 (4400, "ESTIMATED", ""),
    "Alcove_Depth":                 (3400, "ESTIMATED", ""),
    "Kitchen_Width":                (4800, "DERIVED", "from the work-run build-up"),
    "Kitchen_Depth":                (3400, "DERIVED", ""),
    "Entrance_Width":               (2800, "ESTIMATED", ""),
    "Entrance_Depth":               (3400, "ESTIMATED", ""),

    # ---- doors ----------------------------------------------------------
    "Door_Main_Width":              (1250, "ESTIMATED", "double leaf 800 + 450"),
    "Door_Main_Height":             (2250, "ESTIMATED", ""),
    "Door_Width":                    (900, "ESTIMATED", "standard/inferred, anchor A1"),
    "Door_Height":                  (2100, "ESTIMATED", "standard/inferred, anchor A1"),

    # ---- openings -------------------------------------------------------
    "Passage_Entrance_Width":       (2200, "ESTIMATED", "entrance -> hall"),
    "Passage_Entrance_Height":      (2400, "ESTIMATED", ""),
    "Passage_Corridor_Width":       (1100, "ESTIMATED", "to the private zone"),
    "Passage_Corridor_Height":      (2200, "ESTIMATED", ""),
    "Passthrough_Width":            (2100, "DERIVED", "read against the 910 fridge, IMG_06"),
    "Passthrough_Sill":             (1000, "ESTIMATED", ""),
    "Passthrough_Head":             (2150, "ESTIMATED", ""),

    # ---- windows --------------------------------------------------------
    "Window_Sill_Hall":              (900, "ESTIMATED", "above the radiators"),
    "Window_Head_Hall":             (2200, "ESTIMATED", "aligns with the balcony door head"),
    "Window_Sill_Kitchen":          (1000, "ESTIMATED", "above the 900 worktop"),
    "Window_Head_Kitchen":          (2150, "ESTIMATED", ""),
    "Window_W_Hall_Large":          (1800, "ESTIMATED", ""),
    "Window_W_Hall_Small":          (1400, "ESTIMATED", ""),
    "Window_W_Kitchen":             (1400, "ESTIMATED", ""),
    "Window_W_Kitchen_West":        (1600, "ASSUMED", "single view only, CONFLICT C-002"),
    "Balcony_Door_Width":           (1600, "ESTIMATED", ""),
    "Balcony_Door_Height":          (2200, "ESTIMATED", ""),

    # ---- fireplace blade ------------------------------------------------
    "Blade_Length":                 (2400, "DERIVED", ""),
    "Firebox_Width":                (1100, "ESTIMATED", ""),
    "Firebox_Height":                (900, "ESTIMATED", ""),
    "Firebox_Depth":                 (250, "ESTIMATED", ""),
    "Mantel_Height":                (1100, "ESTIMATED", "top of the marble shelf"),
    "Mantel_Depth":                  (750, "ESTIMATED", "projection each side of the blade"),
    "Mantel_Thickness":               (60, "ESTIMATED", ""),
    "Hearth_Height":                 (300, "ESTIMATED", ""),
    "Hearth_Depth":                  (500, "ESTIMATED", ""),

    # ---- kitchen fittings -----------------------------------------------
    "Counter_Depth":                 (600, "ESTIMATED", "standard/inferred, anchor A2"),
    "Counter_Height":                (900, "ESTIMATED", "standard/inferred"),
    "Wall_Cabinet_Depth":            (350, "ESTIMATED", ""),
    "Wall_Cabinet_Bottom":          (1450, "ESTIMATED", "550 splashback"),
    "Wall_Cabinet_Top":             (2050, "ESTIMATED", ""),
    "Bar_Slab_Depth":                (400, "ESTIMATED", ""),
    "Bar_Slab_Thickness":             (40, "ESTIMATED", ""),
    "Fridge_Width":                  (910, "ESTIMATED", "side-by-side, cross-check"),
    "Fridge_Depth":                  (750, "ESTIMATED", ""),
    "Fridge_Height":                (1780, "ESTIMATED", ""),
    "Range_Width":                   (900, "ESTIMATED", "standard/inferred, anchor A3"),
    "Washer_Width":                  (600, "ESTIMATED", ""),
    "Hood_Width":                    (600, "ESTIMATED", ""),
    "Sink_Width":                   (1200, "ESTIMATED", ""),

    # ---- misc -----------------------------------------------------------
    "Skirting_Height":               (100, "ESTIMATED", ""),
    "Radiator_Length":              (1000, "ESTIMATED", ""),
    "Radiator_Height":               (600, "ESTIMATED", ""),
    "Radiator_Depth":                (100, "ESTIMATED", ""),
    "Wardrobe_Width":               (1200, "ESTIMATED", "mirrored, entrance hall"),
    "Wardrobe_Depth":                (600, "ESTIMATED", ""),
    "Wardrobe_Height":              (2200, "ESTIMATED", ""),
}


def v(name: str) -> int:
    """Dimension value in mm."""
    return P[name][0]


def tag(name: str) -> str:
    """Confidence tag."""
    return P[name][1]


def label(name: str) -> str:
    """Dimension formatted for annotation, e.g. '2,400 mm - ESTIMATED'."""
    value, conf, _ = P[name]
    return f"{value:,} mm - {conf}"
