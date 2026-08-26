#!/usr/bin/env python3
"""
PAYA ORIGIN — pomegranate catalogue asset preparation.

This catalogue is deliberately not built like the kiwi or apple ones. The brief
was bold and image-led, so the grading here is pushed harder than the house
default: deeper blacks, higher saturation in the reds, and crops that go close.
Pomegranate is the one product in the range whose colour can carry a page on
its own, and the document is designed around that.

Resolution governs placement. Only three frames in the library are big enough
to run full-bleed at A4 without going soft (hero-splash and the two 2476 px
Saveh frames); everything else is placed at half-page or smaller, and the
script prints the effective dpi for every asset so the decision is checkable
rather than assumed.

Two source files were deleted rather than used, on the rule this range has
followed since the apple catalogue: a watermark means the licence was not
bought, and retouching it out does not buy one.

  badrud-market.jpg   "IMNA IMAGES / IMNANEWS" across the lower right — a
                      press agency frame.
  ferdows-hand.jpg    another pomegranate exporter's logotype (انار ایران)
                      burnt into the lower left.

Three more are kept in the library but are never placed, because every fruit in
them carries another company's stickers: saveh-crates.jpg, saveh-crates2.jpg
and neyriz-crate.jpg.

Yazd has no photography in the library. Its variety page uses a general frame,
captioned as illustrative — the same treatment the Fuji gap got in the apple
catalogue, and flagged at the bottom of this file.
"""

import os
from PIL import Image, ImageEnhance, ImageFilter

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "source-images", "pomegranate")
OUT = os.path.join(HERE, "..", "design", "assets", "pomegranate")
os.makedirs(OUT, exist_ok=True)


def grade(im, sat=1.12, contrast=1.10, bright=1.0, warmth=0.6, crush=0.0):
    """Push the reds and deepen the shadows — the house grade, turned up."""
    im = im.convert("RGB")
    r, g, b = im.split()
    if warmth:
        r = r.point(lambda v: min(255, int(v * (1 + 0.05 * warmth))))
        b = b.point(lambda v: max(0, int(v * (1 - 0.05 * warmth))))
        im = Image.merge("RGB", (r, g, b))
    if crush:
        # pull the bottom of the tone curve down so blacks sit on the dark page
        gam = 1.0 + crush          # named so it cannot shadow the green channel
        im = Image.merge("RGB", [c.point(lambda v: int((v / 255.0) ** gam * 255)) for c in im.split()])
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    return ImageEnhance.Brightness(im).enhance(bright)


def sharpen(im, amount=60):
    return im.filter(ImageFilter.UnsharpMask(radius=1.5, percent=amount, threshold=3))


def place(name, src, aspect, focus=(0.5, 0.5), zoom=1.0, width=1400,
          mm_wide=None, **g):
    """Crop to an aspect, resize, grade. mm_wide reports the effective dpi."""
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

    width = min(width, int(cw))          # never upscale past the source
    height = int(width * th / tw)
    im = im.resize((width, height), Image.LANCZOS)
    im = sharpen(grade(im, **g))
    im.save(os.path.join(OUT, f"{name}.jpg"), quality=90, optimize=True)

    dpi = f"{width / (mm_wide / 25.4):.0f} dpi @ {mm_wide}mm" if mm_wide else ""
    print(f"  {name:<20} {src:<24} {width}x{height:<5} {dpi}")


def main():
    print("preparing pomegranate assets\n")

    # -- FULL-BLEED PLATES ---------------------------------------------------
    # The only three frames that hold up across a whole A4 page.
    place("plate-cover", "hero-splash.webp", (210, 297), focus=(0.5, 0.46),
          width=1800, mm_wide=210, sat=1.06, contrast=1.04, warmth=0.4)
    # The cover runs this as a band with the title on solid ink beneath it. The
    # frame is a light studio shot, so type set over it is unreadable whatever
    # colour it is — the fix is a ground for the type, not a scrim on the photo.
    place("cover-band", "hero-splash.webp", (210, 158), focus=(0.5, 0.30),
          width=1792, mm_wide=210, sat=1.06, contrast=1.04, warmth=0.4)
    place("plate-arils", "saveh-arils.jpg", (210, 297), focus=(0.5, 0.5),
          width=1750, mm_wide=210, sat=1.16, contrast=1.12, crush=0.10)
    place("plate-field", "saveh-field.jpg", (210, 297), focus=(0.5, 0.55),
          width=1750, mm_wide=210, sat=1.05, contrast=1.06)

    # -- BANDS ---------------------------------------------------------------
    place("band-arils", "hero-arils.jpg", (16, 6), focus=(0.5, 0.5),
          width=2000, mm_wide=210, sat=1.18, contrast=1.12, crush=0.08)
    place("band-orchard", "neyriz-orchard-wide.jpg", (16, 6), focus=(0.5, 0.5),
          width=700, mm_wide=105)
    place("band-tree", "ferdows-tree.jpg", (16, 7), focus=(0.5, 0.5),
          width=1189, mm_wide=210, sat=1.06)

    # -- VARIETY FRAMES ------------------------------------------------------
    # A floor-to-ceiling half-page column was the first idea and it fails on
    # arithmetic: cropping a 525x700 frame to 105:297 leaves 247px of width,
    # which is 60 dpi. These are placed at 96mm on a 4:5 crop instead, and the
    # boldness on those pages comes from colour field and type scale — neither
    # of which costs resolution.
    place("var-saveh", "saveh-tree.jpg", (4, 5), focus=(0.5, 0.44),
          width=525, mm_wide=96, sat=1.14, contrast=1.08)
    place("var-neyriz", "neyriz-crate2.jpg", (4, 5), focus=(0.5, 0.5),
          width=525, mm_wide=96, sat=1.12, contrast=1.08)
    place("var-ferdows", "ferdows-large.jpg", (4, 5), focus=(0.5, 0.52),
          width=800, mm_wide=96, sat=1.10, contrast=1.06)
    place("var-yazd", "hero-still.webp", (4, 5), focus=(0.5, 0.48),
          width=800, mm_wide=96, sat=1.12, contrast=1.10, crush=0.06)
    place("var-badrud", "badrud-pile.jpg", (4, 5), focus=(0.5, 0.5),
          width=584, mm_wide=96, sat=1.12, contrast=1.08)

    # -- SUPPORTING FRAMES ---------------------------------------------------
    # The three squares run as a strip beneath the comparison matrix, at 54 mm.
    place("sq-arils-ferdows", "ferdows-arils.jpg", (1, 1), width=800, mm_wide=54,
          sat=1.18, contrast=1.10)
    place("sq-arils-badrud", "badrud-arils.webp", (1, 1), focus=(0.5, 0.5),
          width=470, mm_wide=54, sat=1.16)
    place("sq-hand", "neyriz-hands.jpg", (1, 1), focus=(0.5, 0.5), width=394,
          mm_wide=54, sat=1.10)
    place("sq-halved", "hero-halved.jpg", (1, 1), focus=(0.5, 0.42), width=676,
          mm_wide=70, sat=1.14, contrast=1.08)

    # Packing and handling. Aspects are cut to the slot each one occupies rather
    # than to a tidy 4:3, because a second crop in CSS throws away resolution
    # these sources have none of to spare.
    place("pk-nets", "neyriz-nets.jpg", (120, 74), focus=(0.5, 0.5), width=700,
          mm_wide=120, sat=1.10)
    place("pk-transport", "neyriz-packed2.jpg", (56, 76), focus=(0.5, 0.42),
          width=315, mm_wide=56, sat=1.10)
    place("sc-cut", "neyriz-split.jpg", (6, 7), focus=(0.5, 0.58), width=525,
          mm_wide=96, sat=1.12, contrast=1.06)
    # Named for what it shows. It arrived called "packhouse" and is nothing of
    # the kind — there is no grading or packhouse photography in this library
    # at all, which is the second gap flagged at the foot of this file.
    place("sc-tree-red", "ferdows-packhouse.jpg", (4, 3), focus=(0.5, 0.5),
          width=640, mm_wide=110, sat=1.08)

    place("sc-orchard", "neyriz-orchard.jpg", (4, 5), focus=(0.5, 0.5), width=525,
          mm_wide=70, sat=1.06)
    place("sc-branch", "branch-warm.jpg", (2, 3), focus=(0.5, 0.5), width=408,
          mm_wide=58, sat=1.12)
    place("sc-split-dark", "dark-split.jpg", (2, 3), focus=(0.5, 0.5), width=335,
          mm_wide=54, sat=1.16, crush=0.08)

    print("""
GAPS — flag to the client:

  1. Yazd has no photography in the library. Its variety page uses a general
     frame captioned as illustrative. Yazd is the one variety sold on being
     visibly larger and lighter in skin colour than the rest, so it is the
     variety a photograph would do the most work for.

  2. There is no photography of grading, sorting or a packhouse. The quality
     page therefore argues from the orchard and from packed fruit, and claims
     nothing about a line nobody has photographed.""")


if __name__ == "__main__":
    main()
