"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forceUnlockBodyScroll } from "@/lib/body-scroll-lock";

gsap.registerPlugin(ScrollTrigger);

export type LenisCleanup = () => void;

/**
 * Native document scrolling only.
 * Lenis was disabled — it frequently blocks wheel/touch scroll after splash overflow locks.
 * GSAP ScrollTrigger still works with the browser scroll position.
 */
export function initLenis(): LenisCleanup {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // Ensure nothing left overflow:hidden from a previous session / HMR
  forceUnlockBodyScroll();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  // Drop any leftover Lenis instance from HMR
  if (window.__lenis) {
    try {
      window.__lenis.destroy?.();
    } catch {
      /* ignore */
    }
    delete window.__lenis;
  }

  document.documentElement.classList.add("native-scroll");
  ScrollTrigger.refresh();

  return () => {
    document.documentElement.classList.remove("native-scroll");
    ScrollTrigger.refresh();
  };
}

/**
 * Mounts native-scroll setup (ScrollTrigger refresh). Name kept for existing imports.
 */
export function useLenis(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const cleanup = initLenis();
    return cleanup;
  }, [enabled]);
}
