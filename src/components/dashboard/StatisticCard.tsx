"use client";

import type { LucideIcon } from "lucide-react";
import {
  Award,
  Calendar,
  Clock,
  Crown,
  Globe,
  MapPin,
  Medal,
  Shield,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { cn } from "@/lib/utils";
import type { Statistic } from "@/types/content";

const ICON_MAP: Record<string, LucideIcon> = {
  clock: Clock,
  calendar: Calendar,
  award: Award,
  shield: Shield,
  crown: Crown,
  trophy: Trophy,
  globe: Globe,
  medal: Medal,
  mappin: MapPin,
};

type StatisticCardProps = {
  statistic: Statistic;
  className?: string;
  span?: string;
  compact?: boolean;
};

/**
 * Ivory editorial stat card with gold trim, icon, and animated counter.
 */
export function StatisticCard({
  statistic,
  className,
  span,
  compact = false,
}: StatisticCardProps) {
  const t = useTranslations("dashboard");
  const Icon = ICON_MAP[statistic.icon.toLowerCase()] ?? Award;

  const labelKeys = [
    "yearsExperience",
    "milestones",
    "intlCerts",
    "regionalCerts",
    "royalEvents",
    "championships",
    "countries",
    "horsesTrained",
  ] as const;

  type DashboardStatKey = (typeof labelKeys)[number];
  const isStatKey = (key: string): key is DashboardStatKey =>
    (labelKeys as readonly string[]).includes(key);

  const label = isStatKey(statistic.key) ? t(statistic.key) : statistic.label;
  const descKey = `${statistic.key}Desc`;
  const description = t.has(descKey) ? t(descKey) : statistic.description;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-sm border border-border-gold bg-ivory",
        "shadow-[0_1px_0_rgba(212,175,55,0.12)] transition-[transform,box-shadow] duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(212,175,55,0.35)]",
        compact ? "p-3.5 sm:p-4" : "p-6 sm:p-7",
        span,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pattern-horse-lines pointer-events-none absolute inset-0 opacity-60"
      />

      <div
        className={cn(
          "relative z-[1] flex flex-col",
          compact ? "gap-2.5" : "gap-4",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex items-center justify-center rounded-sm border border-border-gold bg-warm-white/80 text-luxury-gold transition-colors duration-300 group-hover:border-luxury-gold/60 group-hover:text-dark-gold",
              compact ? "size-8" : "size-11",
            )}
          >
            <Icon
              className={compact ? "size-3.5" : "size-5"}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        </div>

        <AnimatedCounter
          end={statistic.value}
          suffix={statistic.suffix}
          prefix={statistic.prefix}
          duration={2.2}
          className={
            compact
              ? "font-display !text-2xl !leading-none tracking-tight text-royal-red sm:!text-[1.65rem] xl:!text-[1.75rem]"
              : undefined
          }
        />

        <div>
          <h3
            className={cn(
              "font-display leading-snug text-burgundy",
              compact ? "text-sm sm:text-[0.95rem]" : "text-lg sm:text-xl",
            )}
          >
            {label}
          </h3>
          <p
            className={cn(
              "text-muted-text",
              compact
                ? "mt-1.5 line-clamp-3 text-[0.65rem] leading-relaxed"
                : "mt-2 text-sm leading-relaxed",
            )}
          >
            {description}
          </p>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-start scale-x-0 bg-gradient-to-r from-transparent via-luxury-gold to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </article>
  );
}
