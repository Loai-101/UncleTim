"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_CODES: Record<AppLocale, string> = {
  en: "EN",
  ar: "AR",
  fr: "FR",
};

export type LanguageSwitcherVariant = "on-dark" | "on-light";

export interface LanguageSwitcherProps {
  className?: string;
  variant?: LanguageSwitcherVariant;
}

/**
 * Compact locale switcher (EN | AR | FR). Active locale in gold.
 * Uses next-intl navigation to replace locale while keeping the path;
 * middleware persists preference via cookie.
 */
export function LanguageSwitcher({
  className,
  variant = "on-dark",
}: LanguageSwitcherProps) {
  const t = useTranslations("navigation");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: AppLocale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      role="listbox"
      aria-label={t("language")}
      aria-orientation="horizontal"
      data-pending={isPending || undefined}
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.6875rem] font-medium tracking-[0.18em] uppercase",
        isPending && "pointer-events-none opacity-70",
        className,
      )}
    >
      {routing.locales.map((code, index) => {
        const isActive = code === locale;
        return (
          <span key={code} className="inline-flex items-center gap-1.5">
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  "select-none",
                  variant === "on-dark"
                    ? "text-ivory/35"
                    : "text-burgundy/30",
                )}
              >
                |
              </span>
            )}
            <button
              type="button"
              role="option"
              aria-selected={isActive}
              aria-current={isActive ? "true" : undefined}
              onClick={() => switchLocale(code)}
              className={cn(
                "rounded-sm px-0.5 py-0.5 transition-colors duration-300",
                isActive
                  ? "text-luxury-gold"
                  : variant === "on-dark"
                    ? "text-ivory/65 hover:text-soft-gold"
                    : "text-burgundy/55 hover:text-burgundy",
              )}
            >
              {LOCALE_CODES[code]}
            </button>
          </span>
        );
      })}
    </div>
  );
}
