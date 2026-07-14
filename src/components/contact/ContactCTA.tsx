import { Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { GoldDivider } from "@/components/shared/GoldDivider";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { QuoteBlock } from "@/components/storytelling/QuoteBlock";
import { CONTACT, SECTION_IDS } from "@/lib/constants";

/**
 * Contact / digital archive credit — PMI IT Solutions.
 */
export async function ContactCTA() {
  const t = await getTranslations("contact");
  const whatsappHref = CONTACT.whatsapp
    ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`
    : undefined;

  return (
    <section
      id={SECTION_IDS.contact}
      className="relative overflow-hidden bg-royal-red py-20 sm:py-24 lg:py-28"
      aria-label={t("title")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 top-0 size-80 rounded-full bg-luxury-gold/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-16 bottom-0 size-64 rounded-full bg-burgundy/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-12 mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-luxury-gold/25 to-transparent"
      />

      <Container className="relative z-[1]">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow-label mb-4 text-luxury-gold">{t("eyebrow")}</p>
            <h2 className="font-display text-4xl leading-tight text-pure-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
            <div className="mx-auto mt-6 max-w-xs">
              <GoldDivider variant="ornate" withDiamond />
            </div>
            <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-ivory/80 sm:text-lg">
              {t("subtitle")}
            </p>
            <QuoteBlock
              quote={t("quote")}
              className="mx-auto mt-8 max-w-2xl border-luxury-gold/50 text-start [&_.quote-text]:text-ivory/90"
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-5 sm:mt-14">
            <p className="text-[0.7rem] tracking-[0.2em] text-luxury-gold uppercase">
              {t("contactInfo")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                aria-label={`${t("phoneLabel")}: ${CONTACT.phone}`}
                className="inline-flex size-12 items-center justify-center border border-luxury-gold/50 text-luxury-gold transition-colors hover:border-luxury-gold hover:bg-burgundy/30 hover:text-soft-gold sm:size-14"
              >
                <Phone className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                aria-label={`${t("emailLabel")}: ${CONTACT.email}`}
                className="inline-flex size-12 items-center justify-center border border-luxury-gold bg-luxury-gold text-burgundy transition-colors hover:bg-soft-gold sm:size-14"
              >
                <Mail className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </a>

              {CONTACT.website ? (
                <a
                  href={CONTACT.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("websiteLabel")}: ${CONTACT.websiteLabel ?? CONTACT.website}`}
                  className="inline-flex size-12 items-center justify-center border border-luxury-gold/50 text-luxury-gold transition-colors hover:border-luxury-gold hover:bg-burgundy/30 hover:text-soft-gold sm:size-14"
                >
                  <Globe className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </a>
              ) : null}

              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("whatsapp")}
                  className="inline-flex size-12 items-center justify-center border border-ivory/50 text-ivory transition-colors hover:border-luxury-gold hover:bg-burgundy/30 hover:text-luxury-gold sm:size-14"
                >
                  <MessageCircle className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </RevealOnScroll>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent"
      />
    </section>
  );
}
