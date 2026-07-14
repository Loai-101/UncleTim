import type { AppLocale } from "@/i18n/routing";
import { galleryImages } from "@/data/gallery";
import { newspapers } from "@/data/newspapers";
import { timelineEvents } from "@/data/timeline";
import { featuredSlides } from "@/features/featured-slider/data/featured-slider.data";
import { certificates } from "@/data/certificates";
import { SITE_LOGO } from "@/lib/constants";
import {
  getLocalePath,
  getSiteUrl,
  SEO_OG_IMAGE,
  SEO_ORGANIZATION,
  SEO_PERSON,
} from "@/lib/seo";

type JsonLd = Record<string, unknown>;

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = getSiteUrl();
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function buildPersonSchema(locale: AppLocale): JsonLd {
  return {
    "@type": "Person",
    "@id": `${getLocalePath(locale)}#person`,
    name: SEO_PERSON.name,
    alternateName: [...SEO_PERSON.alternateNames],
    jobTitle: SEO_PERSON.jobTitle,
    description: SEO_PERSON.description,
    nationality: SEO_PERSON.nationality,
    homeLocation: {
      "@type": "Place",
      name: SEO_PERSON.homeLocation,
    },
    image: absoluteUrl(SEO_PERSON.image),
    url: getLocalePath(locale),
    knowsAbout: [
      "Endurance riding",
      "Equestrian sports",
      "Arabian horses",
      "Bahrain Royal Endurance Team",
      "Horse training",
    ],
  };
}

export function buildOrganizationSchema(locale: AppLocale): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: SEO_ORGANIZATION.name,
    legalName: SEO_ORGANIZATION.legalName,
    alternateName: SEO_ORGANIZATION.alternateName,
    description: SEO_ORGANIZATION.description,
    url: getLocalePath(locale),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(SEO_ORGANIZATION.logo),
    },
    image: absoluteUrl(SEO_OG_IMAGE.url),
    email: SEO_ORGANIZATION.email,
    telephone: SEO_ORGANIZATION.telephone,
    areaServed: {
      "@type": "Country",
      name: "Bahrain",
    },
    founder: { "@id": `${getLocalePath(locale)}#person` },
  };
}

export function buildWebsiteSchema(
  locale: AppLocale,
  siteName: string,
  description: string,
): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${getLocalePath(locale)}#website`,
    name: siteName,
    description,
    url: getLocalePath(locale),
    inLanguage: locale,
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    about: { "@id": `${getLocalePath(locale)}#person` },
    image: absoluteUrl(SEO_OG_IMAGE.url),
  };
}

export function buildBreadcrumbSchema(
  locale: AppLocale,
  items: { name: string; path?: string }[],
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    "@id": `${getLocalePath(locale)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getLocalePath(locale, item.path ?? ""),
    })),
  };
}

export function buildImageObjectSchemas(locale: AppLocale): JsonLd[] {
  const seen = new Set<string>();
  const objects: JsonLd[] = [];

  const push = (url: string, name: string, description: string) => {
    const abs = absoluteUrl(url);
    if (seen.has(abs) || abs.includes("/placeholders/")) return;
    seen.add(abs);
    objects.push({
      "@type": "ImageObject",
      contentUrl: abs,
      url: abs,
      name,
      description,
      inLanguage: locale,
      creditText: SEO_PERSON.name,
      creator: { "@id": `${getLocalePath(locale)}#person` },
    });
  };

  push(
    SITE_LOGO,
    `${SEO_PERSON.name} — Uncle Tim`,
    "Portrait of Abdulrahman Al Bastaki (Uncle Tim), Bahraini endurance horse trainer",
  );

  for (const slide of featuredSlides) {
    push(
      slide.image,
      `Featured archive — ${slide.id}`,
      "Featured archive photograph from Abdulrahman Al Bastaki equestrian legacy",
    );
  }

  for (const image of galleryImages) {
    push(
      image.src,
      image.title ?? image.id,
      image.alt ||
        "Archive photograph from Bahrain equestrian heritage — Abdulrahman Al Bastaki",
    );
  }

  for (const article of newspapers) {
    push(
      article.coverImage,
      article.title,
      article.coverImageAlt ||
        "Press archive cover — Featured Through the Years",
    );
  }

  for (const cert of certificates) {
    push(cert.image, cert.title, cert.imageAlt);
  }

  for (const event of timelineEvents) {
    const urls = event.images?.length ? event.images : [event.image];
    for (const url of urls) {
      push(
        url,
        event.title,
        event.imageAlt ||
          `Historical archive — ${event.title} | Abdulrahman Al Bastaki`,
      );
    }
  }

  return objects;
}

export function buildArticleSchemas(locale: AppLocale): JsonLd[] {
  return timelineEvents.map((event) => ({
    "@type": "Article",
    "@id": `${getLocalePath(locale)}#${event.id}`,
    headline: event.title,
    description: event.description,
    datePublished: event.year.length === 4 ? `${event.year}-01-01` : undefined,
    inLanguage: locale,
    image: absoluteUrl(event.image),
    author: { "@id": `${getLocalePath(locale)}#person` },
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    about: [
      { "@id": `${getLocalePath(locale)}#person` },
      {
        "@type": "Thing",
        name: event.category ?? "Bahrain Equestrian Heritage",
      },
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getLocalePath(locale, `#${event.id}`),
    },
  }));
}

export function buildPageJsonLd(options: {
  locale: AppLocale;
  siteName: string;
  description: string;
  breadcrumbNames: string[];
}): JsonLd {
  const { locale, siteName, description, breadcrumbNames } = options;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildPersonSchema(locale),
      buildOrganizationSchema(locale),
      buildWebsiteSchema(locale, siteName, description),
      buildBreadcrumbSchema(
        locale,
        breadcrumbNames.map((name, index) => ({
          name,
          path: index === 0 ? "" : undefined,
        })),
      ),
      ...buildImageObjectSchemas(locale).slice(0, 80),
      ...buildArticleSchemas(locale),
    ],
  };
}
