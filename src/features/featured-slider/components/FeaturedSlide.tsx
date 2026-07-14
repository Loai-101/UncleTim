"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FeaturedSlideCaption } from "@/features/featured-slider/components/FeaturedSlideCaption";
import { cn } from "@/lib/utils";
import type { FeaturedSlide } from "@/features/featured-slider/types/featured-slider.types";

type FeaturedSlideCardProps = {
  slide: FeaturedSlide;
  priority?: boolean;
  className?: string;
};

export function FeaturedSlide({
  slide,
  priority = false,
  className,
}: FeaturedSlideCardProps) {
  const t = useTranslations("featuredSlider");

  return (
    <article
      className={cn(
        "featured-slide-card relative h-full w-full overflow-hidden rounded-[14px] bg-burgundy",
        className,
      )}
    >
      <Image
        src={slide.image}
        alt={t(`slides.${slide.id}.imageAlt`)}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 33vw"
        priority={priority}
        className="object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="featured-slide-dim pointer-events-none absolute inset-0 bg-burgundy/45 opacity-0 transition-opacity duration-500"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy/70 via-transparent to-transparent"
      />
      <FeaturedSlideCaption slide={slide} />
    </article>
  );
}
