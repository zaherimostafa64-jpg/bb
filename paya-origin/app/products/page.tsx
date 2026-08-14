import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  categories,
  categoryOrder,
  products,
  productsInCategory,
  seasonalProduceNote,
} from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HarvestCalendar } from "@/components/origin/HarvestCalendar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaBand } from "@/components/layout/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { calendarPrinciples } from "@/lib/harvest";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
  description:
    "The full PAYA ORIGIN range: dried fruits & nuts, fresh fruits and fresh vegetables from named Iranian origins, with specification, packaging and season for every line.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-x-16 gap-y-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Portfolio · {products.length} lines</p>
            <h1 className="display-xl font-normal">
              Selected origins,
              <br />
              prepared for global markets.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="lede max-w-md">
              Every line below states what is confirmed and what is set by your
              order. Where a value depends on the season, the variety or the
              destination, it is listed as specified to your requirement rather
              than printed as a promise.
            </p>
          </div>
        </div>
      </section>

      {categoryOrder.map((slug, index) => {
        const category = categories[slug];
        const items = productsInCategory(slug);
        const dark = slug === "dried-fruits-nuts";

        return (
          <section
            key={slug}
            id={slug}
            className={cn(
              "scroll-mt-20",
              dark ? "bg-ground text-cream" : index % 2 ? "bg-canvas" : "bg-canvas-subtle"
            )}
          >
            <div className="container-page py-20 md:py-28">
              <SectionHeader
                eyebrow={`${category.index} — Category`}
                title={category.title}
                lede={`${category.lead} ${category.text}`}
                tone={dark ? "dark" : "light"}
                className="mb-14"
              />

              {category.groups.length > 0 ? (
                category.groups.map((group) => {
                  const groupItems = items.filter((p) => p.group === group);
                  if (!groupItems.length) return null;
                  return (
                    <div key={group} className="mb-16 last:mb-0">
                      <h3
                        className={cn(
                          "metadata mb-8 border-t pt-4",
                          dark ? "border-line-dark !text-cream-soft" : "border-line-strong"
                        )}
                      >
                        {group} · {groupItems.length}
                      </h3>
                      <ProductGrid
                        products={groupItems}
                        columns={4}
                        tone={dark ? "dark" : "light"}
                      />
                    </div>
                  );
                })
              ) : (
                <ProductGrid
                  products={items}
                  columns={items.length <= 2 ? 2 : 4}
                  variant={items.length <= 2 ? "feature" : "default"}
                />
              )}

              <div
                className={cn(
                  "mt-16 grid gap-x-12 gap-y-8 border-t pt-8 sm:grid-cols-2",
                  dark ? "border-line-dark" : "border-line-strong"
                )}
              >
                <div>
                  <p className={cn("metadata mb-2", dark && "!text-cream-soft")}>
                    Specified by
                  </p>
                  <p
                    className={cn(
                      "text-[0.9375rem] leading-relaxed",
                      dark ? "text-cream-soft" : "text-ink-soft"
                    )}
                  >
                    {category.specifiedBy}
                  </p>
                </div>
                <div>
                  <p className={cn("metadata mb-2", dark && "!text-cream-soft")}>
                    {category.handling.label}
                  </p>
                  <p
                    className={cn(
                      "text-[0.9375rem] leading-relaxed",
                      dark ? "text-cream-soft" : "text-ink-soft"
                    )}
                  >
                    {category.handling.text}
                  </p>
                </div>
              </div>

              {slug === "fresh-vegetables" && (
                <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-faint">
                  {seasonalProduceNote}
                </p>
              )}
            </div>
          </section>
        );
      })}

      <section className="border-t border-line">
        <div className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="Harvest calendar"
            title="When each product is actually available."
            lede="Sourcing conversations are easier when both sides are looking at the same calendar. These are the windows we plan against."
            className="mb-14"
          />
          <Reveal>
            <HarvestCalendar />
          </Reveal>

          <ul className="mt-16 grid gap-x-12 gap-y-8 sm:grid-cols-3">
            {calendarPrinciples.map((principle) => (
              <li key={principle.title} className="border-t border-line pt-4">
                <h3 className="metadata">{principle.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {principle.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-subtle">
        <div className="container-page grid items-center gap-x-16 gap-y-10 py-20 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6">Packaging</p>
            <h2 className="display-lg font-normal">
              Packed for the market it is going to.
            </h2>
            <p className="lede mt-6 max-w-md">
              Under the PAYA ORIGIN label, under your own brand, or unbranded in
              bulk for processors — decided with the specification, not after
              it.
            </p>
            <Link
              href="/how-we-work#packaging"
              className="mt-8 inline-block border-b border-line-strong pb-1 text-[0.9375rem] hover:border-ink"
            >
              Packaging and private label
            </Link>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas">
              <Image
                src="/images/packaging/fruit-cartons-stack.jpg"
                alt="PAYA ORIGIN ventilated fruit cartons stacked and marked before palletisation"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
