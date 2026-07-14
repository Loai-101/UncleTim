import { cn } from "@/lib/utils";

type GoldDividerVariant = "thin" | "medium" | "ornate";

type GoldDividerProps = {
  variant?: GoldDividerVariant;
  withDiamond?: boolean;
  className?: string;
};

const lineHeights: Record<GoldDividerVariant, string> = {
  thin: "h-px",
  medium: "h-[2px]",
  ornate: "h-[2px]",
};

export function GoldDivider({
  variant = "thin",
  withDiamond = false,
  className,
}: GoldDividerProps) {
  const showDiamond = withDiamond || variant === "ornate";

  return (
    <div
      role="separator"
      aria-hidden="true"
      className={cn("flex w-full items-center gap-3", className)}
    >
      <span
        className={cn(
          "block flex-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent",
          lineHeights[variant],
          variant === "ornate" && "via-soft-gold",
        )}
      />
      {showDiamond ? (
        <span
          className={cn(
            "shrink-0 rotate-45 border border-luxury-gold bg-luxury-gold/20",
            variant === "ornate" ? "size-2.5" : "size-1.5",
          )}
        />
      ) : null}
      {showDiamond ? (
        <span
          className={cn(
            "block flex-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent",
            lineHeights[variant],
            variant === "ornate" && "via-soft-gold",
          )}
        />
      ) : null}
    </div>
  );
}
