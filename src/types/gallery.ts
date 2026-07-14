export type GalleryCategory =
  | "royal"
  | "training"
  | "championships"
  | "historical"
  | "international"
  | "personal";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  year?: string;
  title?: string;
  width: number;
  height: number;
}

export type NewspaperCategory =
  | "newspaper"
  | "magazine"
  | "interview"
  | "report";

export type NewspaperLanguage = "ar" | "en" | "fr";

export interface NewspaperArticle {
  id: string;
  coverImage: string;
  coverImageAlt: string;
  publicationName: string;
  title: string;
  publicationDate: string;
  language: NewspaperLanguage;
  country: string;
  category: NewspaperCategory;
  pageNumber?: string;
  summary: string;
}
