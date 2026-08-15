"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { contactInfo } from "@/lib/site";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  hint?: string;
  /** Column span within the two-column group. */
  wide?: boolean;
}

const groups: Array<{ title: string; note?: string; fields: Field[] }> = [
  {
    title: "You",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "company", label: "Company" },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "market",
        label: "Country / market",
        placeholder: "Where the goods are going",
      },
    ],
  },
  {
    title: "The requirement",
    note: "As much as you have. Anything you leave open, we will come back with options on.",
    fields: [
      { name: "product", label: "Product", type: "select", required: true },
      { name: "variety", label: "Variety or grade" },
      { name: "quantity", label: "Quantity", placeholder: "e.g. 2 × 40ft, 10 tonnes" },
      {
        name: "period",
        label: "Delivery period",
        placeholder: "e.g. October — December",
      },
      { name: "destination", label: "Destination port" },
      {
        name: "packaging",
        label: "Packaging",
        type: "select",
        options: [
          "PAYA ORIGIN brand",
          "Private label",
          "Bulk / industrial",
          "Not decided yet",
        ],
      },
      {
        name: "notes",
        label: "Additional requirements",
        type: "textarea",
        wide: true,
        placeholder:
          "Certificates, tolerances, labelling language, sample needs — anything that changes the specification.",
      },
    ],
  },
];

const labelClass = "metadata mb-2 block";
const controlClass =
  "w-full rounded-[2px] border border-line bg-surface px-3.5 py-3 text-[0.9375rem] text-ink transition-colors placeholder:text-ink-faint/80 hover:border-line-strong focus:border-ink focus:outline-none";

/**
 * The inquiry experience. It composes a structured sourcing enquiry and
 * hands it to the visitor's mail client addressed to the sales desk — no
 * data is posted anywhere, and nothing is claimed to have been sent that
 * has not been. The summary stays on screen so it can also be copied.
 */
export function InquiryForm() {
  const searchParams = useSearchParams();
  const presetProduct = searchParams.get("product");

  const productOptions = useMemo(
    () => products.map((p) => p.name).sort((a, b) => a.localeCompare(b)),
    []
  );

  const presetName = useMemo(() => {
    if (!presetProduct) return "";
    return products.find((p) => p.slug === presetProduct)?.name ?? "";
  }, [presetProduct]);

  const [values, setValues] = useState<Record<string, string>>({
    product: presetName,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<string | null>(null);

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: "" } : e));
  };

  const buildSummary = () => {
    const lines: string[] = [];
    for (const group of groups) {
      const filled = group.fields.filter((f) => values[f.name]?.trim());
      if (!filled.length) continue;
      lines.push(group.title.toUpperCase());
      for (const field of filled) {
        lines.push(`${field.label}: ${values[field.name].trim()}`);
      }
      lines.push("");
    }
    return lines.join("\n").trim();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    for (const group of groups) {
      for (const field of group.fields) {
        if (field.required && !values[field.name]?.trim()) {
          nextErrors[field.name] = `${field.label} is required.`;
        }
      }
    }
    const email = values.email?.trim() ?? "";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter an email address we can reply to.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      document.getElementById(first)?.focus();
      return;
    }

    const body = buildSummary();
    const subject = `Sourcing enquiry — ${values.product?.trim() ?? "PAYA ORIGIN"}`;
    setSummary(body);
    window.location.href = `${contactInfo.emailHref}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  if (summary) {
    return (
      <div className="border-t-2 border-ink pt-8">
        <h2 className="display-md">Your enquiry is ready to send.</h2>
        <p className="lede mt-4 max-w-xl">
          Your mail client should have opened with the summary below, addressed
          to{" "}
          <a href={contactInfo.emailHref} className="text-brand underline underline-offset-4">
            {contactInfo.email}
          </a>
          . If it did not, copy the text and send it to the same address — or
          message the sales line on WhatsApp.
        </p>
        <pre className="mt-8 max-w-2xl overflow-x-auto whitespace-pre-wrap border border-line bg-canvas-subtle p-6 font-body text-[0.9375rem] leading-relaxed text-ink-soft">
          {summary}
        </pre>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={contactInfo.whatsappHref} variant="secondary">
            WhatsApp us instead
          </Button>
          <Button
            variant="quiet"
            onClick={() => setSummary(null)}
            type="button"
          >
            Edit the enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {groups.map((group) => (
        <fieldset key={group.title} className="mb-12 border-t border-line pt-8">
          <legend className="sr-only">{group.title}</legend>
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h2 className="font-display text-[1.125rem] font-semibold">
                {group.title}
              </h2>
              {group.note && (
                <p className="mt-2 text-sm leading-relaxed text-ink-faint">
                  {group.note}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-9">
              {group.fields.map((field) => {
                const error = errors[field.name];
                const describedBy = error
                  ? `${field.name}-error`
                  : field.hint
                    ? `${field.name}-hint`
                    : undefined;

                return (
                  <div
                    key={field.name}
                    className={cn(field.wide && "sm:col-span-2")}
                  >
                    <label htmlFor={field.name} className={labelClass}>
                      {field.label}
                      {!field.required && (
                        <span className="ml-2 normal-case tracking-normal text-ink-faint">
                          optional
                        </span>
                      )}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(e) => set(field.name, e.target.value)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className={cn(controlClass, "resize-y")}
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={values[field.name] ?? ""}
                        onChange={(e) => set(field.name, e.target.value)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className={cn(controlClass, "appearance-none")}
                      >
                        <option value="">Select…</option>
                        {(field.options ?? productOptions).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                        {field.name === "product" && (
                          <option value="Not listed / several lines">
                            Not listed / several lines
                          </option>
                        )}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type ?? "text"}
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(e) => set(field.name, e.target.value)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className={cn(controlClass, error && "border-brand")}
                      />
                    )}

                    {error && (
                      <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="mt-2 text-sm text-brand"
                      >
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center gap-6 border-t border-line pt-8">
        <Button type="submit">Send your requirement</Button>
        <p className="max-w-md text-sm leading-relaxed text-ink-faint">
          This opens your email client with the enquiry filled in, addressed to{" "}
          {contactInfo.email}. Nothing is stored on this site.
        </p>
      </div>
    </form>
  );
}
