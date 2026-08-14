import Link from "next/link";
import {
  bandFor,
  calendar,
  calendarFootnote,
  monthInitials,
  monthNames,
  type Band,
} from "@/lib/harvest";
import { cn } from "@/lib/utils";

const bandStyles: Record<Band, string> = {
  harvest: "bg-brand",
  storage: "bg-brand/20",
  "year-round": "bg-signal",
};

const bandLabels: Record<Band, string> = {
  harvest: "Harvest window",
  storage: "Available from storage",
  "year-round": "Year-round (protected cultivation)",
};

/**
 * When each product is actually available. Windows are read from the same
 * product data the specification pages use, so the calendar and the product
 * pages can never drift apart.
 */
export function HarvestCalendar({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <ul className="mb-8 flex flex-wrap gap-x-8 gap-y-3">
        {(Object.keys(bandLabels) as Band[]).map((band) => (
          <li key={band} className="flex items-center gap-2.5">
            <span
              className={cn("h-2.5 w-7 shrink-0", bandStyles[band])}
              aria-hidden="true"
            />
            <span className="metadata">{bandLabels[band]}</span>
          </li>
        ))}
      </ul>

      <div className="scroll-x scrollbar-none -mx-5 px-5 md:mx-0 md:px-0">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[minmax(96px,148px)_repeat(12,1fr)] items-center gap-x-1 border-b border-line pb-2">
            <span className="sr-only">Product</span>
            {monthInitials.map((initial, i) => (
              <span
                key={`${initial}-${i}`}
                className="metadata text-center"
                title={monthNames[i]}
              >
                {initial}
              </span>
            ))}
          </div>

          {calendar.map((group) => (
            <section key={group.title}>
              <h3 className="metadata pt-7 pb-3">{group.title}</h3>
              <ul>
                {group.rows.map((row) => (
                  <li
                    key={row.slug}
                    className="grid grid-cols-[minmax(96px,148px)_repeat(12,1fr)] items-center gap-x-1 border-t border-line/70 py-1.5"
                  >
                    <Link
                      href={`/products/${row.slug}`}
                      className="flex min-h-[28px] items-center pr-4 text-[0.9375rem] leading-tight hover:text-brand"
                    >
                      {row.product}
                    </Link>
                    {monthNames.map((month, i) => {
                      const band = bandFor(row, i + 1);
                      return (
                        <span
                          key={month}
                          className={cn(
                            "h-2.5 w-full",
                            band ? bandStyles[band] : "bg-line/40"
                          )}
                        >
                          <span className="sr-only">
                            {row.product}, {month}:{" "}
                            {band ? bandLabels[band] : "not in season"}
                          </span>
                        </span>
                      );
                    })}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {!compact && (
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-faint">
          {calendarFootnote}
        </p>
      )}
    </div>
  );
}
