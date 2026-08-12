#!/usr/bin/env python3
"""Figures that only exist as live vector/CSS in the web build (the map plate,
the diagram pages) are cropped out of the rendered PDF so the editable Word
document can carry them as images."""
import os, pymupdf

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pdf = pymupdf.open(os.path.join(root, "dist", "PAYA-ORIGIN-Company-Profile-2026.pdf"))
out = os.path.join(root, "design", "assets", "word")
os.makedirs(out, exist_ok=True)

MM = 72 / 25.4          # mm -> pt (PDF user space)

def crop(name, page, x0, y0, x1, y1, dpi=200):
    p = pdf[page - 1]
    clip = pymupdf.Rect(x0 * MM, y0 * MM, x1 * MM, y1 * MM)
    pix = p.get_pixmap(dpi=dpi, clip=clip)
    path = os.path.join(out, f"{name}.jpg")
    pix.pil_save(path, format="JPEG", quality=88, optimize=True)
    print(f"  {name:<16} p{page:<3} {pix.width}x{pix.height}px  "
          f"{(x1-x0):.0f}x{(y1-y0):.0f}mm")

# Only the map needs to travel as a picture. The process diagram and the
# harvest calendar are rebuilt as native Word tables so they stay editable.
crop("map-origins", 11, 14, 66, 196, 262)
print("done")
