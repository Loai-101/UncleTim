"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useLocale } from "next-intl";
import { getGalleryImageAlt } from "@/data/seo/localized-alts";
import type { GalleryImage } from "@/types/gallery";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

type GalleryLightboxProps = {
  images: GalleryImage[];
  open: boolean;
  index: number;
  onClose: () => void;
};

/**
 * Full-screen lightbox with captions, zoom, and keyboard navigation.
 * Loaded via dynamic import from PhotoGallery.
 */
export function GalleryLightbox({
  images,
  open,
  index,
  onClose,
}: GalleryLightboxProps) {
  const locale = useLocale();
  const slides = images.map((image) => {
    const alt = getGalleryImageAlt(image.id, locale, image.alt);
    return {
      src: image.src,
      alt,
      width: image.width,
      height: image.height,
      title: image.title,
      description: [image.year, image.category].filter(Boolean).join(" · "),
    };
  });

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
