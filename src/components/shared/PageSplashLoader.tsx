"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { SITE_LOGO, SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SPLASH_IMAGE =
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783852865/WhatsApp_Image_2026-07-12_at_1.40.35_PM_xxhge1.jpg";

const LOAD_DURATION_MS = 2200;
const FADE_MS = 700;

/** Fixed labels — identical for AR / EN / FR (not translated, not RTL-flipped). */
const TIMELINE_MARKERS = ["1970s", "1980s", "1990s", "2000s", "Today"] as const;

declare global {
  interface Window {
    __uncleTimSplashDone?: boolean;
    __uncleTimLanguageChosen?: AppLocale;
    __uncleTimSplashLoadStarted?: number;
  }
}

type LanguageOption = {
  locale: AppLocale;
  code: string;
  name: string;
  region: string;
  Flag: () => ReactNode;
};

function BahrainFlag() {
  return (
    <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
      <rect width="36" height="24" fill="#CE1126" />
      <path
        fill="#FFFFFF"
        d="M0 0h11l-2.75 2.4 2.75 2.4-2.75 2.4 2.75 2.4-2.75 2.4 2.75 2.4-2.75 2.4 2.75 2.4-2.75 2.4H0z"
      />
    </svg>
  );
}

function UsaFlag() {
  return (
    <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
      <rect width="36" height="24" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((y) => (
        <rect key={y} y={y * 1.846} width="36" height="1.846" fill="#FFFFFF" />
      ))}
      <rect width="14.4" height="12.92" fill="#3C3B6E" />
      {[0, 1, 2, 3, 4].map((row) =>
        Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={1.2 + col * 2.4 + (row % 2 === 0 ? 0 : 1.2)}
            cy={1.2 + row * 2.4}
            r="0.55"
            fill="#FFFFFF"
          />
        )),
      )}
    </svg>
  );
}

function FranceFlag() {
  return (
    <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
      <rect width="12" height="24" fill="#002395" />
      <rect x="12" width="12" height="24" fill="#FFFFFF" />
      <rect x="24" width="12" height="24" fill="#ED2939" />
    </svg>
  );
}

const OPTIONS: LanguageOption[] = [
  {
    locale: "ar",
    code: "AR",
    name: "العربية",
    region: "البحرين",
    Flag: BahrainFlag,
  },
  {
    locale: "en",
    code: "EN",
    name: "English",
    region: "United States",
    Flag: UsaFlag,
  },
  {
    locale: "fr",
    code: "FR",
    name: "Français",
    region: "France",
    Flag: FranceFlag,
  },
];

function isAppLocale(value: unknown): value is AppLocale {
  return value === "ar" || value === "en" || value === "fr";
}

function subscribeSplashDone() {
  return () => {};
}

function getSplashDoneSnapshot() {
  return Boolean(window.__uncleTimSplashDone);
}

function getSplashDoneServerSnapshot() {
  return false;
}

/**
 * Loading screen = language chooser, then the same timeline for every language.
 * Shown on every hard open/refresh; skipped on soft client navigations.
 */
export function PageSplashLoader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const titleId = useId();
  const [isPending, startTransition] = useTransition();

  const alreadyDone = useSyncExternalStore(
    subscribeSplashDone,
    getSplashDoneSnapshot,
    getSplashDoneServerSnapshot,
  );

  const initialChoice =
    typeof window !== "undefined" && isAppLocale(window.__uncleTimLanguageChosen)
      ? window.__uncleTimLanguageChosen
      : null;

  const [sessionActive, setSessionActive] = useState(() => !alreadyDone);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<AppLocale | null>(initialChoice);
  const [choiceMade, setChoiceMade] = useState(() => initialChoice !== null);

  const exitingRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const visible = sessionActive && !alreadyDone;

  useEffect(() => {
    if (alreadyDone) {
      onCompleteRef.current?.();
    }
  }, [alreadyDone]);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  /** Same timeline animation for AR / EN / FR (survives locale remount). */
  useEffect(() => {
    if (!choiceMade || fading || alreadyDone) return;

    if (!window.__uncleTimSplashLoadStarted) {
      window.__uncleTimSplashLoadStarted = Date.now();
    }
    const started = window.__uncleTimSplashLoadStarted;

    let raf = 0;
    let fadeTimer = 0;
    let finished = false;

    const finish = () => {
      if (finished || exitingRef.current) return;
      finished = true;
      exitingRef.current = true;
      setProgress(100);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setFading(true);
      fadeTimer = window.setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        window.__uncleTimSplashDone = true;
        setSessionActive(false);
        onCompleteRef.current?.();
      }, FADE_MS);
    };

    const tick = () => {
      const elapsed = Date.now() - started;
      const next = Math.min(100, Math.round((elapsed / LOAD_DURATION_MS) * 100));
      setProgress(next);

      if (next >= 100) {
        finish();
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
    };
  }, [alreadyDone, choiceMade, fading]);

  const choose = useCallback(
    (next: AppLocale) => {
      if (isPending || choiceMade || fading) return;

      window.__uncleTimLanguageChosen = next;
      window.__uncleTimSplashLoadStarted = Date.now();

      setSelected(next);
      setChoiceMade(true);
      setProgress(0);

      if (next !== locale) {
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }
    },
    [choiceMade, fading, isPending, locale, pathname, router],
  );

  if (!visible) {
    return null;
  }

  return (
    <div
      dir="ltr"
      lang="en"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-busy={!fading}
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
        className="absolute inset-0 bg-gradient-to-b from-burgundy/55 via-burgundy/45 to-burgundy/90"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8">
          <div className="mb-7 flex flex-col items-center text-center sm:mb-9">
            <div className="relative mb-5 size-20 overflow-hidden rounded-full border border-luxury-gold/50 bg-burgundy/40 shadow-[0_0_40px_rgba(212,175,55,0.18)] sm:size-24">
              <Image
                src={SITE_LOGO}
                alt={SITE_SHORT_NAME}
                fill
                priority
                sizes="96px"
                className="object-cover object-top"
              />
            </div>
            <p className="mb-2 text-[0.7rem] tracking-[0.28em] text-luxury-gold uppercase">
              {SITE_SHORT_NAME}
            </p>
            <h1
              id={titleId}
              className="font-display text-3xl text-ivory sm:text-4xl"
            >
              Choose your language
            </h1>
            <p className="mt-3 max-w-md font-arabic-body text-sm text-soft-gold/85 sm:text-base">
              اختر لغتك
              <span className="mx-2 text-luxury-gold/40" aria-hidden="true">
                ·
              </span>
              <span className="font-body">Choisissez votre langue</span>
            </p>
            <div
              aria-hidden="true"
              className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"
            />
          </div>

          <ul className="grid w-full max-w-3xl gap-3 sm:grid-cols-3 sm:gap-4">
            {OPTIONS.map((option) => {
              const isSelected = selected === option.locale;
              return (
                <li key={option.locale}>
                  <button
                    type="button"
                    disabled={isPending || choiceMade || fading}
                    onClick={() => choose(option.locale)}
                    className={cn(
                      "group relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-sm border px-4 py-5 text-center transition-all duration-300 sm:gap-4 sm:py-6",
                      "border-luxury-gold/35 bg-ivory/[0.08] backdrop-blur-sm",
                      "hover:border-luxury-gold hover:bg-ivory/[0.14] hover:shadow-[0_16px_40px_-20px_rgba(212,175,55,0.45)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy",
                      "disabled:cursor-wait",
                      isSelected &&
                        "border-luxury-gold bg-ivory/[0.18] shadow-[0_16px_40px_-18px_rgba(212,175,55,0.55)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="relative h-11 w-16 overflow-hidden rounded-sm border border-white/20 shadow-md sm:h-14 sm:w-20">
                      <option.Flag />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-[0.65rem] tracking-[0.22em] text-luxury-gold uppercase">
                        {option.code}
                      </span>
                      <span
                        className={cn(
                          "text-lg text-ivory sm:text-xl",
                          option.locale === "ar"
                            ? "font-arabic-display"
                            : "font-display",
                        )}
                      >
                        {option.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs text-soft-gold/70",
                          option.locale === "ar"
                            ? "font-arabic-body"
                            : "font-body",
                        )}
                      >
                        {option.region}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className={cn(
            "shrink-0 px-6 pb-8 transition-opacity duration-500 sm:px-10 sm:pb-12 lg:px-16",
            choiceMade ? "opacity-100" : "opacity-40",
          )}
        >
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-3 flex items-end justify-between gap-4">
              <p className="font-body text-[0.7rem] tracking-[0.22em] text-luxury-gold uppercase">
                Loading
              </p>
              <p
                className="font-display text-sm tabular-nums text-soft-gold"
                aria-live="polite"
              >
                {progress}%
              </p>
            </div>

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Loading"
              className="relative h-[2px] overflow-hidden bg-luxury-gold/25"
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-dark-gold via-luxury-gold to-soft-gold transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-soft-gold shadow-[0_0_12px_rgba(232,207,122,0.8)]"
                style={{
                  left: `calc(${progress}% - 4px)`,
                }}
              />
            </div>

            <ol className="mt-4 flex justify-between gap-1">
              {TIMELINE_MARKERS.map((marker, index) => {
                const threshold =
                  (index / (TIMELINE_MARKERS.length - 1)) * 100;
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
    </div>
  );
}
