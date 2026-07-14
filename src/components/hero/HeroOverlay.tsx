import { cn } from "@/lib/utils";

type HeroOverlayProps = {
  className?: string;
};

/**
 * Cinematic dark-red wash with a soft gold vignette over hero media.
 */
export function HeroOverlay({ className }: HeroOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-burgundy/45 via-deep-red/25 to-burgundy/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-burgundy/30 via-transparent to-deep-red/25" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212, 175, 55, 0.12) 0%, transparent 65%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-burgundy/75 to-transparent" />
    </div>
  );
}
