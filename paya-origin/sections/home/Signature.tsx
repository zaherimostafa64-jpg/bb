import Link from "next/link";
import Image from "next/image";
import { getProduct, featuredProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The signature export, given the scale it earns, with the rest of the
 * featured lines alongside it. Pistachio leads because the approved profile
 * treats it as the signature line — not because it fits the layout.
 */
export function Signature() {
  const pistachio = getProduct("pistachio")!;
  const others = featuredProducts()
    .filter((p) => p.slug !== "pistachio")
    .slice(0, 6);

  return (
    <section className="bg-ground text-cream">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 lg:self-center">
            <p className="eyebrow !text-brand-soft mb-6">
              Signature export · Kerman
            </p>
            <h2 className="display-lg text-cream font-normal">
              Pistachio, by variety and calibre.
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-cream-soft">
              {pistachio.positioning}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
              {pistachio.varieties?.map((v) => (
                <span key={v.name} className="metadata !text-cream-soft">
                  {v.name}
                </span>
              ))}
            </div>
            <Link
              href="/products/pistachio"
              className="mt-10 inline-block border-b border-line-dark pb-1 text-[0.9375rem] text-cream hover:border-cream"
            >
              Pistachio specification
            </Link>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.08}>
            <div className="relative aspect-square w-full overflow-hidden bg-ground-soft">
              <Image
                src="/images/products/pistachio-kernel.jpg"
                alt="Iranian pistachio kernels in a wooden bowl, shot against the studio backdrop used across the PAYA ORIGIN catalogue"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-20">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-line-dark pt-6">
            <h3 className="font-display text-[1.25rem] font-semibold text-cream">
              Also frequently requested
            </h3>
            <Link
              href="/products"
              className="metadata !text-cream-soft hover:!text-cream"
            >
              View all products →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-6 md:gap-x-6">
            {others.map((product, i) => (
              <Reveal as="li" key={product.slug} delay={i * 0.04}>
                <ProductCard
                  product={product}
                  tone="dark"
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
