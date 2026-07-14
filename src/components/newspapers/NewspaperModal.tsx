"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import type { NewspaperArticle } from "@/types/gallery";

type NewspaperModalProps = {
  articles: NewspaperArticle[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Accessible newspaper preview dialog with zoom, focus trap, and scroll lock.
 * TODO Phase 2: Wire real download and share handlers.
 */
export function NewspaperModal({
  articles,
  index,
  open,
  onClose,
  onNavigate,
}: NewspaperModalProps) {
  const t = useTranslations("newspapers");
  const tCommon = useTranslations("common");
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [zoomArticleId, setZoomArticleId] = useState<string | null>(null);
  const mounted = useMounted();

  const article = articles[index];
  const hasPrev = index > 0;
  const hasNext = index < articles.length - 1;

  if (article && zoomArticleId !== article.id) {
    setZoomArticleId(article.id);
    setZoom(1);
  }

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && hasPrev) {
        event.preventDefault();
        onNavigate(index - 1);
      }
      if (event.key === "ArrowRight" && hasNext) {
        event.preventDefault();
        onNavigate(index + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hasPrev, hasNext, index, onClose, onNavigate]);

  const trapFocus = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  if (!mounted || !open || !article) return null;

  const dateLabel = new Date(article.publicationDate).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-burgundy/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={trapFocus}
        className="relative z-[1] flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-luxury-gold/40 bg-ivory shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border-gold px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-[0.65rem] tracking-[0.16em] text-luxury-gold uppercase">
              {article.publicationName}
            </p>
            <h2
              id={titleId}
              className="truncate font-display text-lg text-burgundy sm:text-xl"
            >
              {article.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              className="inline-flex size-10 items-center justify-center text-burgundy transition-colors hover:text-royal-red"
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
              className="inline-flex size-10 items-center justify-center text-burgundy transition-colors hover:text-royal-red"
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn className="size-4" strokeWidth={1.5} />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center text-burgundy transition-colors hover:text-royal-red"
              aria-label={t("close")}
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-5">
          <div className="relative flex items-center justify-center overflow-auto bg-burgundy/5 p-4 lg:col-span-3 lg:p-6">
            <div
              className="relative w-full max-w-lg transition-transform duration-300"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center top",
              }}
            >
              <ImagePlaceholder
                src={article.coverImage}
                alt={article.coverImageAlt}
                width={900}
                height={1200}
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border-gold p-5 sm:p-6 lg:col-span-2 lg:border-t-0 lg:border-s">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[0.65rem] tracking-[0.16em] text-luxury-gold uppercase">
                  Date
                </dt>
                <dd className="mt-1 text-burgundy">{dateLabel}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] tracking-[0.16em] text-luxury-gold uppercase">
                  {tCommon("category")}
                </dt>
                <dd className="mt-1 capitalize text-burgundy">
                  {article.category}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] tracking-[0.16em] text-luxury-gold uppercase">
                  Language
                </dt>
                <dd className="mt-1 uppercase text-burgundy">
                  {article.language}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] tracking-[0.16em] text-luxury-gold uppercase">
                  Country
                </dt>
                <dd className="mt-1 text-burgundy">{article.country}</dd>
              </div>
              {article.pageNumber ? (
                <div>
                  <dt className="text-[0.65rem] tracking-[0.16em] text-luxury-gold uppercase">
                    Page
                  </dt>
                  <dd className="mt-1 text-burgundy">
                    {t("page", { page: article.pageNumber })}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="body-standard text-sm">{article.summary}</p>

            <div className="mt-auto flex flex-wrap gap-3 pt-4">
              {/* TODO Phase 2: Implement download */}
              <LuxuryButton
                variant="goldOutline"
                size="sm"
                icon={<Download aria-hidden="true" strokeWidth={1.5} />}
                onClick={() => {
                  // Placeholder download
                }}
              >
                {t("download")}
              </LuxuryButton>
              {/* TODO Phase 2: Implement share */}
              <LuxuryButton
                variant="textLink"
                size="sm"
                icon={<Share2 aria-hidden="true" strokeWidth={1.5} />}
                onClick={() => {
                  // Placeholder share
                }}
              >
                {t("share")}
              </LuxuryButton>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border-gold pt-4">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => onNavigate(index - 1)}
                className={cn(
                  "inline-flex items-center gap-1 text-[0.7rem] tracking-[0.14em] uppercase transition-colors",
                  hasPrev
                    ? "text-burgundy hover:text-royal-red"
                    : "cursor-not-allowed text-muted-text/40",
                )}
                aria-label={tCommon("previous")}
              >
                <ChevronLeft className="size-4" />
                {tCommon("previous")}
              </button>
              <span className="text-[0.7rem] tracking-[0.14em] text-muted-text tabular-nums">
                {index + 1} / {articles.length}
              </span>
              <button
                type="button"
                disabled={!hasNext}
                onClick={() => onNavigate(index + 1)}
                className={cn(
                  "inline-flex items-center gap-1 text-[0.7rem] tracking-[0.14em] uppercase transition-colors",
                  hasNext
                    ? "text-burgundy hover:text-royal-red"
                    : "cursor-not-allowed text-muted-text/40",
                )}
                aria-label={tCommon("next")}
              >
                {tCommon("next")}
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
