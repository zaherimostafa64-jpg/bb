import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  tone?: "light" | "dark";
  className?: string;
  variant?: "default" | "feature";
}

const columnClasses: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const gridSizes: Record<number, string> = {
  2: "(min-width: 640px) 50vw, 50vw",
  3: "(min-width: 768px) 33vw, 50vw",
  4: "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
};

export function ProductGrid({
  products,
  columns = 4,
  tone = "light",
  className,
  variant = "default",
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid gap-x-5 gap-y-10 md:gap-x-8",
        columnClasses[columns],
        className
      )}
    >
      {products.map((product, i) => (
        <Reveal key={product.slug} delay={Math.min(i, 5) * 0.05}>
          <ProductCard
            product={product}
            tone={tone}
            variant={variant}
            sizes={gridSizes[columns]}
          />
        </Reveal>
      ))}
    </div>
  );
}
