import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { contactInfo, enquiryChecklist } from "@/lib/site";
import { engagementSteps } from "@/lib/company";
import { InquiryForm } from "@/components/form/InquiryForm";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Send your requirement",
  description:
    "Start a sourcing conversation with PAYA ORIGIN: product, specification, volume, timing, destination and packaging. Tehran, Iran — sale@payaorigin.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-x-16 gap-y-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Send your requirement</p>
            <h1 className="display-xl font-normal">
              Tell us what you need,
              <br />
              not what we have.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="lede max-w-md">
              Send a specification, a target market and a delivery window — or
              simply ask what a region can realistically supply this season. We
              will answer with what is true, including when the answer is no.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-x-16 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Suspense
              fallback={
                <p className="text-ink-faint">Loading the enquiry form…</p>
              }
            >
              <InquiryForm />
            </Suspense>
          </div>

          <aside className="lg:col-span-4">
            <div className="border-t-2 border-ink pt-6">
              <h2 className="metadata mb-5">Direct</h2>
              <ul className="space-y-5">
                <li>
                  <p className="metadata mb-1">Email</p>
                  <a
                    href={contactInfo.emailHref}
                    className="text-[1.0625rem] hover:text-brand"
                  >
                    {contactInfo.email}
                  </a>
                </li>
                <li>
                  <p className="metadata mb-1">Phone &amp; WhatsApp</p>
                  <a
                    href={contactInfo.phoneHref}
                    className="block text-[1.0625rem] hover:text-brand"
                  >
                    {contactInfo.phone}
                  </a>
                </li>
                <li>
                  <p className="metadata mb-1">Office</p>
                  <address className="text-[1.0625rem] not-italic">
                    {contactInfo.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </li>
              </ul>
            </div>

            <div className="mt-12 border-t border-line pt-6">
              <h2 className="metadata mb-5">To start a requirement, send</h2>
              <ol className="space-y-0">
                {enquiryChecklist.map((item, i) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-line py-3"
                  >
                    <span className="metadata pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem]">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-12">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-subtle">
                <Image
                  src="/images/process/palletised-cartons.jpg"
                  alt="Palletised cartons staged for loading, wrapped and marked before dispatch"
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-faint">
                Trial volumes are welcome. Most long relationships here started
                as one container that arrived as described.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-subtle">
        <div className="container-page py-20 md:py-24">
          <SectionHeader
            eyebrow="What happens next"
            title="From enquiry to delivered container."
            lede="Six steps, each with something you receive — so you always know what stage the order is at."
            className="mb-14"
          />
          <ProcessSteps stages={engagementSteps} columns={6} />
        </div>
      </section>
    </>
  );
}
