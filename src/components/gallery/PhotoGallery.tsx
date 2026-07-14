"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { Container } from "@/components/shared/Container";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { galleryImages } from "@/data/gallery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isRtl } from "@/lib/i18n";
import { SECTION_IDS } from "@/lib/constants";

import "swiper/css";
import "swiper/css/pagination";

const GalleryLightbox = dynamic(
  () =>
    import("@/components/gallery/GalleryLightbox").then(
      (mod) => mod.GalleryLightbox,
    ),
  { ssr: false },
);

/**
 * Visual archive slider — equal square cards that scroll continuously
 * (same interaction pattern as Awards & Certificates).
 */
export function PhotoGallery() {
  const t = useTranslations("gallery");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const rtl = useMemo(() => isRtl(locale), [locale]);
  const prefersReduced = useReducedMotion();

  const items = galleryImages;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  const openAt = (id: string) => {
    const index = items.findIndex((image) => image.id === id);
    if (index < 0) return;
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id={SECTION_IDS.gallery}
      className="relative overflow-hidden bg-warm-white py-16 sm:py-20 lg:py-24"
      aria-label={t("title")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-25"
      />

      <Container className="relative z-[1]">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            number="04"
            className="max-w-3xl"
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="relative mt-10">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-text">
              {t("subtitle")}
            </p>
          ) : (
            <div className="certificates-slider relative">
              <Swiper
                key={rtl ? "rtl" : "ltr"}
                modules={[Autoplay, Keyboard, Pagination]}
                dir={rtl ? "rtl" : "ltr"}
                onSwiper={setSwiper}
                loop={items.length > 4}
                speed={prefersReduced ? 0 : 700}
                spaceBetween={12}
                slidesPerView={2}
                keyboard={{ enabled: true }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 3, spaceBetween: 16 },
                  1024: { slidesPerView: 4, spaceBetween: 18 },
                  1280: { slidesPerView: 5, spaceBetween: 20 },
                }}
                autoplay={
                  prefersReduced || items.length < 2
                    ? false
                    : {
                        delay: 3200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                }
                pagination={{
                  clickable: true,
                  el: ".gallery-slider-pagination",
                }}
                className="certificates-swiper"
                aria-label={t("title")}
              >
                {items.map((image) => (
                  <SwiperSlide key={image.id} className="!h-auto">
                    <GalleryCard
                      image={image}
                      onOpen={() => openAt(image.id)}
                      className="h-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                type="button"
                className="certificates-slider-nav certificates-slider-nav--prev"
                aria-label={tCommon("previous")}
                onClick={() => swiper?.slidePrev()}
              >
                <PrevIcon className="size-5" strokeWidth={1.75} aria-hidden />
              </button>
              <button
                type="button"
                className="certificates-slider-nav certificates-slider-nav--next"
                aria-label={tCommon("next")}
                onClick={() => swiper?.slideNext()}
              >
                <NextIcon className="size-5" strokeWidth={1.75} aria-hidden />
              </button>

              <div className="gallery-slider-pagination certificates-slider-pagination mt-6" />
            </div>
          )}
        </RevealOnScroll>
      </Container>

      <GalleryLightbox
        images={items}
        open={lightboxOpen}
        index={activeIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
