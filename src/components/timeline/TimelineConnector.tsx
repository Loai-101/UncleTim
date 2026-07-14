"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GSAP_DEFAULTS } from "@/lib/animations";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type TimelineConnectorProps = {
  /** Predefined SVG path `d` attribute — stable, not random. */
  pathD: string;
  viewBox?: string;
  className?: string;
  /** ScrollTrigger trigger element; defaults to parent via ref walk. */
  triggerRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  /** Vertical mobile line uses a simpler stroke. */
  variant?: "desktop" | "mobile";
};

/**
 * Gold SVG stroke that draws progressively via ScrollTrigger stroke-dashoffset.
 * Lenis already calls ScrollTrigger.update — no extra sync needed here.
 */
export function TimelineConnector({
  pathD,
  viewBox = "0 0 100 1200",
  className,
  triggerRef,
  reducedMotion = false,
  variant = "desktop",
}: TimelineConnectorProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    if (reducedMotion) {
      path.style.strokeDashoffset = "0";
      return;
    }

    let ctx: gsap.Context | null = null;

    const setup = () => {
      ctx?.revert();
      ctx = null;

      // Skip when this track is CSS-hidden (paired mobile/desktop mounts)
      if (window.getComputedStyle(svg).display === "none") {
        return;
      }

      const triggerEl =
        triggerRef?.current ??
        svg.closest("[data-timeline-track]") ??
        svg.parentElement;

      if (!triggerEl) return;

      path.style.strokeDashoffset = `${length}`;

      ctx = gsap.context(() => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top 75%",
            end: "bottom 25%",
            scrub: GSAP_DEFAULTS.scrub,
          },
        });
      }, svg);
    };

    setup();

    const mql = window.matchMedia("(min-width: 768px)");
    mql.addEventListener("change", setup);

    return () => {
      mql.removeEventListener("change", setup);
      ctx?.revert();
    };
  }, [pathD, reducedMotion, triggerRef]);

  return (
    <svg
      ref={svgRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible",
        className,
      )}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient
          id={`timeline-gold-${gradientId}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="var(--soft-gold)" stopOpacity="0.35" />
          <stop offset="15%" stopColor="var(--luxury-gold)" stopOpacity="0.95" />
          <stop offset="85%" stopColor="var(--luxury-gold)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--dark-gold)" stopOpacity="0.4" />
        </linearGradient>
      </defs>

          {/* Soft under-glow track */}
      <path
        d={pathD}
        stroke="var(--luxury-gold)"
        strokeWidth={variant === "mobile" ? 2.5 : 4}
        strokeOpacity={0.18}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <path
        ref={pathRef}
        d={pathD}
        stroke={`url(#timeline-gold-${gradientId})`}
        strokeWidth={variant === "mobile" ? 2.75 : 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Stable desktop path — stays on the center column so cards meet the spine. */
export const DESKTOP_CONNECTOR_PATH =
  "M 50 0 C 50 80, 48 120, 48 180 C 48 260, 52 320, 52 400 C 52 480, 48 540, 48 620 C 48 700, 52 760, 52 840 C 52 920, 50 980, 50 1040 C 50 1100, 50 1160, 50 1200";

/** Straight vertical path for mobile. */
export const MOBILE_CONNECTOR_PATH = "M 12 0 L 12 1200";
