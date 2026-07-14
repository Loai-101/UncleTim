"use client";

import { useTranslations } from "next-intl";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import { cn } from "@/lib/utils";
import type { Decade } from "@/types/content";
import type { TimelineEvent } from "@/types/timeline";

type TimelineEraProps = {
  decade: Decade;
  events: TimelineEvent[];
  className?: string;
};

/**
 * Decade group with faded year separator + balanced editorial slots.
 */
export function TimelineEra({ decade, events, className }: TimelineEraProps) {
  const t = useTranslations("timeline");

  return (
    <div
      data-decade={decade}
      className={cn("timeline-era relative py-8 sm:py-10 lg:py-12", className)}
    >
      <header className="timeline-era-header relative mb-8 overflow-hidden lg:mb-10">
        <span
          aria-hidden="true"
          className="timeline-era-year-bg pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(3.5rem,11vw,7rem)] leading-none font-medium tracking-[-0.04em] select-none"
        >
          {decade.replace("s", "")}
        </span>

        <div className="relative z-[1] flex flex-col items-center gap-2.5 py-6 text-center sm:py-7">
          <p className="eyebrow-label">{t("decadeLabel", { decade })}</p>
          <div
            aria-hidden="true"
            className="timeline-era-rule h-px w-20 bg-gradient-to-r from-transparent via-luxury-gold to-transparent sm:w-28"
          />
        </div>
      </header>

      <div className="timeline-era-grid relative flex flex-col gap-8 sm:gap-9 lg:gap-10">
        {events.map((event, index) => (
          <EraSlot key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}

function EraSlot({
  event,
  index,
}: {
  event: TimelineEvent;
  index: number;
}) {
  const delay = Math.min(index * 0.06, 0.28);
  const revealDirection =
    event.orientation === "left"
      ? "left"
      : event.orientation === "right"
        ? "right"
        : "up";

  return (
    <div
      data-orientation={event.orientation}
      data-variant={event.layoutVariant}
      className={cn(
        "timeline-era-slot relative z-[1] flex w-full",
        /* Pin card edge to the center spine (tight gap for the gold node) */
        event.orientation === "left" &&
          "justify-start md:justify-end md:pe-[calc(50%+0.5rem)]",
        event.orientation === "right" &&
          "justify-start md:ps-[calc(50%+0.5rem)]",
        event.orientation === "center" && "justify-center",
        event.layoutVariant === "floating" &&
          cn(
            event.orientation === "left" && "md:translate-y-1",
            event.orientation === "right" && "md:-translate-y-0.5",
          ),
        event.layoutVariant === "diagonal" &&
          cn(
            event.orientation === "left" && "md:translate-y-2",
            event.orientation === "right" && "md:-translate-y-1",
          ),
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          /* Physical left — SVG spine does not flip in RTL; keep node on the same center as EN/FR */
          "timeline-era-node absolute top-6 left-1/2 z-[2] hidden size-3.5 -translate-x-1/2 rounded-full border-2 border-luxury-gold bg-warm-white",
          "shadow-[0_0_0_5px_rgba(212,175,55,0.18),0_0_16px_rgba(212,175,55,0.35)] md:block",
        )}
      />

      <TimelineCard
        event={event}
        revealDelay={delay}
        revealDirection={revealDirection}
        className="md:w-auto"
      />
    </div>
  );
}
