"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, primaryCta } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const mobileLinks = [...navLinks, { label: "Contact", href: "/contact" }];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Stop the page scrolling behind the mobile panel while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-sm">
        <div className="container-page flex h-[72px] items-center justify-between gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center py-3"
            aria-label="PAYA ORIGIN — home"
          >
            <Image
              src="/logo/paya-logo.png"
              alt="PAYA ORIGIN"
              width={140}
              height={65}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-[0.9375rem] transition-colors",
                    active ? "text-brand" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button href={primaryCta.href} className="px-5 text-[0.6875rem]">
                {primaryCta.label}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-5 bg-ink transition-transform duration-300",
                    open ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-5 bg-ink transition-transform duration-300",
                    open ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/*
        The panel is a sibling of <header>, not a child: the header's
        backdrop-filter would otherwise become the containing block for a
        fixed descendant, collapsing the panel to the height of the bar.
      */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto border-t border-line bg-canvas lg:hidden"
        >
          <div className="container-page py-4">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className="flex min-h-14 items-center border-b border-line font-display text-2xl font-semibold tracking-[-0.02em]"
              >
                {link.label}
              </Link>
            ))}
            <Button
              href={primaryCta.href}
              className="mt-8 w-full"
              onClick={() => setOpen(false)}
            >
              {primaryCta.label}
            </Button>
          </div>
        </nav>
      )}
    </>
  );
}
