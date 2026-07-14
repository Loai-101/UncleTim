"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
  enabled?: boolean;
};

export function SmoothScrollProvider({
  children,
  enabled = true,
}: SmoothScrollProviderProps) {
  useLenis(enabled);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    resetTop();
    window.addEventListener("pageshow", resetTop);
    return () => window.removeEventListener("pageshow", resetTop);
  }, []);

  return children;
}
