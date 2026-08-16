#!/usr/bin/env python3
"""Fetch and prepare the catalog's fonts.

Inter ships as static TTFs, so it is downloaded as-is. Noto Sans SC is only
served as a *variable* font, which Chromium cannot subset into a CID font — it
falls back to Type3 glyph procedures, leaving the Chinese text unsearchable and
bloating the PDF. So each unicode-range chunk is instanced to static 400/500/700
weights, and the stylesheet is rewritten to point at those.

Run from the catalog/ directory:  python3 build_fonts.py
"""
import os
import re
import subprocess

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
LEGACY_UA = "Mozilla/4.0"
WEIGHTS = (400, 500, 700)
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")


def curl(url, dest=None, ua=UA):
    cmd = ["curl", "-sS", "-H", "User-Agent: " + ua, url]
    if dest:
        subprocess.run(cmd + ["-o", dest], check=True)
        return None
    return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout


def fetch_inter():
    """Inter: the legacy CSS endpoint hands back plain static TTFs."""
    css = curl("https://fonts.googleapis.com/css?family=Inter:400,500,600,700", ua=LEGACY_UA)
    names = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold"}
    for block in re.findall(r"@font-face \{.*?\}", css, re.S):
        w = int(re.search(r"font-weight: (\d+);", block).group(1))
        url = re.search(r"url\((https://[^)]+\.ttf)\)", block).group(1)
        dest = os.path.join(FONTS, "Inter-%s.ttf" % names[w])
        if not os.path.exists(dest):
            curl(url, dest)
            print("  Inter-%s.ttf" % names[w])


def fetch_noto_sc():
    """Noto Sans SC: ~100 unicode-range chunks of one variable font."""
    css = curl("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@%s"
               % ";".join(str(w) for w in WEIGHTS))
    os.makedirs(os.path.join(FONTS, "sc"), exist_ok=True)
    for url in sorted(set(re.findall(r"url\((https://[^)]+\.woff2)\)", css))):
        dest = os.path.join(FONTS, "sc", url.split("/")[-1])
        if not os.path.exists(dest):
            curl(url, dest)
    print("  %d variable chunks" % len(os.listdir(os.path.join(FONTS, "sc"))))
    return css


def instance_static(css):
    """Pin each chunk to fixed weights so Chromium emits real Type0 CID fonts."""
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    out_dir = os.path.join(FONTS, "sc-static")
    os.makedirs(out_dir, exist_ok=True)
    # Google rotates the chunk hashes between font releases, so a re-fetch can
    # leave chunks the current stylesheet does not name. Only instance the ones
    # this run's CSS actually references, and drop anything that failed to
    # download cleanly rather than half-writing the stylesheet.
    wanted = {os.path.basename(u) for u in re.findall(r"url\((https://[^)]+\.woff2)\)", css)}
    for name in sorted(wanted):
        src = os.path.join(FONTS, "sc", name)
        try:
            TTFont(src).close()
        except Exception as exc:
            raise SystemExit("corrupt download: fonts/sc/%s (%s)\n"
                             "delete it and re-run." % (name, exc))
        for w in WEIGHTS:
            dest = os.path.join(out_dir, "%s-%d.ttf" % (name.replace(".woff2", ""), w))
            if os.path.exists(dest):
                continue
            f = TTFont(src)
            inst = instancer.instantiateVariableFont(f, {"wght": w}, inplace=True,
                                                     updateFontNames=False)
            inst.flavor = None
            inst.save(dest)
    print("  %d static instances" % len(os.listdir(out_dir)))

    blocks = []
    for b in re.findall(r"@font-face \{.*?\}", css, re.S):
        w = re.search(r"font-weight: (\d+);", b).group(1)
        url = re.search(r"url\((https://[^)]+)/([^/)]+)\.woff2\)", b)
        stem = url.group(2)
        blocks.append(re.sub(r"url\(https://[^)]+\.woff2\) format\('woff2'\)",
                             "url(sc-static/%s-%s.ttf) format('truetype')" % (stem, w), b))
    with open(os.path.join(FONTS, "noto-sans-sc.css"), "w") as fh:
        fh.write("\n".join(blocks))
    print("  %d @font-face rules -> fonts/noto-sans-sc.css" % len(blocks))


if __name__ == "__main__":
    os.makedirs(FONTS, exist_ok=True)
    print("Inter:")
    fetch_inter()
    print("Noto Sans SC:")
    instance_static(fetch_noto_sc())
    print("done — now run: python3 render.py")
