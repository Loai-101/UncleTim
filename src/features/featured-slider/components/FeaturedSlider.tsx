"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeaturedSlide } from "@/features/featured-slider/components/FeaturedSlide";
import { FeaturedSliderNavigation } from "@/features/featured-slider/components/FeaturedSliderNavigation";
import { FeaturedSliderPagination } from "@/features/featured-slider/components/FeaturedSliderPagination";
import { FEATURED_SLIDER_CONFIG } from "@/features/featured-slider/config/featured-slider.config";
import { featuredSlides } from "@/features/featured-slider/data/featured-slider.data";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isRtl } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

type FeaturedSliderProps = {
  className?: string;
};

export function FeaturedSlider({ className }: FeaturedSliderProps) {
  const t = useTranslations("featuredSlider");
  const locale = useLocale();
  const rtl = useMemo(() => isRtl(locale), [locale]);
  const prefersReduced = useReducedMotion();
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  return (
    <div className={cn("relative", className)}>
      <div className="featured-slider-frame relative bg-warm-white">
        <Swiper
          key={rtl ? "rtl" : "ltr"}
          modules={[Autoplay, Keyboard, Pagination]}
          dir={rtl ? "rtl" : "ltr"}
          loop={FEATURED_SLIDER_CONFIG.loop}
          centeredSlides={FEATURED_SLIDER_CONFIG.centeredSlides}
          slidesPerView={FEATURED_SLIDER_CONFIG.slidesPerView}
          spaceBetween={FEATURED_SLIDER_CONFIG.spaceBetween}
          speed={prefersReduced ? 0 : FEATURED_SLIDER_CONFIG.speed}
          breakpoints={FEATURED_SLIDER_CONFIG.breakpoints}
          keyboard={{ enabled: true }}
          pagination={{
            clickable: true,
            el: ".featured-slider-pagination",
          }}
          autoplay={
            prefersReduced
              ? false
              : {
                  delay: 5200,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true,
                }
          }
          onSwiper={setSwiper}
          className="featured-swiper h-full w-full"
          aria-roledescription="carousel"
          aria-label={t("ariaLabel")}
        >
          {featuredSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <FeaturedSlide slide={slide} priority={index === 0} />
            </SwiperSlide>
          ))}
        </Swiper>

        <FeaturedSliderNavigation swiper={swiper} />
      </div>

      <FeaturedSliderPagination />
    </div>
  );
}
