import { checkpoints } from "@/lib/company";
import { Figure } from "@/components/media/Figure";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Trust shown as process, not as badges. Three checkpoints, each with what
 * it actually prevents, next to a photograph of the assessment being made.
 */
export function Quality() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow mb-6">Quality verification</p>
            <h2 className="display-lg font-normal">
              Quality is not a final inspection.
            </h2>
            <p className="lede mt-6 max-w-md">
              A single check before loading can only reject a problem. Checking
              at three points prevents it — which is considerably cheaper for
              everyone involved.
            </p>
          </Reveal>

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

        <Reveal className="lg:col-span-6 lg:pt-16" delay={0.08}>
          <Figure
            src="/images/process/field-inspection.jpg"
            alt="An inspector completing a written assessment against the agreed specification, in the field"
            ratio="4/5"
            captionRef="Fig. 02"
            caption="Assessment recorded against the written specification, in the field."
            sizes="(min-width: 1024px) 48vw, 100vw"
          />
          <p className="mt-10 border-l-2 border-brand pl-5 font-display text-[1.25rem] leading-snug tracking-[-0.02em]">
            “A specification we decline is worth more to a buyer than a shipment
            that fails on arrival.”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
