import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Secondary column of text, used where a section needs two voices. */
  aside?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
  size?: "lg" | "md";
}

/**
 * The section opener. Two columns on wide viewports — statement on the
 * left, supporting text on the right — so sections do not all resolve to
 * a centred heading with a paragraph under it.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  aside,
  className,
  tone = "light",
  size = "lg",
}: SectionHeaderProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("grid gap-x-16 gap-y-6 lg:grid-cols-12", className)}>
      <div className={cn(aside || lede ? "lg:col-span-7" : "lg:col-span-9")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-5", dark && "!text-brand-soft")}>
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            size === "lg" ? "display-lg" : "display-md",
            dark && "text-cream"
          )}
        >
          {title}
        </h2>
      </div>
      {(lede || aside) && (
        <div
          className={cn(
            "lg:col-span-5 lg:pt-2",
            dark ? "text-cream-soft" : "text-ink-soft"
          )}
        >
          {lede && <p className="lede">{lede}</p>}
          {aside && <div className={cn(lede && "mt-6")}>{aside}</div>}
        </div>
      )}
    </div>
  );
}
