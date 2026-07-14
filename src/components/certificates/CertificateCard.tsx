"use client";

import Image from "next/image";
import { Award } from "lucide-react";
import { useTranslations } from "next-intl";
import { RoyalFrame } from "@/components/shared/RoyalFrame";
import { cn } from "@/lib/utils";
import type { Certificate } from "@/types/content";

type CertificateCardProps = {
  certificate: Certificate;
  onOpen: () => void;
  className?: string;
};

/**
 * Equal square certificate thumbnail — object-contain, centered, no crop.
 */
export function CertificateCard({
  certificate,
  onOpen,
  className,
}: CertificateCardProps) {
  const t = useTranslations("certificates");

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${t("viewCertificate")}: ${certificate.imageAlt || certificate.title}`}
      className={cn(
        "group relative flex w-full text-start",
        "transition-transform duration-500 ease-out hover:-translate-y-1",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-luxury-gold",
        className,
      )}
    >
      <RoyalFrame
        className={cn(
          "w-full border border-border-gold bg-warm-white p-2.5 transition-shadow duration-500 sm:p-3",
          "group-hover:shadow-[0_18px_48px_-20px_rgba(212,175,55,0.45)]",
        )}
        contentClassName="w-full"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#f3eee6]">
          <Image
            src={certificate.image}
            alt={certificate.imageAlt || certificate.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.03] sm:p-2.5"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-deep-red/0 transition-colors duration-500 group-hover:bg-deep-red/50"
          />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="inline-flex size-10 items-center justify-center border border-luxury-gold text-luxury-gold sm:size-12">
              <Award className="size-4 sm:size-5" strokeWidth={1.5} />
            </span>
          </span>
        </div>
      </RoyalFrame>
    </button>
  );
}
