import { Reveal } from "@/components/motion/Reveal";

const pillars = [
  {
    index: "01",
    title: "A named origin",
    text: "Every lot traces back to a region and a producer we have assessed ourselves.",
  },
  {
    index: "02",
    title: "A verified standard",
    text: "Quality checked at three points, against the specification the order started with.",
  },
  {
    index: "03",
    title: "One counterpart",
    text: "Sourcing, packing, documentation and freight under a single contract.",
  },
];

/**
 * The commercial idea, stated once and given the whole width of the page.
 * No cards, no icons — the sentence is the design.
 */
export function CommercialIdea() {
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <h2 className="display-lg max-w-4xl font-normal">
          We do not sell what is available. We build supply around what is
          required.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-x-16 gap-y-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-6" delay={0.05}>
          <p className="text-[1.0625rem] leading-relaxed text-ink-soft">
            International buyers rarely struggle to find Iranian agricultural
            products. They struggle to find one accountable partner who selects
            the producer, verifies the quality, prepares the packaging and
            delivers the shipment.
          </p>
        </Reveal>
        <Reveal className="lg:col-span-6" delay={0.1}>
          <p className="text-[1.0625rem] leading-relaxed text-ink-soft">
            PAYA ORIGIN exists to be that single partner — a curated sourcing
            chain running from a named region in Iran to a container arriving on
            schedule at your port.
          </p>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-3">
        {pillars.map((pillar, i) => (
          <Reveal as="li" key={pillar.index} delay={i * 0.06}>
            <div className="border-t border-line-strong pt-4">
              <span className="figure-number block text-2xl text-brand">
                {pillar.index}
              </span>
              <h3 className="mt-4 font-display text-[1.125rem] font-semibold">
                {pillar.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                {pillar.text}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
