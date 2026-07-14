import { getTranslations } from "next-intl/server";
import { FeaturedSlider } from "@/features/featured-slider/components/FeaturedSlider";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FeaturedSliderSectionProps = {
  className?: string;
};

/**
 * Large featured image slider below the secondary navbar.
 * Intentionally separate from the compact hero banner.
 */
export async function FeaturedSliderSection({
  className,
}: FeaturedSliderSectionProps) {
  const t = await getTranslations("featuredSlider");

  return (
    <section
      id={SECTION_IDS.featured}
      className={cn("bg-warm-white py-8 sm:py-10 lg:py-12", className)}
      aria-label={t("title")}
    >
      <div className="featured-slider-shell">
        <FeaturedSlider />
      </div>
    </section>
  );
}
