"use client";

import { useEffect, useState } from "react";

export type ImageOrientation = "landscape" | "portrait";

/**
 * Detects whether an image is landscape (incl. square) or portrait
 * from its natural dimensions.
 */
export function useImageOrientation(
  src: string,
  fallback: ImageOrientation = "portrait",
): ImageOrientation {
  const [trackedSrc, setTrackedSrc] = useState(src);
  const [orientation, setOrientation] = useState<ImageOrientation>(fallback);

  // Reset when the source changes (React-recommended render-time adjustment).
  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setOrientation(fallback);
  }

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();

    img.onload = () => {
      if (cancelled) return;
      setOrientation(
        img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait",
      );
    };

    img.onerror = () => {
      if (!cancelled) setOrientation(fallback);
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, fallback]);

  return orientation;
}

/** Design targets for certificate assets. */
export const CERTIFICATE_SIZE = {
  landscape: { width: 1200, height: 900, ratio: "4 / 3" },
  portrait: { width: 900, height: 1200, ratio: "3 / 4" },
} as const;
