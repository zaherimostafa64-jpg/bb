#!/usr/bin/env python3
"""Render catalog.html to a print-ready PDF and per-page PNG proofs."""
import pathlib
import sys
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
SRC = (HERE / "catalog.html").resolve()
PDF = HERE / "CB250B_Engine_Catalog.pdf"
PROOF = HERE / "proof"
PROOF.mkdir(exist_ok=True)

MM = 210 / 25.4 * 96 / 210  # px per mm at 96dpi
W, H = round(297 * 96 / 25.4), round(210 * 96 / 25.4)


def main(proofs=True):
    with sync_playwright() as p:
        b = p.chromium.launch(
            executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
            args=["--no-sandbox", "--font-render-hinting=none"])
        pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.goto(SRC.as_uri())
        pg.wait_for_load_state("load")
        pg.evaluate("() => document.fonts.ready")
        pg.evaluate("""() => Promise.all(
            [...document.images].filter(i => !i.complete)
                .map(i => new Promise(r => { i.onload = i.onerror = r; })))""")
        pg.wait_for_timeout(1500)

        n = pg.locator("section.page").count()
        print(f"pages: {n}")

        pg.pdf(path=str(PDF), width="297mm", height="210mm",
               print_background=True, prefer_css_page_size=True, margin={
                   "top": "0", "bottom": "0", "left": "0", "right": "0"})
        print(f"wrote {PDF} ({PDF.stat().st_size/1024:.0f} KB)")

        if proofs:
            for i in range(n):
                el = pg.locator("section.page").nth(i)
                el.screenshot(path=str(PROOF / f"p{i+1:02d}.png"))
            print(f"wrote {n} page proofs to {PROOF}")
        b.close()


if __name__ == "__main__":
    main(proofs="--no-proofs" not in sys.argv)
