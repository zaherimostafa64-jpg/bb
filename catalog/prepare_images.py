#!/usr/bin/env python3
"""Derive the catalog's image set from the supplied source photography.

Source material tops out at 1536x1024 / 2048x1152, so crops are kept deliberately
gentle: every derived image is sized to stay at a usable print resolution in the
box it occupies on the page (see the audit printed at the end). Nothing is
upscaled, and no mechanical detail is retouched away.

Run from the catalog/ directory:  python3 prepare_images.py
"""
import os

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "images_raw")
OUT = os.path.join(HERE, "img")

# Crops from the dark three-quarter studio shot (1536x1024).
DARK_CROPS = {
    "intake_top":    (470,   5, 1160,  455),   # airbox, throttle bodies, injector mounts
    "crankcase":     (300, 360,  920,  900),   # centre case and side cover
    "oil_filter":    (600, 700, 1120, 1015),   # oil filter, lower crankcase / sump
    "cyl_left":      (100, 300,  760,  865),   # barrel fins, head interface, hose routing
    "lower_exhaust": (200, 590, 1460, 1024),   # lower engine / exhaust side
}

# Width in mm of the box each image occupies in the layout, for the DPI audit.
BOX_MM = {
    "hero_cover": 218, "hero_dark": 104, "front": 139, "front_band": 88,
    "head_detail": 173, "drawing": 190, "bike": 180, "intake_top": 100,
    "crankcase": 98, "oil_filter": 78, "cyl_left": 84, "lower_exhaust": 127,
}


def save(im, name, quality=95):
    im = im.convert("RGB")
    im.save(os.path.join(OUT, name + ".jpg"), quality=quality, subsampling=0)
    return im


def main():
    os.makedirs(OUT, exist_ok=True)

    # Straight passes — full frame, no crop.
    save(Image.open(os.path.join(RAW, "img03.png")), "hero_light")     # light 3/4 studio
    save(Image.open(os.path.join(RAW, "img09.png")), "hero_dark")      # dark 3/4 studio
    save(Image.open(os.path.join(RAW, "img01.jpg")), "front")          # front view
    save(Image.open(os.path.join(RAW, "img10.jpg")), "head_detail")    # cylinder head close-up
    save(Image.open(os.path.join(RAW, "img02.jpg")), "bike")           # installed, context only
    save(Image.open(os.path.join(RAW, "img06.png")), "drawing")        # GA drawing

    # Panoramic band across both cylinders — distinct framing from the full front
    # view, so no engine image is repeated between pages 03 and 05.
    save(Image.open(os.path.join(RAW, "img01.jpg")).crop((55, 120, 1225, 545)), "front_band")

    dark = Image.open(os.path.join(RAW, "img09.png"))
    for name, box in DARK_CROPS.items():
        save(dark.crop(box), name)

    # Cover cutout: flood-fill the flat studio plate to white from the edges. Only
    # background-connected pixels are touched, so bolts, hoses, fins and the
    # natural contact shadow all survive intact.
    cover = Image.open(os.path.join(OUT, "hero_light.jpg")).convert("RGB")
    w, h = cover.size
    for pt in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
               (w // 2, 0), (0, h // 2), (w - 1, h // 2)]:
        ImageDraw.floodfill(cover, pt, (255, 255, 255), thresh=10)
    cover.save(os.path.join(OUT, "hero_cover.jpg"), quality=95, subsampling=0)

    # White BENDA lockup on transparency, from the supplied white-on-black mark.
    # Recolouring to a monochrome version for a dark ground only — not redrawn,
    # not stretched, original proportions kept.
    import numpy as np
    lum = Image.open(os.path.join(RAW, "img08.jpg")).convert("L")
    a = np.clip((np.array(lum).astype(np.float32) - 30) / 170, 0, 1)
    alpha = Image.fromarray((a * 255).astype("uint8"))
    alpha = alpha.crop(alpha.getbbox())
    logo = Image.new("RGBA", alpha.size, (255, 255, 255, 255))
    logo.putalpha(alpha)
    logo.save(os.path.join(OUT, "logo_dark.png"))

    print("%-14s %-8s %-8s %s" % ("image", "px", "box", "dpi"))
    for name, mm in BOX_MM.items():
        px = Image.open(os.path.join(OUT, name + ".jpg")).size[0]
        print("%-14s %-8d %-8s %d" % (name, px, "%dmm" % mm, px / (mm / 25.4)))


if __name__ == "__main__":
    main()
