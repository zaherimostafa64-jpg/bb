/**
 * Word export — EDITABLE edition.
 *
 * The same content as the printed profile, re-authored in Word's own idiom:
 * real headings, real paragraphs, real tables, inline pictures. It flows and
 * reflows like a Word document, so the fixed print composition is not
 * reproduced — that is what the LAYOUT edition is for.
 *
 * Typefaces fall back to faces that ship with Office (Georgia / Calibri /
 * Consolas) because Fraunces, Inter Tight and IBM Plex Mono will not be
 * installed on a recipient's machine.
 *
 *   node build/docx-editable.mjs
 */

import {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  TableOfContents, Header, Footer, PageNumber, HeadingLevel, AlignmentType,
  BorderStyle, ShadingType, WidthType, VerticalAlign, PageOrientation,
} from "docx";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const A = path.join(root, "design", "assets");
const out = path.join(root, "dist", "PAYA-ORIGIN-Company-Profile-2026-editable.docx");

/* ---------------------------------------------------------------- tokens - */

const BURGUNDY = "831D23";
const AMBER    = "A8701A";
const INK      = "17130F";
const INK2     = "4A4038";
const GREY     = "7C7167";
const RULE     = "DCD2C1";
const PAPER2   = "EFE9DD";
const TINT     = "F3EEE4";

const SERIF = "Georgia";
const SANS  = "Calibri";
const MONO  = "Consolas";

const MARGIN_MM = 20;
const TEXT_MM = 210 - MARGIN_MM * 2;              // 170mm of measure
const dxa = (mm) => Math.round(mm * 56.7);
const px  = (mm) => (mm / 25.4) * 96;             // docx-js images are px@96dpi
const img = (f) => fs.readFileSync(path.join(A, f));

/* ------------------------------------------------------------- helpers --- */

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "auto" };
const HAIR = { style: BorderStyle.SINGLE, size: 4, color: RULE };

const rule = (color = RULE, size = 6, after = 160) =>
  new Paragraph({
    spacing: { before: 0, after },
    border: { bottom: { style: BorderStyle.SINGLE, size, color } },
  });

const eyebrow = (text, color = BURGUNDY) =>
  new Paragraph({
    spacing: { before: 360, after: 80 },
    children: [new TextRun({
      text: text.toUpperCase(), font: MONO, size: 15, bold: true,
      color, characterSpacing: 30,
    })],
  });

const h1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text, font: SERIF, size: 44, color: INK })],
  });

const h2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, font: SERIF, size: 26, color: INK })],
  });

const lede = (text) =>
  new Paragraph({
    spacing: { before: 0, after: 200, line: 300 },
    children: [new TextRun({ text, font: SANS, size: 23, color: INK2 })],
  });

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { before: 0, after: 140, line: 280 },
    children: [new TextRun({ text, font: SANS, size: 20, color: INK2, ...opts })],
  });

const small = (text, color = GREY) =>
  new Paragraph({
    spacing: { before: 0, after: 100, line: 260 },
    children: [new TextRun({ text, font: SANS, size: 17, color })],
  });

const caption = (text) =>
  new Paragraph({
    spacing: { before: 60, after: 240 },
    children: [new TextRun({ text, font: SANS, size: 15, color: GREY, italics: true })],
  });

const label = (text) =>
  new Paragraph({
    spacing: { before: 0, after: 60 },
    children: [new TextRun({
      text: text.toUpperCase(), font: MONO, size: 14, bold: true,
      color: BURGUNDY, characterSpacing: 24,
    })],
  });

const picture = (file, widthMm, heightMm) =>
  new Paragraph({
    spacing: { before: 120, after: 0 },
    children: [new ImageRun({
      type: "jpg",
      data: img(file),
      transformation: { width: px(widthMm), height: px(heightMm) },
    })],
  });

const pngPicture = (file, widthMm, heightMm, align = AlignmentType.LEFT) =>
  new Paragraph({
    alignment: align,
    spacing: { before: 0, after: 0 },
    children: [new ImageRun({
      type: "png",
      data: img(file),
      transformation: { width: px(widthMm), height: px(heightMm) },
    })],
  });

const pageBreak = () =>
  new Paragraph({ children: [], pageBreakBefore: true, spacing: { before: 0, after: 0 } });

/** Cell content helper — cells want Paragraphs, never bare strings. */
const cell = (children, { width, shading, valign, margins, borders } = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    children: Array.isArray(children) ? children : [children],
    verticalAlign: valign ?? VerticalAlign.TOP,
    ...(shading ? { shading: { type: ShadingType.CLEAR, color: "auto", fill: shading } } : {}),
    ...(borders ? { borders } : {}),
    margins: margins ?? { top: 90, bottom: 90, left: 0, right: 140 },
  });

/** A table ruled with hairlines top and bottom only — the document's house style. */
const ruledTable = (rows, columnWidths) =>
  new Table({
    width: { size: dxa(TEXT_MM), type: WidthType.DXA },
    columnWidths,
    borders: {
      top: HAIR, bottom: HAIR,
      left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: HAIR, insideVertical: NO_BORDER,
    },
    rows,
  });

/** Invisible table — used purely to place pictures or columns side by side. */
const layoutTable = (rows, columnWidths) =>
  new Table({
    width: { size: dxa(TEXT_MM), type: WidthType.DXA },
    columnWidths,
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows,
  });

/** Evenly split columns of (label, text) — replaces the print grid strips. */
const factRow = (facts) => {
  const w = Math.floor(dxa(TEXT_MM) / facts.length);
  return ruledTable([
    new TableRow({
      children: facts.map(([k, v]) =>
        cell([label(k), small(v)], { width: w, margins: { top: 120, bottom: 120, left: 0, right: 200 } })),
    }),
  ], facts.map(() => w));
};

const shadedNote = (labelText, text) =>
  new Table({
    width: { size: dxa(TEXT_MM), type: WidthType.DXA },
    columnWidths: [dxa(TEXT_MM)],
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [new TableRow({
      children: [cell([label(labelText), small(text, INK2)], {
        width: dxa(TEXT_MM), shading: TINT,
        margins: { top: 200, bottom: 200, left: 200, right: 200 },
      })],
    })],
  });

const spacer = (after = 200) => new Paragraph({ spacing: { before: 0, after }, children: [] });

/* --------------------------------------------------- specimen image grid - */

/**
 * A row of square specimens with name + origin underneath. Rows always run on
 * a three-column grid; a short row pads with blanks rather than stretching its
 * pictures or repeating a specimen to fill the gap.
 */
const COLS = 3;
const specimenRow = (items) => {
  const w = Math.floor(dxa(TEXT_MM) / COLS);
  const wMm = TEXT_MM / COLS - 3;
  const padded = [...items, ...Array(COLS - items.length).fill(null)];
  const blank = () => cell([new Paragraph({ children: [] })],
    { width: w, margins: { top: 0, bottom: 0, left: 0, right: 140 } });
  return layoutTable([
    new TableRow({
      children: padded.map((it) => it === null ? blank() :
        cell([picture(it[0], wMm, wMm)], {
          width: w, margins: { top: 0, bottom: 40, left: 0, right: 140 },
        })),
    }),
    new TableRow({
      children: padded.map((it) => it === null ? blank() : (([, name, origin]) =>
        cell([
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [new TextRun({ text: name, font: SANS, size: 19, bold: true, color: INK })],
          }),
          new Paragraph({
            spacing: { before: 0, after: 200 },
            children: [new TextRun({
              text: origin.toUpperCase(), font: MONO, size: 13, color: GREY, characterSpacing: 14,
            })],
          }),
        ], { width: w, margins: { top: 0, bottom: 0, left: 0, right: 140 } }))(it)),
    }),
  ], padded.map(() => w));
};

/* ------------------------------------------------------ harvest calendar - */

const CAL = [
  ["group", "Dried fruits & nuts"],
  ["Pistachio",   [9, 10],  [1, 12]],
  ["Saffron",     [10, 11], [1, 12]],
  ["Dates",       [8, 10],  [1, 12]],
  ["Walnut",      [9, 10],  [1, 12]],
  ["Raisin",      [8, 10],  [1, 12]],
  ["Dried fig",   [8, 9],   [1, 12]],
  ["group", "Fresh fruits"],
  ["Grape",       [7, 10],  [11, 12]],
  ["Pomegranate", [9, 11],  [12, 1]],
  ["Kiwi",        [10, 12], [1, 3]],
  ["Apple",       [8, 10],  [11, 4]],
  ["Peach",       [6, 8],   null],
  ["Melon",       [6, 9],   null],
  ["group", "Fresh vegetables"],
  ["Bell pepper", "year"],
  ["Tomato",      "year"],
];

const monthsIn = (range) => {
  if (!range) return [];
  const [a, b] = range;
  const out = [];
  if (a <= b) { for (let m = a; m <= b; m++) out.push(m); }
  else { for (let m = a; m <= 12; m++) out.push(m); for (let m = 1; m <= b; m++) out.push(m); }
  return out;
};

const calendarTable = () => {
  const nameW = dxa(38);
  const monthW = Math.floor((dxa(TEXT_MM) - nameW) / 12);
  const widths = [nameW, ...Array(12).fill(monthW)];
  const M = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell([new Paragraph({ children: [] })], { width: nameW }),
      ...M.map((m) => cell([new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text: m, font: MONO, size: 14, color: GREY })],
      })], { width: monthW, margins: { top: 40, bottom: 40, left: 0, right: 0 } })),
    ],
  });

  const rows = [headerRow];
  for (const entry of CAL) {
    if (entry[0] === "group") {
      rows.push(new TableRow({
        children: [
          cell([new Paragraph({
            spacing: { before: 160, after: 40 },
            children: [new TextRun({
              text: entry[1].toUpperCase(), font: MONO, size: 13,
              bold: true, color: GREY, characterSpacing: 20,
            })],
          })], { width: nameW, margins: { top: 60, bottom: 20, left: 0, right: 0 } }),
          ...Array(12).fill(0).map(() =>
            cell([new Paragraph({ children: [] })], { width: monthW, margins: { top: 0, bottom: 0, left: 0, right: 0 } })),
        ],
      }));
      continue;
    }
    const [name, peak, shoulder] = entry;
    const isYear = peak === "year";
    const peakM = isYear ? monthsIn([1, 12]) : monthsIn(peak);
    const shoulderM = isYear ? [] : monthsIn(shoulder);

    rows.push(new TableRow({
      children: [
        cell([new Paragraph({
          spacing: { before: 30, after: 30 },
          children: [new TextRun({ text: name, font: SANS, size: 18, color: INK })],
        })], { width: nameW, margins: { top: 50, bottom: 50, left: 0, right: 60 } }),
        ...Array(12).fill(0).map((_, i) => {
          const m = i + 1;
          const fill = isYear && peakM.includes(m) ? AMBER
            : peakM.includes(m) ? BURGUNDY
            : shoulderM.includes(m) ? "EAD7D2"
            : PAPER2;
          return cell([new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })], {
            width: monthW, shading: fill,
            margins: { top: 50, bottom: 50, left: 0, right: 0 },
          });
        }),
      ],
    }));
  }

  return new Table({
    width: { size: dxa(TEXT_MM), type: WidthType.DXA },
    columnWidths: widths,
    borders: {
      top: HAIR, bottom: HAIR, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
    },
    rows,
  });
};

/* ------------------------------------------------------------- document -- */

const children = [];
const push = (...xs) => children.push(...xs);

/* ---- cover ---- */
push(
  new Paragraph({
    spacing: { before: 400, after: 100 },
    children: [new TextRun({
      text: "CORPORATE PROFILE · EDITION 2026", font: MONO, size: 16,
      bold: true, color: GREY, characterSpacing: 40,
    })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 200, line: 620, lineRule: "exact" },
    children: [new TextRun({
      text: "Trusted origins, curated for global markets.",
      font: SERIF, size: 60, color: INK,
    })],
  }),
  rule(BURGUNDY, 10, 200),
  lede("An agricultural sourcing and export company connecting selected producers " +
       "across Iran with international buyers."),
  picture("cover-band.jpg", TEXT_MM, TEXT_MM * (162 / 210)),
  caption("Apple harvest at a selected orchard. Iran, first light."),
  pageBreak(),
);

/* ---- contents ---- */
push(
  eyebrow("Contents"),
  h1("What is in this document"),
  body("Fields below update inside Word: select the table of contents, right-click " +
       "and choose “Update Field” to refresh page numbers after editing."),
  new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }),
  pageBreak(),
);

/* ---- 01 the company ---- */
push(
  eyebrow("01 — The company"),
  h1("A single, accountable partner between Iranian farms and your business."),
  lede("PAYA ORIGIN is an agricultural sourcing and export company. We identify " +
       "producers across Iran's growing regions, verify what they grow, prepare it " +
       "for its destination market, and ship it under one contract."),
  body("The company was built for export from the beginning rather than adapted to it. " +
       "Our decisions start from a buyer's specification — product, grade, volume, " +
       "packaging, destination — and work backwards to the orchard or field best able " +
       "to meet it."),
  body("That order matters. It is the difference between offering a buyer what happens " +
       "to be in a warehouse and building a supply chain that holds its shape across seasons."),
  picture("scene-orchard-wide.jpg", TEXT_MM, TEXT_MM * (9 / 16)),
  caption("Fig. 01 — Pistachio harvest at a selected orchard, Kerman province. " +
          "Producers are visited and assessed before they enter the network."),
  factRow([
    ["What we are", "A sourcing, quality and export partner working on behalf of the buyer."],
    ["What we are not", "A farm, a broker of anonymous stock, or a one-shipment trader."],
  ]),
  pageBreak(),
);

/* ---- 02 at a glance ---- */
const glance = [
  ["15+",  "Years in agricultural trade", "Commercial experience across sourcing, quality control and export operations for Iranian agricultural products.", "EXPERIENCE"],
  ["05",   "Sourcing regions across Iran", "Kerman, Khorasan, Fars, Mazandaran and the Azerbaijan provinces — each selected for a specific crop, not for convenience.", "ORIGIN"],
  ["03",   "Product categories", "Dried fruits & nuts · fresh fruits · fresh vegetables — with packaging under our brand or your private label.", "RANGE"],
  ["04",   "Priority export markets", "Middle East · Russia & CIS · India · Europe. Commercial focus rather than an exhaustive list.", "MARKETS"],
  ["ONE",  "Point of accountability", "A single contract and a single counterpart from producer selection through to delivered shipment.", "STRUCTURE"],
];
push(
  eyebrow("02 — At a glance"),
  h1("A sourcing network built on experience, not guesswork."),
  ruledTable(
    glance.map(([n, k, v, tag]) => new TableRow({
      children: [
        cell([new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: n, font: SERIF, size: 40, color: BURGUNDY })],
        })], { width: dxa(28) }),
        cell([
          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [new TextRun({ text: k, font: SANS, size: 21, bold: true, color: INK })],
          }),
          small(v),
        ], { width: dxa(112) }),
        cell([new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 120, after: 0 },
          children: [new TextRun({ text: tag, font: MONO, size: 14, color: GREY, characterSpacing: 20 })],
        })], { width: dxa(30), margins: { top: 90, bottom: 90, left: 0, right: 0 } }),
      ],
    })),
    [dxa(28), dxa(112), dxa(30)],
  ),
  spacer(200),
  small("Figures describe the company's commercial focus and sourcing footprint. Volumes, " +
        "grades and lead times are confirmed per enquiry. Regions listed are those currently " +
        "active in the sourcing network and expand according to buyer requirements."),
  pageBreak(),
);

/* ---- 03 the sourcing problem ---- */
push(
  eyebrow("03 — The sourcing problem"),
  h1("International sourcing is rarely a single transaction."),
  lede("A buyer who wants ten tonnes of a specific grade, packed a specific way, arriving " +
       "on a specific date, usually ends up coordinating four or five unrelated parties — " +
       "and carrying the risk between them."),
  label("Without a coordinated partner"),
  ruledTable(
    [
      ["Producers", "Different standards, timelines and languages."],
      ["Inspectors", "Quality verified inconsistently, if at all."],
      ["Packers", "Packaging chosen for supply, not for the market."],
      ["Forwarders", "Freight booked separately from production."],
      ["Documents", "Certificates chased after the goods have moved."],
    ].map(([k, v]) => new TableRow({
      children: [
        cell([new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: k, font: SANS, size: 20, bold: true, color: INK })],
        })], { width: dxa(42) }),
        cell([small(v)], { width: dxa(128) }),
      ],
    })),
    [dxa(42), dxa(128)],
  ),
  spacer(240),
  shadedNote("With PAYA ORIGIN",
    "One partner holds the whole chain — and the responsibility for it. Every hand-off " +
    "removed is a point of failure removed. That is the entire commercial argument for " +
    "how this company is structured."),
  spacer(240),
  label("What fragmentation costs"),
  factRow([
    ["Quality drifts", "When no single party owns the standard, each lot is judged against a slightly different one."],
    ["Schedules slip", "Production, packing and freight planned separately rarely meet on the date the buyer needs."],
    ["Nobody answers", "When something goes wrong across five counterparties, the buyer absorbs it. That is the real cost."],
  ]),
  pageBreak(),
);

/* ---- 04 our model ---- */
const stages = [
  ["01", "Requirement", "Product, grade, volume, packaging, destination and delivery window are fixed in writing before anything is sourced.", "Written specification"],
  ["02", "Sourcing", "The region is chosen for the crop; the producer is chosen for the specification. Alternatives are proposed, not assumed.", "Origin proposal"],
  ["03", "Verification", "Quality is checked at supplier assessment, during procurement, and again before the shipment is sealed.", "Inspection record"],
  ["04", "Preparation", "Cleaning, sorting, grading, packing and labelling to the destination market's requirements.", "Packing & label spec"],
  ["05", "Delivery", "Documentation, customs and freight handled inside the same contract that started at the requirement.", "Document set"],
];
push(
  eyebrow("04 — Our model"),
  h1("From complexity to confidence."),
  lede("One workflow, five stages, a single counterpart. Each stage produces something " +
       "the next stage depends on — which is why we refuse to run them in parallel with " +
       "different companies."),
  ruledTable([
    new TableRow({
      tableHeader: true,
      children: [
        cell([label("Stage")], { width: dxa(14) }),
        cell([label("")], { width: dxa(34) }),
        cell([label("What happens")], { width: dxa(80) }),
        cell([label("What it produces")], { width: dxa(42) }),
      ],
    }),
    ...stages.map(([n, name, what, produces]) => new TableRow({
      children: [
        cell([new Paragraph({
          spacing: { before: 60, after: 0 },
          children: [new TextRun({ text: n, font: MONO, size: 17, color: AMBER })],
        })], { width: dxa(14) }),
        cell([new Paragraph({
          spacing: { before: 50, after: 0 },
          children: [new TextRun({ text: name, font: SANS, size: 21, bold: true, color: INK })],
        })], { width: dxa(34) }),
        cell([small(what)], { width: dxa(80) }),
        cell([new Paragraph({
          spacing: { before: 60, after: 0 },
          children: [new TextRun({ text: produces, font: SANS, size: 18, color: BURGUNDY })],
        })], { width: dxa(42), margins: { top: 90, bottom: 90, left: 0, right: 0 } }),
      ],
    })),
  ], [dxa(14), dxa(34), dxa(80), dxa(42)]),
  spacer(240),
  factRow([
    ["Principle", "The requirement defines the sourcing strategy — never the other way round."],
    ["Principle", "Producers are selected and re-assessed. Being nearby is not a qualification."],
    ["Principle", "One coordinated partner replaces a chain of disconnected suppliers."],
  ]),
  pageBreak(),
);

/* ---- 05 scope ---- */
const weDo = [
  ["Procurement against a written specification.", "Grade, calibre, moisture, packing and tolerance agreed before sourcing begins."],
  ["Producer identification and assessment.", "Farms and processors evaluated across Iran's growing regions."],
  ["Quality verification at three points.", "Supplier assessment, procurement, pre-shipment."],
  ["Packaging development.", "PAYA ORIGIN brand or your private label, built for the destination market."],
  ["Export documentation and freight.", "Certificates, customs and shipment inside one contract."],
  ["Season-over-season supply planning.", "Continuity treated as the product, not the by-product."],
];
const weDont = [
  ["Operate farms.", "We select and supervise producers; we do not compete with them."],
  ["Sell anonymous commodity stock.", "Every lot has a named region and a named producer behind it."],
  ["Depend on a single producer or region.", "Alternatives are maintained for every active line."],
  ["Treat a shipment as the finish line.", "A first order that does not repeat is a failed order."],
  ["Quote what we cannot verify.", "If a specification cannot be met honestly, we say so."],
  ["Sell certification we do not hold.", "Required certificates are arranged and named explicitly per shipment."],
];
const scopeCell = (items, marker, markerColor) =>
  items.map(([bold, rest], i) => new Paragraph({
    spacing: { before: i === 0 ? 0 : 160, after: 0, line: 260 },
    children: [
      new TextRun({ text: `${marker}  `, font: MONO, size: 16, color: markerColor }),
      new TextRun({ text: bold + " ", font: SANS, size: 19, bold: true, color: INK }),
      new TextRun({ text: rest, font: SANS, size: 19, color: INK2 }),
    ],
  }));
push(
  eyebrow("05 — Scope of responsibility"),
  h1("What we take responsibility for — and what we deliberately do not."),
  lede("A clear boundary is more useful to a buyer than a long list of capabilities. This is ours."),
  ruledTable([
    new TableRow({
      tableHeader: true,
      children: [
        cell([label("We do")], { width: dxa(85), margins: { top: 90, bottom: 120, left: 0, right: 200 } }),
        cell([label("We do not")], { width: dxa(85), margins: { top: 90, bottom: 120, left: 0, right: 0 } }),
      ],
    }),
    new TableRow({
      children: [
        cell(scopeCell(weDo, "—", BURGUNDY), { width: dxa(85), margins: { top: 160, bottom: 160, left: 0, right: 200 } }),
        cell(scopeCell(weDont, "×", GREY), { width: dxa(85), margins: { top: 160, bottom: 160, left: 0, right: 0 } }),
      ],
    }),
  ], [dxa(85), dxa(85)]),
  spacer(240),
  new Paragraph({
    spacing: { before: 0, after: 0, line: 300 },
    children: [new TextRun({
      text: "“Rather than selling available inventory, we build supply around the customer's requirement.”",
      font: SERIF, size: 26, color: BURGUNDY,
    })],
  }),
  pageBreak(),
  eyebrow("Principle 02"),
  h1("Producers are selected, not assumed."),
  lede("The decision that determines a shipment's quality is made long before the " +
       "shipment exists — in the choice of who grows it."),
  picture("plate-selection.jpg", TEXT_MM, TEXT_MM * (297 / 210)),
  pageBreak(),
);

/* ---- 06 how we work ---- */
const steps = [
  ["scene-inspection.jpg", "01", "Understand", "Product, grade, quantity, destination market and delivery window recorded as a specification."],
  ["scene-field.jpg", "02", "Curate", "Region matched to crop, producer matched to specification — with a second option held in reserve."],
  ["scene-crates.jpg", "03", "Verify", "Checked at supplier assessment, again during procurement, and again before loading."],
  ["scene-pallet.jpg", "04", "Prepare", "Cleaned, sorted, packed, labelled and palletised for the destination market's rules."],
  ["scene-transit.jpg", "05", "Deliver", "Documentation, customs and freight coordinated under the same contract."],
];
const stepW = Math.floor(dxa(TEXT_MM) / 5);
push(
  eyebrow("06 — How we work"),
  h1("From requirement to reliable supply."),
  lede("Five stages, each with a photograph of what it actually looks like. Every stage " +
       "is designed to remove a specific uncertainty."),
  layoutTable([
    new TableRow({
      children: steps.map(([f]) =>
        cell([picture(f, TEXT_MM / 5 - 3, (TEXT_MM / 5 - 3) * 1.25)], {
          width: stepW, margins: { top: 0, bottom: 60, left: 0, right: 110 },
        })),
    }),
    new TableRow({
      children: steps.map(([, n, name, desc]) =>
        cell([
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [new TextRun({ text: n, font: MONO, size: 14, color: AMBER })],
          }),
          new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [new TextRun({ text: name, font: SANS, size: 19, bold: true, color: INK })],
          }),
          new Paragraph({
            spacing: { before: 0, after: 0, line: 220 },
            children: [new TextRun({ text: desc, font: SANS, size: 15, color: GREY })],
          }),
        ], { width: stepW, margins: { top: 0, bottom: 0, left: 0, right: 110 } })),
    }),
  ], steps.map(() => stepW)),
  spacer(280),
  factRow([
    ["What the buyer receives", "A written specification, named origin, and an agreed delivery window before any commitment."],
    ["What we hold", "Producer relationships, quality records and the freight plan — in one place."],
    ["What changes each season", "Origins and harvest windows. The process around them does not."],
  ]),
  pageBreak(),
);

/* ---- 07 quality ---- */
push(
  eyebrow("07 — Quality verification"),
  h1("Quality is not a final inspection."),
  lede("A single check before loading can only reject a problem. Checking at three points " +
       "prevents it — which is considerably cheaper for everyone involved."),
  ruledTable([
    ["Checkpoint 01", "Before procurement", "The producer is assessed — growing region, handling practice, processing capability and past consistency. A producer who cannot meet the specification is not asked to try."],
    ["Checkpoint 02", "During sourcing", "Lots are checked against the agreed grade as they are collected and processed — so a deviation is caught while it can still be corrected, not after packing."],
    ["Checkpoint 03", "Before shipment", "Pre-shipment inspection against the same written specification the order started with, together with the documentation the destination market requires."],
  ].map(([tag, title, desc]) => new TableRow({
    children: [
      cell([
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [new TextRun({
            text: tag.toUpperCase(), font: MONO, size: 14, color: AMBER, characterSpacing: 16,
          })],
        }),
        new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: title, font: SANS, size: 21, bold: true, color: INK })],
        }),
      ], { width: dxa(52) }),
      cell([small(desc)], { width: dxa(118) }),
    ],
  })), [dxa(52), dxa(118)]),
  spacer(260),
  layoutTable([new TableRow({
    children: [
      cell([
        picture("scene-inspection.jpg", 80, 60),
        caption("Fig. 02 — Assessment recorded against the written specification, in the field."),
      ], { width: dxa(86), margins: { top: 0, bottom: 0, left: 0, right: 240 } }),
      cell([
        label("Typically accompanies a shipment"),
        ...["Commercial invoice", "Packing list", "Certificate of origin",
            "Phytosanitary certificate", "Bill of lading or CMR",
            "Inspection report, where agreed"].map((t) =>
          new Paragraph({
            spacing: { before: 0, after: 40, line: 240 },
            children: [new TextRun({ text: t, font: SANS, size: 18, color: INK2 })],
          })),
        small("Exact document set depends on product, destination and the buyer's import requirements."),
      ], { width: dxa(84), shading: TINT, margins: { top: 200, bottom: 200, left: 200, right: 200 } }),
    ],
  })], [dxa(86), dxa(84)]),
  pageBreak(),
);

/* ---- 08 origins ---- */
push(
  eyebrow("08 — Origins across Iran"),
  h1("Iran is not one origin. It is a set of them."),
  lede("Climate, altitude and harvest window change completely between provinces. We source " +
       "each crop from the region that grows it best — which is why the map matters more " +
       "than the country name."),
  picture("word/map-origins.jpg", TEXT_MM, TEXT_MM * (196 / 182)),
  caption("Fig. 03 — Selected agricultural origins. Positions are provincial reference points, " +
          "not producer locations."),
  pageBreak(),
  eyebrow("08 — Origins across Iran"),
  h2("Why each region, and what it is good for."),
  ruledTable([
    new TableRow({
      tableHeader: true,
      children: [
        cell([label("Region")], { width: dxa(38) }),
        cell([label("Primary crops")], { width: dxa(38) }),
        cell([label("Growing condition")], { width: dxa(70) }),
        cell([label("Harvest")], { width: dxa(24) }),
      ],
    }),
    ...[
      ["Azerbaijan", "East & West provinces", "Grapes, apple, walnut", "Cool continental highland; long, bright autumns that concentrate sugars before harvest.", "Aug — Oct"],
      ["Mazandaran", "Caspian belt", "Kiwi, citrus, fresh fruit", "Humid subtropical strip between the Alborz range and the Caspian; the country's late-season fruit basket.", "Oct — Dec"],
      ["Khorasan", "Razavi & South", "Saffron, barberry", "Semi-arid highland with cold winters and dry autumns — the conditions saffron requires and few places offer.", "Oct — Nov"],
      ["Kerman", "Rafsanjan & Sirjan", "Pistachio, dates", "Arid high plateau with a wide day-to-night temperature range; the origin behind Iran's signature nut export.", "Sep — Oct"],
      ["Fars", "Southern valleys", "Dates, citrus, grapes", "Warm temperate valleys with a long growing season, supporting both stone fruit and date production.", "Aug — Nov"],
    ].map(([region, sub, crops, cond, harvest]) => new TableRow({
      children: [
        cell([
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [new TextRun({ text: region, font: SANS, size: 21, bold: true, color: INK })],
          }),
          new Paragraph({
            spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: sub, font: SANS, size: 15, color: GREY })],
          }),
        ], { width: dxa(38) }),
        cell([new Paragraph({
          spacing: { before: 70, after: 0, line: 240 },
          children: [new TextRun({ text: crops, font: SANS, size: 18, color: BURGUNDY })],
        })], { width: dxa(38) }),
        cell([small(cond)], { width: dxa(70) }),
        cell([new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 70, after: 0 },
          children: [new TextRun({ text: harvest, font: MONO, size: 16, color: INK })],
        })], { width: dxa(24), margins: { top: 90, bottom: 90, left: 0, right: 0 } }),
      ],
    })),
  ], [dxa(38), dxa(38), dxa(70), dxa(24)]),
  spacer(200),
  factRow([
    ["Origin is a decision", "Two orchards in the same province do not produce the same lot. The producer is chosen after the region."],
    ["Seasons are honest", "Harvest windows shift year to year with weather. We commit to dates we can actually hold."],
    ["Coverage expands", "New regions enter the network when a specification justifies the assessment work behind them."],
  ]),
  pageBreak(),
);

/* ---- 09 harvest calendar ---- */
push(
  eyebrow("09 — Harvest calendar"),
  h1("When each product is actually available."),
  lede("Sourcing conversations are easier when both sides are looking at the same calendar. " +
       "These are the windows we plan against."),
  layoutTable([new TableRow({
    children: [
      cell([new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })],
           { width: dxa(16), shading: BURGUNDY, margins: { top: 60, bottom: 60, left: 0, right: 0 } }),
      cell([small("Harvest", INK2)], { width: dxa(30), margins: { top: 30, bottom: 30, left: 100, right: 0 } }),
      cell([new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })],
           { width: dxa(16), shading: "EAD7D2", margins: { top: 60, bottom: 60, left: 0, right: 0 } }),
      cell([small("Available from storage", INK2)], { width: dxa(52), margins: { top: 30, bottom: 30, left: 100, right: 0 } }),
      cell([new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })],
           { width: dxa(16), shading: AMBER, margins: { top: 60, bottom: 60, left: 0, right: 0 } }),
      cell([small("Year-round (protected cultivation)", INK2)], { width: dxa(40), margins: { top: 30, bottom: 30, left: 100, right: 0 } }),
    ],
  })], [dxa(16), dxa(30), dxa(16), dxa(52), dxa(16), dxa(40)]),
  spacer(160),
  calendarTable(),
  spacer(240),
  factRow([
    ["Contract ahead of harvest", "Capacity at the better producers is committed early. Peak-season volumes are best agreed before the harvest opens, not during it."],
    ["Two calendars, not one", "The harvest window and your selling season rarely align. Variety choice, storage and switching origin are how we bridge the gap."],
    ["Storage is not neutral", "Product supplied from storage is available, but it is not identical to a fresh-harvest lot. We tell you which one you are buying."],
  ]),
  spacer(160),
  small("Indicative windows for Iranian production, subject to season, region and variety. " +
        "Greenhouse-grown vegetables are available year-round with seasonal peaks. Confirmed per enquiry."),
  pageBreak(),
);

/* ---- 10 dried fruits & nuts ---- */
push(
  eyebrow("10 — Products · category 01 of 03"),
  h1("Dried fruits & nuts"),
  lede("The category Iran is known for. Long harvest-to-export experience, established " +
       "processing capacity, and grading conventions that international buyers already recognise."),
  specimenRow([
    ["sp-pistachio.jpg", "Pistachio", "Kerman · Sep–Oct"],
    ["sp-saffron.jpg", "Saffron", "Khorasan · Oct–Nov"],
    ["sp-date.jpg", "Dates", "Fars · Kerman · Aug–Oct"],
  ]),
  specimenRow([
    ["sp-walnut.jpg", "Walnut", "Azerbaijan · Sep–Oct"],
    ["sp-raisin.jpg", "Raisin", "Azerbaijan · Fars · Aug–Oct"],
  ]),
  body("Pistachio is grown on the arid Kerman plateau, where the day-to-night temperature " +
       "swing drives shell split and kernel fill. Supplied by variety and calibre — Akbari, " +
       "Ahmad Aghaei, Kaleh Ghouchi, Fandoghi — in-shell or kernel."),
  factRow([
    ["Also sourced", "Dried fig · peanut · dried mulberry · sunflower seed · watermelon seed · dried plum."],
    ["Specified by", "Variety, calibre or size grade, moisture, defect tolerance and treatment."],
    ["Packed as", "Bulk cartons and sacks for processors; retail units under our brand or your private label."],
  ]),
  pageBreak(),
);

/* ---- 11 fresh fruits ---- */
push(
  eyebrow("11 — Products · category 02 of 03"),
  h1("Fresh fruits"),
  lede("Iran's climate range means the fresh-fruit season does not close in autumn. Between " +
       "the Caspian belt and the southern valleys, the country supplies across most of the calendar."),
  specimenRow([
    ["sp-grape.jpg", "Grape", "Azerbaijan · Jul–Oct"],
    ["sp-pomegranate.jpg", "Pomegranate", "Fars · Sep–Nov"],
    ["sp-kiwi.jpg", "Kiwi", "Mazandaran · Oct–Dec"],
  ]),
  specimenRow([
    ["sp-peach.jpg", "Peach", "Fars · Jun–Aug"],
    ["sp-melon.jpg", "Melon", "Central Iran · Jun–Sep"],
  ]),
  factRow([
    ["Also sourced", "Apple · watermelon · plum · citrus · seasonal varieties by harvest calendar."],
    ["Specified by", "Variety, size and colour grade, brix where relevant, and pack count."],
    ["Handled as", "Cold-chain from packhouse to port; carton and tray formats matched to the market."],
  ]),
  pageBreak(),
);

/* ---- 12 fresh vegetables ---- */
push(
  eyebrow("12 — Products · category 03 of 03"),
  h1("Fresh vegetables"),
  lede("Protected cultivation has changed what Iran can offer in vegetables. Greenhouse " +
       "production runs through the year, which makes vegetables the category where " +
       "continuity — not season — is the commercial point."),
  ruledTable([
    ["01", "Bell pepper", "Greenhouse-grown across colour grades. Available year-round with a cooler-season peak, sized and packed to the buyer's count per carton."],
    ["02", "Tomato", "Greenhouse and open-field production by variety and grade, including formats intended for onward processing."],
    ["03", "Seasonal produce", "Cucumber, aubergine, courgette and others sourced against the harvest calendar and the destination market's requirements."],
    ["04", "Cold chain & programme", "Vegetables are contracted as a rolling programme with agreed weekly or monthly volumes, and moved under temperature control from packhouse to port."],
  ].map(([n, name, desc]) => new TableRow({
    children: [
      cell([new Paragraph({
        spacing: { before: 70, after: 0 },
        children: [new TextRun({ text: n, font: MONO, size: 16, color: AMBER })],
      })], { width: dxa(14) }),
      cell([new Paragraph({
        spacing: { before: 60, after: 0 },
        children: [new TextRun({ text: name, font: SANS, size: 21, bold: true, color: INK })],
      })], { width: dxa(44) }),
      cell([small(desc)], { width: dxa(112) }),
    ],
  })), [dxa(14), dxa(44), dxa(112)]),
  spacer(200),
  picture("sp-bellpepper.jpg", 84, 84),
  caption("Fig. 04 — Bell pepper, sorted by colour grade before packing."),
  shadedNote("Why vegetables behave differently",
    "With protected cultivation the constraint moves from the season to the cold chain. " +
    "Planning is agreed as a rolling programme rather than a single shipment — which is " +
    "how most of our vegetable buyers work with us."),
  spacer(200),
  small("Full specifications, grades, packing formats and availability are set out in the " +
        "Product Catalogue, available on enquiry."),
  pageBreak(),
);

/* ---- 13 packaging ---- */
const packs = [
  ["pack-carton-nuts.jpg", "Bulk export carton", "Nuts & dried fruit"],
  ["pack-retail-boxes.jpg", "Retail presentation", "Saffron & premium lines"],
  ["pack-carton-grape.jpg", "Ventilated fruit carton", "Fresh fruit · cold chain"],
  ["pack-carton-pepper.jpg", "Vegetable carton", "Greenhouse produce"],
];
const packW = Math.floor(dxa(TEXT_MM) / 4);
push(
  eyebrow("13 — Packaging & private label"),
  h1("Packed for the market it is going to."),
  lede("Packaging is a commercial decision, not a finishing touch. Format, count, labelling " +
       "language and compliance marks change by destination — so they are agreed with the " +
       "specification, not after it."),
  layoutTable([
    new TableRow({
      children: packs.map(([f]) =>
        cell([picture(f, TEXT_MM / 4 - 3, (TEXT_MM / 4 - 3) * 0.75)], {
          width: packW, margins: { top: 0, bottom: 60, left: 0, right: 110 },
        })),
    }),
    new TableRow({
      children: packs.map(([, name, sub]) =>
        cell([
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [new TextRun({ text: name, font: SANS, size: 18, bold: true, color: INK })],
          }),
          new Paragraph({
            spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: sub.toUpperCase(), font: MONO, size: 13, color: GREY, characterSpacing: 14 })],
          }),
        ], { width: packW, margins: { top: 0, bottom: 0, left: 0, right: 110 } })),
    }),
  ], packs.map(() => packW)),
  spacer(280),
  ruledTable([
    ["A", "PAYA ORIGIN brand", "Our own labelling, used where the buyer wants an origin-marked product without developing packaging of their own."],
    ["B", "Private label", "Your brand, your artwork, your market's language and compliance marks — produced to your specification."],
    ["C", "Bulk & industrial", "Unbranded bulk formats for processors and re-packers, specified by net weight and pallet configuration."],
  ].map(([n, name, desc]) => new TableRow({
    children: [
      cell([new Paragraph({
        spacing: { before: 70, after: 0 },
        children: [new TextRun({ text: n, font: MONO, size: 16, color: AMBER })],
      })], { width: dxa(12) }),
      cell([new Paragraph({
        spacing: { before: 60, after: 0 },
        children: [new TextRun({ text: name, font: SANS, size: 21, bold: true, color: INK })],
      })], { width: dxa(44) }),
      cell([small(desc)], { width: dxa(114) }),
    ],
  })), [dxa(12), dxa(44), dxa(114)]),
  spacer(200),
  picture("scene-pallet-wide.jpg", TEXT_MM, TEXT_MM * (10 / 16)),
  caption("Fig. 05 — Palletised cartons staged for loading. Pallet configuration is agreed " +
          "with the packing format, not improvised at the warehouse."),
  pageBreak(),
);

/* ---- 14 markets ---- */
push(
  eyebrow("14 — Markets"),
  h1("Four markets we are built to serve."),
  lede("Our commercial focus is deliberately narrow. These are the markets whose requirements, " +
       "routes and buying patterns we know well enough to commit to."),
  ruledTable([
    ["01", "Middle East", "GCC states and neighbouring markets. Short transit favours fresh fruit and vegetables where condition on arrival is the deciding factor.", "Fresh fruit · vegetables · dates"],
    ["02", "Russia & CIS", "Established demand for Iranian fresh produce, with volume concentrated in the months when local supply is out of season.", "Fresh fruit · vegetables · dried fruit"],
    ["03", "India", "A long-standing destination for Iranian dates, saffron and dried fruit, bought on specification and grade.", "Dates · saffron · dried fruit"],
    ["04", "Europe", "Sea-freighted shelf-stable categories, where documentation, traceability and consistent grading matter as much as price.", "Nuts · dried fruit · saffron"],
  ].map(([n, name, desc, cats]) => new TableRow({
    children: [
      cell([new Paragraph({
        spacing: { before: 70, after: 0 },
        children: [new TextRun({ text: n, font: MONO, size: 16, color: AMBER })],
      })], { width: dxa(12) }),
      cell([new Paragraph({
        spacing: { before: 55, after: 0 },
        children: [new TextRun({ text: name, font: SANS, size: 22, bold: true, color: INK })],
      })], { width: dxa(36) }),
      cell([small(desc)], { width: dxa(80) }),
      cell([new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 70, after: 0, line: 240 },
        children: [new TextRun({ text: cats, font: MONO, size: 14, color: BURGUNDY })],
      })], { width: dxa(42), margins: { top: 90, bottom: 90, left: 0, right: 0 } }),
    ],
  })), [dxa(12), dxa(36), dxa(80), dxa(42)]),
  spacer(240),
  layoutTable([new TableRow({
    children: [
      cell([
        label("How a market is added"),
        small("A new destination enters the list once we understand its import requirements, " +
              "have a route we can hold, and have buyers whose specifications we can meet " +
              "repeatedly. Until then it is an enquiry we will answer honestly, not a market we claim."),
      ], { width: dxa(82), margins: { top: 0, bottom: 0, left: 0, right: 240 } }),
      cell([
        picture("scene-truck.jpg", 82, 82 * (9 / 16)),
        caption("Fig. 06 — Dispatch. Freight is booked against a production plan, not after it."),
      ], { width: dxa(88), margins: { top: 0, bottom: 0, left: 0, right: 0 } }),
    ],
  })], [dxa(82), dxa(88)]),
  pageBreak(),
);

/* ---- 15 working with us ---- */
push(
  eyebrow("15 — Working with us"),
  h1("What happens after you send an enquiry."),
  ruledTable([
    ["01", "Enquiry", "Product, grade, volume, packaging preference, destination port and target delivery window — as much as you have."],
    ["02", "Sourcing proposal", "Origin options with the trade-offs stated: what each region gives you on quality, timing and cost."],
    ["03", "Sample & approval", "Representative samples against the specification, so the standard is agreed on the product rather than on paper."],
    ["04", "Contract & planning", "Terms, schedule and packing fixed. Production is planned against the harvest window, not against optimism."],
    ["05", "Inspection & documents", "Pre-shipment inspection and the document set your import process requires, prepared before the container moves."],
    ["06", "Shipment & follow-up", "Delivery tracked to arrival, then reviewed — because the next season's programme is built on what this one taught us."],
  ].map(([n, name, desc]) => new TableRow({
    children: [
      cell([new Paragraph({
        spacing: { before: 70, after: 0 },
        children: [new TextRun({ text: n, font: MONO, size: 16, color: AMBER })],
      })], { width: dxa(12) }),
      cell([new Paragraph({
        spacing: { before: 60, after: 0 },
        children: [new TextRun({ text: name, font: SANS, size: 21, bold: true, color: INK })],
      })], { width: dxa(48) }),
      cell([small(desc)], { width: dxa(110) }),
    ],
  })), [dxa(12), dxa(48), dxa(110)]),
  spacer(240),
  factRow([
    ["Commercial terms", "FOB, CFR, CIF and DAP quoted on request, according to product, destination and the route being used."],
    ["Lead time", "Driven by harvest window, processing and packing format. Confirmed per order rather than promised in general."],
    ["First order", "Trial volumes are welcome. Most long relationships here started as one container that arrived as described."],
  ]),
  pageBreak(),
);

/* ---- closing ---- */
push(
  picture("scene-field-wide.jpg", TEXT_MM, TEXT_MM * (7 / 16)),
  new Paragraph({
    spacing: { before: 400, after: 200, line: 420, lineRule: "exact" },
    children: [new TextRun({
      text: "Trust is not created by words. It is created by disciplined decisions and consistent delivery.",
      font: SERIF, size: 36, color: INK,
    })],
  }),
  rule(BURGUNDY, 10, 240),
  body("Send us a specification, a target market and a delivery window — or simply ask what " +
       "a region can realistically supply this season. We will answer with what is true, " +
       "including when the answer is no."),
  spacer(240),
  factRow([
    ["Email", "sale@payaorigin.com"],
    ["Phone & WhatsApp", "+98 912 410 7606"],
    ["Office", "Valiasr Street, Tehran, Iran"],
  ]),
  spacer(400),
  pngPicture("logo-burgundy.png", 34, 34 * (451 / 989)),
  new Paragraph({
    spacing: { before: 200, after: 0 },
    children: [new TextRun({
      text: "© 2026 PAYA ORIGIN · payaorigin.com", font: MONO, size: 14, color: GREY,
    })],
  }),
);

/* ------------------------------------------------------------- assemble -- */

const doc = new Document({
  title: "PAYA ORIGIN — Corporate Profile 2026",
  description: "Agricultural sourcing and export. Corporate profile, 2026 edition.",
  creator: "PAYA ORIGIN",
  styles: {
    default: {
      document: { run: { font: SANS, size: 20, color: INK2 } },
      heading1: { run: { font: SERIF, size: 44, bold: false, color: INK }, paragraph: { spacing: { before: 0, after: 200 } } },
      heading2: { run: { font: SERIF, size: 26, bold: false, color: INK }, paragraph: { spacing: { before: 300, after: 120 } } },
    },
  },
  sections: [{
    properties: {
      titlePage: true,
      page: {
        size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
        margin: {
          top: dxa(30), bottom: dxa(MARGIN_MM),
          left: dxa(MARGIN_MM), right: dxa(MARGIN_MM),
          header: dxa(14), footer: dxa(12),
        },
      },
    },
    headers: {
      // the wordmark rides in the header so it appears on every page, the
      // same way the print edition carries a page mark
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 0 },
          children: [new ImageRun({
            type: "png",
            data: img("logo-burgundy.png"),
            transformation: { width: px(22), height: px(22 * (451 / 989)) },
          })],
        })],
      }),
      // the cover gets the mark at cover scale instead of the running size
      first: new Header({
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new ImageRun({
            type: "png",
            data: img("logo-burgundy.png"),
            transformation: { width: px(42), height: px(42 * (451 / 989)) },
          })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: RULE } },
            spacing: { before: 0, after: 0 },
            children: [],
          }),
          new Paragraph({
            spacing: { before: 80, after: 0 },
            tabStops: [{ type: "right", position: dxa(TEXT_MM) }],
            children: [
              new TextRun({
                text: "PAYA ORIGIN — CORPORATE PROFILE", font: MONO, size: 13,
                color: GREY, characterSpacing: 24,
              }),
              new TextRun({ text: "\t", font: MONO, size: 13 }),
              new TextRun({ children: [PageNumber.CURRENT], font: MONO, size: 13, color: GREY }),
            ],
          }),
        ],
      }),
    },
    children,
  }],
});

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, await Packer.toBuffer(doc));
console.log(`editable -> ${path.relative(root, out)} ` +
            `(${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
