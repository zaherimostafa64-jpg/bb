import type { Stage } from "@/types";
import { cn } from "@/lib/utils";

interface ProcessStepsProps {
  stages: Stage[];
  tone?: "light" | "dark";
  /** Show what each stage produces — the artefact the next stage depends on. */
  showOutputs?: boolean;
  columns?: 3 | 5 | 6;
}

const columnClasses: Record<number, string> = {
  3: "sm:grid-cols-3",
  5: "sm:grid-cols-2 lg:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-3",
};

/**
 * The chain, rendered as a numbered sequence rather than a row of icon
 * cards. Each stage is a rule, an index and two lines of text — the
 * structure carries the meaning, so no illustration is needed.
 */
export function ProcessSteps({
  stages,
  tone = "light",
  showOutputs = false,
  columns = 5,
}: ProcessStepsProps) {
  const dark = tone === "dark";
  return (
    <div>
      <ol className={cn("grid gap-x-8 gap-y-10", columnClasses[columns])}>
        {stages.map((stage) => (
          <li key={stage.index}>
            <div
              className={cn(
                "border-t pt-4",
                dark ? "border-line-dark" : "border-line-strong"
              )}
            >
              <span
                className={cn(
                  "figure-number block text-2xl",
                  dark ? "text-brand-soft" : "text-brand"
                )}
              >
                {stage.index}
              </span>
              <h3
                className={cn(
                  "mt-4 font-display text-[1.125rem] font-semibold",
                  dark && "text-cream"
                )}
              >
                {stage.title}
              </h3>
              <p
                className={cn(
                  "mt-2 text-[0.9375rem] leading-relaxed",
                  dark ? "text-cream-soft" : "text-ink-soft"
                )}
              >
                {stage.text}
              </p>
              {showOutputs && stage.output && (
                <div
                  className={cn(
                    "mt-5 border-t pt-4",
                    dark ? "border-line-dark" : "border-line"
                  )}
                >
                  <p className={cn("metadata", dark && "!text-cream-soft")}>
                    Produces
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-sm font-medium",
                      dark ? "text-cream" : "text-ink"
                    )}
                  >
                    {stage.output.title}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      dark ? "text-cream-soft" : "text-ink-faint"
                    )}
                  >
                    {stage.output.text}
                  </p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
