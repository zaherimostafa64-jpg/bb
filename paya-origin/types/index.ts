export interface NavLink {
  label: string;
  href: string;
}

export type CategorySlug =
  | "dried-fruits-nuts"
  | "fresh-fruits"
  | "fresh-vegetables";

/** A single row of a commercial specification table. */
export interface SpecField {
  label: string;
  value: string;
  /** Qualifier printed beneath the value — never a claim of its own. */
  note?: string;
}

export interface Variety {
  name: string;
  /** Short descriptor as written in the source catalogue. */
  note?: string;
  image?: string;
  meta?: Array<{ label: string; value: string }>;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Group inside the category, mirroring the catalogue's own sections. */
  group?: string;
  image: string;
  /** Cutout images sit on the page background; photos get a frame. */
  imageKind?: "photo" | "cutout";
  /** Wide context photograph for the product hero, where one exists. */
  contextImage?: string;
  contextCaption?: string;
  /** One-line commercial positioning, taken from the approved catalogues. */
  positioning: string;
  origin: string;
  originNote?: string;
  regions?: string[];
  season?: string;
  seasonNote?: string;
  availability?: string;
  availabilityNote?: string;
  varietyLabel?: string;
  varieties?: Variety[];
  /** Fields with confirmed values. Rendered as the specification table. */
  spec?: SpecField[];
  /** Fields the buyer sets — printed as the "specified to your requirement" set. */
  specifiedToRequirement?: string[];
  /** Only where the source states markets for this product line. */
  markets?: string[];
  /** Qualifier carried from the source, printed alongside the data. */
  sourceNote?: string;
  featured?: boolean;
}

export interface Origin {
  ref: string;
  name: string;
  subtitle: string;
  crops: string;
  condition: string;
  harvest: string;
  image?: string;
  /** What the photograph actually shows. Never a claim about the location. */
  imageCaption?: string;
}

export interface Market {
  ref: string;
  name: string;
  text: string;
  categories: string;
}

export interface Stage {
  index: string;
  title: string;
  text: string;
  output?: { title: string; text: string };
}
