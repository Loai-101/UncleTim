import type { Transition, Variants } from "framer-motion";

/** Duration constants (seconds) for Framer Motion */
export const DURATION = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.2,
} as const;

/** Easing curves tuned for luxury, cinematic motion */
export const EASING = {
  smooth: [0.22, 1, 0.36, 1] as const,
  elegant: [0.16, 1, 0.3, 1] as const,
  softOut: [0.33, 1, 0.68, 1] as const,
  linear: [0, 0, 1, 1] as const,
} as const;

export const defaultTransition: Transition = {
  duration: DURATION.base,
  ease: EASING.elegant,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.base,
      ease: EASING.smooth,
    },
  },
};

export const revealMask: Variants = {
  hidden: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.elegant,
    },
  },
};

/** GSAP default settings for ScrollTrigger / timeline animations */
export const GSAP_DEFAULTS = {
  duration: 1.1,
  ease: "power2.out",
  scrub: 0.6,
  start: "top 80%",
  end: "bottom 20%",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Returns static “visible” variants when reduced motion is preferred */
export function withReducedMotion(variants: Variants): Variants {
  if (typeof window !== "undefined" && prefersReducedMotion()) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }
  return variants;
}

export function getMotionSafeTransition(
  transition: Transition = defaultTransition,
): Transition {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  return transition;
}
