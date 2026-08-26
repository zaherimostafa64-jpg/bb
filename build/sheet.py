import sys, pymupdf
DOCS = {"profile": "dist/PAYA-ORIGIN-Company-Profile-2026.pdf",
        "kiwi": "dist/PAYA-ORIGIN-Iranian-Fresh-Green-Kiwi-2026.pdf",
        "apples": "dist/PAYA-ORIGIN-Iranian-Fresh-Apples-2026.pdf",
        "pomegranate": "dist/PAYA-ORIGIN-Iranian-Pomegranates-2026.pdf"}
which = next((a for a in sys.argv[1:] if a in DOCS), "profile")
pdf = pymupdf.open(DOCS[which])
pages = [int(a) for a in sys.argv[1:] if a not in DOCS]
C = 2 if len(pages) <= 4 else 3
W, H = int(595*.78), int(842*.78)
rows = (len(pages)+C-1)//C
out = pymupdf.open(); pg = out.new_page(width=W*C, height=H*rows)
for k, p in enumerate(pages):
    r = pymupdf.Rect((k % C)*W, (k//C)*H, (k % C)*W+W, (k//C)*H+H)
    pg.show_pdf_page(r, pdf, p-1)
out[0].get_pixmap(dpi=104).save("build/qa/sheet.png")
print("ok", pages)
