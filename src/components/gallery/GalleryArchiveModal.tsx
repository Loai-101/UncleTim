"use client";

import { X } from "lucide-react";
import dynamic from "next/dynamic";
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
import { GalleryCard } from "@/components/gallery/GalleryCard";
import {
  GalleryFilters,
  type GalleryFilterValue,
} from "@/components/gallery/GalleryFilters";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/gallery";

const GalleryLightbox = dynamic(
  () =>
    import("@/components/gallery/GalleryLightbox").then(
      (mod) => mod.GalleryLightbox,
    ),
  { ssr: false },
);

type GalleryArchiveModalProps = {
  open: boolean;
  initialFilter: GalleryFilterValue;
  images: GalleryImage[];
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Full-window gallery archive with category filters and lightbox.
 */
export function GalleryArchiveModal({
  open,
  initialFilter,
  images,
  onClose,
}: GalleryArchiveModalProps) {
  const t = useTranslations("gallery");
  const tCommon = useTranslations("common");
  const mounted = useMounted();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [filter, setFilter] = useState<GalleryFilterValue>(initialFilter);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setFilter(initialFilter);
      setLightboxOpen(false);
    }
  }, [open, initialFilter]);

  const filtered = useMemo(() => {
    if (filter === "all") return images;
    return images.filter((image) => image.category === filter);
  }, [filter, images]);

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
      if (event.key === "Escape" && !lightboxOpen) {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, lightboxOpen]);

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

  const openAt = (id: string) => {
    const index = filtered.findIndex((image) => image.id === id);
    if (index < 0) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
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
            <p className="mt-1 text-[0.7rem] tracking-[0.14em] text-muted-text uppercase">
              {t("imageCount", { count: filtered.length })}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-sm border border-border-gold text-burgundy transition-colors hover:border-luxury-gold hover:text-royal-red"
            aria-label={tCommon("close")}
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        </header>

        <div className="shrink-0 border-b border-border-gold/70 px-4 py-3 sm:px-6">
          <GalleryFilters active={filter} onChange={setFilter} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-text">
              {t("subtitle")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((image) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  onOpen={() => openAt(image.id)}
                  className="min-h-[14rem] rounded-[10px] border border-border-gold/60"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxOpen ? (
        <GalleryLightbox
          images={filtered}
          open={lightboxOpen}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </div>,
    document.body,
  );
}
