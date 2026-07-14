"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GoldDivider } from "@/components/shared/GoldDivider";
import { QuoteBlock } from "@/components/storytelling/QuoteBlock";
import { stories } from "@/data/stories";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isRtl } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { StoryBlock } from "@/types/content";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function StorySlideContent({
  story,
  reverse,
}: {
  story: StoryBlock;
  reverse?: boolean;
}) {
  const t = useTranslations("legacy");
  const baseKey = `stories.${story.id}`;

  const eyebrow = t.has(`${baseKey}.eyebrow`)
    ? t(`${baseKey}.eyebrow`)
    : story.eyebrow;
  const title = t.has(`${baseKey}.title`)
    ? t(`${baseKey}.title`)
    : story.title;
  const subtitle = t.has(`${baseKey}.subtitle`)
    ? t(`${baseKey}.subtitle`)
    : story.subtitle;
  const role = t.has(`${baseKey}.role`) ? t(`${baseKey}.role`) : story.role;
  const description = t.has(`${baseKey}.description`)
    ? t(`${baseKey}.description`)
    : story.description;
  const quote = t.has(`${baseKey}.quote`)
    ? t(`${baseKey}.quote`)
    : story.quote;
  const imageAlt = t.has(`${baseKey}.imageAlt`)
    ? t(`${baseKey}.imageAlt`)
    : story.imageAlt;
  const year = t.has(`${baseKey}.year`) ? t(`${baseKey}.year`) : story.year;
  const location = t.has(`${baseKey}.location`)
    ? t(`${baseKey}.location`)
    : story.location;

  const figures = story.figures?.map((figure) => {
    const figureKey = `${baseKey}.figures.${figure.id}`;
    return {
      id: figure.id,
      name: t.has(`${figureKey}.name`)
        ? t(`${figureKey}.name`)
        : figure.name,
      role: t.has(`${figureKey}.role`) ? t(`${figureKey}.role`) : figure.role,
      description: t.has(`${figureKey}.description`)
        ? t(`${figureKey}.description`)
        : figure.description,
    };
  });

  const hasFigures = Boolean(figures && figures.length > 0);
  const copyScrolls = hasFigures || Boolean(story.scrollable);

  return (
    <article
      className={cn(
        "story-slide grid h-full rounded-[14px] border border-border-gold bg-warm-white shadow-[0_18px_48px_-28px_rgba(58,0,12,0.35)]",
        "lg:grid-cols-2 overflow-hidden",
        copyScrolls && "story-slide--figures",
      )}
    >
      <div
        className={cn(
          "relative min-h-[260px] overflow-hidden bg-burgundy/10 sm:min-h-[320px]",
          copyScrolls ? "lg:min-h-0 lg:h-full" : "lg:min-h-full",
          reverse && "lg:order-2",
        )}
      >
        <Image
          src={story.image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
          priority={story.id === "story-01"}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-burgundy/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-burgundy/20"
        />
        {story.secondaryImage ? (
          <div className="absolute end-3 bottom-3 hidden h-24 w-20 overflow-hidden border border-luxury-gold/50 shadow-lg sm:block lg:h-32 lg:w-24">
            <Image
              src={story.secondaryImage}
              alt={story.secondaryImageAlt ?? imageAlt}
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "story-slide-copy flex min-h-0 flex-col p-5 sm:p-8 lg:p-10",
          copyScrolls
            ? "story-slide-copy--scroll justify-start gap-3 overflow-y-auto overscroll-contain sm:gap-3.5"
            : "justify-center gap-3 sm:gap-4",
          reverse && "lg:order-1",
        )}
        {...(copyScrolls
          ? {
              "data-lenis-prevent": true,
              tabIndex: 0,
              "aria-label": title,
            }
          : {})}
      >
        <p className="eyebrow-label shrink-0 text-luxury-gold">{eyebrow}</p>
        <h3 className="font-display shrink-0 text-xl leading-snug text-burgundy sm:text-2xl lg:text-[1.75rem]">
          {title}
        </h3>
        {!hasFigures && subtitle ? (
          <p className="font-display shrink-0 text-base leading-snug text-dark-gold sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {!hasFigures && role ? (
          <p className="whitespace-pre-line text-sm font-medium tracking-wide text-burgundy/70 sm:text-[0.95rem]">
            {role}
          </p>
        ) : null}
        <div className="max-w-[7rem] shrink-0">
          <GoldDivider variant="thin" />
        </div>
        {(year || location) && (
          <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] tracking-[0.16em] text-dark-gold uppercase">
            {year ? <span>{year}</span> : null}
            {year && location ? (
              <span aria-hidden="true" className="text-luxury-gold/40">
                ·
              </span>
            ) : null}
            {location ? <span>{location}</span> : null}
          </div>
        )}

        {hasFigures ? (
          <div className="flex flex-col gap-4 pe-1">
            {figures!.map((figure) => (
              <div key={figure.id} className="space-y-1.5">
                <p className="font-display text-[0.95rem] leading-snug text-dark-gold sm:text-base">
                  {figure.name}
                </p>
                {figure.role ? (
                  <p className="whitespace-pre-line text-[0.7rem] font-medium leading-relaxed tracking-wide text-burgundy/65 sm:text-xs">
                    {figure.role}
                  </p>
                ) : null}
                <p className="font-body whitespace-pre-line text-[0.8125rem] leading-relaxed text-muted-text sm:text-sm">
                  {figure.description}
                </p>
              </div>
            ))}
            <p className="font-body whitespace-pre-line text-[0.8125rem] leading-relaxed text-muted-text sm:text-sm">
              {description}
            </p>
          </div>
        ) : (
          <p
            className={cn(
              "font-body whitespace-pre-line leading-relaxed text-muted-text",
              copyScrolls
                ? "text-[0.8125rem] sm:text-sm"
                : "text-sm sm:text-[0.95rem]",
            )}
          >
            {description}
          </p>
        )}

        {quote ? (
          <QuoteBlock
            quote={quote}
            className={cn("mt-1 shrink-0", copyScrolls && "pb-1")}
          />
        ) : null}
      </div>
    </article>
  );
}

/**
 * Editorial storytelling chapters as a premium Swiper carousel.
 */
export function StorytellingSlider({ className }: { className?: string }) {
  const t = useTranslations("legacy");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const rtl = useMemo(() => isRtl(locale), [locale]);
  const prefersReduced = useReducedMotion();
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <div className={cn("storytelling-slider relative", className)}>
      <Swiper
        key={rtl ? "rtl" : "ltr"}
        modules={[Autoplay, Keyboard, Navigation, Pagination]}
        dir={rtl ? "rtl" : "ltr"}
        loop={stories.length > 1}
        speed={prefersReduced ? 0 : 750}
        spaceBetween={20}
        slidesPerView={1}
        keyboard={{ enabled: true }}
        autoplay={
          prefersReduced
            ? false
            : {
                delay: 6500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }
        }
        pagination={{
          clickable: true,
          el: ".storytelling-slider-pagination",
        }}
        onSwiper={setSwiper}
        className="storytelling-swiper"
        aria-label={t("title")}
      >
        {stories.map((story: StoryBlock, index) => (
          <SwiperSlide key={story.id} className="!h-auto">
            <StorySlideContent story={story} reverse={index % 2 === 1} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        className="storytelling-slider-nav storytelling-slider-nav--prev"
        aria-label={tCommon("previous")}
        onClick={() => swiper?.slidePrev()}
      >
        <PrevIcon className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
      <button
        type="button"
        className="storytelling-slider-nav storytelling-slider-nav--next"
        aria-label={tCommon("next")}
        onClick={() => swiper?.slideNext()}
      >
        <NextIcon className="size-5" strokeWidth={1.75} aria-hidden />
      </button>

      <div className="storytelling-slider-pagination mt-6" />
    </div>
  );
}
