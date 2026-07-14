"use client";

import { MapPin, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { TimelineCardMedia } from "@/components/timeline/TimelineCardMedia";
import { cn } from "@/lib/utils";
import type {
  TimelineEvent,
  TimelineImageAspect,
  TimelineSize,
} from "@/types/timeline";

type TimelineCardProps = {
  event: TimelineEvent;
  className?: string;
  revealDelay?: number;
  revealDirection?: "up" | "left" | "right" | "none";
};

const SIZE_CLASSES: Record<TimelineSize, string> = {
  small: "w-full max-w-[300px] md:w-[300px]",
  medium: "w-full max-w-[380px] md:w-[380px]",
  large: "w-full max-w-[640px] md:w-[min(640px,calc(50%-0.5rem))]",
};

const ASPECT_CLASSES: Record<TimelineImageAspect, string> = {
  landscape: "aspect-[16/9]",
  classic: "aspect-[4/3]",
  portrait: "aspect-[3/4] max-h-[360px]",
};

/**
 * Curated archive card — readable typography, controlled size, style variants.
 */
export function TimelineCard({
  event,
  className,
  revealDelay = 0,
  revealDirection = "up",
}: TimelineCardProps) {
  const t = useTranslations("timeline");
  const isHorizontal = event.layoutVariant === "horizontal";
  const isFeatured =
    event.size === "large" || event.layoutVariant === "featured";
  const aspect = event.imageAspect ?? "classic";
  const styleVariant = event.styleVariant ?? "editorial";

  const yearKey = `events.${event.id}.year`;
  const titleKey = `events.${event.id}.title`;
  const descriptionKey = `events.${event.id}.description`;
  const locationKey = `events.${event.id}.location`;
  const categoryKey = `events.${event.id}.category`;
  const badgeKey = `events.${event.id}.badge`;
  const imageAltKey = `events.${event.id}.imageAlt`;
  const quoteKey = `events.${event.id}.quote`;

  const year = t.has(yearKey) ? t(yearKey) : event.year;
  const title = t.has(titleKey) ? t(titleKey) : event.title;
  const description = t.has(descriptionKey)
    ? t(descriptionKey)
    : event.description;
  const location = t.has(locationKey) ? t(locationKey) : event.location;
  const category = t.has(categoryKey) ? t(categoryKey) : event.category;
  const badge = event.badge
    ? t.has(badgeKey)
      ? t(badgeKey)
      : event.badge
    : undefined;
  const imageAlt = t.has(imageAltKey) ? t(imageAltKey) : event.imageAlt;
  const quote = t.has(quoteKey) ? t(quoteKey) : event.quote;

  return (
    <RevealOnScroll
      delay={revealDelay}
      direction={revealDirection}
      className={cn("w-full", SIZE_CLASSES[event.size], className)}
    >
      <article
        data-layout={event.layoutVariant}
        data-size={event.size}
        data-style={styleVariant}
        className={cn(
          "timeline-card group relative overflow-hidden border bg-ivory",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out",
          "hover:-translate-y-1",
          isHorizontal
            ? "grid grid-cols-1 sm:grid-cols-2 sm:items-stretch"
            : "flex flex-col",
        )}
      >
        <div
          className={cn(
            "timeline-card-media relative isolate overflow-hidden bg-pure-white",
            isHorizontal ? "min-h-[10rem] sm:h-full sm:min-h-[12rem]" : "w-full",
            !isHorizontal && ASPECT_CLASSES[aspect],
          )}
        >
          <TimelineCardMedia
            image={event.image}
            images={event.images}
            imagePositions={event.imagePositions}
            alt={imageAlt}
            sizes="(max-width: 768px) 100vw, 580px"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-burgundy/25 via-transparent to-transparent"
          />
          {badge ? (
            <span className="timeline-card-badge absolute start-2.5 top-2.5 z-[2] border px-2 py-0.5 font-body text-[0.65rem] font-medium tracking-[0.12em] uppercase backdrop-blur-sm">
              {badge}
            </span>
          ) : null}
          {styleVariant === "documentary" ? (
            <time className="absolute end-2.5 top-2.5 z-[2] border border-luxury-gold/40 bg-burgundy/85 px-2 py-0.5 font-display text-xs tracking-wide text-soft-gold backdrop-blur-sm">
              {year}
            </time>
          ) : null}
        </div>

        <div
          className={cn(
            "timeline-card-body relative z-[1] flex min-w-0 flex-col gap-2.5 overflow-visible p-4 sm:p-5",
            isHorizontal && "justify-center",
            isFeatured && "sm:gap-3",
          )}
        >
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
            {styleVariant !== "documentary" ? (
              <time className="timeline-year shrink-0 text-xl leading-none sm:text-[1.35rem]">
                {year}
              </time>
            ) : null}
            <span className="timeline-card-category min-w-0 font-body text-[0.7rem] leading-snug tracking-[0.12em] uppercase">
              {category}
            </span>
          </div>

          <h3 className="timeline-card-title font-display text-lg leading-snug break-words text-burgundy sm:text-xl">
            {title}
          </h3>

          <p className="timeline-card-copy whitespace-pre-line font-body text-sm leading-relaxed break-words text-muted-text">
            {description}
          </p>

          {quote ? (
            <blockquote className="relative mt-1 border-s-2 border-luxury-gold/50 ps-3">
              <Quote
                className="mb-1 size-3.5 text-luxury-gold/80"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="font-display text-sm leading-relaxed text-burgundy italic sm:text-base">
                {quote}
              </p>
            </blockquote>
          ) : null}

          {location ? (
            <p className="mt-auto flex items-start gap-1.5 pt-1 font-body text-xs leading-snug text-muted-text">
              <MapPin
                className="mt-0.5 size-3.5 shrink-0 text-luxury-gold"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span>
                <span className="sr-only">{t("location")}: </span>
                {location}
              </span>
            </p>
          ) : null}
        </div>
      </article>
    </RevealOnScroll>
  );
}
