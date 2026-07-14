"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { isRtl } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FeaturedSliderNavigationProps = {
  swiper: SwiperInstance | null;
  className?: string;
};

export function FeaturedSliderNavigation({
  swiper,
  className,
}: FeaturedSliderNavigationProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const rtl = useMemo(() => isRtl(locale), [locale]);

  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-20", className)}>
      <button
        type="button"
        className="featured-slider-nav featured-slider-nav--prev pointer-events-auto"
        aria-label={t("previous")}
        onClick={() => swiper?.slidePrev()}
      >
        <PrevIcon className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
      <button
        type="button"
        className="featured-slider-nav featured-slider-nav--next pointer-events-auto"
        aria-label={t("next")}
        onClick={() => swiper?.slideNext()}
      >
        <NextIcon className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
