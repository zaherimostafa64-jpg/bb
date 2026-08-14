import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: Array<{ route: string; priority: number }> = [
    { route: "", priority: 1 },
    { route: "/products", priority: 0.9 },
    { route: "/origins", priority: 0.8 },
    { route: "/how-we-work", priority: 0.8 },
    { route: "/company", priority: 0.7 },
    { route: "/contact", priority: 0.9 },
  ];

  return [
    ...pages.map(({ route, priority }) => ({
      url: `${siteConfig.url}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
