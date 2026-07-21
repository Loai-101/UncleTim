"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { PageSplashLoader } from "@/components/shared/PageSplashLoader";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { UncleTimIntroModal } from "@/components/shared/UncleTimIntroModal";
import { forceUnlockBodyScroll } from "@/lib/body-scroll-lock";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => {
    forceUnlockBodyScroll();
    setSplashDone(true);
  }, []);

  return (
    <SmoothScrollProvider>
      <PageSplashLoader onComplete={handleSplashComplete} />
      <UncleTimIntroModal splashDone={splashDone} />
      {children}
    </SmoothScrollProvider>
  );
}
