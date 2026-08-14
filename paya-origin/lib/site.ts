import type { NavLink } from "@/types";

export const siteConfig = {
  name: "PAYA ORIGIN",
  legalName: "PAYA ORIGIN",
  tagline: "Trusted origins, curated for global markets.",
  positioning: "Agricultural Sourcing, Quality & Export Partner",
  description:
    "PAYA ORIGIN is an agricultural sourcing and export company. We identify producers across Iran's growing regions, verify what they grow, prepare it for its destination market, and ship it under one contract.",
  url: "https://payaorigin.com",
};

export const navLinks: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "Origins", href: "/origins" },
  { label: "How we work", href: "/how-we-work" },
  { label: "Company", href: "/company" },
];

/** The single primary CTA. Used wherever commercial intent is high. */
export const primaryCta = {
  label: "Send your requirement",
  href: "/contact",
};

export const contactInfo = {
  email: "sale@payaorigin.com",
  emailHref: "mailto:sale@payaorigin.com",
  /** Recorded in the Corporate Profile. */
  phone: "+98 912 410 7606",
  phoneHref: "tel:+989124107606",
  whatsappHref: "https://wa.me/989124107606",
  /** Recorded in both product catalogues. */
  salesPhone: "+98 930 458 9965",
  salesPhoneHref: "tel:+989304589965",
  salesWhatsappHref: "https://wa.me/989304589965",
  addressLines: ["Valiasr Street", "Tehran, Iran"],
};

export const enquiryChecklist = [
  "Product and variety",
  "Volume and delivery period",
  "Destination market",
  "Packaging and branding preference",
];
