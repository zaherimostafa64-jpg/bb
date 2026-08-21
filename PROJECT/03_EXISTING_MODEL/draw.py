"""Orthographic projection + SVG drawing primitives.

Professional architectural line hierarchy (skill section 26):
  cut    1.00 mm   elements cut by the section plane
  edge   0.35 mm   visible edges in elevation
  fine   0.18 mm   fittings, furniture, joinery
  dim    0.13 mm   dimension lines and extension lines
"""

LW = {"cut": 1.00, "edge": 0.35, "fine": 0.18, "dim": 0.13, "grid": 0.13}

# view -> (u_from, u_sign, depth_from, depth_sign)
VIEWS = {
    "PLAN": None,
    "N": ("x", 1, "y", 1),    # looking towards +Y
    "S": ("x", -1, "y", -1),  # looking towards -Y
    "E": ("y", -1, "x", 1),   # looking towards +X
    "W": ("y", 1, "x", -1),   # looking towards -X
}


def project(box, view):
    """Return (u0, v0, u1, v1, depth) for a box in an elevation view."""
    uf, us, df, ds = VIEWS[view]
    a0, a1 = getattr(box, uf + "0"), getattr(box, uf + "1")
    d0, d1 = getattr(box, df + "0"), getattr(box, df + "1")
    u0, u1 = sorted((a0 * us, a1 * us))
    depth = min(d0 * ds, d1 * ds)
    return u0, box.z0, u1, box.z1, depth


class Sheet:
    """An SVG drawing sheet in millimetre paper units at a stated scale."""

    def __init__(self, title, number, scale=50, size=(841, 594), rev="A",
                 date="2026-08-21"):
        self.title, self.number, self.scale = title, number, scale
        self.w, self.h = size
        self.rev, self.date = rev, date
        self.body = []
        self.ox, self.oy = 0.0, 0.0

    # -- coordinate transform: model mm -> paper mm --------------------
    def tx(self, x):
        return (x + self.ox) / self.scale

    def ty(self, y):
        return self.h - (y + self.oy) / self.scale

    def fit(self, bounds, area=None):
        """Centre the model bounds inside the sheet's clear drawing area."""
        x0, y0, x1, y1 = bounds
        ax0, ay0, ax1, ay1 = area or (18, 78, self.w - 18, self.h - 18)
        cw, ch = (x1 - x0) / self.scale, (y1 - y0) / self.scale
        padx, pady = (ax1 - ax0 - cw) / 2, (ay1 - ay0 - ch) / 2
        self.ox = (ax0 + padx) * self.scale - x0
        self.oy = (self.h - ay1 + pady) * self.scale - y0

    def scalebar(self, X, Y, seg=None, n=4):
        """Graphic scale bar, drawn in paper units at the sheet's scale."""
        if seg is None:                       # keep the bar around 100 mm long
            seg = next(s for s in (250, 500, 1000, 2000, 5000)
                       if s * n / self.scale >= 80)
        L = seg / self.scale
        for i in range(n):
            fill = "#111" if i % 2 == 0 else "#fff"
            self.body.append(
                f'<rect x="{X + i * L:.2f}" y="{Y:.2f}" width="{L:.2f}" '
                f'height="2.4" fill="{fill}" stroke="#111" stroke-width="0.25"/>')
        for i in range(n + 1):
            if i % 2 == 0:
                self.paper_text(X + i * L, Y - 1.6, f"{i * seg / 1000:g}",
                                2.1, "middle")
        self.paper_text(X + n * L + 3, Y + 2.2, "m", 2.1)
        self.paper_text(X, Y + 6.4, f"SCALE 1:{self.scale}", 2.1)

    # -- primitives -----------------------------------------------------
    def line(self, x0, y0, x1, y1, w="edge", dash=None, cls=""):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.body.append(
            f'<line x1="{self.tx(x0):.2f}" y1="{self.ty(y0):.2f}" '
            f'x2="{self.tx(x1):.2f}" y2="{self.ty(y1):.2f}" '
            f'stroke="#111" stroke-width="{LW[w]}"{d} class="{cls}"/>')

    def rect(self, x0, y0, x1, y1, w="edge", fill="none", dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        X, Y = self.tx(x0), self.ty(y1)
        self.body.append(
            f'<rect x="{X:.2f}" y="{Y:.2f}" width="{abs(self.tx(x1) - X):.2f}" '
            f'height="{abs(self.ty(y0) - Y):.2f}" fill="{fill}" stroke="#111" '
            f'stroke-width="{LW[w]}"{d}/>')

    def poly(self, pts, w="edge", fill="none"):
        s = " ".join(f"{self.tx(x):.2f},{self.ty(y):.2f}" for x, y in pts)
        self.body.append(f'<polygon points="{s}" fill="{fill}" stroke="#111" '
                         f'stroke-width="{LW[w]}"/>')

    def text(self, x, y, s, size=2.6, anchor="start", weight="normal",
             rotate=0, color="#111"):
        X, Y = self.tx(x), self.ty(y)
        r = f' transform="rotate({rotate} {X:.2f} {Y:.2f})"' if rotate else ""
        self.body.append(
            f'<text x="{X:.2f}" y="{Y:.2f}" font-size="{size}" fill="{color}" '
            f'text-anchor="{anchor}" font-weight="{weight}" '
            f'font-family="Helvetica,Arial,sans-serif"{r}>{s}</text>')

    def paper_text(self, X, Y, s, size=2.6, anchor="start", weight="normal",
                   color="#111"):
        self.body.append(
            f'<text x="{X:.2f}" y="{Y:.2f}" font-size="{size}" fill="{color}" '
            f'text-anchor="{anchor}" font-weight="{weight}" '
            f'font-family="Helvetica,Arial,sans-serif">{s}</text>')

    # -- dimensioning ---------------------------------------------------
    def dim_h(self, x0, x1, y, text=None, tick=250, off=0):
        yy = y + off
        self.line(x0, yy, x1, yy, "dim")
        for x in (x0, x1):
            self.line(x, yy - tick / 2, x, yy + tick / 2, "dim")
            self.line(x, yy, x, y - off * 0.15, "dim", dash="1.5,1.5")
        self.text((x0 + x1) / 2, yy + 180, text or f"{int(abs(x1 - x0)):,}",
                  2.4, "middle")

    def dim_v(self, y0, y1, x, text=None, tick=250, off=0):
        xx = x + off
        self.line(xx, y0, xx, y1, "dim")
        for y in (y0, y1):
            self.line(xx - tick / 2, y, xx + tick / 2, y, "dim")
        mid = (y0 + y1) / 2
        self.text(xx - 180, mid, text or f"{int(abs(y1 - y0)):,}", 2.4, "middle",
                  rotate=-90)

    # -- title block ----------------------------------------------------
    def titleblock(self, notes=(), scalestr=None):
        W, H = self.w, self.h
        b = self.body
        b.append(f'<rect x="6" y="6" width="{W - 12}" height="{H - 12}" '
                 f'fill="none" stroke="#111" stroke-width="0.5"/>')
        tw, th = 150, 60
        x0, y0 = W - 6 - tw, H - 6 - th
        b.append(f'<rect x="{x0}" y="{y0}" width="{tw}" height="{th}" '
                 f'fill="none" stroke="#111" stroke-width="0.5"/>')
        b.append(f'<line x1="{x0}" y1="{y0 + 12}" x2="{x0 + tw}" y2="{y0 + 12}" '
                 f'stroke="#111" stroke-width="0.35"/>')
        b.append(f'<line x1="{x0}" y1="{y0 + 34}" x2="{x0 + tw}" y2="{y0 + 34}" '
                 f'stroke="#111" stroke-width="0.35"/>')
        self.paper_text(x0 + 4, y0 + 8.5, "EXISTING CONDITION SURVEY - "
                        "PHOTOGRAPHIC RECONSTRUCTION", 3.0, weight="bold")
        self.paper_text(x0 + 4, y0 + 22, self.title, 5.0, weight="bold")
        self.paper_text(x0 + 4, y0 + 30, "Residential unit - entrance, hall, kitchen", 2.6)
        self.paper_text(x0 + 4, y0 + 42, f"DRG  {self.number}", 3.2, weight="bold")
        self.paper_text(x0 + 4, y0 + 48.5, f"SCALE  {scalestr or f'1:{self.scale}'}  @ A1", 2.6)
        self.paper_text(x0 + 4, y0 + 54, f"REV  {self.rev}    DATE  {self.date}", 2.6)
        self.paper_text(x0 + tw - 4, y0 + 48.5, "UNITS  mm", 2.6, anchor="end")
        self.paper_text(x0 + tw - 4, y0 + 54, "V01_EXISTING", 2.6, anchor="end")

        # confidence legend + notes
        ny = y0 - 6
        self.paper_text(x0 + 4, ny - len(notes) * 4.2 - 6, "NOTES", 2.8,
                        weight="bold")
        for i, n in enumerate(notes):
            self.paper_text(x0 + 4, ny - (len(notes) - i - 1) * 4.2, n, 2.3)

    def north_arrow(self, X, Y, r=9):
        self.body.append(
            f'<g transform="translate({X},{Y})">'
            f'<circle r="{r}" fill="none" stroke="#111" stroke-width="0.35"/>'
            f'<polygon points="0,{-r} {r * 0.34},{r * 0.5} 0,{r * 0.2} '
            f'{-r * 0.34},{r * 0.5}" fill="#111"/>'
            f'<text y="{-r - 2.5}" font-size="3" text-anchor="middle" '
            f'font-family="Helvetica,Arial,sans-serif" font-weight="bold">N</text>'
            f'</g>')
        self.paper_text(X, Y + r + 6, "PROJECT NORTH", 2.1, anchor="middle")
        self.paper_text(X, Y + r + 9.4, "ASSUMED - NOT TRUE NORTH", 2.1,
                        anchor="middle", color="#900")

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}mm" '
                f'height="{self.h}mm" viewBox="0 0 {self.w} {self.h}">'
                f'<rect width="{self.w}" height="{self.h}" fill="#fff"/>'
                + "".join(self.body) + "</svg>")

    def save(self, path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.svg())
