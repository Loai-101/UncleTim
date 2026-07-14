"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const ROTATE_MS = 2000;

type TimelineCardMediaProps = {
  image: string;
  images?: string[];
  imagePositions?: string[];
  alt: string;
  className?: string;
  sizes?: string;
};

/**
 * Timeline card media — single still, or auto-rotating gallery every 2s.
 */
export function TimelineCardMedia({
  image,
  images,
  imagePositions,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 580px",
}: TimelineCardMediaProps) {
  const prefersReduced = useReducedMotion();
  const gallery =
    images && images.length > 0 ? images : ([image].filter(Boolean) as string[]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced || gallery.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % gallery.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [gallery.length, prefersReduced]);

  return (
    <div className={cn("absolute inset-0", className)}>
      {gallery.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          fill
          sizes={sizes}
          priority={i === 0}
          aria-hidden={i !== index}
          className={cn(
            "timeline-card-image object-cover transition-opacity duration-700 ease-out",
            i === index ? "z-[1] opacity-100" : "z-0 opacity-0",
          )}
          style={{
            objectPosition: imagePositions?.[i] ?? "center",
          }}
        />
      ))}
    </div>
  );
}
