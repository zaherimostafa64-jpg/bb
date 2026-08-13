#!/usr/bin/env python3
"""Structural + content verification for the Word exports.

LibreOffice is unavailable in this container, so instead of a visual render we
assert the things Word actually depends on: page geometry, media wiring, and
that a strict third-party reader (pandoc) can parse the document.
"""
import sys, zipfile, re, os
import defusedxml.ElementTree as ET
import pypandoc

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
EMU_PER_MM = 36000

path = sys.argv[1]
z = zipfile.ZipFile(path)
names = set(z.namelist())

print(f"== {os.path.basename(path)}  ({os.path.getsize(path)/1e6:.2f} MB)")

for required in ["[Content_Types].xml", "word/document.xml", "word/_rels/document.xml.rels"]:
    assert required in names, f"MISSING {required}"

doc = ET.fromstring(z.read("word/document.xml"))
rels = ET.fromstring(z.read("word/_rels/document.xml.rels"))
rel_target = {r.get("Id"): r.get("Target") for r in rels}

paras = doc.iter(f"{W}p")
n_para = sum(1 for _ in doc.iter(f"{W}p"))
n_tbl = sum(1 for _ in doc.iter(f"{W}tbl"))
n_brk = sum(1 for b in doc.iter(f"{W}br") if b.get(f"{W}type") == "page")
n_pbb = sum(1 for _ in doc.iter(f"{W}pageBreakBefore"))

# page geometry
for sect in doc.iter(f"{W}sectPr"):
    pg = sect.find(f"{W}pgSz"); mg = sect.find(f"{W}pgMar")
    w, h = int(pg.get(f"{W}w")), int(pg.get(f"{W}h"))
    print(f"   page      {w/56.7:.0f} x {h/56.7:.0f} mm"
          f"   margins t{int(mg.get(f'{W}top'))/56.7:.0f} r{int(mg.get(f'{W}right'))/56.7:.0f} "
          f"b{int(mg.get(f'{W}bottom'))/56.7:.0f} l{int(mg.get(f'{W}left'))/56.7:.0f} mm")

# images: every blip must resolve to a media part that exists
missing, sizes = [], []
for ext in doc.iter(f"{A}ext"):
    if ext.get("cx") and ext.getparent if False else None:
        pass
for anchor in list(doc.iter(f"{W}drawing")):
    for blip in anchor.iter(f"{A}blip"):
        rid = blip.get(f"{R}embed")
        tgt = rel_target.get(rid)
        full = "word/" + tgt if tgt and not tgt.startswith("/") else (tgt or "")
        if full not in names:
            missing.append((rid, tgt))
    for ext in anchor.iter(f"{A}ext"):
        if ext.get("cx"):
            sizes.append((int(ext.get("cx")) / EMU_PER_MM, int(ext.get("cy")) / EMU_PER_MM))

media = sorted(n for n in names if n.startswith("word/media/"))
print(f"   content   {n_para} paragraphs, {n_tbl} tables, "
      f"{n_pbb} pageBreakBefore, {n_brk} explicit page breaks")
print(f"   media     {len(media)} files, {len(sizes)} placements, "
      f"{len(missing)} unresolved refs")
if sizes:
    uniq = sorted(set((round(a, 1), round(b, 1)) for a, b in sizes))
    print(f"   sizes mm  {uniq[:4]}{' …' if len(uniq) > 4 else ''}")
assert not missing, f"UNRESOLVED IMAGE REFS: {missing}"

# headers and footers are separate parts with their own relationships; the
# body check above never sees them, and that is where a running logo lives
for part in sorted(n for n in names if re.match(r"word/(header|footer)\d+\.xml$", n)):
    px = ET.fromstring(z.read(part))
    prels = ET.fromstring(z.read(part.replace("word/", "word/_rels/") + ".rels"))
    ptarget = {r.get("Id"): r.get("Target") for r in prels}
    refs = [b.get(f"{R}embed") for b in px.iter(f"{A}blip")]
    bad = [r for r in refs
           if ("word/" + (ptarget.get(r) or "").lstrip("/")).replace("word/../", "")
           not in names]
    print(f"   {os.path.basename(part):<13} {len(refs)} image ref(s), {len(bad)} unresolved")
    assert not bad, f"UNRESOLVED IN {part}: {bad}"

txt = pypandoc.convert_file(path, "plain", extra_args=["--wrap=none"])
words = len(txt.split())
print(f"   pandoc    parsed OK, {words} words of extractable text")
print("   RESULT    PASS\n")
