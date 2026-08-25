#!/usr/bin/env python3
"""
PAYA ORIGIN — apple catalogue asset preparation.

Same two image languages as the rest of the house (see prepare_assets.py),
plus one this library makes possible for the first time:

  CUTOUT   — whole fruit lifted off a studio sweep onto the paper tone.
             Shape and colour coverage are both specification fields for
             apples, so the silhouette has to survive; a frame-filling crop
             would destroy exactly the information the page is selling.

Studio cutouts exist for Gala, Golden Delicious, Red Delicious and Granny
Smith. There is no studio shot of Fuji in the library — only packed cartons —
so Fuji's second frame is a carton crop, captioned as such rather than
disguised. That gap is listed at the bottom of this file.
"""

import os
from PIL import Image, ImageEnhance, ImageFilter

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "source-images", "apples")
OUT = os.path.join(HERE, "..", "design", "assets", "apples")
os.makedirs(OUT, exist_ok=True)

PAPER = (246, 242, 234)          # --paper, so cutouts sit on the page tone


def grade(im, warmth=0.9, sat=1.0, contrast=1.05, bright=1.0):
    im = im.convert("RGB")
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * (1 + 0.045 * warmth))))
    b = b.point(lambda v: max(0, int(v * (1 - 0.035 * warmth))))
    im = Image.merge("RGB", (r, g, b))
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    return ImageEnhance.Brightness(im).enhance(bright)


def sharpen(im, amount=55):
    return im.filter(ImageFilter.UnsharpMask(radius=1.5, percent=amount, threshold=3))


def content_bbox(im, tol=236):
    g = im.convert("L")
    return g.point(lambda v: 0 if v > tol else 255).getbbox()


def cutout(name, src, size=1000, pad=0.06, sat=1.02, contrast=1.06):
    """Whole fruit on the paper tone, centred in a square, silhouette intact."""
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    bb = content_bbox(im)
    if bb:
        im = im.crop(bb)
    im = grade(im, sat=sat, contrast=contrast)

    # roll the studio sweep to the paper tone rather than leaving a white box
    px = im.load()
    W, H = im.size
    for y in range(H):
        for x in range(W):
            r, g, b = px[x, y]
            lum = (r * 299 + g * 587 + b * 114) // 1000
            if lum < 214:
                continue
            t = min(1.0, (lum - 214) / 41.0)
            px[x, y] = (int(r + (PAPER[0] - r) * t),
                        int(g + (PAPER[1] - g) * t),
                        int(b + (PAPER[2] - b) * t))

    side = int(max(W, H) * (1 + pad * 2))
    canvas = Image.new("RGB", (side, side), PAPER)
    canvas.paste(im, ((side - W) // 2, (side - H) // 2))
    canvas = canvas.resize((size, size), Image.LANCZOS)
    canvas = sharpen(canvas, 60)
    canvas.save(os.path.join(OUT, f"{name}.jpg"), quality=91, optimize=True)
    print(f"  cutout    {name:<18} {src:<24} -> {size}x{size}")


def specimen(name, src, zoom=1.0, shift=(0.0, 0.0), size=900, box=None,
             sat=1.0, contrast=1.06):
    """Square crop the fruit fills — used for colour/skin comparison."""
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    if box:
        im = im.crop(box)
    W, H = im.size
    side = min(W, H) / zoom
    cx, cy = W / 2 + shift[0] * side, H / 2 + shift[1] * side
    left = max(0, min(W - side, cx - side / 2))
    top = max(0, min(H - side, cy - side / 2))
    im = im.crop((int(left), int(top), int(left + side), int(top + side)))
    im = im.resize((size, size), Image.LANCZOS)
    im = sharpen(grade(im, sat=sat, contrast=contrast), 65)
    im.save(os.path.join(OUT, f"{name}.jpg"), quality=90, optimize=True)
    print(f"  specimen  {name:<18} {src:<24} -> {size}x{size}")


def scene(name, src, aspect, focus=(0.5, 0.5), zoom=1.0, width=1400,
          sat=0.97, contrast=1.04):
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    W, H = im.size
    tw, th = aspect
    target = tw / th
    if W / H > target:
        ch = H / zoom
        cw = ch * target
    else:
        cw = W / zoom
        ch = cw / target
    cw, ch = min(cw, W), min(ch, H)
    left = max(0, min(W - cw, focus[0] * W - cw / 2))
    top = max(0, min(H - ch, focus[1] * H - ch / 2))
    im = im.crop((int(left), int(top), int(left + cw), int(top + ch)))
    height = int(width * th / tw)
    im = im.resize((width, height), Image.LANCZOS)
    im = sharpen(grade(im, sat=sat, contrast=contrast), 45)
    im.save(os.path.join(OUT, f"{name}.jpg"), quality=88, optimize=True)
    print(f"  scene     {name:<18} {src:<24} -> {width}x{height}")


def main():
    print("preparing apple assets\n")

    # -- CUTOUTS: whole fruit, silhouette preserved --------------------------
    cutout("cut-gala",   "gala-royal-gala-2.jpg")
    cutout("cut-golden", "golden-delicious-3.jpg")
    cutout("cut-red",    "red-delicious-7.jpg")
    cutout("cut-granny", "granny-smith-4.jpg")

    # Frame-filling crops of the same four were built first and dropped: they
    # destroy the silhouette, and shape is a specification field for apples.
    # No studio Fuji exists, so its frame on the variety plate is the cleanest
    # carton in the library — plain board, no third-party stickers — captioned
    # as packed fruit rather than passed off as a studio specimen.
    specimen("fuji-packed", "fuji-3.jpg", box=(150, 105, 620, 575), zoom=1.15, size=820)

    # -- SCENES: one orchard or tree frame per variety, all five present ------
    scene("sc-gala",   "gala-royal-gala.jpg",  (4, 3), focus=(0.5, 0.5), width=1300)
    scene("sc-golden", "golden-delicious.jpg", (4, 3), focus=(0.5, 0.5), width=1300)
    scene("sc-red",    "red-delicious.jpg",    (4, 3), focus=(0.5, 0.42), width=1300)
    scene("sc-granny", "granny-smith.jpg",     (4, 3), focus=(0.5, 0.5), width=1400)
    scene("sc-fuji",   "fuji.jpg",             (4, 3), focus=(0.5, 0.5), width=1000)

    # -- SCENES: harvest, packing, transport ---------------------------------
    scene("sc-bin",        "golden-delicious-2.jpg", (4, 3), width=1300)
    scene("sc-picking",    "granny-smith-3.jpg",     (16, 9), width=1200)
    scene("sc-branch",     "red-delicious-3.jpg",    (1, 1), width=800)
    scene("sc-gala-close", "gala-closeup.jpg",       (1, 1), focus=(0.5, 0.45), width=700)

    scene("pk-granny", "granny-smith-2.jpeg", (3, 4), width=900)
    scene("pk-red",    "red-delicious-4.jpg", (3, 4), width=1000)
    scene("pk-fuji",   "fuji-3.jpg",          (4, 3), focus=(0.5, 0.48), zoom=1.05, width=1200)
    scene("pk-crates", "fuji-5.jpg",          (16, 9), width=1280)

    # -- COVER + PLATES ------------------------------------------------------
    scene("cover-band",  "granny-smith.jpg", (210, 150), focus=(0.5, 0.5), width=1900)
    scene("plate-wide",  "red-delicious.jpg", (210, 297), focus=(0.5, 0.45), width=1200)
    scene("plate-orchard", "gala-royal-gala.jpg", (16, 7), focus=(0.5, 0.5), width=1400)

    print("""
GAP — flag to the client:
  Fuji has no studio photograph in the library, only packed cartons. Every
  other variety has a clean single-fruit shot that shows shape and colour
  coverage, both of which are specification fields. One studio session with
  a single Fuji apple on a plain sweep would close the last inconsistency
  in this catalogue.""")


if __name__ == "__main__":
    main()
