"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASING } from "@/lib/animations";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right" | "none";

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
  className?: string;
  once?: boolean;
};

function getOffset(direction: RevealDirection): { x?: number; y?: number } {
  switch (direction) {
    case "up":
      return { y: 28 };
    case "left":
      return { x: -32 };
    case "right":
      return { x: 32 };
    case "none":
    default:
      return {};
  }
}

export function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: RevealOnScrollProps) {
  const prefersReduced = useReducedMotion();
  const offset = getOffset(direction);

  const variants: Variants = prefersReduced
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: DURATION.base,
            ease: EASING.elegant,
            delay,
          },
        },
      };

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
