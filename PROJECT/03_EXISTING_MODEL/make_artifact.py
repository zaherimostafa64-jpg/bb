"""Assemble the self-contained review artifact: reconstruction_review.html."""

import glob
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "reconstruction_review.html")

scene = open(os.path.join(ROOT, "07_EXPORTS", "scene_V01.json")).read()

SHEETS = [
    ("A-001", "Existing floor plan", "A-001_existing_floor_plan.svg"),
    ("A-002", "Dimensioned floor plan", "A-002_dimensioned_floor_plan.svg"),
    ("A-003", "Furniture plan", "A-003_furniture_plan.svg"),
    ("E-001", "Hall south facade", "E-001_hall_south_facade_elevation.svg"),
    ("E-002", "Kitchen work wall", "E-002_kitchen_work_wall_elevation.svg"),
    ("E-003", "Kitchen pass-through", "E-003_kitchen_passthrough_elevation.svg"),
    ("E-004", "Fireplace blade", "E-004_fireplace_blade_elevation__alcove_face.svg"),
    ("S-001", "Section AA — hall", "S-001_section_aa__hall_longitudinal.svg"),
    ("S-002", "Section BB — kitchen", "S-002_section_bb__kitchen_cross_section.svg"),
]

panels, tabs = [], []
for i, (num, name, fn) in enumerate(SHEETS):
    svg = open(os.path.join(ROOT, "04_DRAWINGS", fn)).read()
    svg = svg.replace('width="841mm" height="594mm"', 'width="100%" height="100%"')
    svg = re.sub(r'<rect width="841" height="594" fill="#fff"/>',
                 '<rect width="841" height="594" fill="var(--sheet)"/>', svg)
    svg = svg.replace('fill="#111"', 'fill="var(--line)"')
    svg = svg.replace('stroke="#111"', 'stroke="var(--line)"')
    svg = svg.replace('fill="#900"', 'fill="var(--ochre)"')
    sel = " is-on" if i == 0 else ""
    tabs.append(f'<button class="tab{sel}" data-sheet="{i}" role="tab" '
                f'aria-selected="{"true" if i == 0 else "false"}">'
                f'<span class="tab-num">{num}</span>'
                f'<span class="tab-name">{name}</span></button>')
    panels.append(f'<div class="sheet{sel}" data-sheet="{i}">{svg}</div>')

html = open(os.path.join(HERE, "artifact_template.html")).read()
html = (html.replace("/*__SCENE__*/", scene)
            .replace("<!--__TABS__-->", "\n".join(tabs))
            .replace("<!--__SHEETS__-->", "\n".join(panels)))
with open(OUT, "w") as f:
    f.write(html)
print(f"{OUT}  {os.path.getsize(OUT) / 1024:.0f} KB")
