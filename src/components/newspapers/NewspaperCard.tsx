"use client";

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { cn } from "@/lib/utils";
import type { NewspaperArticle } from "@/types/gallery";

type NewspaperCardProps = {
  article: NewspaperArticle;
  onOpen: () => void;
  className?: string;
};

/**
 * Archive-folder aesthetic card: ivory paper, gold clip, burgundy title.
 */
export function NewspaperCard({
  article,
  onOpen,
  className,
}: NewspaperCardProps) {
  const t = useTranslations("newspapers");
  const dateLabel = new Date(article.publicationDate).toLocaleDateString(
    undefined,
    { year: "numeric", month: "short", day: "numeric" },
  );

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${t("viewArticle")}: ${article.title}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-sm border border-border-gold bg-ivory text-start shadow-[0_1px_0_rgba(212,175,55,0.12)]",
        "transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(58,0,12,0.35)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-luxury-gold",
        className,
      )}
    >
      {/* Gold corner clip */}
      <span
        aria-hidden="true"
        className="absolute end-4 top-0 z-20 h-5 w-8 -translate-y-px bg-gradient-to-b from-luxury-gold to-dark-gold shadow-sm"
        style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-0 top-0 size-8 border-s-2 border-t-2 border-luxury-gold/50"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-0 bottom-0 size-8 border-e-2 border-b-2 border-luxury-gold/50"
      />

      <div className="relative aspect-[4/3] overflow-hidden border-b border-border-gold bg-burgundy/5">
        <ImagePlaceholder
          src={article.coverImage}
          alt={article.coverImageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="relative flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] tracking-[0.14em] text-luxury-gold uppercase">
          <span>{article.publicationName}</span>
          <span aria-hidden="true" className="text-luxury-gold/40">
            ·
          </span>
          <span>{dateLabel}</span>
        </div>

        <h3 className="font-display text-xl leading-snug text-burgundy sm:text-2xl">
          {article.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-text">
          {article.summary}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-[0.65rem] tracking-[0.12em] text-muted-text uppercase">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5 text-luxury-gold" aria-hidden="true" />
            {article.category}
          </span>
          <span>{article.language.toUpperCase()}</span>
          <span>{article.country}</span>
          {article.pageNumber ? (
            <span>{t("page", { page: article.pageNumber })}</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
