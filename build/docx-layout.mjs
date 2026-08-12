/**
 * Word export — LAYOUT edition.
 *
 * Each page of the built PDF is placed as a full-bleed A4 image. The design
 * survives exactly; the text is not editable. This is the version to send when
 * someone asks for "the catalogue as a Word file" and means the catalogue.
 *
 *   python3 build/pdf-to-pages.py 170     # writes build/pages/*.jpg first
 *   node    build/docx-layout.mjs
 */

import {
  Document, Packer, Paragraph, ImageRun, PageOrientation,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom,
} from "docx";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pagesDir = path.join(root, "build", "pages");
const out = path.join(root, "dist", "PAYA-ORIGIN-Company-Profile-2026-layout.docx");

// A4 in DXA (twentieths of a point)
const A4_W = 11906;
const A4_H = 16838;
// docx-js sizes images in PIXELS at 96 dpi, not points: 210mm = 793.7px
const PX_W = (210 / 25.4) * 96;
const PX_H = (297 / 25.4) * 96;

const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".jpg")).sort();
if (!files.length) throw new Error("no page images — run build/pdf-to-pages.py first");

// Each page image is anchored to the page itself and sits behind the text
// layer. An inline image at exactly page size fights the paragraph mark and
// spills onto a blank following page in Word; anchoring sidesteps that.
const children = files.map((f, i) =>
  new Paragraph({
    spacing: { before: 0, after: 0, line: 20, lineRule: "exact" },
    pageBreakBefore: i > 0,
    children: [
      new ImageRun({
        type: "jpg",
        data: fs.readFileSync(path.join(pagesDir, f)),
        transformation: { width: PX_W, height: PX_H },
        floating: {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
          behindDocument: true,
          allowOverlap: true,
          zIndex: 0,
        },
      }),
    ],
  })
);

const doc = new Document({
  title: "PAYA ORIGIN — Corporate Profile 2026",
  description: "Agricultural sourcing and export. Corporate profile, 2026 edition.",
  creator: "PAYA ORIGIN",
  sections: [
    {
      properties: {
        page: {
          size: { width: A4_W, height: A4_H, orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, right: 0, bottom: 0, left: 0, header: 0, footer: 0, gutter: 0 },
        },
      },
      children,
    },
  ],
});

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, await Packer.toBuffer(doc));
console.log(`${files.length} pages -> ${path.relative(root, out)} ` +
            `(${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
