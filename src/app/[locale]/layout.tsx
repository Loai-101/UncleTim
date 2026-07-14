import {
  Aref_Ruqaa,
  Aref_Ruqaa_Ink,
  Cormorant_Garamond,
  IBM_Plex_Sans_Arabic,
  Inter,
  Playfair_Display,
} from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { Footer } from "@/components/layout/Footer";
import { TopContactBar } from "@/components/layout/TopContactBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type AppLocale } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants";
import { getDirection } from "@/lib/i18n";
import {
  buildLanguageAlternates,
  getSiteUrl,
  isAppLocale,
  OG_LOCALE,
  PRIMARY_KEYWORDS,
  SEO_OG_IMAGE,
  SEO_PERSON,
} from "@/lib/seo";
import { buildPageJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/** English titles — luxury editorial / museum */
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

/** French titles — European heritage */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

/** English & French body */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/** Arabic titles — traditional royal calligraphy */
const arefRuqaaInk = Aref_Ruqaa_Ink({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

/** Arabic hero name only — solid fill so white color works on dark banner */
const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa-solid",
  display: "swap",
});

/** Arabic body — premium readable heritage */
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#3a000c" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: AppLocale = isAppLocale(localeParam)
    ? localeParam
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const title = t("title");
  const description = t("description");
  const siteUrl = getSiteUrl();
  const keywords = [
    ...PRIMARY_KEYWORDS[locale],
    ...t("keywords")
      .split(/[,،]/)
      .map((keyword) => keyword.trim())
      .filter(Boolean),
  ];

  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(siteUrl),
    // Absolute title — use the locale metadata string as-is (browser tab + crawlers)
    title: {
      absolute: title,
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: Array.from(new Set(keywords)),
    authors: [{ name: SEO_PERSON.name, url: `${siteUrl}/${locale}` }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Equestrian Heritage",
    applicationName: title,
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.png", type: "image/png", sizes: "48x48" },
        { url: "/icon.png", type: "image/png", sizes: "48x48" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
      ],
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => OG_LOCALE[code]),
      url: `/${locale}`,
      title: t("ogTitle"),
      description: t("ogDescription"),
      siteName: title,
      images: [
        {
          url: SEO_OG_IMAGE.url,
          width: SEO_OG_IMAGE.width,
          height: SEO_OG_IMAGE.height,
          alt: SEO_OG_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: SEO_OG_IMAGE.url,
          alt: SEO_OG_IMAGE.alt,
        },
      ],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: buildLanguageAlternates(),
    },
    verification: googleVerification
      ? { google: googleVerification }
      : undefined,
    other: {
      "geo.region": "BH",
      "geo.placename": "Kingdom of Bahrain",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = getDirection(locale);
  const tNav = await getTranslations({ locale, namespace: "navigation" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  const appLocale: AppLocale = isAppLocale(locale)
    ? locale
    : routing.defaultLocale;

  const jsonLd = buildPageJsonLd({
    locale: appLocale,
    siteName: tMeta("title"),
    description: tMeta("description"),
    breadcrumbNames: [tMeta("breadcrumbHome")],
  });

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn(
        playfair.variable,
        cormorant.variable,
        inter.variable,
        arefRuqaaInk.variable,
        arefRuqaa.variable,
        ibmPlexArabic.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body
        className={cn(
          "min-h-svh bg-warm-white text-charcoal antialiased",
          locale === "ar" ? "font-arabic-body" : "font-body",
        )}
        suppressHydrationWarning
      >
        <JsonLd data={jsonLd} />
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-burgundy focus:px-4 focus:py-2 focus:text-ivory focus:outline-none"
            >
              {tNav("skipToContent")}
            </a>
            <TopContactBar />
            {children}
            <Footer />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
