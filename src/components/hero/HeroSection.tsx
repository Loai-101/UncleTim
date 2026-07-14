"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroOverlay } from "@/components/hero/HeroOverlay";
import { heroSlides } from "@/data/hero";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  className?: string;
};

/**
 * Compact luxury hero banner — visual introduction only (not full-viewport).
 */
export function HeroSection({ className }: HeroSectionProps) {
  const t = useTranslations("hero");
  const tMeta = useTranslations("metadata");
  const banner = heroSlides[0];

  return (
    <section
      id={SECTION_IDS.home}
      className={cn("hero-section bg-burgundy", className)}
      aria-label={t("title")}
    >
      <Image
        src={banner.image}
        alt={tMeta("heroImageAlt")}
        fill
        priority
        sizes="100vw"
        className="hero-banner-image"
      />
      <HeroOverlay />

      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-7">
          <p className="eyebrow-label mb-1.5 text-[0.65rem] tracking-[0.2em] text-luxury-gold sm:mb-2 sm:text-xs">
            {t("eyebrow")}
          </p>
          <h1 className="hero-name font-display text-2xl leading-tight text-white sm:text-3xl lg:text-[2.15rem]">
            {t("title")}
          </h1>
          <p className="hero-nickname mt-1 font-display text-sm text-white sm:text-base">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
