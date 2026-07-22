"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { secondaryNavigationItems } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { forceUnlockBodyScroll } from "@/lib/body-scroll-lock";
import { SITE_LOGO, SITE_SHORT_NAME } from "@/lib/constants";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export interface SecondaryNavbarProps {
  className?: string;
}

/**
 * Secondary navigation bar placed directly below the compact hero.
 * Separate section — never overlaid on the hero.
 */
export function SecondaryNavbar({ className }: SecondaryNavbarProps) {
  const t = useTranslations("navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sectionIds = useMemo(
    () => secondaryNavigationItems.map((item) => item.sectionId),
    [],
  );
  const activeSectionId = useActiveSection({ sectionIds });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <div
        ref={sentinelRef}
        className="pointer-events-none h-px w-full"
        aria-hidden
      />
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-luxury-gold/40 bg-warm-white text-burgundy transition-[box-shadow,background-color,backdrop-filter] duration-300",
          stuck &&
            "bg-warm-white/92 shadow-[0_8px_30px_rgba(58,0,12,0.08)] backdrop-blur-md",
          className,
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-3 sm:h-[4.25rem] sm:px-5 lg:px-6">
          <a
            href={`#${sectionIds[0]}`}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(sectionIds[0]);
            }}
            className="group inline-flex shrink-0 items-center gap-3"
            aria-label={SITE_SHORT_NAME}
          >
            <Image
              src={SITE_LOGO}
              alt=""
              width={56}
              height={56}
              priority
              className="size-11 shrink-0 object-contain sm:size-14"
            />
            <span className="font-display text-xl tracking-wide text-burgundy">
              {SITE_SHORT_NAME}
            </span>
          </a>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0 xl:flex"
            aria-label={t("secondaryNav")}
          >
            {secondaryNavigationItems.map((item) => {
              const isActive = activeSectionId === item.sectionId;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item.sectionId);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative whitespace-nowrap px-1.5 py-2 text-[0.58rem] font-medium tracking-[0.06em] uppercase transition-colors 2xl:px-2 2xl:text-[0.68rem] 2xl:tracking-[0.1em]",
                    isActive
                      ? "text-burgundy"
                      : "text-burgundy/70 hover:text-royal-red",
                  )}
                >
                  {t(item.labelKey as Parameters<typeof t>[0])}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-1 bottom-0 h-[2px] origin-center bg-royal-red transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm text-burgundy transition-colors hover:text-royal-red xl:invisible xl:pointer-events-none"
            aria-label={t("openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-6" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </header>

      <div id="mobile-menu">
        <MobileMenu
          open={menuOpen}
          onClose={() => {
            setMenuOpen(false);
            // Ensure page scroll works after closing the menu (X or backdrop)
            forceUnlockBodyScroll();
          }}
          activeSectionId={activeSectionId}
          onNavigate={scrollToSection}
          items={secondaryNavigationItems}
        />
      </div>
    </>
  );
}
