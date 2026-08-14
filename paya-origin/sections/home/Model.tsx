import Link from "next/link";
import { modelStages } from "@/lib/company";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

export function Model() {
  return (
    <section className="border-t border-line bg-canvas-subtle">
      <div className="container-page py-20 md:py-28">
        <SectionHeader
          eyebrow="How we work"
          title="From complexity to confidence."
          lede="One workflow, five stages, a single counterpart. Each stage produces something the next stage depends on — which is why we refuse to run them in parallel with different companies."
          className="mb-14"
        />

        <Reveal>
          <ProcessSteps stages={modelStages} showOutputs columns={5} />
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href="/how-we-work"
            className="mt-12 inline-block border-b border-line-strong pb-1 text-[0.9375rem] hover:border-ink"
          >
            The model, quality verification and packaging in full
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
