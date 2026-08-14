import type { Market, Stage } from "@/types";

/**
 * Company-level content, transcribed from the Corporate Profile (Edition
 * 2026). Figures describe commercial focus and sourcing footprint; volumes,
 * grades and lead times are confirmed per enquiry.
 */

export const commercialPrinciple =
  "We do not sell what is available. We build supply around what is required.";

export const positioning = "Agricultural Sourcing, Quality & Export Partner";

export const glance = [
  {
    value: "15+",
    title: "Years in agricultural trade",
    text: "Commercial experience across sourcing, quality control and export operations for Iranian agricultural products.",
    tag: "Experience",
  },
  {
    value: "05",
    title: "Sourcing regions across Iran",
    text: "Kerman, Khorasan, Fars, Mazandaran and the Azerbaijan provinces — each selected for a specific crop, not for convenience.",
    tag: "Origin",
  },
  {
    value: "03",
    title: "Product categories",
    text: "Dried fruits & nuts · fresh fruits · fresh vegetables — with packaging under our brand or your private label.",
    tag: "Range",
  },
  {
    value: "04",
    title: "Priority export markets",
    text: "Middle East · Russia & CIS · India · Europe. Commercial focus rather than an exhaustive list.",
    tag: "Markets",
  },
  {
    value: "One",
    title: "Point of accountability",
    text: "A single contract and a single counterpart from producer selection through to delivered shipment.",
    tag: "Structure",
  },
];

export const glanceFootnote =
  "Figures describe the company's commercial focus and sourcing footprint. Volumes, grades and lead times are confirmed per enquiry. Regions listed are those currently active in the sourcing network and expand according to buyer requirements.";

/** Section 04 — Our model. Five stages, each producing something the next depends on. */
export const modelStages: Stage[] = [
  {
    index: "01",
    title: "Requirement",
    text: "Product, grade, volume, packaging, destination and delivery window are fixed in writing before anything is sourced.",
    output: {
      title: "Written specification",
      text: "Signed before sourcing begins.",
    },
  },
  {
    index: "02",
    title: "Sourcing",
    text: "The region is chosen for the crop; the producer is chosen for the specification. Alternatives are proposed, not assumed.",
    output: {
      title: "Origin proposal",
      text: "Producer options with the trade-offs stated.",
    },
  },
  {
    index: "03",
    title: "Verification",
    text: "Quality is checked at supplier assessment, during procurement, and again before the shipment is sealed.",
    output: {
      title: "Inspection record",
      text: "Evidence against the agreed grade.",
    },
  },
  {
    index: "04",
    title: "Preparation",
    text: "Cleaning, sorting, grading, packing and labelling to the destination market's requirements.",
    output: {
      title: "Packing & label spec",
      text: "Format, count, marks, pallet plan.",
    },
  },
  {
    index: "05",
    title: "Delivery",
    text: "Documentation, customs and freight handled inside the same contract that started at the requirement.",
    output: {
      title: "Document set",
      text: "Certificates and shipping schedule.",
    },
  },
];

export const modelPrinciples = [
  "The requirement defines the sourcing strategy — never the other way round.",
  "Producers are selected and re-assessed. Being nearby is not a qualification.",
  "One coordinated partner replaces a chain of disconnected suppliers.",
];

/** Section 07 — Quality verification. Three checkpoints, not one final inspection. */
export const checkpoints = [
  {
    index: "Checkpoint 01",
    title: "Before procurement",
    text: "The producer is assessed — growing region, handling practice, processing capability and past consistency. A producer who cannot meet the specification is not asked to try.",
  },
  {
    index: "Checkpoint 02",
    title: "During sourcing",
    text: "Lots are checked against the agreed grade as they are collected and processed — so a deviation is caught while it can still be corrected, not after packing.",
  },
  {
    index: "Checkpoint 03",
    title: "Before shipment",
    text: "Pre-shipment inspection against the same written specification the order started with, together with the documentation the destination market requires.",
  },
];

export const shipmentDocuments = [
  "Commercial invoice",
  "Packing list",
  "Certificate of origin",
  "Phytosanitary certificate",
  "Bill of lading or CMR",
  "Inspection report, where agreed",
];

export const shipmentDocumentsNote =
  "Exact document set depends on product, destination and the buyer's import requirements.";

/** Section 05 — Scope of responsibility. */
export const weDo = [
  {
    index: "01",
    title: "Procurement against a written specification",
    text: "Grade, calibre, moisture, packing and tolerance agreed before sourcing begins.",
  },
  {
    index: "02",
    title: "Producer identification and assessment",
    text: "Farms and processors evaluated across Iran's growing regions.",
  },
  {
    index: "03",
    title: "Quality verification at three points",
    text: "Supplier assessment, procurement, pre-shipment.",
  },
  {
    index: "04",
    title: "Packaging development",
    text: "PAYA ORIGIN brand or your private label, built for the destination market.",
  },
  {
    index: "05",
    title: "Export documentation and freight",
    text: "Certificates, customs and shipment inside one contract.",
  },
  {
    index: "06",
    title: "Season-over-season supply planning",
    text: "Continuity treated as the product, not the by-product.",
  },
];

export const weDoNot = [
  "Operate farms. We select and supervise producers; we do not compete with them.",
  "Sell anonymous commodity stock. Every lot has a named region and a named producer behind it.",
  "Depend on a single producer or region. Alternatives are maintained for every active line.",
  "Treat a shipment as the finish line. A first order that does not repeat is a failed order.",
  "Quote what we cannot verify. If a specification cannot be met honestly, we say so.",
  "Sell certification we do not hold. Required certificates are arranged and named explicitly per shipment.",
];

/** Section 03 — The sourcing problem. */
export const fragmentation = [
  {
    title: "Producers",
    text: "Different standards, timelines and languages.",
  },
  { title: "Inspectors", text: "Quality verified inconsistently, if at all." },
  { title: "Packers", text: "Packaging chosen for supply, not for the market." },
  { title: "Forwarders", text: "Freight booked separately from production." },
  { title: "Documents", text: "Certificates chased after the goods have moved." },
];

export const fragmentationCost = [
  {
    title: "Quality drifts",
    text: "When no single party owns the standard, each lot is judged against a slightly different one.",
  },
  {
    title: "Schedules slip",
    text: "Production, packing and freight planned separately rarely meet on the date the buyer needs.",
  },
  {
    title: "Nobody answers",
    text: "When something goes wrong across five counterparties, the buyer absorbs it. That is the real cost.",
  },
];

/** Section 13 — Packaging & private label. */
export const packagingOptions = [
  {
    ref: "A",
    title: "PAYA ORIGIN brand",
    text: "Our own labelling, used where the buyer wants an origin-marked product without developing packaging of their own.",
    image: "/images/packaging/pistachio-retail-box.jpg",
  },
  {
    ref: "B",
    title: "Private label",
    text: "Your brand, your artwork, your market's language and compliance marks — produced to your specification.",
    image: "/images/packaging/bell-pepper-retail.jpg",
  },
  {
    ref: "C",
    title: "Bulk & industrial",
    text: "Unbranded bulk formats for processors and re-packers, specified by net weight and pallet configuration.",
    image: "/images/packaging/export-cartons-pallet.jpg",
  },
];

export const packagingFormats = [
  { title: "Bulk export carton", tag: "Nuts & dried fruit" },
  { title: "Retail presentation", tag: "Saffron & premium lines" },
  { title: "Ventilated fruit carton", tag: "Fresh fruit · cold chain" },
  { title: "Vegetable carton", tag: "Greenhouse produce" },
];

export const packagingNote =
  "Packaging is a commercial decision, not a finishing touch. Format, count, labelling language and compliance marks change by destination — so they are agreed with the specification, not after it. Exact formats, weights and materials are confirmed product by product.";

/** Section 14 — Markets. */
export const markets: Market[] = [
  {
    ref: "01",
    name: "Middle East",
    text: "GCC states and neighbouring markets. Short transit favours fresh fruit and vegetables where condition on arrival is the deciding factor.",
    categories: "Fresh fruit · vegetables · dates",
  },
  {
    ref: "02",
    name: "Russia & CIS",
    text: "Established demand for Iranian fresh produce, with volume concentrated in the months when local supply is out of season.",
    categories: "Fresh fruit · vegetables · dried fruit",
  },
  {
    ref: "03",
    name: "India",
    text: "A long-standing destination for Iranian dates, saffron and dried fruit, bought on specification and grade.",
    categories: "Dates · saffron · dried fruit",
  },
  {
    ref: "04",
    name: "Europe",
    text: "Sea-freighted shelf-stable categories, where documentation, traceability and consistent grading matter as much as price.",
    categories: "Nuts · dried fruit · saffron",
  },
];

export const marketAdditionNote =
  "A new destination enters the list once we understand its import requirements, have a route we can hold, and have buyers whose specifications we can meet repeatedly. Until then it is an enquiry we will answer honestly, not a market we claim.";

/** Section 14 — Working with us. */
export const engagementSteps: Stage[] = [
  {
    index: "01",
    title: "Enquiry",
    text: "Product, grade, volume, packaging preference, destination port and target delivery window — as much as you have.",
  },
  {
    index: "02",
    title: "Sourcing proposal",
    text: "Origin options with the trade-offs stated: what each region gives you on quality, timing and cost.",
  },
  {
    index: "03",
    title: "Sample & approval",
    text: "Representative samples against the specification, so the standard is agreed on the product rather than on paper.",
  },
  {
    index: "04",
    title: "Contract & planning",
    text: "Terms, schedule and packing fixed. Production is planned against the harvest window, not against optimism.",
  },
  {
    index: "05",
    title: "Inspection & documents",
    text: "Pre-shipment inspection and the document set your import process requires, prepared before the container moves.",
  },
  {
    index: "06",
    title: "Shipment & follow-up",
    text: "Delivery tracked to arrival, then reviewed — because the next season's programme is built on what this one taught us.",
  },
];

export const commercialTerms = [
  {
    title: "Commercial terms",
    text: "FOB, CFR, CIF and DAP quoted on request, according to product, destination and the route being used.",
  },
  {
    title: "Lead time",
    text: "Driven by harvest window, processing and packing format. Confirmed per order rather than promised in general.",
  },
  {
    title: "First order",
    text: "Trial volumes are welcome. Most long relationships here started as one container that arrived as described.",
  },
];

export const samplesNote =
  "Representative samples are available on request against the agreed specification. Sample cost is paid by the customer.";
