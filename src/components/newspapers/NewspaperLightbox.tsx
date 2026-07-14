"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import type { NewspaperArticle } from "@/types/gallery";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

type NewspaperLightboxProps = {
  articles: NewspaperArticle[];
  open: boolean;
  index: number;
  onClose: () => void;
};

/**
 * Full-screen lightbox for press covers with captions and zoom.
 */
export function NewspaperLightbox({
  articles,
  open,
  index,
  onClose,
}: NewspaperLightboxProps) {
  const slides = articles.map((article) => ({
    src: article.coverImage,
    alt: article.coverImageAlt || article.title,
    title: article.title,
    description: [article.publicationName, article.publicationDate, article.country]
      .filter(Boolean)
      .join(" · "),
  }));

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Captions, Zoom]}
      captions={{ showToggle: true, descriptionTextAlign: "center" }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      controller={{ closeOnBackdropClick: true }}
      styles={{
        container: { backgroundColor: "rgba(58, 0, 12, 0.96)" },
      }}
    />
  );
}
