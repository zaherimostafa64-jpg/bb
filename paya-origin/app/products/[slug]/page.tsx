import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  categories,
  getProduct,
  products,
  relatedProducts,
} from "@/lib/products";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductSpecification } from "@/components/product/ProductSpecification";
import { VarietyStrip } from "@/components/product/VarietyStrip";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Figure } from "@/components/media/Figure";
import { CtaBand } from "@/components/layout/CtaBand";
import { siteConfig } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const season = product.season ?? product.availability;
  return {
    title: product.name,
    description: `${product.name} from ${product.origin}${
      season ? ` · ${season}` : ""
    }. ${product.positioning}`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${siteConfig.name}`,
      description: product.positioning,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categories[product.category];
  const dark = product.category === "dried-fruits-nuts";
  const related = relatedProducts(product);

  return (
    <>
      <ProductHero product={product} />

      {product.contextImage && (
        <section className="container-page pb-4 pt-12 md:pt-16">
          <Figure
            src={product.contextImage}
            alt={product.contextCaption ?? `${product.name} at origin`}
            ratio="21/9"
            captionRef="Origin"
            caption={product.contextCaption}
            sizes="100vw"
          />
        </section>
      )}

      <ProductSpecification product={product} />

      {product.varieties?.length ? (
        <VarietyStrip
          label={product.varietyLabel ?? "Varieties"}
          varieties={product.varieties}
          tone={dark ? "dark" : "light"}
          note={
            product.varieties.length > 1
              ? "Presented together for comparison. Single-variety consignments or mixed presentations are both possible."
              : undefined
          }
        />
      ) : null}

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">Packaging</p>
            <h2 className="display-md">
              Under our label or yours.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[1.0625rem] leading-relaxed text-ink-soft">
              {category.handling.text}
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-faint">
              Format, count, labelling language and compliance marks change by
              destination, so they are agreed with the specification. Exact
              formats and weights are confirmed product by product.
            </p>
            <Link
              href="/how-we-work#packaging"
              className="mt-6 inline-block border-b border-line-strong pb-1 text-[0.9375rem] hover:border-ink"
            >
              Packaging and private label
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-canvas-subtle">
          <div className="container-page py-16 md:py-20">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="display-md">More from {category.title.toLowerCase()}</h2>
              <Link
                href={`/products#${category.slug}`}
                className="metadata hover:text-brand"
              >
                All {category.shortTitle.toLowerCase()} →
              </Link>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        </section>
      )}

      <CtaBand
        title={`Send the specification you need for ${product.name.toLowerCase()}.`}
        body="Tell us the grade, volume, packing format and delivery window. We will come back with what the origin and the season can actually hold — including when the answer is no."
      />
    </>
  );
}
