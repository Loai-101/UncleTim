import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StorytellingSlider } from "@/components/storytelling/StorytellingSlider";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Editorial storytelling showcase as a chapter slider — anchors “Legacy”.
 * TODO Phase 2: Replace placeholder stories with verified historical content.
 */
export async function StorytellingSection() {
  const t = await getTranslations("legacy");

  return (
    <section
      id={SECTION_IDS.legacy}
      className="relative overflow-hidden bg-ivory py-16 sm:py-20 lg:py-24"
      aria-label={t("title")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-30"
      />

      <Container className="relative z-[1] max-w-[1400px]">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            number="03"
            className="w-full max-w-none"
            subtitleClassName="max-w-none w-full"
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.08} className="mt-10 sm:mt-12 lg:mt-14">
          <StorytellingSlider />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
