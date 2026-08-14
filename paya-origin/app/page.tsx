import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { CommercialIdea } from "@/sections/home/CommercialIdea";
import { Categories } from "@/sections/home/Categories";
import { Signature } from "@/sections/home/Signature";
import { Origin } from "@/sections/home/Origin";
import { Model } from "@/sections/home/Model";
import { Quality } from "@/sections/home/Quality";
import { Markets } from "@/sections/home/Markets";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "PAYA ORIGIN — Trusted origins, curated for global markets",
  description:
    "Agricultural sourcing, quality and export partner. Dried fruits & nuts, fresh fruits and vegetables sourced from named regions across Iran and shipped under one contract.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CommercialIdea />
      <Categories />
      <Signature />
      <Origin />
      <Model />
      <Quality />
      <Markets />
      <CtaBand />
    </>
  );
}
