#!/usr/bin/env python3
"""Rasterise the built PDF for visual review — QA the artifact, not the DOM."""
import os, sys, pymupdf

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = {"profile": "PAYA-ORIGIN-Company-Profile-2026.pdf",
        "kiwi": "PAYA-ORIGIN-Iranian-Fresh-Green-Kiwi-2026.pdf",
        "apples": "PAYA-ORIGIN-Iranian-Fresh-Apples-2026.pdf",
        "pomegranate": "PAYA-ORIGIN-Iranian-Pomegranates-2026.pdf"}
which = next((a for a in sys.argv[1:] if a in DOCS), "profile")
sys.argv = [a for a in sys.argv if a not in DOCS]
pdf = os.path.join(root, "dist", DOCS[which])
qa = os.path.join(root, "build", "qa", which)
os.makedirs(qa, exist_ok=True)
d = pymupdf.open(pdf)
dpi = int(sys.argv[1]) if len(sys.argv) > 1 else 100
for i in range(d.page_count):
    d[i].get_pixmap(dpi=dpi).save(os.path.join(qa, f"p{i+1:02d}.png"))

# contact sheet
W, H = int(595 * .40), int(842 * .40)
C = 5
rows = (d.page_count + C - 1) // C
out = pymupdf.open(); pg = out.new_page(width=W * C, height=H * rows)
for i in range(d.page_count):
    r = pymupdf.Rect((i % C) * W, (i // C) * H, (i % C) * W + W, (i // C) * H + H)
    pg.show_pdf_page(r, d, i)
out[0].get_pixmap(dpi=100).save(os.path.join(qa, "contact.png"))
print(f"{d.page_count} pages -> build/qa  ({d[0].rect.width:.1f} x {d[0].rect.height:.1f} pt)")
