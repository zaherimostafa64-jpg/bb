import type { Metadata } from "next";
import Image from "next/image";
import {
  commercialTerms,
  glance,
  glanceFootnote,
  marketAdditionNote,
  markets,
  weDo,
  weDoNot,
} from "@/lib/company";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Figure } from "@/components/media/Figure";
import { CtaBand } from "@/components/layout/CtaBand";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Company",
  description:
    "PAYA ORIGIN is an agricultural sourcing and export company built for export from the beginning: 15+ years in agricultural trade, five sourcing regions across Iran, four priority export markets, one point of accountability.",
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-x-16 gap-y-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">The company</p>
            <h1 className="display-xl font-normal">
              A single, accountable partner between Iranian farms and your
              business.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="lede max-w-md">
              PAYA ORIGIN is an agricultural sourcing and export company. We
              identify producers across Iran&rsquo;s growing regions, verify what
              they grow, prepare it for its destination market, and ship it
              under one contract.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
              The company was built for export from the beginning rather than
              adapted to it. Our decisions start from a buyer&rsquo;s
              specification — product, grade, volume, packaging, destination —
              and work backwards to the orchard or field best able to meet it.
            </p>
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
              That order matters. It is the difference between offering a buyer
              what happens to be in a warehouse and building a supply chain that
              holds its shape across seasons.
            </p>

            <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
              <div className="border-t border-line-strong pt-4">
                <dt className="metadata">What we are</dt>
                <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  A sourcing, quality and export partner working on behalf of
                  the buyer.
                </dd>
              </div>
              <div className="border-t border-line-strong pt-4">
                <dt className="metadata">What we are not</dt>
                <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  A farm, a broker of anonymous stock, or a one-shipment trader.
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <Figure
              src="/images/process/pistachio-harvest.jpg"
              alt="Pistachio harvest at a selected orchard in Kerman province, with pickers filling field crates"
              ratio="4/5"
              captionRef="Fig. 01"
              caption="Pistachio harvest at a selected orchard, Kerman province. Producers are visited and assessed before they enter the network."
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* At a glance */}
      <section className="border-t border-line bg-canvas-subtle">
        <div className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="At a glance"
            title="A sourcing network built on experience, not guesswork."
            className="mb-14"
          />

          <dl>
            {glance.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-8 border-t border-line py-7 md:grid-cols-[minmax(90px,120px)_minmax(0,1fr)_auto] md:gap-x-12">
                  <dt className="figure-number text-[2.25rem] leading-none text-brand md:text-[3rem]">
                    {item.value}
                  </dt>
                  <dd>
                    <h3 className="font-display text-[1.125rem] font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
                      {item.text}
                    </p>
                  </dd>
                  <dd className="metadata col-start-2 mt-3 md:col-start-3 md:mt-0 md:text-right">
                    {item.tag}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-faint">
            {glanceFootnote}
          </p>
        </div>
      </section>

      {/* Scope of responsibility */}
      <section className="container-page py-20 md:py-28">
        <SectionHeader
          eyebrow="Scope of responsibility"
          title="What we take responsibility for — and what we deliberately do not."
          lede="A clear boundary is more useful to a buyer than a long list of capabilities. This is ours."
          className="mb-14"
        />

        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
          <div>
            <h3 className="metadata mb-6">We do</h3>
            <ol>
              {weDo.map((item) => (
                <li
                  key={item.index}
                  className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line py-5"
                >
                  <span className="metadata pt-1">{item.index}</span>
                  <div>
                    <h4 className="font-display text-[1.0625rem] font-semibold">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="metadata mb-6">We do not</h3>
            <ul>
              {weDoNot.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line py-5"
                >
                  <span className="pt-0.5 text-ink-faint" aria-hidden="true">
                    —
                  </span>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal>
          <p className="mt-16 max-w-3xl border-l-2 border-brand pl-6 font-display text-[1.5rem] leading-snug tracking-[-0.025em]">
            “Rather than selling available inventory, we build supply around the
            customer&rsquo;s requirement.”
          </p>
        </Reveal>
      </section>

      {/* Markets */}
      <section id="markets" className="scroll-mt-20 bg-ground text-cream">
        <div className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="Markets"
            title="Four markets we are built to serve."
            lede="Our commercial focus is deliberately narrow. These are the markets whose requirements, routes and buying patterns we know well enough to commit to."
            tone="dark"
            className="mb-14"
          />

          <ul>
            {markets.map((market, i) => (
              <Reveal as="li" key={market.ref} delay={i * 0.05}>
                <div className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-line-dark py-7 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-12">
                  <span className="metadata !text-cream-soft pt-1.5">
                    {market.ref}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.25rem] font-semibold text-cream">
                      {market.name}
                    </h3>
                    <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-cream-soft">
                      {market.text}
                    </p>
                  </div>
                  <span className="metadata !text-cream-soft col-start-2 mt-3 sm:col-start-3 sm:mt-1.5 sm:max-w-[10rem] sm:text-right">
                    {market.categories}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h3 className="metadata !text-cream-soft mb-4">
                How a market is added
              </h3>
              <p className="max-w-xl text-[0.9375rem] leading-relaxed text-cream-soft">
                {marketAdditionNote}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-ground-soft">
                <Image
                  src="/images/process/truck-dispatch.jpg"
                  alt="A loaded trailer leaving the dispatch bay — freight booked against a production plan, not after it"
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial terms */}
      <section className="container-page py-16 md:py-20">
        <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {commercialTerms.map((term) => (
            <li key={term.title} className="border-t border-line-strong pt-4">
              <h2 className="metadata">{term.title}</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                {term.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Trust is not created by words. It is created by disciplined decisions and consistent delivery."
        body="Send us a specification, a target market and a delivery window — or simply ask what a region can realistically supply this season."
      />
    </>
  );
}
