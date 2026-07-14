import { StatisticCard } from "@/components/dashboard/StatisticCard";
import { Container } from "@/components/shared/Container";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { statistics } from "@/data/statistics";
import { SECTION_IDS } from "@/lib/constants";
import { getTranslations } from "next-intl/server";

/**
 * Legacy-at-a-glance biography overview — all stats in one horizontal row.
 */
export async function LegacyDashboard() {
  const t = await getTranslations("dashboard");

  return (
    <section
      id={SECTION_IDS.biography}
      className="relative overflow-hidden bg-warm-white py-16 sm:py-20 lg:py-24"
      aria-label={t("title")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 end-0 size-72 rounded-full bg-luxury-gold/5 blur-3xl"
      />

      <Container className="relative z-[1] max-w-[1800px]">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            number="01"
            align="center"
            className="w-full max-w-none"
            subtitleClassName="max-w-none w-full"
          />
        </RevealOnScroll>

        <div className="mt-10 -mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
          <div className="flex min-w-max gap-3 lg:grid lg:min-w-0 lg:grid-cols-8 lg:gap-3 xl:gap-4">
            {statistics.map((statistic, index) => (
              <RevealOnScroll
                key={statistic.id}
                delay={Math.min(index * 0.05, 0.35)}
                className="w-[9.5rem] shrink-0 sm:w-[10.5rem] lg:w-auto lg:min-w-0"
              >
                <StatisticCard statistic={statistic} className="h-full" compact />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
