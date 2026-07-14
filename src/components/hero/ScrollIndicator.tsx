"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ScrollIndicatorProps = {
  className?: string;
};

/**
 * Subtle gold chevron inviting the visitor to scroll past the hero.
 */
export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();

  return (
    <a
      href={`#${SECTION_IDS.biography}`}
      className={cn(
        "group absolute bottom-8 start-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2",
        "text-luxury-gold/80 transition-colors hover:text-soft-gold",
        className,
      )}
      aria-label={t("scroll")}
    >
      <span className="eyebrow-label text-[0.65rem] text-luxury-gold/70">
        {t("scroll")}
      </span>
      <ChevronDown
        className={cn(
          "size-5 text-luxury-gold",
          !prefersReduced && "animate-hero-scroll-bounce",
        )}
        aria-hidden="true"
        strokeWidth={1.5}
      />
    </a>
  );
}
