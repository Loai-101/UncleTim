"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { heroSlides } from "@/data/hero";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

type HeroSliderProps = {
  className?: string;
};

/**
 * Full-bleed cinematic fade slider with subtle ken-burns on the active slide.
 */
export function HeroSlider({ className }: HeroSliderProps) {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = heroSlides.length;

  return (
    <div className={cn("absolute inset-0 z-0", className)}>
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={prefersReduced ? 0 : 1400}
        loop={total > 1}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        autoplay={
          prefersReduced
            ? false
            : {
                delay: 6500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }
        }
        onSlideChange={(swiper: SwiperInstance) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="hero-swiper h-full w-full"
        aria-roledescription="carousel"
        aria-label={t("slideLabel", {
          current: activeIndex + 1,
          total,
        })}
      >
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;
          const isPriority = Boolean(slide.priority) || index === 0;

          return (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 will-change-transform",
                    isActive && !prefersReduced && "hero-ken-burns",
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    sizes="100vw"
                    preload={isPriority}
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-10 px-6 sm:px-10 lg:px-14">
        <p
          className="font-display text-sm tracking-[0.2em] text-luxury-gold/90 tabular-nums"
          aria-live="polite"
        >
          <span className="text-soft-gold">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="mx-2 text-luxury-gold/40">/</span>
          <span className="text-luxury-gold/60">
            {String(total).padStart(2, "0")}
          </span>
          <span className="sr-only">
            {t("slideLabel", { current: activeIndex + 1, total })}
          </span>
        </p>
      </div>
    </div>
  );
}
