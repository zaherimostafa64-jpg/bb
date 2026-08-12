#!/usr/bin/env python3
"""Rasterise the built PDF to one JPEG per page, for the Word layout export."""
import os, sys, pymupdf

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pdf = os.path.join(root, "dist", "PAYA-ORIGIN-Company-Profile-2026.pdf")
out = os.path.join(root, "build", "pages")
os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    os.remove(os.path.join(out, f))

dpi = int(sys.argv[1]) if len(sys.argv) > 1 else 170
d = pymupdf.open(pdf)
for i in range(d.page_count):
    pix = d[i].get_pixmap(dpi=dpi)
    pix.pil_save(os.path.join(out, f"p{i+1:02d}.jpg"), format="JPEG",
                 quality=86, optimize=True, progressive=True)
total = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out))
print(f"{d.page_count} pages at {dpi} dpi ({pix.width}x{pix.height}px) -> {total/1e6:.1f} MB")
