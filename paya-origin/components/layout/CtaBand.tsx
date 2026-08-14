import { Button } from "@/components/ui/Button";
import { primaryCta } from "@/lib/site";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  title?: string;
  body?: string;
  tone?: "dark" | "light";
}

const requirementTerms = [
  "Product",
  "Specification",
  "Volume",
  "Timing",
  "Destination",
  "Packaging",
];

/**
 * The closing commercial band. One CTA, the same wording everywhere, with
 * the six things a requirement is actually built from stated underneath —
 * so a buyer knows what to send before they click.
 */
export function CtaBand({
  title = "Send us a specification — or ask what a region can realistically supply this season.",
  body = "We will answer with what is true, including when the answer is no.",
  tone = "dark",
}: CtaBandProps) {
  const dark = tone === "dark";
  return (
    <section className={cn(dark ? "bg-ground text-cream" : "bg-canvas-subtle")}>
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className={cn("display-lg", dark && "text-cream")}>{title}</h2>
            <p
              className={cn(
                "lede mt-6 max-w-xl",
                dark && "!text-cream-soft"
              )}
            >
              {body}
            </p>
            <div className="mt-10">
              <Button
                href={primaryCta.href}
                variant={dark ? "inverse" : "primary"}
              >
                {primaryCta.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <p className={cn("metadata mb-5", dark && "!text-cream-soft")}>
              We work around
            </p>
            <ul
              className={cn(
                "grid grid-cols-2 gap-x-8",
                dark ? "text-cream" : "text-ink"
              )}
            >
              {requirementTerms.map((term) => (
                <li
                  key={term}
                  className={cn(
                    "border-t py-3 text-[0.9375rem]",
                    dark ? "border-line-dark" : "border-line"
                  )}
                >
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
