import { cn } from "@/lib/utils";

export type SocialNetwork = "instagram" | "facebook" | "youtube" | "twitter";

const PATHS: Record<SocialNetwork, string> = {
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.7A2.9 2.9 0 1 1 14.9 12 2.9 2.9 0 0 1 12 14.9zm5.05-8.65a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15z",
  facebook:
    "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z",
  youtube:
    "M22.5 7.2a3.1 3.1 0 0 0-2.2-2.2C18.4 4.5 12 4.5 12 4.5s-6.4 0-8.3.5A3.1 3.1 0 0 0 1.5 7.2 32.6 32.6 0 0 0 1 12a32.6 32.6 0 0 0 .5 4.8 3.1 3.1 0 0 0 2.2 2.2c1.9.5 8.3.5 8.3.5s6.4 0 8.3-.5a3.1 3.1 0 0 0 2.2-2.2A32.6 32.6 0 0 0 23 12a32.6 32.6 0 0 0-.5-4.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z",
  twitter:
    "M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.9-6.4L5.4 22H2.6l7-8L2 2h6.4l4.4 5.8L18.2 2zm-1.1 18h1.7L7 3.9H5.2L17.1 20z",
};

export interface SocialIconProps {
  network: SocialNetwork;
  className?: string;
}

/** Minimal brand mark SVGs — Lucide no longer ships trademarked social icons. */
export function SocialIcon({ network, className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn("size-4", className)}
    >
      <path d={PATHS[network]} />
    </svg>
  );
}
