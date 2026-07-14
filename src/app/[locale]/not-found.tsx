import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");
  const tNav = await getTranslations("navigation");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-burgundy px-6 text-center text-ivory">
      <p className="eyebrow-label mb-4">404</p>
      <h1 className="font-display text-4xl text-soft-gold sm:text-5xl">
        {tNav("home")}
      </h1>
      <p className="body-standard mt-4 max-w-md text-ivory/70">
        {t("placeholder")}
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex border border-luxury-gold px-6 py-3 text-sm tracking-[0.16em] text-luxury-gold uppercase transition-colors hover:bg-luxury-gold hover:text-burgundy"
      >
        {t("backToTop")}
      </Link>
    </main>
  );
}
