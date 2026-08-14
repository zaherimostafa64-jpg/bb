import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "inverse" | "quiet";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  href?: string;
  children: ReactNode;
  className?: string;
}

type ButtonProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps> &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonOwnProps | "href">;

const base =
  "group/btn items-center justify-center gap-3 font-medium transition-colors duration-300";

/**
 * Each variant owns its own display, size and type treatment. Utilities are
 * never split between `base` and a variant, because two competing classes
 * on one element resolve by stylesheet order rather than by the order they
 * are written here.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    "inline-flex min-h-11 px-7 text-[0.8125rem] uppercase tracking-[0.06em] bg-ink text-cream hover:bg-brand",
  secondary:
    "inline-flex min-h-11 px-7 text-[0.8125rem] uppercase tracking-[0.06em] border border-line-strong text-ink hover:border-ink",
  inverse:
    "inline-flex min-h-11 px-7 text-[0.8125rem] uppercase tracking-[0.06em] bg-cream text-ink hover:bg-white",
  quiet:
    "inline-flex text-[0.9375rem] text-ink border-b border-line-strong pb-1 hover:border-ink",
};

/**
 * The single CTA component. `primary` carries the site's one primary
 * action — "Send your requirement" — and every other action is deliberately
 * quieter so commercial intent is never split across competing buttons.
 */
export function Button({
  variant = "primary",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className={classes} {...(props as object)}>
          {children}
        </Link>
      );
    }
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...(props as object)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(props as ComponentPropsWithoutRef<"button">)}
    >
      {children}
    </button>
  );
}
