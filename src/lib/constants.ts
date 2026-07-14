import type { ContactInfo } from "@/types/content";

export const SITE_NAME = "Abdulrahman Al Bastaki — Uncle Tim";
export const SITE_SHORT_NAME = "Uncle Tim";
export const SITE_MONOGRAM = "UT";
export const SITE_LOGO =
  "https://res.cloudinary.com/dvybb2xnc/image/upload/e_background_removal/e_trim/f_png/v1783944409/WhatsApp_Image_2026-07-13_at_3.03.51_PM_jwjtxm.jpg";

export const LOCALES = ["ar", "en", "fr"] as const;
export type LocaleCode = (typeof LOCALES)[number];

export const SECTION_IDS = {
  home: "home",
  featured: "featured",
  biography: "biography",
  timeline: "timeline",
  legacy: "legacy",
  gallery: "gallery",
  newspapers: "newspapers",
  certifications: "certifications",
  royalConnections: "royal-connections",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const CONTACT: ContactInfo = {
  email: "it.solutions@pmigroup.me",
  phone: "+973 3200 9540",
  whatsapp: "+97332009540",
  website: "https://it-solutions.pmi-me.net/",
  websiteLabel: "PMI IT Solutions",
};
