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
  const [orientation, setOrientation] = useState<ImageOrientation>(fallback);

  useEffect(() => {
    let cancelled = false;
    setOrientation(fallback);

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
