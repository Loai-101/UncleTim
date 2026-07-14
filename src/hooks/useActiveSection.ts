"use client";

import { useEffect, useState } from "react";

export interface UseActiveSectionOptions {
  sectionIds: readonly string[];
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Tracks which section ID is currently most visible via IntersectionObserver.
 */
export function useActiveSection({
  sectionIds,
  rootMargin = "-35% 0px -45% 0px",
  threshold = [0, 0.25, 0.5, 0.75, 1],
}: UseActiveSectionOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null,
  );

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let bestId: string | null = null;
        let bestRatio = 0;

        for (const id of sectionIds) {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId) {
          setActiveId(bestId);
        }
      },
      { rootMargin, threshold },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds, rootMargin, threshold]);

  return activeId;
}
