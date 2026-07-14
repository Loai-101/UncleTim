import type { SwiperOptions } from "swiper/types";

export const FEATURED_SLIDER_CONFIG = {
  loop: true,
  centeredSlides: true,
  spaceBetween: 16,
  speed: 700,
  slidesPerView: 1.15,
  breakpoints: {
    640: {
      slidesPerView: 1.3,
      spaceBetween: 18,
    },
    1024: {
      slidesPerView: 2.2,
      spaceBetween: 20,
    },
    1440: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  },
} as const satisfies Pick<
  SwiperOptions,
  "loop" | "centeredSlides" | "spaceBetween" | "speed" | "slidesPerView" | "breakpoints"
>;
