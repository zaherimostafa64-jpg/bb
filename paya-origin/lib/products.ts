import type { CategorySlug, Product } from "@/types";

/**
 * The product system.
 *
 * Every value below is transcribed from an approved PAYA ORIGIN source:
 *   · Fresh Produce Catalogue (Edition 01) — fresh fruits & vegetables
 *   · Dry Fruits & Nuts Catalogue (v1.0)   — dried fruits, nuts, seeds
 *   · Corporate Profile (Edition 2026)     — origins, harvest windows, markets
 *
 * Nothing is inferred. Where a catalogue leaves a field to the buyer it is
 * listed under `specifiedToRequirement` rather than given a plausible value,
 * and where a source flags a value as unconfirmed it is carried as a
 * `sourceNote` instead of being printed as specification.
 */

export const categories: Record<
  CategorySlug,
  {
    slug: CategorySlug;
    title: string;
    shortTitle: string;
    index: string;
    lead: string;
    text: string;
    image: string;
    groups: string[];
    specifiedBy: string;
    handling: { label: string; text: string };
  }
> = {
  "dried-fruits-nuts": {
    slug: "dried-fruits-nuts",
    title: "Dried fruits & nuts",
    shortTitle: "Dried fruits & nuts",
    index: "01",
    lead: "The category Iran is known for.",
    text: "Long harvest-to-export experience, established processing capacity, and grading conventions that international buyers already recognise.",
    image: "/images/products/dry-fruits-composition.jpg",
    groups: ["Signature products", "Dried fruits", "Nuts", "Seeds & specialties"],
    specifiedBy:
      "Variety, calibre or size grade, moisture, defect tolerance and treatment.",
    handling: {
      label: "Packed as",
      text: "Bulk cartons and sacks for processors; retail units under our brand or your private label.",
    },
  },
  "fresh-fruits": {
    slug: "fresh-fruits",
    title: "Fresh fruits",
    shortTitle: "Fresh fruits",
    index: "02",
    lead: "The fresh-fruit season does not close in autumn.",
    text: "Between the Caspian belt and the southern valleys, the country supplies across most of the calendar.",
    image: "/images/products/pomegranate.png",
    groups: [],
    specifiedBy:
      "Variety, size and colour grade, brix where relevant, and pack count.",
    handling: {
      label: "Handled as",
      text: "Cold-chain from packhouse to port; carton and tray formats matched to the market.",
    },
  },
  "fresh-vegetables": {
    slug: "fresh-vegetables",
    title: "Fresh vegetables",
    shortTitle: "Fresh vegetables",
    index: "03",
    lead: "Continuity, not season, is the commercial point.",
    text: "Protected cultivation runs through the year, which makes vegetables the category where a rolling programme matters more than a harvest window.",
    image: "/images/products/bell-pepper.png",
    groups: [],
    specifiedBy: "Calibre, colour stage, count per carton and packing format.",
    handling: {
      label: "Contracted as",
      text: "A rolling programme with agreed weekly or monthly volumes, moved under temperature control from packhouse to port.",
    },
  },
};

export const categoryOrder: CategorySlug[] = [
  "dried-fruits-nuts",
  "fresh-fruits",
  "fresh-vegetables",
];

const EXPORT_MARKETS = ["Middle East", "Russia", "India", "Europe"];
const GRADES = "Extra Class · Class I · Class II";

export const products: Product[] = [
  // ────────────────────────────────────────────────────────────────
  // 01 — DRIED FRUITS & NUTS · Signature products
  // ────────────────────────────────────────────────────────────────
  {
    slug: "pistachio",
    name: "Pistachio",
    category: "dried-fruits-nuts",
    group: "Signature products",
    image: "/images/products/pistachio-akbari.jpg",
    contextImage: "/images/process/pistachio-harvest.jpg",
    contextCaption:
      "Pistachio harvest at a selected orchard, Kerman province. Producers are visited and assessed before they enter the network.",
    positioning:
      "Grown on the arid Kerman plateau, where the day-to-night temperature swing drives shell split and kernel fill. Supplied by variety and calibre, in-shell or kernel.",
    origin: "Iran",
    regions: ["Kerman"],
    season: "September — October",
    varietyLabel: "Varieties",
    varieties: [
      {
        name: "Akbari",
        note: "Long & elongated profile",
        image: "/images/products/pistachio-akbari.jpg",
      },
      {
        name: "Ahmad Aghaei",
        note: "Long kernel profile",
        image: "/images/products/pistachio-ahmad-aghaei.jpg",
      },
      {
        name: "Kalleh Ghuchi",
        note: "Distinctive rounder profile",
        image: "/images/products/pistachio-kalleh-ghuchi.jpg",
      },
      {
        name: "Fandoghi",
        note: "Round / hazelnut-shaped profile",
        image: "/images/products/pistachio-fandoghi.jpg",
      },
    ],
    spec: [
      { label: "Form", value: "In-shell · Kernel · Sliced / Slivered" },
    ],
    specifiedToRequirement: [
      "Size / Count",
      "Grade",
      "Open / Closed Shell",
      "Processing",
      "Crop Year",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
    sourceNote:
      "Shape descriptions are visual references. Commercial values are confirmed per order.",
    featured: true,
  },
  {
    slug: "saffron",
    name: "Saffron",
    category: "dried-fruits-nuts",
    group: "Signature products",
    image: "/images/products/saffron.jpg",
    contextImage: "/images/process/laboratory-check.jpg",
    contextCaption:
      "Saffron weighed and checked before packing. Grade and type are agreed with the specification, not after it.",
    positioning: "A concentrated expression of Iranian agricultural origin.",
    origin: "Iran",
    regions: ["Khorasan"],
    season: "October — November",
    specifiedToRequirement: ["Type", "Grade", "Packaging", "Availability"],
    sourceNote:
      "Grade and availability are recorded in the Company Profile but are held as source-based and are not printed as specification until confirmed per order.",
    featured: true,
  },
  {
    slug: "dates",
    name: "Dates",
    category: "dried-fruits-nuts",
    group: "Signature products",
    image: "/images/products/dates.jpg",
    positioning:
      "Selected Iranian dates sourced according to product and market requirements.",
    origin: "Iran",
    regions: ["Fars", "Kerman"],
    season: "August — October",
    varietyLabel: "Varieties",
    varieties: [{ name: "Piarom" }, { name: "Zahedi" }, { name: "Mazafati" }],
    specifiedToRequirement: [
      "Size",
      "Moisture",
      "Grade",
      "Processing",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
    featured: true,
  },
  {
    slug: "raisins",
    name: "Raisins",
    category: "dried-fruits-nuts",
    group: "Signature products",
    image: "/images/products/raisin-green.jpg",
    positioning:
      "Selected raisins in different colours, types and processing profiles.",
    origin: "Iran",
    regions: ["Azerbaijan", "Fars"],
    season: "August — October",
    varietyLabel: "Types",
    varieties: [
      { name: "Green Raisin", image: "/images/products/raisin-green.jpg" },
      { name: "Shahani / Maviz", image: "/images/products/raisin-shahani.jpg" },
      { name: "Fakhri", image: "/images/products/raisin-fakhri.jpg" },
      {
        name: "Seedless Raisin",
        note: "Also listed as Plov",
        image: "/images/products/raisin-seedless.jpg",
      },
    ],
    specifiedToRequirement: [
      "Growing Region",
      "Colour",
      "Seeded / Seedless",
      "Size",
      "Grade",
      "Sulphured / Unsulphured",
      "Stemmed / Stemless",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
    featured: true,
  },
  {
    slug: "dried-fig",
    name: "Dried fig",
    category: "dried-fruits-nuts",
    group: "Signature products",
    image: "/images/products/dried-fig.jpg",
    positioning:
      "Iranian dried fig, supplied as a general origin product or as a dedicated Estahban product.",
    origin: "Iran",
    season: "August — September",
    specifiedToRequirement: [
      "Fig Type / Grade",
      "Size",
      "Colour",
      "Open / Closed",
      "Processing",
      "Crop Year",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
    featured: true,
  },
  {
    slug: "estahban-dried-fig",
    name: "Estahban dried fig",
    category: "dried-fruits-nuts",
    group: "Signature products",
    image: "/images/products/estahban-dried-fig.jpg",
    positioning:
      "A dedicated product entry. Estahban dried fig carries a distinct commercial identity and is not listed inside a generic dried fig line.",
    origin: "Estahban, Fars, Iran",
    specifiedToRequirement: [
      "Grade",
      "Size",
      "Open / Closed",
      "Colour",
      "Processing",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
  },

  // ── Dried fruits ────────────────────────────────────────────────
  {
    slug: "dried-apricot",
    name: "Dried apricot / Qaysi",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-apricot-qaysi.jpg",
    positioning:
      "Iranian dried apricot, prepared to the type and processing profile the buyer requires.",
    origin: "Iran",
    specifiedToRequirement: [
      "Type",
      "Size",
      "Colour",
      "Sulphured / Unsulphured",
      "Moisture",
      "Grade",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
  },
  {
    slug: "dried-mulberry",
    name: "Dried mulberry",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-mulberry.jpg",
    positioning:
      "Iranian dried mulberry, supplied to buyer size and grade requirements.",
    origin: "Iran",
    specifiedToRequirement: [
      "Variety",
      "Size",
      "Colour",
      "Moisture",
      "Grade",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
  },
  {
    slug: "dried-plum",
    name: "Dried plum / Prune",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-plum.jpg",
    positioning:
      "Selected Iranian dried plum products prepared for culinary and commercial applications.",
    origin: "Iran",
    varietyLabel: "Product types",
    varieties: [
      { name: "Targhabeh" },
      { name: "Shoghani" },
      { name: "Santariza / Sour Plum" },
      { name: "Moghan" },
    ],
    specifiedToRequirement: [
      "Whole / Pitted",
      "Size",
      "Moisture",
      "Grade",
      "Processing",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
    sourceNote:
      "These are dried / processed products. They are not fresh plum varieties and are not listed in the fresh produce range.",
  },
  {
    slug: "dried-sour-cherry",
    name: "Dried sour cherry",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-sour-cherry.jpg",
    positioning:
      "Iranian dried sour cherry, prepared for culinary and industrial applications.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Dried" }],
    specifiedToRequirement: [
      "Size",
      "Grade",
      "Processing",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
  },
  {
    slug: "dried-peach",
    name: "Dried peach",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-peach.jpg",
    positioning: "Iranian dried peach, specification confirmed per order.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Dried" }],
  },
  {
    slug: "dried-apple",
    name: "Dried apple",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-apple.jpg",
    positioning: "Iranian dried apple, specification confirmed per order.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Dried" }],
  },
  {
    slug: "dried-pear",
    name: "Dried pear",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-pear.jpg",
    positioning: "Iranian dried pear, specification confirmed per order.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Dried" }],
  },
  {
    slug: "dried-kiwi",
    name: "Dried kiwi",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-kiwi.jpg",
    positioning: "Iranian dried kiwi, specification confirmed per order.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Dried" }],
  },
  {
    slug: "dried-persimmon",
    name: "Dried persimmon",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-persimmon.jpg",
    positioning: "Iranian dried persimmon, specification confirmed per order.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Dried" }],
  },
  {
    slug: "dried-banana",
    name: "Dried banana",
    category: "dried-fruits-nuts",
    group: "Dried fruits",
    image: "/images/products/dried-banana.jpg",
    positioning: "Dried banana, specification confirmed per order.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Dried" }],
  },

  // ── Nuts ────────────────────────────────────────────────────────
  {
    slug: "walnut",
    name: "Walnut",
    category: "dried-fruits-nuts",
    group: "Nuts",
    image: "/images/products/walnut.jpg",
    positioning:
      "Iranian walnut supplied in-shell or as kernel, prepared to buyer specification.",
    origin: "Iran",
    regions: ["Azerbaijan"],
    season: "September — October",
    spec: [{ label: "Form", value: "In-shell · Kernel" }],
    specifiedToRequirement: [
      "Variety",
      "Growing Region",
      "Kernel Colour",
      "Size",
      "Grade",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
    featured: true,
  },
  {
    slug: "almond",
    name: "Almond",
    category: "dried-fruits-nuts",
    group: "Nuts",
    image: "/images/products/almond.jpg",
    positioning:
      "Iranian almond supplied raw or slivered, prepared to buyer specification.",
    origin: "Iran",
    spec: [{ label: "Form", value: "Raw · Slivered" }],
    specifiedToRequirement: [
      "Variety",
      "Growing Region",
      "Size",
      "Grade",
      "Processing",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
  },
  {
    slug: "hazelnut",
    name: "Hazelnut",
    category: "dried-fruits-nuts",
    group: "Nuts",
    image: "/images/products/hazelnut.jpg",
    positioning: "Iranian hazelnut supplied in-shell or as raw kernel.",
    origin: "Iran",
    spec: [{ label: "Form", value: "In-shell · Raw Kernel" }],
    specifiedToRequirement: ["Size", "Grade", "Packaging"],
  },
  {
    slug: "peanut",
    name: "Peanut",
    category: "dried-fruits-nuts",
    group: "Nuts",
    image: "/images/products/peanut.jpg",
    positioning: "Iranian peanut sourced from the Astaneh growing area.",
    origin: "Iran",
    spec: [
      {
        label: "Growing area",
        value: "Astaneh",
        note: "Origin reference confirmed per order.",
      },
    ],
    specifiedToRequirement: [
      "Type / Variety",
      "In-shell / Shelled",
      "Raw / Roasted",
      "Salted / Unsalted",
      "Size",
      "Grade",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
    sourceNote:
      "The Astaneh growing-area reference is carried from the visual library and is printed as an origin reference only once confirmed.",
  },
  {
    slug: "chickpea",
    name: "Chickpea",
    category: "dried-fruits-nuts",
    group: "Nuts",
    image: "/images/products/chickpea.jpg",
    positioning:
      "Roasted chickpea (nokhodchi), part of the Iranian nuts range.",
    origin: "Iran",
    specifiedToRequirement: [
      "Type",
      "Size",
      "Processing",
      "Grade",
      "Packaging",
    ],
  },

  // ── Seeds & specialties ─────────────────────────────────────────
  {
    slug: "sunflower-seeds",
    name: "Sunflower seeds",
    category: "dried-fruits-nuts",
    group: "Seeds & specialties",
    image: "/images/products/sunflower-seeds.jpg",
    positioning: "Iranian sunflower seeds in in-shell, raw and kernel forms.",
    origin: "Iran",
    spec: [
      { label: "Type", value: "White-Ring" },
      { label: "Form", value: "In-shell · Raw · Kernel" },
    ],
    specifiedToRequirement: [
      "Size",
      "Raw / Roasted",
      "Salted / Unsalted",
      "Grade",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
  },
  {
    slug: "pumpkin-seeds",
    name: "Pumpkin seeds",
    category: "dried-fruits-nuts",
    group: "Seeds & specialties",
    image: "/images/products/pumpkin-seeds.jpg",
    positioning: "Iranian pumpkin seeds in in-shell and kernel forms.",
    origin: "Iran",
    spec: [
      { label: "Form", value: "In-shell · Kernel" },
      { label: "Type", value: "Meaty · Small" },
    ],
    specifiedToRequirement: [
      "Size",
      "Raw / Roasted",
      "Salted / Unsalted",
      "Grade",
      "Packaging",
    ],
  },
  {
    slug: "watermelon-seeds",
    name: "Watermelon seeds",
    category: "dried-fruits-nuts",
    group: "Seeds & specialties",
    image: "/images/products/watermelon-seeds.jpg",
    positioning:
      "Selected Iranian watermelon seeds prepared according to buyer requirements.",
    origin: "Iran",
    specifiedToRequirement: [
      "Variety / Type",
      "Shelled / In-shell",
      "Size",
      "Raw / Roasted",
      "Salted / Unsalted",
      "Grade",
      "Packaging",
      "Storage",
      "Shelf Life",
    ],
  },
  {
    slug: "barberry",
    name: "Barberry",
    category: "dried-fruits-nuts",
    group: "Seeds & specialties",
    image: "/images/products/barberry.jpg",
    positioning:
      "A distinct Iranian product available alongside the main range.",
    origin: "Iran",
    regions: ["Khorasan"],
  },
  {
    slug: "jujube",
    name: "Jujube",
    category: "dried-fruits-nuts",
    group: "Seeds & specialties",
    image: "/images/products/jujube.jpg",
    positioning:
      "A distinct Iranian product available alongside the main range.",
    origin: "Iran",
  },
  {
    slug: "senjed",
    name: "Senjed",
    category: "dried-fruits-nuts",
    group: "Seeds & specialties",
    image: "/images/products/senjed.jpg",
    positioning:
      "A distinct Iranian product available alongside the main range.",
    origin: "Iran",
  },

  // ────────────────────────────────────────────────────────────────
  // 02 — FRESH FRUITS
  // ────────────────────────────────────────────────────────────────
  {
    slug: "apple",
    name: "Apple",
    category: "fresh-fruits",
    image: "/images/products/apple.jpg",
    contextImage: "/images/origins/apple-orchard-crates.jpg",
    contextCaption:
      "Apples graded into field crates at harvest, before cold storage.",
    positioning:
      "Selected Iranian orchards across five growing regions, with availability extended through controlled cold storage.",
    origin: "Iran",
    originNote: "Selected Iranian orchards",
    regions: [
      "W. Azerbaijan (Urmia)",
      "E. Azerbaijan",
      "Tehran (Damavand)",
      "Isfahan (Semirom)",
      "Kurdistan",
    ],
    season: "August — November",
    seasonNote:
      "By variety and growing region. Extended availability through controlled cold storage.",
    varietyLabel: "Varieties",
    varieties: [
      { name: "Red Delicious" },
      { name: "Golden Delicious" },
      { name: "Gala" },
      { name: "Fuji" },
      { name: "Granny Smith" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      {
        label: "Calibre",
        value: "60 — 85 mm",
        note: "Specific calibre and count per carton to buyer requirement.",
      },
      {
        label: "Packaging",
        value: "Export-grade cartons · Plastic crates · Standard or customised formats",
      },
      {
        label: "Storage",
        value: "0 — 4 °C, high RH",
        note: "Controlled-atmosphere storage available for selected varieties.",
      },
      {
        label: "Shelf life",
        value: "4 — 6 months cold storage",
        note: "Up to 6 — 8 months under controlled atmosphere, depending on variety and conditions.",
      },
      {
        label: "MOQ",
        value: "1 pallet · 1 truckload",
        note: "Depending on variety, destination and packaging.",
      },
    ],
    markets: EXPORT_MARKETS,
    featured: true,
  },
  {
    slug: "kiwi",
    name: "Kiwi",
    category: "fresh-fruits",
    image: "/images/products/kiwi.jpg",
    contextImage: "/images/origins/kiwi-vines.jpg",
    contextCaption:
      "Kiwi vines under cover. Crop reference for the line that carries the late-season fruit calendar.",
    positioning:
      "Grown on the humid Caspian strip between the Alborz range and the sea, where the season runs late into the year.",
    origin: "Iran",
    originNote: "Selected Iranian orchards",
    regions: ["Mazandaran", "Gilan", "Golestan"],
    season: "October — November",
    seasonNote: "Extended availability through cold storage.",
    varietyLabel: "Variety",
    varieties: [{ name: "Hayward" }, { name: "Other varieties on request" }],
    spec: [
      { label: "Grades", value: GRADES },
      {
        label: "Size",
        value: "70 — 110 g per fruit",
        note: "Other sizes according to buyer requirements.",
      },
      {
        label: "Packaging",
        value: "Export-grade cartons · Trays · Customised formats",
      },
      { label: "Storage", value: "0 — 1 °C", note: "High relative humidity." },
      {
        label: "Shelf life",
        value: "3 — 6 months",
        note: "Under appropriate cold-storage conditions.",
      },
    ],
    markets: EXPORT_MARKETS,
    featured: true,
  },
  {
    slug: "pomegranate",
    name: "Pomegranate",
    category: "fresh-fruits",
    image: "/images/products/pomegranate.png",
    imageKind: "cutout",
    contextImage: "/images/origins/pomegranate-harvest.jpg",
    contextCaption:
      "Pomegranate harvest staged in the orchard before grading and packing.",
    positioning:
      "Four named varieties across five growing regions, graded and sized to the destination market's carton count.",
    origin: "Iran",
    originNote: "Selected Iranian orchards",
    regions: [
      "Markazi (Saveh)",
      "Fars",
      "Yazd",
      "Khorasan Razavi",
      "Isfahan",
    ],
    season: "September — November",
    seasonNote: "Depending on variety and region.",
    varietyLabel: "Varieties",
    varieties: [
      { name: "Wonderful" },
      { name: "Malase Saveh" },
      { name: "Shahvar" },
      { name: "Shirin-e-Saveh" },
      { name: "Others on request" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      {
        label: "Size",
        value: "60 — 100 mm",
        note: "Specific size and count per carton available to buyer requirement.",
      },
      {
        label: "Packaging",
        value: "Export-grade cartons · Trays · Crates · Customised formats",
      },
      { label: "Storage", value: "5 — 7 °C, high RH" },
      {
        label: "Shelf life",
        value: "2 — 4 months",
        note: "Under appropriate cold storage.",
      },
    ],
    markets: EXPORT_MARKETS,
    featured: true,
  },
  {
    slug: "table-grapes",
    name: "Table grapes",
    category: "fresh-fruits",
    image: "/images/products/table-grapes.jpg",
    contextImage: "/images/origins/vineyard.jpg",
    contextCaption:
      "Table grapes on the vine. Long, bright autumns concentrate sugars before harvest.",
    positioning:
      "Five seedless varieties spread across the season, supplied as single-variety consignments or mixed presentations.",
    origin: "Iran",
    originNote: "Selected Iranian vineyards",
    regions: [
      "W. Azerbaijan",
      "E. Azerbaijan",
      "Qazvin",
      "Fars",
      "Khorasan Razavi",
    ],
    season: "June — October",
    seasonNote: "Depending on variety and growing region.",
    varietyLabel: "Varieties",
    varieties: [
      {
        name: "Flame Seedless",
        note: "Seedless red grape",
        meta: [
          { label: "Season", value: "Early" },
          { label: "Colour", value: "Red" },
          { label: "Texture", value: "Crisp" },
        ],
      },
      {
        name: "Crimson Seedless",
        note: "Seedless red grape",
        meta: [
          { label: "Season", value: "Late" },
          { label: "Colour", value: "Deep red" },
          { label: "Texture", value: "Firm" },
        ],
      },
      {
        name: "Autumn Royal",
        note: "Seedless black grape",
        meta: [
          { label: "Season", value: "Late" },
          { label: "Colour", value: "Purple–black" },
          { label: "Berry", value: "Large" },
        ],
      },
      {
        name: "Perlette",
        note: "Seedless green grape",
        meta: [
          { label: "Season", value: "Early" },
          { label: "Colour", value: "Light green" },
          { label: "Texture", value: "Crisp" },
        ],
      },
      {
        name: "Superior Seedless",
        note: "Seedless green grape",
        meta: [
          { label: "Season", value: "Early" },
          { label: "Colour", value: "Green–yellow" },
          { label: "Texture", value: "Crisp" },
        ],
      },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      {
        label: "Berry size",
        value: "16 — 24 mm",
        note: "Berry size, bunch weight and carton count to buyer requirement.",
      },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Punnets · Plastic clamshells · Customised formats",
      },
      {
        label: "Storage",
        value: "0 — 1 °C, high RH",
        note: "Continuous cold-chain management recommended.",
      },
      {
        label: "Shelf life",
        value: "2 — 6 weeks",
        note: "Under appropriate cold-chain conditions.",
      },
    ],
    markets: EXPORT_MARKETS,
    featured: true,
  },
  {
    slug: "watermelon",
    name: "Watermelon",
    category: "fresh-fruits",
    image: "/images/products/watermelon.jpg",
    positioning:
      "Seeded and seedless types by season and market, loaded in bulk or packed to a customised palletisation.",
    origin: "Iran",
    originNote: "Selected Iranian farms",
    regions: ["Khuzestan", "Fars", "Khorasan Razavi", "Semnan", "Qazvin"],
    season: "May — September",
    varietyLabel: "Types",
    varieties: [
      { name: "Seeded" },
      { name: "Seedless", note: "According to season and market" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      { label: "Size", value: "3 — 10 kg", note: "Per fruit." },
      {
        label: "Packaging",
        value:
          "Bulk loading · Export-grade cartons · Crates · Customised palletisation",
      },
      {
        label: "Storage",
        value: "10 — 15 °C",
        note: "With appropriate relative humidity.",
      },
      {
        label: "Shelf life",
        value: "2 — 4 weeks",
        note: "Under appropriate post-harvest and cold-chain conditions.",
      },
    ],
    markets: EXPORT_MARKETS,
  },
  {
    slug: "peach",
    name: "Peach",
    category: "fresh-fruits",
    image: "/images/products/peach.png",
    imageKind: "cutout",
    contextImage: "/images/origins/peach-orchard.jpg",
    contextCaption: "Peach orchard at harvest.",
    positioning:
      "Four named varieties from the northern and central orchards, packed for a one-to-three-week cold-chain window.",
    origin: "Iran",
    originNote: "Selected Iranian orchards",
    regions: [
      "W. Azerbaijan",
      "E. Azerbaijan",
      "Alborz",
      "Tehran",
      "Fars",
      "Isfahan",
    ],
    season: "June — September",
    varietyLabel: "Varieties",
    varieties: [
      { name: "Red Haven" },
      { name: "Elberta" },
      { name: "Red Top" },
      { name: "Springcrest" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      { label: "Size", value: "55 — 80 mm" },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Trays · Plastic crates · Customised formats",
      },
      { label: "Storage / shelf life", value: "0 — 1 °C · 1 — 3 weeks" },
    ],
    markets: EXPORT_MARKETS,
  },
  {
    slug: "flat-peach",
    name: "Flat peach",
    category: "fresh-fruits",
    image: "/images/products/flat-peach.jpg",
    positioning:
      "Commercial flat-peach varieties selected according to season and market requirements.",
    origin: "Iran",
    regions: [
      "W. Azerbaijan",
      "E. Azerbaijan",
      "Tehran",
      "Alborz",
      "Fars",
      "Isfahan",
    ],
    season: "June — September",
    varietyLabel: "Varieties",
    varieties: [
      {
        name: "Commercial flat-peach varieties",
        note: "According to season and market requirements",
      },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      { label: "Size", value: "50 — 75 mm" },
      {
        label: "Packaging",
        value:
          "Export-grade trays · Cartons · Protective punnets · Customised formats",
      },
      { label: "Storage", value: "0 — 1 °C, high RH" },
      { label: "Shelf life", value: "1 — 3 weeks" },
    ],
    markets: EXPORT_MARKETS,
  },
  {
    slug: "apricot",
    name: "Apricot",
    category: "fresh-fruits",
    image: "/images/products/apricot.jpg",
    positioning:
      "Early-season stone fruit from the north-western and central orchards, packed with protection for a short window.",
    origin: "Iran",
    originNote: "Selected Iranian orchards",
    regions: [
      "E. Azerbaijan",
      "W. Azerbaijan",
      "Fars",
      "Isfahan",
      "Khorasan Razavi",
      "Tehran",
    ],
    season: "May — July",
    varietyLabel: "Varieties",
    varieties: [
      { name: "Shams" },
      { name: "Nakhjavan" },
      { name: "Rajabali" },
      { name: "Qaysari" },
      { name: "Others" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      { label: "Size", value: "40 — 60 mm" },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Trays · Plastic crates · Protective packaging · Customised formats",
      },
      { label: "Storage", value: "0 — 1 °C, high RH" },
      { label: "Shelf life", value: "1 — 3 weeks" },
    ],
    markets: EXPORT_MARKETS,
  },
  {
    slug: "plum",
    name: "Plum",
    category: "fresh-fruits",
    image: "/images/products/plum-cut.png",
    imageKind: "cutout",
    positioning:
      "Fresh Iranian plums sourced from selected growing regions and prepared according to buyer and destination requirements.",
    origin: "Iran",
    originNote: "Selected Iranian orchards",
    regions: [
      "W. Azerbaijan",
      "E. Azerbaijan",
      "Tehran",
      "Alborz",
      "Fars",
      "Isfahan",
      "Khorasan Razavi",
    ],
    season: "June — September",
    seasonNote: "Subject to variety and growing region.",
    varietyLabel: "Varieties",
    varieties: [
      { name: "Shablon" },
      { name: "Santa Rosa" },
      { name: "Golden Drop" },
    ],
    spec: [
      { label: "Commercial form", value: "Fresh" },
      { label: "Grades", value: GRADES },
      { label: "Size", value: "45 — 70 mm typical" },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Trays · Plastic crates · Customised formats",
      },
      {
        label: "Storage / shelf life",
        value: "0 — 1 °C · 2 — 4 weeks",
        note: "Guidance across the three varieties; confirmed per variety and consignment.",
      },
    ],
    markets: EXPORT_MARKETS,
  },
  {
    slug: "melon",
    name: "Melon",
    category: "fresh-fruits",
    image: "/images/products/melon.jpg",
    positioning:
      "Galia, Honeydew and market-specific varieties from the central and eastern farms.",
    origin: "Iran",
    originNote: "Selected Iranian farms",
    regions: ["Fars", "Khorasan Razavi", "Isfahan", "Yazd", "Semnan"],
    season: "May — September",
    varietyLabel: "Varieties",
    varieties: [
      { name: "Galia" },
      { name: "Honeydew" },
      { name: "Market-specific" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      { label: "Size", value: "1 — 3.5 kg", note: "Per fruit." },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Trays · Plastic crates · Customised packing · Palletisation",
      },
      {
        label: "Storage",
        value: "5 — 10 °C",
        note: "Adjusted according to variety and transport duration.",
      },
      { label: "Shelf life", value: "2 — 4 weeks" },
    ],
    markets: EXPORT_MARKETS,
  },
  {
    slug: "cantaloupe",
    name: "Cantaloupe",
    category: "fresh-fruits",
    image: "/images/products/cantaloupe.png",
    imageKind: "cutout",
    contextImage: "/images/origins/cantaloupe-field.jpg",
    contextCaption: "Cantaloupe collected in the field ahead of grading.",
    positioning:
      "Commercial cantaloupe varieties selected according to season, destination and buyer requirements.",
    origin: "Iran",
    originNote: "Selected Iranian farms",
    regions: ["Fars", "Khorasan Razavi", "Isfahan", "Yazd", "Semnan"],
    season: "May — September",
    varietyLabel: "Varieties",
    varieties: [
      {
        name: "Commercial cantaloupe varieties",
        note: "Selected according to season, destination and buyer requirements",
      },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      { label: "Size", value: "1 — 2.5 kg" },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Trays · Plastic crates · Customised packing · Palletisation",
      },
      { label: "Storage", value: "2 — 5 °C" },
      { label: "Shelf life", value: "2 — 3 weeks" },
    ],
    markets: EXPORT_MARKETS,
  },

  // ────────────────────────────────────────────────────────────────
  // 03 — FRESH VEGETABLES
  // ────────────────────────────────────────────────────────────────
  {
    slug: "bell-pepper",
    name: "Bell pepper",
    category: "fresh-vegetables",
    image: "/images/products/bell-pepper.png",
    imageKind: "cutout",
    contextImage: "/images/origins/greenhouse-pepper.jpg",
    contextCaption:
      "Greenhouse production. With protected cultivation the constraint moves from the season to the cold chain.",
    positioning:
      "Greenhouse-grown across four colour grades, available year-round and sized to the buyer's count per carton.",
    origin: "Iran",
    originNote: "Selected Iranian farms",
    regions: ["Fars", "Isfahan", "Alborz", "Tehran", "Qazvin"],
    availability: "Year-round",
    availabilityNote:
      "From different growing regions; peak supply varies by region and production cycle.",
    varietyLabel: "Colours",
    varieties: [
      { name: "Green" },
      { name: "Red" },
      { name: "Yellow" },
      { name: "Orange" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      {
        label: "Size",
        value: "70 — 100 mm",
        note: "Specific calibre, length and weight to buyer requirement.",
      },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Plastic crates · Flow-pack · Customised formats · Palletisation",
      },
      { label: "Storage", value: "7 — 10 °C, high RH" },
      { label: "Shelf life", value: "2 — 4 weeks" },
    ],
    markets: EXPORT_MARKETS,
    featured: true,
  },
  {
    slug: "tomato",
    name: "Tomato",
    category: "fresh-vegetables",
    image: "/images/products/tomato.png",
    imageKind: "cutout",
    contextImage: "/images/origins/greenhouse-tomato.jpg",
    contextCaption:
      "Greenhouse tomato picked into crates. Vegetables are contracted as a rolling programme rather than a single shipment.",
    positioning:
      "Greenhouse and open-field production by variety and grade, including formats intended for onward processing.",
    origin: "Iran",
    originNote: "Selected Iranian farms",
    regions: ["Fars", "Kerman", "Hormozgan", "Tehran", "Alborz", "Qazvin"],
    availability: "Year-round",
    availabilityNote:
      "Peak availability varies by region and production cycle.",
    varietyLabel: "Varieties",
    varieties: [
      { name: "Round" },
      { name: "Roma / Plum" },
      { name: "Others" },
    ],
    spec: [
      { label: "Grades", value: GRADES },
      {
        label: "Size",
        value: "47 — 82 mm",
        note: "Specific calibre, weight and colour stage to buyer requirement.",
      },
      {
        label: "Packaging",
        value:
          "Export-grade cartons · Plastic crates · Trays · Flow-pack · Customised formats · Palletisation",
      },
      {
        label: "Storage",
        value: "8 — 12 °C",
        note: "Adjusted according to maturity stage and transport duration.",
      },
      { label: "Shelf life", value: "1 — 3 weeks" },
    ],
    markets: EXPORT_MARKETS,
  },
];

/**
 * Seasonal produce is listed in the Corporate Profile as sourced against the
 * harvest calendar, but without a specification of its own — so it is shown
 * as a note on the vegetables category rather than as a product page.
 */
export const seasonalProduceNote =
  "Cucumber, aubergine, courgette and others are sourced against the harvest calendar and the destination market's requirements.";

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsInCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function featuredProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function relatedProducts(product: Product, count = 4): Product[] {
  const sameGroup = products.filter(
    (p) =>
      p.slug !== product.slug &&
      p.category === product.category &&
      (product.group ? p.group === product.group : true)
  );
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category
  );
  const pool = [...sameGroup, ...sameCategory];
  const seen = new Set<string>();
  return pool
    .filter((p) => !seen.has(p.slug) && seen.add(p.slug))
    .slice(0, count);
}
