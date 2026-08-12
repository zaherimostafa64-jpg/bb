#!/usr/bin/env python3
"""
PAYA ORIGIN — asset preparation.

Takes the raw image library (build/source-images) and produces a single,
art-directed asset set in design/assets.

Two image languages only — this is the point of the whole script:

  1. SPECIMEN  — square, product fills the frame edge to edge, no visible
                 background, unified warm grade. Used for product pages.
  2. SCENE     — photographic evidence (people, places, cartons, transport),
                 unified warm grade, cropped to a declared aspect ratio.

Anything that cannot be pushed into one of those two languages is rejected
rather than "used anyway". Rejections are listed at the bottom of this file.
"""

import os
from PIL import Image, ImageEnhance, ImageOps, ImageFilter

SRC = os.path.join(os.path.dirname(__file__), "source-images")
OUT = os.path.join(os.path.dirname(__file__), "..", "design", "assets")
os.makedirs(OUT, exist_ok=True)


# --------------------------------------------------------------------------
# grading — one look for the whole document
# --------------------------------------------------------------------------

def grade(im, warmth=1.0, sat=0.96, contrast=1.06, bright=1.0):
    """Unified warm editorial grade so mixed sources read as one shoot."""
    im = im.convert("RGB")
    r, g, b = im.split()
    if warmth != 1.0:
        r = r.point(lambda v: min(255, int(v * (1 + 0.055 * warmth))))
        b = b.point(lambda v: max(0, int(v * (1 - 0.045 * warmth))))
        im = Image.merge("RGB", (r, g, b))
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Brightness(im).enhance(bright)
    return im


def sharpen(im, amount=55):
    return im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=amount, threshold=3))


# --------------------------------------------------------------------------
# language 1 — SPECIMEN
# --------------------------------------------------------------------------

def content_bbox(im, tol=238):
    """Bounding box of non-white content (for cutout-style product shots)."""
    g = im.convert("L")
    mask = g.point(lambda v: 0 if v > tol else 255)
    return mask.getbbox()


def specimen(name, src, mode="center", zoom=1.0, shift=(0.0, 0.0),
             size=1100, sat=0.98, contrast=1.08, bright=1.0):
    """
    Crop a product shot to a square that the product FILLS.

      mode="center"  — subject already fills the frame (bowls, piles)
      mode="content" — white-background cutout; lock onto the content bbox

    zoom  > 1 crops tighter; shift moves the crop window (fraction of side).
    """
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    W, H = im.size

    if mode == "content":
        bb = content_bbox(im)
        if bb:
            cx, cy = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2
            side = min(bb[2] - bb[0], bb[3] - bb[1])
        else:
            cx, cy, side = W / 2, H / 2, min(W, H)
    else:
        cx, cy, side = W / 2, H / 2, min(W, H)

    side = side / zoom
    cx += shift[0] * side
    cy += shift[1] * side

    # keep the window inside the image
    side = min(side, W, H)
    left = max(0, min(W - side, cx - side / 2))
    top = max(0, min(H - side, cy - side / 2))
    im = im.crop((int(left), int(top), int(left + side), int(top + side)))

    im = im.resize((size, size), Image.LANCZOS)
    im = grade(im, warmth=0.85, sat=sat, contrast=contrast, bright=bright)
    im = sharpen(im, 65)
    im.save(os.path.join(OUT, f"{name}.jpg"), quality=90, optimize=True)
    print(f"  specimen  {name:<16} {src:<14} -> {size}x{size}")


# --------------------------------------------------------------------------
# language 2 — SCENE
# --------------------------------------------------------------------------

def warm_studio_white(im, paper=(239, 233, 221)):
    """Studio mock-ups arrive on white or cold grey sweeps, which read as bright
    rectangles on a cream page. Roll the sweep towards the paper tone so the
    packaging shots sit in the document instead of on top of it."""
    px = im.load()
    W, H = im.size
    pr, pg_, pb = paper
    for y in range(H):
        for x in range(W):
            r, g, b = px[x, y]
            lum = (r * 299 + g * 587 + b * 114) // 1000
            if lum < 205:
                continue
            t = min(1.0, (lum - 205) / 50.0)      # 0 at mid grey, 1 at white
            px[x, y] = (int(r + (pr - r) * t),
                        int(g + (pg_ - g) * t),
                        int(b + (pb - b) * t))
    return im


def scene(name, src, aspect, focus=(0.5, 0.5), zoom=1.0, width=1600,
          crop_box=None, sat=0.94, contrast=1.05, bright=1.0, warmth=1.0,
          studio=False):
    """Crop a photograph to a declared aspect ratio around a focal point."""
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    if crop_box:
        im = im.crop(crop_box)
    W, H = im.size

    tw, th = aspect
    target = tw / th
    if W / H > target:          # too wide -> trim sides
        ch = H / zoom
        cw = ch * target
    else:                       # too tall -> trim top/bottom
        cw = W / zoom
        ch = cw / target
    cw, ch = min(cw, W), min(ch, H)

    left = max(0, min(W - cw, focus[0] * W - cw / 2))
    top = max(0, min(H - ch, focus[1] * H - ch / 2))
    im = im.crop((int(left), int(top), int(left + cw), int(top + ch)))

    height = int(width * th / tw)
    im = im.resize((width, height), Image.LANCZOS)
    im = grade(im, warmth=warmth, sat=sat, contrast=contrast, bright=bright)
    if studio:
        im = warm_studio_white(im)
    im = sharpen(im, 45)
    im.save(os.path.join(OUT, f"{name}.jpg"), quality=88, optimize=True)
    print(f"  scene     {name:<16} {src:<14} -> {width}x{height}")


# --------------------------------------------------------------------------
# logo — one master, two colourways, nothing else
# --------------------------------------------------------------------------

def logos():
    im = Image.open(os.path.join(SRC, "x0042.png")).convert("RGBA")
    px = im.load()
    W, H = im.size
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            lum = (r * 299 + g * 587 + b * 114) // 1000
            px[x, y] = (r, g, b, 0 if lum > 246 else min(a, 255 - lum + 40))
    im = im.crop(im.getbbox())
    im.save(os.path.join(OUT, "logo-burgundy.png"))

    white = Image.new("RGBA", im.size, (255, 255, 255, 0))
    white.putalpha(im.getchannel("A"))
    white.save(os.path.join(OUT, "logo-white.png"))
    print(f"  logo      burgundy + white  -> {im.size[0]}x{im.size[1]}")


# --------------------------------------------------------------------------
# the five-frame process strip embedded as one tall composite in the old PDF
# --------------------------------------------------------------------------

def split_process_strip():
    """x0209 is five separate photographs baked into one image with the old
    layout's numbers and icons attached. Slice it and drop the furniture."""
    im = Image.open(os.path.join(SRC, "x0209.jpeg")).convert("RGB")
    W, H = im.size
    names = ["scene-field", "scene-inspection", "scene-selection",
             "scene-documents", "scene-transit"]
    for i, nm in enumerate(names):
        cell = im.crop((0, int(i * H / 5), W, int((i + 1) * H / 5)))
        cw, ch = cell.size
        # drop the old layout's number + icon badge column, then auto-trim to
        # the photograph itself (the surrounding page is near-cream)
        cell = cell.crop((int(cw * 0.26), 0, cw, ch))
        px = cell.load()
        cw, ch = cell.size

        def is_paper(x, y):
            r, g, b = px[x, y]
            return r > 232 and g > 228 and b > 222

        top = next((y for y in range(ch)
                    if sum(not is_paper(x, y) for x in range(0, cw, 8)) > cw / 24), 0)
        bot = next((y for y in range(ch - 1, -1, -1)
                    if sum(not is_paper(x, y) for x in range(0, cw, 8)) > cw / 24), ch - 1)
        cell = cell.crop((2, top + 2, cw, bot - 1))
        cell.save(os.path.join(SRC, f"_strip{i + 1}.jpg"), quality=95)
    print("  split     x0209 -> 5 scene frames")
    return names


# --------------------------------------------------------------------------

def main():
    print("preparing assets\n")
    logos()
    split_process_strip()

    # -- SPECIMENS ---------------------------------------------------------
    # Dried fruits & nuts: bowl shots, already frame-filling.
    specimen("sp-pistachio",   "x0323.jpeg", "center", zoom=1.30)
    specimen("sp-saffron",     "x0324.jpeg", "center", zoom=1.45, sat=0.92)
    specimen("sp-date",        "x0325.jpeg", "center", zoom=1.55, shift=(0.02, 0.04))
    specimen("sp-raisin",      "x0327.jpeg", "center", zoom=1.40)
    # White-background cutouts: lock onto the product, then crop hard into it
    # until the frame is pure product. Values tuned per image by eye.
    specimen("sp-walnut",      "x0326.jpeg", "content", zoom=1.30)
    specimen("sp-kiwi",        "x0369.jpeg", "content", zoom=1.70, shift=(-0.05, 0.05))
    specimen("sp-peach",       "x0370.jpeg", "content", zoom=1.58, shift=(0.04, 0.06))
    specimen("sp-melon",       "x0371.jpeg", "content", zoom=1.85, shift=(-0.08, -0.05))
    specimen("sp-pomegranate", "x0372.jpeg", "content", zoom=1.70, shift=(0.12, 0.04))
    specimen("sp-bellpepper",  "x0418.jpeg", "content", zoom=1.95, shift=(0.05, -0.02))
    specimen("sp-grape",       "x0368.jpeg", "center",  zoom=2.00, shift=(-0.10, 0.04))

    # -- SCENES ------------------------------------------------------------
    # Cover band: the photograph runs full width across the top of the cover and
    # is never darkened — the title sits on paper below it, not on top of it.
    scene("cover-band",     "x0013.jpeg", (210, 162), focus=(0.5, 0.60), width=1900,
          contrast=1.04, bright=1.0)
    scene("cover",          "x0013.jpeg", (210, 297), focus=(0.5, 0.55), width=1800,
          contrast=1.04, bright=0.99)
    scene("scene-orchard",  "x0334.jpeg", (4, 5),   focus=(0.62, 0.5), width=1300)
    scene("scene-orchard-wide", "x0334.jpeg", (16, 9), focus=(0.6, 0.5), width=1600)
    scene("scene-pallet",   "x0373.jpeg", (3, 4),   focus=(0.5, 0.5),  width=1200)
    scene("scene-pallet-wide", "x0373.jpeg", (16, 10), focus=(0.5, 0.45), width=1400)
    scene("scene-truck",    "x0489.jpeg", (16, 9),  focus=(0.5, 0.5),  width=1600)
    scene("scene-crates",   "x0379.jpeg", (1, 1),   focus=(0.5, 0.5),  width=1200)
    scene("scene-crates-wide", "x0379.jpeg", (16, 9), focus=(0.5, 0.5), width=1400)
    scene("scene-apricot",  "x0269.jpeg", (3, 4),   focus=(0.5, 0.45), width=1100)
    scene("scene-vine",     "x0113.jpeg", (3, 4),   focus=(0.5, 0.5),  width=900)

    for i, nm in enumerate(["scene-field", "scene-inspection", "scene-selection",
                            "scene-documents", "scene-transit"], start=1):
        scene(nm, f"_strip{i}.jpg", (4, 3), focus=(0.5, 0.5), width=1100)
    scene("scene-field-wide", "_strip1.jpg", (16, 7), focus=(0.5, 0.5), width=1600)
    scene("scene-transit-wide", "_strip5.jpg", (16, 7), focus=(0.5, 0.5), width=1600)

    # -- PACKAGING ---------------------------------------------------------
    scene("pack-carton-nuts",   "x0328.jpeg", (4, 3), focus=(0.5, 0.5), width=1000, studio=True)
    scene("pack-retail-boxes",  "x0329.jpeg", (4, 3), focus=(0.5, 0.5), width=1000, studio=True)
    scene("pack-carton-grape",  "x0374.jpeg", (4, 3), focus=(0.5, 0.5), width=1000, studio=True)
    scene("pack-carton-pepper", "x0413.jpeg", (4, 3), focus=(0.5, 0.5), width=1000, studio=True)

    print("\nREJECTED (deliberately unused):")
    for src, why in [
        ("x0457.jpeg", "3D relief world map + ship + produce — generic stock trade visual"),
        ("x0159.jpeg", "raster screenshot of an earlier layout, not an image asset"),
        ("x0073.jpeg", "composited truck/orchard/produce montage — reads synthetic"),
        ("x0048.jpeg", "duplicate of x0269 (same apricot tree)"),
        ("x0234.jpeg", "duplicate of x0113 (same vine)"),
    ]:
        print(f"  {src:<14} {why}")


if __name__ == "__main__":
    main()
