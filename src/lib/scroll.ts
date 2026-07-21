const NAV_OFFSET_PX = -88;

type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void;
  destroy?: () => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

/**
 * Smooth-scrolls to a homepage section, accounting for the sticky navbar
 * and Lenis when it is active.
 */
export function scrollToSection(
  sectionId: string,
  offset: number = NAV_OFFSET_PX,
): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.15 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  window.history.replaceState(null, "", `#${sectionId}`);
}
