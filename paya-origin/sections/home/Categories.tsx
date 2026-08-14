import Link from "next/link";
import Image from "next/image";
import { categories, categoryOrder, productsInCategory } from "@/lib/products";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Three categories at three different weights rather than three identical
 * cards: the lead category takes the full row, the other two share it.
 */
export function Categories() {
  const [lead, ...rest] = categoryOrder;
  const leadCategory = categories[lead];

  return (
    <section className="border-t border-line bg-canvas-subtle">
      <div className="container-page py-20 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-lg max-w-2xl font-normal">
            Three categories, sourced against one specification.
          </h2>
          <Link
            href="/products"
            className="border-b border-line-strong pb-1 text-[0.9375rem] hover:border-ink"
          >
            All {productsInCategory("dried-fruits-nuts").length +
              productsInCategory("fresh-fruits").length +
              productsInCategory("fresh-vegetables").length}{" "}
            product lines
          </Link>
        </div>

        <Reveal>
          <Link
            href={`/products#${leadCategory.slug}`}
            className="group grid gap-x-12 gap-y-6 border-t border-line-strong pt-8 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <span className="metadata">{leadCategory.index} — Category</span>
              <h3 className="display-md mt-4">{leadCategory.title}</h3>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
                {leadCategory.lead} {leadCategory.text}
              </p>
              <p className="metadata mt-6 text-ink">
                {productsInCategory(leadCategory.slug).length} product lines →
              </p>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden bg-ground lg:col-span-7">
              <Image
                src={leadCategory.image}
                alt={`${leadCategory.title} — ${leadCategory.text}`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {rest.map((slug, i) => {
            const category = categories[slug];
            return (
              <Reveal key={slug} delay={i * 0.06}>
                <Link
                  href={`/products#${slug}`}
                  className="group block border-t border-line-strong pt-8"
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden",
                      "bg-canvas"
                    )}
                  >
                    <Image
                      src={category.image}
                      alt={`${category.title} — ${category.text}`}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-contain p-6 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <span className="metadata mt-6 block">
                    {category.index} — Category
                  </span>
                  <h3 className="display-md mt-3">{category.title}</h3>
                  <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
                    {category.lead} {category.text}
                  </p>
                  <p className="metadata mt-5 text-ink">
                    {productsInCategory(slug).length} product lines →
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
