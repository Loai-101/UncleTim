"use client";

import { useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  DESKTOP_CONNECTOR_PATH,
  TimelineConnector,
} from "@/components/timeline/TimelineConnector";
import { TimelineEra } from "@/components/timeline/TimelineEra";
import { TimelineMobile } from "@/components/timeline/TimelineMobile";
import { timelineEvents } from "@/data/timeline";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SECTION_IDS } from "@/lib/constants";
import type { Decade } from "@/types/content";
import type { TimelineEvent } from "@/types/timeline";

const DECADE_ORDER: Decade[] = [
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

function groupEventsByDecade(events: TimelineEvent[]) {
  return DECADE_ORDER.map((decade) => ({
    decade,
    events: events.filter((event) => event.decade === decade),
  })).filter((group) => group.events.length > 0);
}

/**
 * Interactive Historical Timeline — luxury digital museum editorial section.
 * Desktop (md+): mixed editorial layout + snaking gold connector (GSAP ScrollTrigger).
 * Mobile (<768): clean vertical stack via TimelineMobile.
 * CSS visibility switch avoids hydration flash from JS media queries.
 */
export function LegacyTimeline() {
  const t = useTranslations("timeline");
  const prefersReduced = useReducedMotion();
  const desktopTrackRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => groupEventsByDecade(timelineEvents), []);

  return (
    <section
      id={SECTION_IDS.timeline}
      className="relative overflow-hidden bg-warm-white py-20 sm:py-24 lg:py-32"
      aria-label={t("title")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-32 top-1/4 size-[28rem] rounded-full bg-royal-red/[0.04] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 bottom-1/5 size-[22rem] rounded-full bg-luxury-gold/[0.07] blur-3xl"
      />

      <Container className="relative z-[1]">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            number="02"
            className="max-w-3xl"
          />
        </RevealOnScroll>

        <div className="mt-14 sm:mt-16 lg:mt-20">
          {/* Mobile (<768) */}
          <div className="md:hidden">
            <TimelineMobile groups={groups} reducedMotion={prefersReduced} />
          </div>

          {/* Desktop editorial track */}
          <div
            ref={desktopTrackRef}
            data-timeline-track="desktop"
            className="relative hidden md:block"
          >
            <TimelineConnector
              pathD={DESKTOP_CONNECTOR_PATH}
              viewBox="0 0 100 1200"
              variant="desktop"
              triggerRef={desktopTrackRef}
              reducedMotion={prefersReduced}
              className="opacity-90"
            />

            <div className="relative z-[1] divide-y divide-border-gold/25">
              {groups.map((group) => (
                <TimelineEra
                  key={group.decade}
                  decade={group.decade}
                  events={group.events}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
