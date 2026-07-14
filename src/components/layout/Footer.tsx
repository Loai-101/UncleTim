import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SocialIcon } from "@/components/layout/SocialIcons";
import { navigationItems } from "@/data/navigation";
import {
  CONTACT,
  SITE_LOGO,
  SITE_SHORT_NAME,
  SOCIAL,
  SECTION_IDS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const socialLinks = [
  { href: SOCIAL.instagram, label: "Instagram", network: "instagram" as const },
  { href: SOCIAL.facebook, label: "Facebook", network: "facebook" as const },
  { href: SOCIAL.youtube, label: "YouTube", network: "youtube" as const },
  { href: SOCIAL.twitter, label: "X", network: "twitter" as const },
];

const QUICK_SECTION_IDS: ReadonlySet<string> = new Set([
  SECTION_IDS.home,
  SECTION_IDS.featured,
  SECTION_IDS.biography,
  SECTION_IDS.timeline,
  SECTION_IDS.legacy,
  SECTION_IDS.contact,
]);

const ARCHIVE_SECTION_IDS: ReadonlySet<string> = new Set([
  SECTION_IDS.gallery,
  SECTION_IDS.newspapers,
  SECTION_IDS.certifications,
  SECTION_IDS.royalConnections,
]);

export interface FooterProps {
  className?: string;
}

/**
 * Site footer — deep burgundy, gold accents, quick/archive links, contact.
 * Server component with client LanguageSwitcher.
 */
export async function Footer({ className }: FooterProps) {
  const tNav = await getTranslations("navigation");
  const tFooter = await getTranslations("footer");
  const tContact = await getTranslations("contact");
  const year = new Date().getFullYear();

  const quickLinks = navigationItems.filter((item) =>
    QUICK_SECTION_IDS.has(item.sectionId),
  );
  const archiveLinks = navigationItems.filter((item) =>
    ARCHIVE_SECTION_IDS.has(item.sectionId),
  );

  return (
    <footer
      className={cn(
        "relative overflow-hidden bg-burgundy text-ivory",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src={SITE_LOGO}
                alt={SITE_SHORT_NAME}
                width={56}
                height={56}
                className="size-14 shrink-0 object-contain"
              />
              <div>
                <p className="font-display text-xl tracking-wide text-ivory">
                  {SITE_SHORT_NAME}
                </p>
                <p className="text-[0.65rem] tracking-[0.2em] text-luxury-gold/80 uppercase">
                  {tFooter("tagline")}
                </p>
              </div>
            </div>
            <p className="max-w-sm whitespace-pre-line text-sm leading-relaxed text-ivory/70">
              {tFooter("biography")}
            </p>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-[0.6875rem] font-medium tracking-[0.22em] text-luxury-gold uppercase">
              {tFooter("quickLinks")}
            </h2>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-sm text-ivory/75 transition-colors hover:text-soft-gold"
                  >
                    {tNav(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Archive links */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-[0.6875rem] font-medium tracking-[0.22em] text-luxury-gold uppercase">
              {tFooter("archiveLinks")}
            </h2>
            <ul className="space-y-2.5">
              {archiveLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-sm text-ivory/75 transition-colors hover:text-soft-gold"
                  >
                    {tNav(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + social */}
          <div className="space-y-6 lg:col-span-4">
            <div>
              <h2 className="mb-4 text-[0.6875rem] font-medium tracking-[0.22em] text-luxury-gold uppercase">
                {tNav("contact")}
              </h2>
              <ul className="space-y-2.5 text-sm text-ivory/75">
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-soft-gold"
                  >
                    <Mail
                      className="size-3.5 shrink-0 text-luxury-gold"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span>
                      <span className="sr-only">{tContact("emailLabel")}: </span>
                      {CONTACT.email}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-soft-gold"
                  >
                    <Phone
                      className="size-3.5 shrink-0 text-luxury-gold"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span>
                      <span className="sr-only">{tContact("phoneLabel")}: </span>
                      {CONTACT.phone}
                    </span>
                  </a>
                </li>
                {CONTACT.website && (
                  <li>
                    <a
                      href={CONTACT.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-soft-gold"
                    >
                      <MapPin
                        className="size-3.5 shrink-0 text-luxury-gold"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span>
                        <span className="sr-only">
                          {tContact("websiteLabel")}:{" "}
                        </span>
                        {CONTACT.websiteLabel ?? CONTACT.website}
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-[0.6875rem] font-medium tracking-[0.22em] text-luxury-gold uppercase">
                {tFooter("follow")}
              </h2>
              <ul className="flex items-center gap-3">
                {socialLinks.map(({ href, label, network }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={label}
                      className="inline-flex size-9 items-center justify-center border border-luxury-gold/35 text-luxury-gold transition-colors hover:border-luxury-gold hover:bg-deep-red hover:text-soft-gold"
                    >
                      <SocialIcon network={network} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <LanguageSwitcher variant="on-dark" />
          </div>
        </div>

        <div className="gold-divider my-10" />

        <div className="flex flex-col gap-3 text-xs tracking-wide text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_SHORT_NAME}. {tFooter("rights")}
          </p>
          <p>
            {tFooter("developerPrefix")}
            <a
              href={CONTACT.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit no-underline"
            >
              {CONTACT.websiteLabel}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
