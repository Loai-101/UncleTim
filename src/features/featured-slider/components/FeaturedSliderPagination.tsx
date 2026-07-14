import { cn } from "@/lib/utils";

type FeaturedSliderPaginationProps = {
  className?: string;
};

/**
 * Mount point for Swiper pagination bullets.
 * Swiper injects bullets into the element with class `featured-slider-pagination`.
 */
export function FeaturedSliderPagination({
  className,
}: FeaturedSliderPaginationProps) {
  return (
    <div
      className={cn("featured-slider-pagination", className)}
      aria-hidden="false"
    />
  );
}
