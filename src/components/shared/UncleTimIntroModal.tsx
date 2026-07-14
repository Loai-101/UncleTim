"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { useMounted } from "@/hooks/useMounted";
import { DURATION, EASING } from "@/lib/animations";
import { cn } from "@/lib/utils";

const INTRO_IMAGE =
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783947117/tim33_v6rgzl.jpg";

type UncleTimIntroModalProps = {
  /** True once the splash screen has finished (or was skipped). */
  splashDone: boolean;
};

/**
 * Intro explaining the "Uncle Tim" nickname — after splash, on every refresh / locale change.
 */
export function UncleTimIntroModal({ splashDone }: UncleTimIntroModalProps) {
  const t = useTranslations("introModal");
  const locale = useLocale();
  const mounted = useMounted();
  const titleId = useId();
  const continueId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const [dismissedLocale, setDismissedLocale] = useState<string | null>(null);
  const open = splashDone && dismissedLocale !== locale;

  const close = useCallback(() => {
    setDismissedLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      document.getElementById(continueId)?.focus();
    }, 80);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open, continueId]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const trapFocus = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.tabIndex !== -1);

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-3 sm:p-6 lg:p-8">
          <motion.button
            type="button"
            aria-label={t("continue")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASING.elegant }}
            className="absolute inset-0 bg-burgundy/88 backdrop-blur-[6px]"
            onClick={close}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={trapFocus}
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{
              duration: DURATION.base,
              ease: EASING.elegant,
              delay: 0.05,
            }}
            className={cn(
              "intro-modal relative z-[1] flex max-h-[min(92svh,880px)] w-full max-w-xl flex-col overflow-hidden",
              "rounded-sm border border-luxury-gold/45 bg-ivory shadow-[0_28px_80px_-24px_rgba(0,0,0,0.55)]",
              "sm:max-w-2xl",
            )}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent"
            />

            <div className="relative shrink-0 border-b border-border-gold bg-burgundy/5">
              <div className="relative mx-auto aspect-[16/10] w-full max-h-[240px] sm:max-h-[280px]">
                <Image
                  src={INTRO_IMAGE}
                  alt={t("imageAlt")}
                  fill
                  priority
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-cover object-[center_20%]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-burgundy/20 via-transparent to-transparent"
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
                <p className="eyebrow-label mb-2 text-luxury-gold">Uncle Tim</p>
                <h2
                  id={titleId}
                  className="font-display text-2xl leading-snug text-burgundy sm:text-3xl"
                >
                  {t("title")}
                </h2>
                <div
                  aria-hidden="true"
                  className="mt-4 h-px w-16 bg-gradient-to-r from-luxury-gold to-transparent"
                />

                <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-muted-text sm:text-[0.95rem] sm:leading-[1.75]">
                  <p>{t("p1")}</p>
                  <p>{t("p2")}</p>
                  <p>{t("p3")}</p>
                </div>
              </div>

              <div className="shrink-0 border-t border-border-gold bg-warm-white/80 px-5 py-4 sm:px-8 sm:py-5">
                <LuxuryButton
                  id={continueId}
                  type="button"
                  variant="gold"
                  size="lg"
                  className="w-full tracking-[0.12em]"
                  onClick={close}
                >
                  {t("continue")}
                </LuxuryButton>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
