export type Decade =
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s";

export interface HeroSlide {
  id: string;
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  priority?: boolean;
}

export interface Statistic {
  id: string;
  key: string;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  icon: string;
}

export type StoryLayoutVariant =
  | "image-left"
  | "image-right"
  | "full-width-float"
  | "dual-image"
  | "portrait-vertical";

export interface StoryFigure {
  id: string;
  name: string;
  role?: string;
  description: string;
}

export interface StoryBlock {
  id: string;
  layoutVariant: StoryLayoutVariant;
  eyebrow: string;
  title: string;
  subtitle?: string;
  role?: string;
  description: string;
  figures?: StoryFigure[];
  image: string;
  imageAlt: string;
  secondaryImage?: string;
  secondaryImageAlt?: string;
  quote?: string;
  year?: string;
  location?: string;
  /** When true, text panel scrolls while image frame stays fixed. */
  scrollable?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  country: string;
  year: string;
  category: "international" | "regional" | "award" | "accreditation";
  image: string;
  imageAlt: string;
  description: string;
  verificationUrl?: string;
}

export interface NavigationItem {
  id: string;
  labelKey: string;
  href: string;
  sectionId: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  website?: string;
  websiteLabel?: string;
}
