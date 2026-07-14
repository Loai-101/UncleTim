"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { NewspaperCoverCard } from "@/components/newspapers/NewspaperCoverCard";
import { Container } from "@/components/shared/Container";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { newspapers } from "@/data/newspapers";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isRtl } from "@/lib/i18n";
import { SECTION_IDS } from "@/lib/constants";

import "swiper/css";
import "swiper/css/pagination";

const NewspaperLightbox = dynamic(
  () =>
    import("@/components/newspapers/NewspaperLightbox").then(
      (mod) => mod.NewspaperLightbox,
    ),
  { ssr: false },
);

/**
 * Media archive slider — equal square press covers that scroll continuously
 * (same interaction pattern as Awards & Certificates / Gallery).
 */
export function NewspaperArchive() {
  const t = useTranslations("newspapers");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const rtl = useMemo(() => isRtl(locale), [locale]);
  const prefersReduced = useReducedMotion();

  const items = newspapers;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  const openAt = (id: string) => {
    const index = items.findIndex((article) => article.id === id);
    if (index < 0) return;
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id={SECTION_IDS.newspapers}
      className="relative overflow-hidden bg-ivory py-16 sm:py-20 lg:py-24"
      aria-label={t("title")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-30"
      />

      <Container className="relative z-[1]">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            number="05"
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
                  el: ".newspapers-slider-pagination",
                }}
                className="certificates-swiper"
                aria-label={t("title")}
              >
                {items.map((article) => (
                  <SwiperSlide key={article.id} className="!h-auto">
                    <NewspaperCoverCard
                      article={article}
                      onOpen={() => openAt(article.id)}
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

              <div className="newspapers-slider-pagination certificates-slider-pagination mt-6" />
            </div>
          )}
        </RevealOnScroll>
      </Container>

      <NewspaperLightbox
        articles={items}
        open={lightboxOpen}
        index={activeIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
