"use client";

import Image from "next/image";
import { Images } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { GalleryFilterValue } from "@/components/gallery/GalleryFilters";

type GalleryCategoryCardProps = {
  value: GalleryFilterValue;
  labelKey: string;
  coverSrc: string;
  coverAlt: string;
  onOpen: () => void;
  className?: string;
};

/**
 * Category card — click opens the archive gallery window.
 */
export function GalleryCategoryCard({
  value,
  labelKey,
  coverSrc,
  coverAlt,
  onOpen,
  className,
}: GalleryCategoryCardProps) {
  const t = useTranslations("gallery");

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t(labelKey as Parameters<typeof t>[0])}
      data-category={value}
      className={cn(
        "group relative flex min-h-[16rem] w-full flex-col overflow-hidden rounded-[14px] border border-border-gold bg-ivory text-start",
        "shadow-[0_12px_36px_-24px_rgba(58,0,12,0.35)] transition-[transform,box-shadow,border-color] duration-500",
        "hover:-translate-y-1 hover:border-luxury-gold/60 hover:shadow-[0_20px_48px_-22px_rgba(212,175,55,0.4)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-luxury-gold",
        className,
      )}
    >
      <div className="relative min-h-[11rem] flex-1 overflow-hidden bg-burgundy/10">
        <Image
          src={coverSrc}
          alt={coverAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-burgundy/85 via-burgundy/25 to-transparent"
        />
        <span className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-luxury-gold/60 bg-warm-white/90 text-burgundy opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Images className="size-4" strokeWidth={1.5} aria-hidden />
        </span>
      </div>

      <div className="relative z-[1] p-4 sm:p-5">
        <h3 className="font-display text-xl leading-snug text-burgundy sm:text-2xl">
          {t(labelKey as Parameters<typeof t>[0])}
        </h3>
      </div>
    </button>
  );
}
