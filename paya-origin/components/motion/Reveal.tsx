"use client";

import { createElement } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, ElementType } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  /** duration in seconds; brand motion system uses 0.6–0.8s for section entries */
  duration?: number;
  once?: boolean;
}

/**
 * Fade-up-on-scroll wrapper — the single reveal primitive used across
 * every section so entrance motion stays consistent (0.6–0.8s, smooth
 * ease-out, ~24–32px of travel). Renders content in its resting state
 * immediately when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  as = "div",
  className,
  duration = 0.7,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (shouldReduceMotion) {
    return createElement(as as ElementType, { className }, children);
  }

  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
