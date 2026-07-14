import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en", "fr"],
  defaultLocale: "ar",
  localePrefix: "always",
  // Always open Arabic on first visit — do not follow browser Accept-Language / cookie
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
