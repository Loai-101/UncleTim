import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RoyalFrameProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const cornerBase =
  "pointer-events-none absolute z-10 size-5 border-luxury-gold sm:size-6";

export function RoyalFrame({
  children,
  className,
  contentClassName,
}: RoyalFrameProps) {
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className={cn(cornerBase, "start-0 top-0 border-s border-t")}
      />
      <span
        aria-hidden="true"
        className={cn(cornerBase, "end-0 top-0 border-e border-t")}
      />
      <span
        aria-hidden="true"
        className={cn(cornerBase, "bottom-0 start-0 border-s border-b")}
      />
      <span
        aria-hidden="true"
        className={cn(cornerBase, "bottom-0 end-0 border-e border-b")}
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}
