import Link from "next/link";
import Image from "next/image";
import { contactInfo, navLinks, siteConfig } from "@/lib/site";
import { categories, categoryOrder } from "@/lib/products";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-canvas-subtle">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image
              src="/logo/paya-logo.png"
              alt="PAYA ORIGIN"
              width={140}
              height={65}
              className="h-9 w-auto"
            />
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
              {siteConfig.positioning}. Producers identified across Iran&rsquo;s
              growing regions, verified against a written specification, and
              shipped under one contract.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="metadata mb-5">Products</h2>
            <ul className="space-y-2.5">
              {categoryOrder.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/products#${slug}`}
                    className="text-[0.9375rem] text-ink-soft hover:text-brand"
                  >
                    {categories[slug].title}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="metadata mt-9 mb-5">Company</h2>
            <ul className="space-y-2.5">
              {navLinks
                .filter((l) => l.href !== "/products")
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-ink-soft hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/contact"
                  className="text-[0.9375rem] text-ink-soft hover:text-brand"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="metadata mb-5">Contact</h2>
            <ul className="space-y-3 text-[0.9375rem]">
              <li>
                <a href={contactInfo.emailHref} className="hover:text-brand">
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a href={contactInfo.phoneHref} className="hover:text-brand">
                  {contactInfo.phone}
                </a>
                <span className="ml-2 text-ink-faint">Phone &amp; WhatsApp</span>
              </li>
              <li>
                <a href={contactInfo.salesPhoneHref} className="hover:text-brand">
                  {contactInfo.salesPhone}
                </a>
                <span className="ml-2 text-ink-faint">Sales &amp; WhatsApp</span>
              </li>
            </ul>

            <address className="mt-6 text-[0.9375rem] not-italic text-ink-soft">
              {contactInfo.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="metadata">
            © {year} {siteConfig.name} · payaorigin.com
          </p>
          <p className="metadata">Agricultural sourcing &amp; export · Tehran, Iran</p>
        </div>
      </div>
    </footer>
  );
}
