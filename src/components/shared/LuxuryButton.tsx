"use client";

import { Loader2 } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "gold"
  | "goldOutline"
  | "whiteOutline"
  | "burgundy"
  | "textLink";

type ButtonSize = "sm" | "md" | "lg";

type LuxuryButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  /** Prefer a pre-rendered icon element so Server Components can pass icons safely. */
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const variantClasses: Record<ButtonVariant, string> = {
  gold: "border border-luxury-gold bg-luxury-gold text-burgundy hover:bg-soft-gold hover:border-soft-gold",
  goldOutline:
    "border border-luxury-gold bg-transparent text-luxury-gold hover:bg-luxury-gold/10",
  whiteOutline:
    "border border-pure-white/80 bg-transparent text-pure-white hover:border-luxury-gold hover:text-luxury-gold",
  burgundy:
    "border border-burgundy bg-burgundy text-ivory hover:bg-deep-red hover:border-deep-red",
  textLink:
    "border-transparent bg-transparent px-0 text-luxury-gold underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs tracking-[0.14em]",
  md: "px-5 py-2.5 text-sm tracking-[0.16em]",
  lg: "px-7 py-3.5 text-sm tracking-[0.18em]",
};

function isInternalHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

export function LuxuryButton({
  variant = "gold",
  size = "md",
  href,
  onClick,
  icon,
  iconPosition = "start",
  loading = false,
  disabled = false,
  children,
  className,
  id,
  type = "button",
}: LuxuryButtonProps) {
  const isDisabled = disabled || loading;

  const classes = cn(
    "inline-flex items-center justify-center rounded-sm font-medium uppercase transition-colors duration-300",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-luxury-gold",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    variant !== "textLink" && sizeClasses[size],
    variant === "textLink" && size === "sm" && "text-xs tracking-[0.14em]",
    variant === "textLink" && size === "md" && "text-sm tracking-[0.16em]",
    variant === "textLink" && size === "lg" && "text-base tracking-[0.18em]",
    className,
  );

  const iconNode = icon ? (
    <span className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
      {icon}
    </span>
  ) : null;

  const content = (
    <>
      {loading ? (
        <Loader2
          className="me-2 size-4 shrink-0 animate-spin"
          aria-hidden="true"
        />
      ) : (
        iconNode &&
        iconPosition === "start" && <span className="me-2">{iconNode}</span>
      )}
      <span>{children}</span>
      {!loading && iconNode && iconPosition === "end" ? (
        <span className="ms-2">{iconNode}</span>
      ) : null}
    </>
  );

  if (href && !isDisabled) {
    if (isInternalHref(href)) {
      return (
        <Link href={href} id={id} className={classes} onClick={onClick}>
          {content}
        </Link>
      );
    }

    return (
      <a
        id={id}
        href={href}
        className={classes}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
