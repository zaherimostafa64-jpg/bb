"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  /** seconds between each child's entrance */
  stagger?: number;
  y?: number;
}

const container = (stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  },
});

const item = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
});

/**
 * Wrap a grid/row of cards to have them fade up in a gentle cascade as
 * the group enters the viewport. Each direct child becomes a stagger
 * item automatically — no per-card motion code needed.
 */
export function StaggerGroup({
  children,
  className,
  stagger = 0.09,
  y = 24,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={container(stagger)}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={item(y)}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export const staggerItemVariants = item;
