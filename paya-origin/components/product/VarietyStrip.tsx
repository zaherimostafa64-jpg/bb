import Image from "next/image";
import type { Variety } from "@/types";
import { cn } from "@/lib/utils";

interface VarietyStripProps {
  label: string;
  varieties: Variety[];
  tone?: "light" | "dark";
  note?: string;
}

/**
 * Varieties presented together for comparison rather than as repeated
 * product pages. Where the catalogue supplies a photograph per variety the
 * strip becomes visual; where it does not, it stays a typographic list
 * rather than inventing imagery to fill the frame.
 */
export function VarietyStrip({
  label,
  varieties,
  tone = "light",
  note,
}: VarietyStripProps) {
  const dark = tone === "dark";
  const withImages = varieties.filter((v) => v.image);
  const visual = withImages.length === varieties.length && varieties.length > 1;

  return (
    <section
      className={cn(
        dark ? "bg-ground text-cream" : "bg-canvas-subtle text-ink"
      )}
    >
      <div className="container-page py-16 md:py-20">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className={cn("display-md", dark && "text-cream")}>{label}</h2>
          {note && (
            <p
              className={cn(
                "max-w-sm text-sm leading-relaxed",
                dark ? "text-cream-soft" : "text-ink-faint"
              )}
            >
              {note}
            </p>
          )}
        </div>

        {visual ? (
          <ul className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 md:gap-x-8">
            {varieties.map((variety) => (
              <li key={variety.name}>
                <div
                  className={cn(
                    "relative aspect-square w-full overflow-hidden",
                    dark ? "bg-ground-soft" : "bg-canvas"
                  )}
                >
                  <Image
                    src={variety.image!}
                    alt={`${variety.name}${variety.note ? ` — ${variety.note}` : ""}`}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3
                  className={cn(
                    "mt-4 border-t pt-3 font-display text-base font-semibold",
                    dark ? "border-line-dark text-cream" : "border-line"
                  )}
                >
                  {variety.name}
                </h3>
                {variety.note && (
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      dark ? "text-cream-soft" : "text-ink-faint"
                    )}
                  >
                    {variety.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid gap-x-12 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {varieties.map((variety) => (
              <li
                key={variety.name}
                className={cn(
                  "border-t py-5",
                  dark ? "border-line-dark" : "border-line"
                )}
              >
                <h3
                  className={cn(
                    "font-display text-[1.125rem] font-semibold",
                    dark && "text-cream"
                  )}
                >
                  {variety.name}
                </h3>
                {variety.note && (
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      dark ? "text-cream-soft" : "text-ink-soft"
                    )}
                  >
                    {variety.note}
                  </p>
                )}
                {variety.meta && (
                  <dl className="mt-3 space-y-1">
                    {variety.meta.map((m) => (
                      <div
                        key={m.label}
                        className="flex items-baseline justify-between gap-4"
                      >
                        <dt
                          className={cn("metadata", dark && "!text-cream-soft")}
                        >
                          {m.label}
                        </dt>
                        <dd
                          className={cn(
                            "text-sm",
                            dark ? "text-cream" : "text-ink"
                          )}
                        >
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
