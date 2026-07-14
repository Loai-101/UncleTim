import type { Decade } from "./content";

export type TimelineOrientation = "left" | "right" | "center";
export type TimelineSize = "small" | "medium" | "large";
export type TimelineLayoutVariant =
  | "vertical"
  | "horizontal"
  | "floating"
  | "featured"
  | "diagonal";

/** Visual treatment — varies style, not size. */
export type TimelineStyleVariant =
  | "royal"
  | "archive"
  | "editorial"
  | "documentary"
  | "modern";

export type TimelineImageAspect = "landscape" | "classic" | "portrait";

export interface TimelineEvent {
  id: string;
  year: string;
  decade: Decade;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Optional auto-rotating gallery (falls back to `image` when omitted). */
  images?: string[];
  /** Optional CSS object-position per gallery image (same order as `images`). */
  imagePositions?: string[];
  orientation: TimelineOrientation;
  size: TimelineSize;
  layoutVariant: TimelineLayoutVariant;
  styleVariant: TimelineStyleVariant;
  imageAspect?: TimelineImageAspect;
  category: string;
  quote?: string;
  location?: string;
  badge?: string;
}
