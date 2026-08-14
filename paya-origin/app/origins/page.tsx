import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  footprintFootnote,
  originPrinciples,
  origins,
  originsFootnote,
  sourcingFootprint,
} from "@/lib/origins";
import { calendarPrinciples } from "@/lib/harvest";
import { HarvestCalendar } from "@/components/origin/HarvestCalendar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaBand } from "@/components/layout/CtaBand";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Origins",
  description:
    "Five sourcing regions across Iran — Azerbaijan, Mazandaran, Khorasan, Kerman and Fars — with the crops, growing conditions and harvest windows behind each, plus the principal sourcing region for every fresh line.",
  alternates: { canonical: "/origins" },
};

export default function OriginsPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-x-16 gap-y-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Origins across Iran</p>
            <h1 className="display-xl font-normal">
              Iran is not one origin.
              <br />
              It is a set of them.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="lede max-w-md">
              Climate, altitude and harvest window change completely between
              provinces. We source each crop from the region that grows it best
              — which is why the region matters more than the country name.
            </p>
          </div>
        </div>
      </section>

      {/* Region records — photograph, condition and window per origin. */}
      <section className="container-page py-16 md:py-24">
        <ul className="space-y-16 md:space-y-24">
          {origins.map((origin, i) => (
            <Reveal as="li" key={origin.ref}>
              <article className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
                <div
                  className={
                    i % 2 === 0
                      ? "lg:col-span-5"
                      : "lg:col-span-5 lg:order-2"
                  }
                >
                  <figure>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-subtle">
                      <Image
                        src={origin.image!}
                        alt={origin.imageCaption ?? `${origin.crops} at harvest`}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {origin.imageCaption && (
                      <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-ink-faint">
                        {origin.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                </div>

                <div className={i % 2 === 0 ? "lg:col-span-7" : "lg:col-span-7 lg:order-1"}>
                  <div className="flex items-baseline gap-5 border-t border-line-strong pt-5">
                    <span className="figure-number text-2xl text-brand">
                      {origin.ref}
                    </span>
                    <div>
                      <h2 className="display-md">{origin.name}</h2>
                      <p className="metadata mt-2">{origin.subtitle}</p>
                    </div>
                  </div>

                  <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
                    {origin.condition}
                  </p>

                  <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                    <div className="border-t border-line pt-3">
                      <dt className="metadata">Primary crops</dt>
                      <dd className="mt-1.5 text-[0.9375rem]">{origin.crops}</dd>
                    </div>
                    <div className="border-t border-line pt-3">
                      <dt className="metadata">Harvest</dt>
                      <dd className="mt-1.5 text-[0.9375rem]">
                        {origin.harvest}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <p className="mt-16 max-w-3xl text-sm leading-relaxed text-ink-faint">
          {originsFootnote}
        </p>
      </section>

      {/* Principles */}
      <section className="border-t border-line bg-canvas-subtle">
        <div className="container-page py-16 md:py-20">
          <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-3">
            {originPrinciples.map((principle) => (
              <li key={principle.title} className="border-t border-line-strong pt-4">
                <h2 className="metadata">{principle.title}</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {principle.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sourcing footprint per product line */}
      <section className="container-page py-20 md:py-28">
        <SectionHeader
          eyebrow="Sourcing footprint"
          title="Where each fresh line comes from."
          lede="Principal sourcing areas per product. Additional regions are used according to season and buyer requirement."
          className="mb-12"
        />

        <Reveal>
          <dl className="border-t border-line-strong">
            {sourcingFootprint.map((row) => (
              <div
                key={row.slug}
                className="grid gap-1 border-b border-line py-5 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-10"
              >
                <dt>
                  <Link
                    href={`/products/${row.slug}`}
                    className="font-display text-[1.0625rem] font-semibold hover:text-brand"
                  >
                    {row.product}
                  </Link>
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">
                  {row.regions}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-faint">
          {footprintFootnote}
        </p>
      </section>

      {/* Harvest calendar */}
      <section id="harvest-calendar" className="scroll-mt-24 border-t border-line bg-canvas-subtle">
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
              <li key={principle.title} className="border-t border-line-strong pt-4">
                <h3 className="metadata">{principle.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {principle.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Ask what a region can realistically supply this season."
        body="Send the product, the window and the destination. We will tell you which origin fits — and where the trade-offs are."
      />
    </>
  );
}
