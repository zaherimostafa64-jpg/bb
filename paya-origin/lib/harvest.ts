/**
 * Harvest calendar.
 *
 * Windows come from the product pages of the two product catalogues; the
 * storage extensions and the dried-line windows come from the Corporate
 * Profile's harvest calendar (section 09). Months are 1-indexed and ranges
 * are inclusive. Nothing here is interpolated — a line without a confirmed
 * window is simply not listed.
 */

export type Band = "harvest" | "storage" | "year-round";

export interface CalendarRow {
  product: string;
  slug: string;
  harvest?: [number, number];
  /** Availability held from cold storage, outside the harvest window. */
  storage?: Array<[number, number]>;
  /** Protected cultivation — supplied across the year. */
  yearRound?: boolean;
}

export interface CalendarGroup {
  title: string;
  rows: CalendarRow[];
}

const ALL_YEAR: Array<[number, number]> = [[1, 12]];

export const calendar: CalendarGroup[] = [
  {
    title: "Dried fruits & nuts",
    rows: [
      { product: "Pistachio", slug: "pistachio", harvest: [9, 10], storage: ALL_YEAR },
      { product: "Saffron", slug: "saffron", harvest: [10, 11], storage: ALL_YEAR },
      { product: "Dates", slug: "dates", harvest: [8, 10], storage: ALL_YEAR },
      { product: "Walnut", slug: "walnut", harvest: [9, 10], storage: ALL_YEAR },
      { product: "Raisins", slug: "raisins", harvest: [8, 10], storage: ALL_YEAR },
      { product: "Dried fig", slug: "dried-fig", harvest: [8, 9], storage: ALL_YEAR },
    ],
  },
  {
    title: "Fresh fruits",
    rows: [
      { product: "Apple", slug: "apple", harvest: [8, 11], storage: [[1, 4]] },
      { product: "Kiwi", slug: "kiwi", harvest: [10, 11], storage: [[12, 12], [1, 3]] },
      { product: "Pomegranate", slug: "pomegranate", harvest: [9, 11], storage: [[12, 12], [1, 1]] },
      { product: "Table grapes", slug: "table-grapes", harvest: [6, 10], storage: [[11, 12]] },
      { product: "Apricot", slug: "apricot", harvest: [5, 7] },
      { product: "Peach", slug: "peach", harvest: [6, 9] },
      { product: "Flat peach", slug: "flat-peach", harvest: [6, 9] },
      { product: "Plum", slug: "plum", harvest: [6, 9] },
      { product: "Watermelon", slug: "watermelon", harvest: [5, 9] },
      { product: "Melon", slug: "melon", harvest: [5, 9] },
      { product: "Cantaloupe", slug: "cantaloupe", harvest: [5, 9] },
    ],
  },
  {
    title: "Fresh vegetables",
    rows: [
      { product: "Bell pepper", slug: "bell-pepper", yearRound: true },
      { product: "Tomato", slug: "tomato", yearRound: true },
    ],
  },
];

export const monthInitials = [
  "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D",
];

export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Resolve the band a given month falls into for a calendar row. */
export function bandFor(row: CalendarRow, month: number): Band | null {
  if (row.yearRound) return "year-round";
  if (row.harvest && month >= row.harvest[0] && month <= row.harvest[1]) {
    return "harvest";
  }
  if (row.storage?.some(([from, to]) => month >= from && month <= to)) {
    return "storage";
  }
  return null;
}

export const calendarPrinciples = [
  {
    title: "Contract ahead of harvest",
    text: "Capacity at the better producers is committed early. Peak-season volumes are best agreed before the harvest opens, not during it.",
  },
  {
    title: "Two calendars, not one",
    text: "The harvest window and your selling season rarely align. Variety choice, storage and switching origin are how we bridge the gap.",
  },
  {
    title: "Storage is not neutral",
    text: "Product supplied from storage is available, but it is not identical to a fresh-harvest lot. We tell you which one you are buying.",
  },
];

export const calendarFootnote =
  "Indicative windows for Iranian production, subject to season, region and variety. Greenhouse-grown vegetables are available year-round with seasonal peaks. Confirmed per enquiry.";
