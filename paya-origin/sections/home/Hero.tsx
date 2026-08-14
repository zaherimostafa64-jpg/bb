import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { primaryCta } from "@/lib/site";

/**
 * One dominant image, one dominant message, one supporting statement, one
 * primary CTA — arranged the way the approved Corporate Profile cover is:
 * photograph above, type below, nothing competing over the image.
 */
export function Hero() {
  return (
    <section className="border-b border-line">
      <div className="relative h-[46vh] min-h-[300px] w-full sm:h-[56vh] lg:h-[64vh] lg:min-h-[440px]">
        <Image
          src="/images/origins/apple-crate-orchard.jpg"
          alt="Apples harvested into a PAYA ORIGIN field crate between orchard rows at first light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container-page">
        <div className="grid gap-x-16 gap-y-8 py-12 md:py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">
              Agricultural sourcing, quality &amp; export partner
            </p>
            <h1 className="display-xl font-normal">
              Trusted origins,
              <br />
              curated for global markets.
            </h1>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <p className="lede max-w-md">
              We identify producers across Iran&rsquo;s growing regions, verify
              what they grow, prepare it for its destination market, and ship it
              under one contract.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
              <Button href="/products" variant="quiet">
                Explore products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
