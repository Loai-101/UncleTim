"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type LenisCleanup = () => void;

/** Prefer native scrolling on phones/tablets — Lenis often blocks touch scroll. */
function shouldUseNativeScroll(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 1024px)").matches
  );
}

/**
 * Initializes Lenis smooth scrolling synced with GSAP ScrollTrigger.
 * Uses native scroll on touch / narrow viewports. Respects prefers-reduced-motion.
 */
export function initLenis(): LenisCleanup {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReduced || shouldUseNativeScroll()) {
    document.documentElement.classList.add("native-scroll");
    ScrollTrigger.refresh();
    return () => {
      document.documentElement.classList.remove("native-scroll");
    };
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.2,
  });

  window.__lenis = lenis;
  lenis.scrollTo(0, { immediate: true });
  lenis.on("scroll", ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.refresh();

  return () => {
    gsap.ticker.remove(tickerCallback);
    if (window.__lenis === lenis) {
      delete window.__lenis;
    }
    lenis.destroy();
    ScrollTrigger.refresh();
  };
}

/**
 * React hook wrapper that mounts Lenis on the client and cleans up on unmount.
 */
export function useLenis(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const cleanup = initLenis();
    return cleanup;
  }, [enabled]);
}
