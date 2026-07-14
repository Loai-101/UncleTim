import { cn } from "@/lib/utils";

type SectionNumberProps = {
  number: string;
  className?: string;
};

export function SectionNumber({ number, className }: SectionNumberProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none font-display text-[clamp(4rem,12vw,9rem)] font-medium leading-none tracking-tight text-luxury-gold/10",
        className,
      )}
    >
      {number}
    </span>
  );
}
