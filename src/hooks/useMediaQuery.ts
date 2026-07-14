"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * SSR snapshot is `false` to keep server and first client paint aligned.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
