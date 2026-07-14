import type { MetadataRoute } from "next";
import { certificates } from "@/data/certificates";
import { galleryImages } from "@/data/gallery";
import { newspapers } from "@/data/newspapers";
import { timelineEvents } from "@/data/timeline";
import { featuredSlides } from "@/features/featured-slider/data/featured-slider.data";
import { routing } from "@/i18n/routing";
import { SITE_LOGO } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo";

function collectImageUrls(): string[] {
  const urls = new Set<string>();

  const add = (url?: string) => {
    if (!url || url.includes("/placeholders/")) return;
    urls.add(url.startsWith("http") ? url : `${getSiteUrl()}${url}`);
  };

  add(SITE_LOGO);

  for (const slide of featuredSlides) add(slide.image);
  for (const image of galleryImages) add(image.src);
  for (const article of newspapers) add(article.coverImage);
  for (const cert of certificates) add(cert.image);
  for (const event of timelineEvents) {
    add(event.image);
    event.images?.forEach(add);
  }

  return Array.from(urls);
}

/**
 * Automatic sitemap with locale URLs + image sitemap entries.
 * Served at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const images = collectImageUrls();

  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    images,
    alternates: {
      languages: {
        "x-default": `${siteUrl}/${routing.defaultLocale}`,
        ...Object.fromEntries(
          routing.locales.map((code) => [code, `${siteUrl}/${code}`]),
        ),
      },
    },
  }));
}
