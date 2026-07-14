"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { navigationItems } from "@/data/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CONTACT, SITE_MONOGRAM } from "@/lib/constants";
import { DURATION, EASING } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/content";

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeSectionId?: string | null;
  onNavigate?: (sectionId: string) => void;
  items?: NavigationItem[];
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen deep-red mobile navigation overlay with numbered links.
 */
export function MobileMenu({
  open,
  onClose,
  activeSectionId,
  onNavigate,
  items = navigationItems,
}: MobileMenuProps) {
  const t = useTranslations("navigation");
  const tContact = useTranslations("contact");
  const tCommon = useTranslations("common");
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const handleNavigate = useCallback(
    (sectionId: string) => {
      onNavigate?.(sectionId);
      onClose();
    },
    [onClose, onNavigate],
  );

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Focus close button on open; Escape to close
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  function onPanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
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
  }

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.06,
        delayChildren: reducedMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: reducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : DURATION.base,
        ease: EASING.elegant,
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onKeyDown={onPanelKeyDown}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0 : DURATION.fast,
            ease: EASING.smooth,
          }}
          className="fixed inset-0 z-[70] flex flex-col bg-deep-red text-ivory"
        >
          <div className="pointer-events-none absolute inset-0 pattern-horse-lines opacity-40" />

          <div className="relative flex items-center justify-between px-5 py-5 sm:px-8">
            <span
              id={titleId}
              className="font-display text-2xl tracking-[0.12em] text-luxury-gold"
            >
              {SITE_MONOGRAM}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex size-11 items-center justify-center rounded-sm text-ivory transition-colors hover:text-luxury-gold"
              aria-label={t("closeMenu")}
            >
              <X className="size-6" strokeWidth={1.25} aria-hidden />
            </button>
          </div>

          <nav
            className="relative flex flex-1 flex-col justify-center px-6 sm:px-10"
            aria-label={t("openMenu")}
          >
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-1"
            >
              {items.map((item, index) => {
                const isActive = activeSectionId === item.sectionId;
                const number = String(index + 1).padStart(2, "0");
                return (
                  <motion.li key={item.id} variants={itemVariants}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.sectionId)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "group flex w-full items-baseline gap-4 py-2.5 text-start transition-colors",
                        isActive
                          ? "text-luxury-gold"
                          : "text-ivory hover:text-soft-gold",
                      )}
                    >
                      <span className="font-body shrink-0 text-[0.65rem] tracking-[0.2em] text-luxury-gold/80">
                        {number}
                      </span>
                      <span className="font-display text-3xl leading-none tracking-wide sm:text-4xl">
                        {t(item.labelKey)}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          <div className="relative space-y-5 border-t border-luxury-gold/25 px-6 py-6 sm:px-10">
            <div className="flex flex-col gap-2 text-sm text-ivory/75">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-soft-gold"
              >
                <Mail
                  className="size-3.5 text-luxury-gold"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span>
                  <span className="sr-only">{tContact("emailLabel")}: </span>
                  {CONTACT.email}
                </span>
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-soft-gold"
              >
                <Phone
                  className="size-3.5 text-luxury-gold"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span>
                  <span className="sr-only">{tContact("phoneLabel")}: </span>
                  {CONTACT.phone}
                </span>
              </a>
              {CONTACT.website && (
                <a
                  href={CONTACT.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ivory/80 transition-colors hover:text-luxury-gold"
                >
                  <MapPin
                    className="size-3.5 text-luxury-gold"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span>
                    <span className="sr-only">{tContact("websiteLabel")}: </span>
                    {CONTACT.websiteLabel ?? CONTACT.website}
                  </span>
                </a>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <LanguageSwitcher variant="on-dark" />
              <button
                type="button"
                onClick={onClose}
                className="text-[0.6875rem] tracking-[0.18em] text-ivory/55 uppercase transition-colors hover:text-luxury-gold"
              >
                {tCommon("close")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
