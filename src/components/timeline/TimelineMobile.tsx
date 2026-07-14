"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import {
  MOBILE_CONNECTOR_PATH,
  TimelineConnector,
} from "@/components/timeline/TimelineConnector";
import { cn } from "@/lib/utils";
import type { Decade } from "@/types/content";
import type { TimelineEvent } from "@/types/timeline";

type DecadeGroup = {
  decade: Decade;
  events: TimelineEvent[];
};

type TimelineMobileProps = {
  groups: DecadeGroup[];
  reducedMotion?: boolean;
  className?: string;
};

/**
 * Mobile strategy: single vertical gold connector, stacked cards, no horizontal overflow.
 */
export function TimelineMobile({
  groups,
  reducedMotion = false,
  className,
}: TimelineMobileProps) {
  const t = useTranslations("timeline");
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={trackRef}
      data-timeline-track="mobile"
      className={cn("relative ps-8 pe-1 sm:ps-10", className)}
    >
      <TimelineConnector
        pathD={MOBILE_CONNECTOR_PATH}
        viewBox="0 0 24 1200"
        variant="mobile"
        triggerRef={trackRef}
        reducedMotion={reducedMotion}
        className="start-0 w-6"
      />

      <div className="relative z-[1] flex flex-col gap-6 sm:gap-7">
        {groups.map((group) => (
          <div
            key={group.decade}
            data-decade={group.decade}
            className="timeline-era timeline-era--mobile"
          >
            <header className="relative mb-5 overflow-hidden py-3">
              <span
                aria-hidden="true"
                className="timeline-era-year-bg pointer-events-none absolute -start-1 top-1/2 -translate-y-1/2 font-display text-5xl leading-none font-medium select-none sm:text-6xl"
              >
                {group.decade.replace("s", "")}
              </span>
              <p className="eyebrow-label relative z-[1]">
                {t("decadeLabel", { decade: group.decade })}
              </p>
            </header>

            <ol className="flex list-none flex-col gap-5 sm:gap-6">
              {group.events.map((event, index) => (
                <li key={event.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-5 -start-[1.65rem] size-2.5 rounded-full border-2 border-luxury-gold bg-warm-white shadow-[0_0_0_3px_rgba(212,175,55,0.2)] sm:-start-[2.15rem]"
                  />
                  <TimelineCard
                    event={event}
                    revealDelay={Math.min(index * 0.05, 0.2)}
                    revealDirection="up"
                    className="w-full max-w-none"
                  />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
