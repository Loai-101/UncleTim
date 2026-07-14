"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navigationItems } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { SITE_LOGO, SITE_SHORT_NAME } from "@/lib/constants";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export interface MainNavbarProps {
  className?: string;
}

/**
 * Primary site navbar — sits after the hero, sticks on scroll.
 * Ivory surface, burgundy text, gold active underline.
 */
export function MainNavbar({ className }: MainNavbarProps) {
  const t = useTranslations("navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sectionIds = useMemo(
    () => navigationItems.map((item) => item.sectionId),
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

  // Escape closes mobile menu (also handled in MobileMenu; belt-and-suspenders)
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

  // Body scroll lock while menu open
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
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
          "sticky top-0 z-50 border-b border-luxury-gold/40 bg-warm-white/95 text-burgundy transition-[height,box-shadow,background-color,backdrop-filter] duration-300",
          stuck && "bg-warm-white/90 shadow-[0_8px_30px_rgba(58,0,12,0.08)] backdrop-blur-md",
          className,
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6 lg:px-8",
            stuck ? "h-14 sm:h-16" : "h-16 sm:h-[4.5rem]",
          )}
        >
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
              className={cn(
                "size-11 shrink-0 object-contain sm:size-14",
                stuck && "size-9 sm:size-11",
              )}
            />
            <span
              className={cn(
                "font-display tracking-wide text-burgundy transition-[font-size] duration-300",
                stuck ? "text-lg sm:text-xl" : "text-xl",
              )}
            >
              {SITE_SHORT_NAME}
            </span>
          </a>

          <nav
            className="hidden items-center gap-0.5 lg:flex xl:gap-1"
            aria-label={SITE_SHORT_NAME}
          >
            {navigationItems.map((item) => {
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
                    "relative px-2.5 py-2 text-[0.6875rem] font-medium tracking-[0.14em] uppercase transition-colors xl:px-3",
                    isActive
                      ? "text-burgundy"
                      : "text-burgundy/70 hover:text-burgundy",
                  )}
                >
                  {t(item.labelKey)}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-2.5 -bottom-0.5 h-px origin-center bg-luxury-gold transition-transform duration-300 xl:inset-x-3",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-sm text-burgundy transition-colors hover:text-royal-red lg:hidden"
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
          onClose={() => setMenuOpen(false)}
          activeSectionId={activeSectionId}
          onNavigate={scrollToSection}
        />
      </div>
    </>
  );
}
