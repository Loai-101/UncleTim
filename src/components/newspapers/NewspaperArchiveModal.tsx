"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { NewspaperCard } from "@/components/newspapers/NewspaperCard";
import type { NewspaperFilterValue } from "@/components/newspapers/NewspaperCategoryCard";
import { NewspaperModal } from "@/components/newspapers/NewspaperModal";
import { useMounted } from "@/hooks/useMounted";
import { DURATION, EASING } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type {
  NewspaperArticle,
  NewspaperCategory,
} from "@/types/gallery";

type ArchiveFilter = "all" | NewspaperFilterValue;

type NewspaperArchiveModalProps = {
  open: boolean;
  initialFilter: ArchiveFilter;
  articles: NewspaperArticle[];
  onClose: () => void;
};

const FILTERS: { value: ArchiveFilter; labelKey: string }[] = [
  { value: "all", labelKey: "filterAll" },
  { value: "newspaper", labelKey: "filterNewspapers" },
  { value: "magazine", labelKey: "filterMagazines" },
  { value: "interview", labelKey: "filterInterviews" },
  { value: "report", labelKey: "filterReports" },
];

const CATEGORIES: NewspaperCategory[] = [
  "newspaper",
  "magazine",
  "interview",
  "report",
];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Full-window newspaper archive with filters and article preview modal.
 */
export function NewspaperArchiveModal({
  open,
  initialFilter,
  articles,
  onClose,
}: NewspaperArchiveModalProps) {
  const t = useTranslations("newspapers");
  const tCommon = useTranslations("common");
  const mounted = useMounted();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [filter, setFilter] = useState<ArchiveFilter>(initialFilter);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setFilter(initialFilter);
      setViewerOpen(false);
    }
  }, [open, initialFilter]);

  const filtered = useMemo(() => {
    if (filter === "all") return articles;
    if (CATEGORIES.includes(filter as NewspaperCategory)) {
      return articles.filter((item) => item.category === filter);
    }
    return articles;
  }, [filter, articles]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !viewerOpen) {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, viewerOpen]);

  const onPanelKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

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
    },
    [],
  );

  const openArticle = (id: string) => {
    const index = filtered.findIndex((item) => item.id === id);
    if (index < 0) return;
    setActiveIndex(index);
    setViewerOpen(true);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label={tCommon("close")}
        className="absolute inset-0 bg-burgundy/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "relative z-[1] flex max-h-[92svh] w-full max-w-6xl flex-col overflow-hidden",
          "rounded-[16px] border border-luxury-gold/40 bg-warm-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]",
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border-gold px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="eyebrow-label mb-1">{t("eyebrow")}</p>
            <h2
              id={titleId}
              className="font-display text-2xl text-burgundy sm:text-3xl"
            >
              {t("title")}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-sm border border-border-gold text-burgundy transition-colors hover:border-luxury-gold hover:text-royal-red"
            aria-label={t("close")}
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        </header>

        <div className="shrink-0 border-b border-border-gold/70 px-4 py-3 sm:px-6">
          <div
            role="tablist"
            aria-label={t("title")}
            className="flex flex-wrap gap-1"
          >
            {FILTERS.map((item) => {
              const isActive = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    "relative px-3 py-2.5 text-[0.7rem] tracking-[0.14em] uppercase transition-colors duration-300",
                    isActive
                      ? "text-burgundy"
                      : "text-muted-text hover:text-burgundy",
                  )}
                >
                  {t(item.labelKey as Parameters<typeof t>[0])}
                  {isActive ? (
                    <motion.span
                      layoutId="newspaper-modal-filter"
                      className="absolute inset-x-2 -bottom-px h-0.5 bg-luxury-gold"
                      transition={{
                        duration: DURATION.fast,
                        ease: EASING.elegant,
                      }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-text">
              {t("subtitle")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <NewspaperCard
                  key={article.id}
                  article={article}
                  onOpen={() => openArticle(article.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <NewspaperModal
        articles={filtered}
        index={activeIndex}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNavigate={setActiveIndex}
      />
    </div>,
    document.body,
  );
}
