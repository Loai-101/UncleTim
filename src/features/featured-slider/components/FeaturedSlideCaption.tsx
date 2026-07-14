"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { FeaturedSlide } from "@/features/featured-slider/types/featured-slider.types";

type FeaturedSlideCaptionProps = {
  slide: FeaturedSlide;
  className?: string;
};

export function FeaturedSlideCaption({
  slide,
  className,
}: FeaturedSlideCaptionProps) {
  const t = useTranslations("featuredSlider");
  const locale = useLocale();
  const title = t(`slides.${slide.id}.title`);
  const subtitleKey = `slides.${slide.id}.subtitle`;
  const subtitle = t.has(subtitleKey) ? t(subtitleKey) : null;

  return (
    <div className={cn("slide-caption", className)}>
      <div className="min-w-0">
        {(slide.year || slide.category) && (
          <p className="mb-1 text-[0.65rem] tracking-[0.18em] text-luxury-gold/90 uppercase">
            {[slide.year, slide.category].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="font-display text-base leading-snug text-pure-white sm:text-lg">
          {title}
        </p>
        {subtitle && (
          <p
            className={cn(
              "slide-caption-subtitle mt-1 text-sm leading-relaxed text-soft-gold/95 sm:text-[0.95rem]",
              locale === "ar" ? "font-arabic-body" : "font-body",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
