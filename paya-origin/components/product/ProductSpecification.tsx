import type { Product } from "@/types";
import { cn } from "@/lib/utils";

/**
 * The commercial specification interface: confirmed values on the left as a
 * definition list, buyer-set fields on the right as a chip set. Fields with
 * no reliable data are not rendered — an absent row is more useful to a
 * buyer than a plausible one.
 */
export function ProductSpecification({ product }: { product: Product }) {
  const rows: Array<{ label: string; value: string; note?: string }> = [];

  rows.push({
    label: "Origin",
    value: product.origin,
    note: product.originNote,
  });

  if (product.regions?.length) {
    rows.push({
      label: "Main sourcing regions",
      value: product.regions.join(" · "),
    });
  }
  if (product.season) {
    rows.push({
      label: "Harvest season",
      value: product.season,
      note: product.seasonNote,
    });
  }
  if (product.availability) {
    rows.push({
      label: "Availability",
      value: product.availability,
      note: product.availabilityNote,
    });
  }
  if (product.spec) rows.push(...product.spec);

  const hasChips = Boolean(product.specifiedToRequirement?.length);

  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="metadata mb-8">Commercial specification</h2>
          <dl>
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 gap-1 border-t border-line py-5 sm:grid-cols-[minmax(140px,190px)_1fr] sm:gap-8"
              >
                <dt className="metadata pt-1">{row.label}</dt>
                <dd>
                  <span className="text-[1.0625rem] leading-snug">
                    {row.value}
                  </span>
                  {row.note && (
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-faint">
                      {row.note}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="metadata mt-8 border-t border-line pt-5">
            Specification confirmed per order
          </p>
        </div>

        <div className="lg:col-span-5">
          {hasChips && (
            <>
              <h2 className="metadata mb-8">Specified to your requirement</h2>
              <ul className="flex flex-wrap gap-2">
                {product.specifiedToRequirement!.map((field) => (
                  <li
                    key={field}
                    className="rounded-[2px] border border-line bg-canvas-subtle px-3 py-2 text-[0.8125rem] text-ink-soft"
                  >
                    {field}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-ink-faint">
                These are set by your order rather than fixed in advance. Send
                the values you need and we will confirm what the season and the
                origin can actually hold.
              </p>
            </>
          )}

          {product.markets?.length ? (
            <div className={cn(hasChips && "mt-12")}>
              <h2 className="metadata mb-5">Available for export</h2>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {product.markets.map((market) => (
                  <li key={market} className="text-[1.0625rem]">
                    {market}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-ink-faint">
                Market availability depends on season, specification and the
                destination&rsquo;s import requirements.
              </p>
            </div>
          ) : null}

          {product.sourceNote && (
            <p
              className={cn(
                "border-l-2 border-line-strong pl-4 text-sm leading-relaxed text-ink-faint",
                hasChips || product.markets?.length ? "mt-12" : ""
              )}
            >
              {product.sourceNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
