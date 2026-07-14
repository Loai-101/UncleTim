import { routing, type AppLocale } from "@/i18n/routing";
import { CONTACT, SITE_LOGO, SITE_NAME, SITE_SHORT_NAME } from "@/lib/constants";

/** Canonical production origin — used for SEO, sitemap, OG, schema, hreflang. */
export const SITE_URL = "https://uncletim.horse" as const;

/**
 * Always returns the production domain for SEO/sitemap/schema.
 * Preview and local hosts are never emitted in crawler-facing URLs.
 */
export function getSiteUrl(): string {
  return SITE_URL;
}

export function getLocalePath(locale: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${getSiteUrl()}/${locale}${normalized}`;
}

export const SEO_PERSON = {
  name: "Abdulrahman Al Bastaki",
  alternateNames: [
    "Abdulrahman Albastaki",
    "Abdulrahman Al-Bastaki",
    "Uncle Tim",
    "العم تيم",
    "عبدالرحمن البستكي",
  ],
  jobTitle: "Endurance Horse Trainer and Groom",
  description:
    "Abdulrahman Al Bastaki, known as Uncle Tim, is a Bahraini endurance horse trainer and groom whose legacy spans decades with the Bahrain Royal Endurance Team.",
  nationality: "Bahraini",
  homeLocation: "Kingdom of Bahrain",
  image: SITE_LOGO,
} as const;

export const SEO_ORGANIZATION = {
  name: "Abdulrahman Al Bastaki — Uncle Tim Digital Museum",
  legalName: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  description:
    "A digital museum preserving the Bahraini equestrian heritage and endurance riding legacy of Abdulrahman Al Bastaki (Uncle Tim).",
  logo: SITE_LOGO,
  email: CONTACT.email,
  telephone: CONTACT.phone,
} as const;

/** Primary OG / Twitter share image (portrait-friendly Cloudinary asset). */
export const SEO_OG_IMAGE = {
  url: SITE_LOGO,
  width: 1200,
  height: 1200,
  alt: "Abdulrahman Al Bastaki — Uncle Tim | Bahrain Equestrian Heritage",
} as const;

export const PRIMARY_KEYWORDS: Record<AppLocale, string[]> = {
  ar: [
    "عبدالرحمن البستكي",
    "العم تيم",
    "الفروسية البحرينية",
    "رياضة القدرة البحرين",
    "تاريخ الفروسية البحرين",
    "الخيل العربية",
    "عبدالرحمن البستكي البحرين",
    "فريق البحرين الملكي لسباقات القدرة",
  ],
  en: [
    "Abdulrahman Al Bastaki",
    "Abdulrahman Albastaki",
    "Abdulrahman Al-Bastaki",
    "Uncle Tim Bahrain",
    "Bahrain Endurance Riding",
    "Bahrain Equestrian Heritage",
    "Bahraini Horse Trainer",
    "Royal Endurance Team Bahrain",
    "Uncle Tim",
    "Abdulrahman Al Bastaki Bahrain",
  ],
  fr: [
    "Abdulrahman Al Bastaki",
    "Patrimoine Équestre de Bahreïn",
    "Endurance Équestre Bahreïn",
    "Musée Équestre Numérique",
    "Cavalier Bahreïn",
    "Oncle Tim",
    "Abdulrahman Albastaki",
  ],
};

export const OG_LOCALE: Record<AppLocale, string> = {
  ar: "ar_BH",
  en: "en_US",
  fr: "fr_FR",
};

/** Absolute hreflang / alternate language URLs for the production domain. */
export function buildLanguageAlternates(path = ""): Record<string, string> {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  const base = getSiteUrl();
  const languages: Record<string, string> = {
    "x-default": `${base}/${routing.defaultLocale}${normalized}`,
  };
  for (const locale of routing.locales) {
    languages[locale] = `${base}/${locale}${normalized}`;
  }
  return languages;
}

export function isAppLocale(locale: string): locale is AppLocale {
  return (routing.locales as readonly string[]).includes(locale);
}
