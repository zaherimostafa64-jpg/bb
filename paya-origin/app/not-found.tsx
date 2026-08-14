import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { primaryCta } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="container-page py-24 md:py-36">
      <p className="eyebrow mb-6">404</p>
      <h1 className="display-lg max-w-2xl font-normal">
        That page is not part of the catalogue.
      </h1>
      <p className="lede mt-6 max-w-md">
        The link may be out of date. The product range, the origins and the
        harvest calendar are all reachable from the pages below.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button href="/products">Browse products</Button>
        <Link
          href={primaryCta.href}
          className="border-b border-line-strong pb-1 text-[0.9375rem] hover:border-ink"
        >
          {primaryCta.label}
        </Link>
      </div>
    </section>
  );
}
