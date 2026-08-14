import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { categories } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { primaryCta } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The product hero. The photograph takes the dominant half of the viewport
 * — never a thumbnail inside a card — and carries the name, the origin and
 * one line of commercial positioning. Dried lines are set on the deep
 * ground their studio photography was shot against; fresh lines sit on the
 * warm canvas so the fruit colour is the only colour on the page.
 */
export function ProductHero({ product }: { product: Product }) {
  const category = categories[product.category];
  const dark = product.category === "dried-fruits-nuts";
  const cutout = product.imageKind === "cutout";

  return (
    <section
      className={cn(
        "relative",
        dark ? "bg-ground text-cream" : "bg-canvas text-ink"
      )}
    >
      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="order-2 lg:order-1">
          <nav
            aria-label="Breadcrumb"
            className={cn("metadata mb-8 flex flex-wrap items-center gap-2", dark && "!text-cream-soft")}
          >
            <Link href="/products" className="hover:text-brand-soft">
              Products
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/products#${category.slug}`}
              className="hover:text-brand-soft"
            >
              {category.shortTitle}
            </Link>
          </nav>

          <h1 className="display-lg">{product.name}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className={cn("metadata", dark && "!text-cream-soft")}>
              Origin · {product.origin}
            </span>
            {(product.season || product.availability) && (
              <span className={cn("metadata", dark && "!text-cream-soft")}>
                {product.season ?? product.availability}
              </span>
            )}
          </div>

          <p
            className={cn(
              "lede mt-7 max-w-xl",
              dark && "!text-cream-soft"
            )}
          >
            {product.positioning}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              href={`${primaryCta.href}?product=${product.slug}`}
              variant={dark ? "inverse" : "primary"}
            >
              Request this specification
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div
            className={cn(
              "relative w-full overflow-hidden",
              cutout ? "aspect-[5/4]" : "aspect-[4/5] lg:aspect-[4/4.4]",
              !cutout && (dark ? "bg-ground-soft" : "bg-canvas-subtle")
            )}
          >
            <Image
              src={product.image}
              alt={`${product.name} — ${product.positioning}`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={cn(cutout ? "object-contain" : "object-cover")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
