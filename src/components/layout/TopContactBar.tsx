import { Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface TopContactBarProps {
  className?: string;
}

/**
 * Slim deep-burgundy contact strip — icon-only email/phone + language switcher.
 */
export async function TopContactBar({ className }: TopContactBarProps) {
  const t = await getTranslations("contact");

  return (
    <div
      className={cn(
        "relative z-[60] border-b border-luxury-gold/40 bg-burgundy text-ivory",
        className,
      )}
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:h-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center text-luxury-gold transition-colors hover:text-soft-gold"
            aria-label={`${t("emailLabel")}: ${CONTACT.email}`}
            title={CONTACT.email}
          >
            <Mail className="size-3.5" strokeWidth={1.5} aria-hidden />
          </a>
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center text-luxury-gold transition-colors hover:text-soft-gold"
            aria-label={`${t("phoneLabel")}: ${CONTACT.phone}`}
            title={CONTACT.phone}
          >
            <Phone className="size-3.5" strokeWidth={1.5} aria-hidden />
          </a>
        </div>

        <LanguageSwitcher variant="on-dark" />
      </div>
    </div>
  );
}
