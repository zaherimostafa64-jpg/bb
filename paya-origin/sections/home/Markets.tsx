import Image from "next/image";
import { markets } from "@/lib/company";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Four markets, each with the reason it is on the list. No world map — the
 * commercial logic is in the sentences, and a decorative globe would add
 * nothing a buyer can use.
 */
export function Markets() {
  return (
    <section className="border-t border-line">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-6">Markets</p>
              <h2 className="display-lg font-normal">
                Four markets we are built to serve.
              </h2>
              <p className="lede mt-6 max-w-lg">
                Our commercial focus is deliberately narrow. These are the
                markets whose requirements, routes and buying patterns we know
                well enough to commit to.
              </p>
            </Reveal>

            <ul className="mt-12">
              {markets.map((market, i) => (
                <Reveal as="li" key={market.ref} delay={i * 0.05}>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-line py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-10">
                    <span className="metadata pt-1.5">{market.ref}</span>
                    <div>
                      <h3 className="font-display text-[1.25rem] font-semibold">
                        {market.name}
                      </h3>
                      <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
                        {market.text}
                      </p>
                    </div>
                    <span className="metadata col-start-2 mt-3 sm:col-start-3 sm:mt-1.5 sm:max-w-[9rem] sm:text-right">
                      {market.categories}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-canvas-subtle lg:sticky lg:top-28">
              <Image
                src="/images/process/freight-dispatch.jpg"
                alt="Dispatch by road, sea and air — freight booked against a production plan rather than after it"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-faint">
              A new destination enters the list once we understand its import
              requirements, have a route we can hold, and have buyers whose
              specifications we can meet repeatedly.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
