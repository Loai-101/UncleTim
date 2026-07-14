import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { GoldDivider } from "@/components/shared/GoldDivider";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { RoyalFrame } from "@/components/shared/RoyalFrame";
import { QuoteBlock } from "@/components/storytelling/QuoteBlock";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Royal Circles — gratitude statement and patronage imagery.
 */
export async function RoyalConnectionsTeaser() {
  const t = await getTranslations("royalConnections");

  return (
    <section
      id={SECTION_IDS.royalConnections}
      className="relative overflow-hidden bg-deep-red py-16 sm:py-20 lg:py-24"
      aria-label={t("title")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-20 top-1/2 size-64 -translate-y-1/2 rounded-full bg-luxury-gold/10 blur-3xl"
      />

      <Container className="relative z-[1]">
        <RevealOnScroll>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow-label mb-4 text-luxury-gold">{t("eyebrow")}</p>
              <h2 className="font-display text-3xl leading-tight text-pure-white sm:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
              <div className="mt-5 max-w-[10rem]">
                <GoldDivider variant="ornate" withDiamond />
              </div>
              <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-ivory/80 sm:text-lg">
                {t("statement")}
              </p>
              <QuoteBlock
                quote={t("quote")}
                className="mt-8 max-w-xl border-luxury-gold/50 [&_.quote-text]:text-ivory/90"
              />
            </div>

            <div className="lg:col-span-5">
              <RoyalFrame className="p-3 sm:p-4">
                <ImagePlaceholder
                  src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1783855330/1tim_c5lku8.png"
                  alt={t("imageAlt")}
                  fill
                  aspectRatio="4 / 3"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full"
                />
              </RoyalFrame>
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
