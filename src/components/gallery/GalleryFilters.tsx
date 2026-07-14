"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { DURATION, EASING } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { GalleryCategory } from "@/types/gallery";

export type GalleryFilterValue = "all" | GalleryCategory;

type GalleryFiltersProps = {
  active: GalleryFilterValue;
  onChange: (value: GalleryFilterValue) => void;
  className?: string;
};

const FILTERS: { value: GalleryFilterValue; labelKey: string }[] = [
  { value: "all", labelKey: "filterAll" },
  { value: "royal", labelKey: "filterRoyal" },
  { value: "training", labelKey: "filterTraining" },
  { value: "championships", labelKey: "filterChampionships" },
  { value: "historical", labelKey: "filterHistorical" },
  { value: "international", labelKey: "filterInternational" },
  { value: "personal", labelKey: "filterPersonal" },
];

/**
 * Category tabs with animated gold underline for the active filter.
 */
export function GalleryFilters({
  active,
  onChange,
  className,
}: GalleryFiltersProps) {
  const t = useTranslations("gallery");

  return (
    <div
      role="tablist"
      aria-label={t("title")}
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-border-gold pb-px",
        className,
      )}
    >
      {FILTERS.map((filter) => {
        const isActive = active === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={cn(
              "relative px-3 py-2.5 text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-300 sm:px-4",
              isActive
                ? "text-burgundy"
                : "text-muted-text hover:text-burgundy",
            )}
          >
            {t(filter.labelKey as Parameters<typeof t>[0])}
            {isActive ? (
              <motion.span
                layoutId="gallery-filter-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 bg-luxury-gold"
                transition={{ duration: DURATION.fast, ease: EASING.elegant }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
