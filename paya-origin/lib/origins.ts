import type { Origin } from "@/types";

/**
 * Origins are a commercial asset, not decoration: each entry states why the
 * region is used, for which crops, and when it delivers. Transcribed from
 * the Corporate Profile (Edition 2026), section 08.
 */
export const origins: Origin[] = [
  {
    ref: "01",
    name: "Azerbaijan",
    subtitle: "East & West provinces",
    crops: "Grapes, apple, walnut",
    condition:
      "Cool continental highland; long, bright autumns that concentrate sugars before harvest.",
    harvest: "Aug — Oct",
    image: "/images/origins/vineyard.jpg",
    imageCaption:
      "Table grapes on the vine — one of the crops sourced from this origin. Crop reference, not a producer location.",
  },
  {
    ref: "02",
    name: "Mazandaran",
    subtitle: "Caspian belt",
    crops: "Kiwi, citrus, fresh fruit",
    condition:
      "Humid subtropical strip between the Alborz range and the Caspian; the country's late-season fruit basket.",
    harvest: "Oct — Dec",
    image: "/images/origins/kiwi-vines.jpg",
    imageCaption:
      "Kiwi vines under cover. Crop reference, not a producer location.",
  },
  {
    ref: "03",
    name: "Khorasan",
    subtitle: "Razavi & South",
    crops: "Saffron, barberry",
    condition:
      "Semi-arid highland with cold winters and dry autumns — the conditions saffron requires and few places offer.",
    harvest: "Oct — Nov",
    image: "/images/origins/agricultural-landscape.jpg",
    imageCaption:
      "Iranian agricultural landscape. Illustrative of the growing regions the network draws on, not of this province specifically.",
  },
  {
    ref: "04",
    name: "Kerman",
    subtitle: "Rafsanjan & Sirjan",
    crops: "Pistachio, dates",
    condition:
      "Arid high plateau with a wide day-to-night temperature range; the origin behind Iran's signature nut export.",
    harvest: "Sep — Oct",
    image: "/images/process/pistachio-harvest.jpg",
    imageCaption:
      "Pistachio harvest at a selected orchard, Kerman province.",
  },
  {
    ref: "05",
    name: "Fars",
    subtitle: "Southern valleys",
    crops: "Dates, citrus, grapes",
    condition:
      "Warm temperate valleys with a long growing season, supporting both stone fruit and date production.",
    harvest: "Aug — Nov",
    image: "/images/origins/orchard-dusk.jpg",
    imageCaption:
      "Orchard rows at dusk. Illustrative of a long-season growing valley, not of a named producer site.",
  },
];

export const originPrinciples = [
  {
    title: "Origin is a decision",
    text: "Two orchards in the same province do not produce the same lot. The producer is chosen after the region.",
  },
  {
    title: "Seasons are honest",
    text: "Harvest windows shift year to year with weather. We commit to dates we can actually hold.",
  },
  {
    title: "Coverage expands",
    text: "New regions enter the network when a specification justifies the assessment work behind them.",
  },
];

export const originsFootnote =
  "Five origins are currently active in the sourcing network. Growing conditions are described qualitatively; harvest windows are indicative and confirmed per season before contracting. Additional regions are assessed and added when a buyer's specification calls for them.";

/**
 * Principal sourcing regions per fresh product line, from the Fresh Produce
 * Catalogue's sourcing footprint. Region names are provincial references,
 * not producer locations.
 */
export const sourcingFootprint: Array<{ product: string; slug: string; regions: string }> = [
  { product: "Apple", slug: "apple", regions: "W. Azerbaijan (Urmia) · E. Azerbaijan · Tehran (Damavand) · Isfahan (Semirom) · Kurdistan" },
  { product: "Kiwi", slug: "kiwi", regions: "Mazandaran · Gilan · Golestan" },
  { product: "Pomegranate", slug: "pomegranate", regions: "Markazi (Saveh) · Fars · Yazd · Khorasan Razavi · Isfahan" },
  { product: "Table grapes", slug: "table-grapes", regions: "W. Azerbaijan · E. Azerbaijan · Qazvin · Fars · Khorasan Razavi" },
  { product: "Watermelon", slug: "watermelon", regions: "Khuzestan · Fars · Khorasan Razavi · Semnan · Qazvin" },
  { product: "Peach", slug: "peach", regions: "W. Azerbaijan · E. Azerbaijan · Alborz · Tehran · Fars · Isfahan" },
  { product: "Flat peach", slug: "flat-peach", regions: "W. Azerbaijan · E. Azerbaijan · Tehran · Alborz · Fars · Isfahan" },
  { product: "Apricot", slug: "apricot", regions: "E. Azerbaijan · W. Azerbaijan · Fars · Isfahan · Khorasan Razavi · Tehran" },
  { product: "Plum", slug: "plum", regions: "W. Azerbaijan · E. Azerbaijan · Tehran · Alborz · Fars · Isfahan · Khorasan Razavi" },
  { product: "Melon", slug: "melon", regions: "Fars · Khorasan Razavi · Isfahan · Yazd · Semnan" },
  { product: "Cantaloupe", slug: "cantaloupe", regions: "Fars · Khorasan Razavi · Isfahan · Yazd · Semnan" },
  { product: "Bell pepper", slug: "bell-pepper", regions: "Fars · Isfahan · Alborz · Tehran · Qazvin" },
  { product: "Tomato", slug: "tomato", regions: "Fars · Kerman · Hormozgan · Tehran · Alborz · Qazvin" },
];

export const footprintFootnote =
  "Regions shown are the principal sourcing areas for each product line. Harvest windows vary by variety and growing region; additional regions are used according to season and buyer requirement.";
