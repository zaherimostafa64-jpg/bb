import type { Metadata } from "next";
import Image from "next/image";
import {
  checkpoints,
  engagementSteps,
  fragmentation,
  fragmentationCost,
  modelPrinciples,
  modelStages,
  packagingFormats,
  packagingNote,
  packagingOptions,
  samplesNote,
  shipmentDocuments,
  shipmentDocumentsNote,
} from "@/lib/company";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Figure } from "@/components/media/Figure";
import { CtaBand } from "@/components/layout/CtaBand";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "One workflow, five stages, a single counterpart: requirement, sourcing, verification, preparation and delivery — with quality checked at three points and packaging agreed with the specification.",
  alternates: { canonical: "/how-we-work" },
};

export default function HowWeWorkPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-x-16 gap-y-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Our model</p>
            <h1 className="display-xl font-normal">
              From complexity
              <br />
              to confidence.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="lede max-w-md">
              One workflow, five stages, a single counterpart. Each stage
              produces something the next stage depends on — which is why we
              refuse to run them in parallel with different companies.
            </p>
          </div>
        </div>
      </section>

      {/* The problem being solved */}
      <section className="container-page py-20 md:py-28">
        <SectionHeader
          eyebrow="The sourcing problem"
          title="International sourcing is rarely a single transaction."
          lede="A buyer who wants ten tonnes of a specific grade, packed a specific way, arriving on a specific date, usually ends up coordinating four or five unrelated parties — and carrying the risk between them."
          className="mb-14"
        />

        <p className="metadata mb-6">Without a coordinated partner</p>
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {fragmentation.map((item) => (
            <li key={item.title} className="border-t border-line pt-4">
              <h3 className="font-display text-[1.0625rem] font-semibold text-ink-faint">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-faint">
                {item.text}
              </p>
            </li>
          ))}
        </ul>

        <Reveal>
          <div className="mt-16 border-t-2 border-ink pt-8">
            <p className="metadata mb-4">With PAYA ORIGIN</p>
            <h3 className="display-md max-w-3xl">
              One partner holds the whole chain — and the responsibility for it.
            </h3>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
              Every hand-off removed is a point of failure removed. That is the
              entire commercial argument for how this company is structured.
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {fragmentationCost.map((item) => (
            <li key={item.title} className="border-t border-line pt-4">
              <h3 className="font-display text-[1.0625rem] font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* The five stages */}
      <section id="model" className="scroll-mt-24 bg-ground text-cream">
        <div className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="The model"
            title="Five stages, and what each one produces."
            lede="Every stage is designed to remove a specific uncertainty, and to hand the next stage something it can rely on."
            tone="dark"
            className="mb-14"
          />
          <Reveal>
            <ProcessSteps stages={modelStages} tone="dark" showOutputs columns={5} />
          </Reveal>

          <ul className="mt-16 grid gap-x-12 gap-y-8 sm:grid-cols-3">
            {modelPrinciples.map((principle) => (
              <li
                key={principle}
                className="border-t border-line-dark pt-4 text-[0.9375rem] leading-relaxed text-cream-soft"
              >
                <span className="metadata !text-cream-soft mb-3 block">
                  Principle
                </span>
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quality verification */}
      <section id="quality" className="scroll-mt-24 container-page py-20 md:py-28">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6">Quality verification</p>
            <h2 className="display-lg font-normal">
              Quality is not a final inspection.
            </h2>
            <p className="lede mt-6 max-w-md">
              A single check before loading can only reject a problem. Checking
              at three points prevents it.
            </p>

            <ol className="mt-12">
              {checkpoints.map((checkpoint, i) => (
                <Reveal as="li" key={checkpoint.index} delay={i * 0.06}>
                  <div className="border-t border-line py-6">
                    <p className="metadata">{checkpoint.index}</p>
                    <h3 className="mt-3 font-display text-[1.125rem] font-semibold">
                      {checkpoint.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-ink-soft">
                      {checkpoint.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-6">
            <Figure
              src="/images/process/sorting-line.jpg"
              alt="Product moving along a sorting line during processing, ahead of grading and packing"
              ratio="4/3"
              captionRef="Fig. 01"
              caption="Lots are checked against the agreed grade as they are collected and processed, so a deviation is caught while it can still be corrected."
              sizes="(min-width: 1024px) 48vw, 100vw"
            />

            <div className="mt-12 border-t border-line-strong pt-6">
              <h3 className="metadata mb-5">
                Typically accompanies a shipment
              </h3>
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {shipmentDocuments.map((doc) => (
                  <li
                    key={doc}
                    className="border-b border-line py-3 text-[0.9375rem]"
                  >
                    {doc}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-ink-faint">
                {shipmentDocumentsNote}
              </p>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="mt-16 max-w-3xl border-l-2 border-brand pl-6 font-display text-[1.5rem] leading-snug tracking-[-0.025em]">
            “A specification we decline is worth more to a buyer than a shipment
            that fails on arrival.”
          </p>
        </Reveal>
      </section>

      {/* Packaging */}
      <section id="packaging" className="scroll-mt-24 border-t border-line bg-canvas-subtle">
        <div className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="Packaging & private label"
            title="Packed for the market it is going to."
            lede={packagingNote}
            className="mb-14"
          />

          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {packagingOptions.map((option, i) => (
              <Reveal as="li" key={option.ref} delay={i * 0.06}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
                  <Image
                    src={option.image}
                    alt={`${option.title} — ${option.text}`}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-5 flex items-baseline gap-4 border-t border-line-strong pt-4">
                  <span className="figure-number text-lg text-brand">
                    {option.ref}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.125rem] font-semibold">
                      {option.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {option.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-16 border-t border-line-strong pt-8">
            <h3 className="metadata mb-6">Formats in regular use</h3>
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              {packagingFormats.map((format) => (
                <li key={format.title} className="border-t border-line pt-3">
                  <p className="text-[1.0625rem]">{format.title}</p>
                  <p className="metadata mt-1.5">{format.tag}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Working with us */}
      <section id="working-with-us" className="scroll-mt-24 container-page py-20 md:py-28">
        <SectionHeader
          eyebrow="Working with us"
          title="What happens after you send an enquiry."
          lede="Six steps from first message to a delivered container — and a review afterwards, because the next season's programme is built on what this one taught us."
          className="mb-14"
        />

        <Reveal>
          <ProcessSteps stages={engagementSteps} columns={6} />
        </Reveal>

        <p className="mt-12 max-w-3xl text-sm leading-relaxed text-ink-faint">
          {samplesNote}
        </p>
      </section>

      <CtaBand />
    </>
  );
}
