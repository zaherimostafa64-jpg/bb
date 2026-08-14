import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  /** `feature` gives the card a taller frame for signature lines. */
  variant?: "default" | "feature";
  tone?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
}

/**
 * The single product card used everywhere products are listed. One base
 * component with two controlled sizes — the product photograph carries the
 * card, and the metadata beneath it stays consistent across every page.
 */
export function ProductCard({
  product,
  variant = "default",
  tone = "light",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: ProductCardProps) {
  const dark = tone === "dark";
  const meta = product.season ?? product.availability ?? product.origin;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus-visible:outline-offset-4"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          variant === "feature" ? "aspect-[4/5]" : "aspect-square",
          dark ? "bg-ground-soft" : "bg-canvas-subtle"
        )}
      >
        <Image
          src={product.image}
          alt={`${product.name} — ${product.positioning}`}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]",
            product.imageKind === "cutout" ? "object-contain p-6" : "object-cover"
          )}
        />
      </div>
      <div
        className={cn(
          "mt-4 border-t pt-3",
          dark ? "border-line-dark" : "border-line"
        )}
      >
        <h3
          className={cn(
            "font-display text-[1.0625rem] font-semibold tracking-[-0.02em]",
            dark ? "text-cream" : "text-ink"
          )}
        >
          {product.name}
        </h3>
        <span
          className={cn("metadata mt-1.5 block", dark && "!text-cream-soft")}
        >
          {meta}
        </span>
      </div>
    </Link>
  );
}
