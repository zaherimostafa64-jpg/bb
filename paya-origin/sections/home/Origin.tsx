import Link from "next/link";
import { origins } from "@/lib/origins";
import { Figure } from "@/components/media/Figure";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Origin as a commercial asset: five regions, what each is used for, and
 * when it delivers. The photograph is the evidence; the table is the
 * argument.
 */
export function Origin() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <Figure
            src="/images/origins/orchard-dusk.jpg"
            alt="Orchard rows running to the hills at dusk in a southern Iranian growing valley"
            ratio="4/5"
            captionRef="Fig. 01"
            caption="Climate, altitude and harvest window change completely between provinces. Each crop is sourced from the region that grows it best."
            sizes="(min-width: 1024px) 48vw, 100vw"
          />
        </Reveal>

        <div className="lg:col-span-6 lg:pt-4">
          <Reveal>
            <p className="eyebrow mb-6">Origins across Iran</p>
            <h2 className="display-lg font-normal">
              Iran is not one origin. It is a set of them.
            </h2>
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="mt-10">
              {origins.map((origin) => (
                <li
                  key={origin.ref}
                  className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-t border-line py-4"
                >
                  <span className="metadata">{origin.ref}</span>
                  <span>
                    <span className="font-display text-[1.0625rem] font-semibold">
                      {origin.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">
                      {origin.crops}
                    </span>
                  </span>
                  <span className="metadata whitespace-nowrap">
                    {origin.harvest}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/origins"
              className="mt-8 inline-block border-b border-line-strong pb-1 text-[0.9375rem] hover:border-ink"
            >
              Origins, regions and the harvest calendar
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
