"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const SPLASH_IMAGE =
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783852865/WhatsApp_Image_2026-07-12_at_1.40.35_PM_xxhge1.jpg";

const MIN_VISIBLE_MS = 2200;
const FADE_MS = 700;

const TIMELINE_MARKERS = ["1970s", "1980s", "1990s", "2000s", "Today"] as const;

declare global {
  interface Window {
    __uncleTimSplashDone?: boolean;
  }
}

/**
 * Full-page splash — shown only on hard open/refresh, not soft client navigations.
 */
export function PageSplashLoader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.__uncleTimSplashDone;
  });
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.__uncleTimSplashDone) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const started = Date.now();
    let raf = 0;
    let finishTimer = 0;
    let fadeTimer = 0;
    let loadComplete = document.readyState === "complete";

    const tick = () => {
      const elapsed = Date.now() - started;
      const loadFactor = loadComplete ? 1 : Math.min(0.85, elapsed / MIN_VISIBLE_MS);
      const timeFactor = Math.min(1, elapsed / MIN_VISIBLE_MS);
      const next = Math.min(100, Math.round(Math.max(timeFactor, loadFactor) * 100));
      setProgress(next);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const beginExit = () => {
      loadComplete = true;
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - started));
      finishTimer = window.setTimeout(() => {
        setProgress(100);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setFading(true);
        fadeTimer = window.setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          setVisible(false);
          window.__uncleTimSplashDone = true;
          onComplete?.();
        }, FADE_MS);
      }, remaining);
    };

    if (loadComplete) {
      beginExit();
    } else {
      window.addEventListener("load", beginExit, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(finishTimer);
      window.clearTimeout(fadeTimer);
      window.removeEventListener("load", beginExit);
    };
  }, [onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-live="polite"
      aria-busy={!fading}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={t("loading")}
      className={cn(
        "page-splash fixed inset-0 z-[9999] overflow-hidden bg-burgundy",
        "transition-opacity duration-700 ease-out",
        fading ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <Image
        src={SPLASH_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-burgundy/35 via-transparent to-burgundy/75"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:px-10 sm:pb-14 lg:px-16">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-3 flex items-end justify-between gap-4">
            <p
              className={cn(
                "text-[0.7rem] tracking-[0.22em] text-luxury-gold uppercase",
                locale === "ar" ? "font-arabic-body" : "font-body",
              )}
            >
              {t("loading")}
            </p>
            <p className="font-display text-sm tabular-nums text-soft-gold">
              {progress}%
            </p>
          </div>

          <div className="relative h-[2px] overflow-hidden bg-luxury-gold/25">
            <div
              className="absolute inset-y-0 start-0 bg-gradient-to-r from-dark-gold via-luxury-gold to-soft-gold transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-soft-gold shadow-[0_0_12px_rgba(232,207,122,0.8)]"
              style={{
                insetInlineStart: `calc(${progress}% - 4px)`,
              }}
            />
          </div>

          <ol className="mt-4 flex justify-between gap-1">
            {TIMELINE_MARKERS.map((marker, index) => {
              const threshold = (index / (TIMELINE_MARKERS.length - 1)) * 100;
              const active = progress >= threshold;
              return (
                <li
                  key={marker}
                  className={cn(
                    "flex flex-col items-center gap-1.5",
                    index === 0 && "items-start",
                    index === TIMELINE_MARKERS.length - 1 && "items-end",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full transition-colors duration-300",
                      active ? "bg-luxury-gold" : "bg-luxury-gold/30",
                    )}
                  />
                  <span
                    className={cn(
                      "font-display text-[0.65rem] tracking-[0.08em] transition-colors duration-300 sm:text-xs",
                      active ? "text-soft-gold" : "text-soft-gold/40",
                    )}
                  >
                    {marker}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
