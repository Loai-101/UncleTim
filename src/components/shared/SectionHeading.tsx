import { GoldDivider } from "@/components/shared/GoldDivider";
import { SectionNumber } from "@/components/shared/SectionNumber";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
  subtitleClassName?: string;
  number?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  className,
  subtitleClassName,
  number,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "relative",
        isCentered ? "mx-auto text-center" : "text-start",
        className,
      )}
    >
      {number ? (
        <SectionNumber
          number={number}
          className={cn(
            "absolute -top-6 opacity-100",
            isCentered ? "start-1/2 -translate-x-1/2" : "start-0",
          )}
        />
      ) : null}

      {eyebrow ? (
        <p className={cn("eyebrow-label mb-3", isCentered && "mx-auto")}>
          {eyebrow}
        </p>
      ) : null}

      <h2 className="section-title relative z-10">{title}</h2>

      <div
        className={cn(
          "mt-5",
          isCentered ? "mx-auto max-w-xs" : "max-w-[12rem]",
        )}
      >
        <GoldDivider variant="thin" withDiamond={isCentered} />
      </div>

      {subtitle ? (
        <p
          className={cn(
            "section-subtitle mt-5",
            isCentered && "mx-auto",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
