"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CertificateCard } from "@/components/certificates/CertificateCard";
import { Container } from "@/components/shared/Container";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { RoyalFrame } from "@/components/shared/RoyalFrame";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { certificates } from "@/data/certificates";
import {
  CERTIFICATE_SIZE,
  useImageOrientation,
} from "@/hooks/useImageOrientation";
import { useMounted } from "@/hooks/useMounted";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isRtl } from "@/lib/i18n";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

function CertificateLightboxMedia({
  src,
  alt,
  zoom,
}: {
  src: string;
  alt: string;
  zoom: number;
}) {
  const orientation = useImageOrientation(src);
  const size = CERTIFICATE_SIZE[orientation];

  return (
    <RoyalFrame
      className={cn(
        "mx-auto w-full p-2",
        orientation === "landscape"
          ? "max-w-[min(100%,1200px)]"
          : "max-w-[min(100%,900px)]",
      )}
    >
      <div
        className="relative w-full overflow-hidden bg-[#f3eee6] transition-transform duration-300"
        style={{
          aspectRatio: size.ratio,
          transform: `scale(${zoom})`,
          transformOrigin: "center top",
        }}
        data-orientation={orientation}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-contain object-center"
        />
      </div>
    </RoyalFrame>
  );
}

/**
 * Certifications slider — equal square cards that scroll continuously.
 */
export function CertificatesSection() {
  const t = useTranslations("certificates");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const rtl = useMemo(() => isRtl(locale), [locale]);
  const prefersReduced = useReducedMotion();
  const mounted = useMounted();

  const items = useMemo(
    () => [...certificates].sort((a, b) => Number(b.year) - Number(a.year)),
    [],
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const active = items[activeIndex] ?? null;
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  const openAt = (id: string) => {
    const index = items.findIndex((c) => c.id === id);
    if (index < 0) return;
    setActiveIndex(index);
    setZoom(1);
    setModalOpen(true);
  };

  const goPrev = useCallback(() => {
    setActiveIndex((i) => i - 1);
    setZoom(1);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => i + 1);
    setZoom(1);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setModalOpen(false);
      }
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight" && activeIndex < items.length - 1) {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, activeIndex, items.length, goPrev, goNext]);

  const trapFocus = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  return (
    <section
      id={SECTION_IDS.certifications}
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
            number="06"
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
                  el: ".certificates-slider-pagination",
                }}
                className="certificates-swiper"
                aria-label={t("title")}
              >
                {items.map((certificate) => (
                  <SwiperSlide key={certificate.id} className="!h-auto">
                    <CertificateCard
                      certificate={certificate}
                      onOpen={() => openAt(certificate.id)}
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

              <div className="certificates-slider-pagination mt-6" />
            </div>
          )}
        </RevealOnScroll>
      </Container>

      {mounted && modalOpen && active
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
              <button
                type="button"
                aria-label={tCommon("close")}
                className="absolute inset-0 bg-burgundy/90 backdrop-blur-sm"
                onClick={() => setModalOpen(false)}
              />
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onKeyDown={trapFocus}
                className="relative z-[1] flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-luxury-gold/40 bg-ivory"
              >
                <div className="flex items-center justify-between gap-3 border-b border-border-gold px-4 py-3 sm:px-6">
                  <h2 id={titleId} className="sr-only">
                    {t("viewCertificate")}
                  </h2>
                  <span className="text-[0.7rem] tracking-[0.14em] text-muted-text uppercase tabular-nums">
                    {activeIndex + 1} / {items.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                      className="inline-flex size-10 items-center justify-center text-burgundy"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                      className="inline-flex size-10 items-center justify-center text-burgundy"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="size-4" />
                    </button>
                    <button
                      ref={closeRef}
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="inline-flex size-10 items-center justify-center text-burgundy"
                      aria-label={tCommon("close")}
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
                  <CertificateLightboxMedia
                    src={active.image}
                    alt={active.imageAlt || active.title}
                    zoom={zoom}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border-gold px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    disabled={activeIndex === 0}
                    onClick={goPrev}
                    className={cn(
                      "inline-flex items-center gap-1 text-[0.7rem] tracking-[0.14em] uppercase",
                      activeIndex === 0
                        ? "cursor-not-allowed text-muted-text/40"
                        : "text-burgundy hover:text-royal-red",
                    )}
                    aria-label={tCommon("previous")}
                  >
                    <ChevronLeft className="size-4" />
                    {tCommon("previous")}
                  </button>
                  <button
                    type="button"
                    disabled={activeIndex >= items.length - 1}
                    onClick={goNext}
                    className={cn(
                      "inline-flex items-center gap-1 text-[0.7rem] tracking-[0.14em] uppercase",
                      activeIndex >= items.length - 1
                        ? "cursor-not-allowed text-muted-text/40"
                        : "text-burgundy hover:text-royal-red",
                    )}
                    aria-label={tCommon("next")}
                  >
                    {tCommon("next")}
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
