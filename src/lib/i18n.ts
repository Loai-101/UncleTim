import type { AppLocale } from "@/i18n/routing";
import { LOCALES, type LocaleCode } from "@/lib/constants";

const RTL_LOCALES: readonly LocaleCode[] = ["ar"];

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

export const LOCALE_NATIVE_NAMES: Record<LocaleCode, string> = {
  en: "EN",
  ar: "ع",
  fr: "FR",
};

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale as LocaleCode);
}

export function getDirection(locale: string): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export function getLocaleLabel(locale: string): string {
  if (isValidLocale(locale)) {
    return LOCALE_LABELS[locale];
  }
  return locale;
}

export function isValidLocale(locale: string): locale is AppLocale {
  return (LOCALES as readonly string[]).includes(locale);
}
