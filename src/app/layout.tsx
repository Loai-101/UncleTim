import type { ReactNode } from "react";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

/**
 * Root layout — html/body live in [locale]/layout for dir/lang control.
 * Phase 1 stub: pass-through only.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
