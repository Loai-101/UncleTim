import Image from "next/image";
import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  aspectRatio?: string;
};

export function ImagePlaceholder({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  className,
  sizes,
  aspectRatio,
}: ImagePlaceholderProps) {
  const frameCorners = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-2 top-2 z-10 size-4 border-s border-t border-luxury-gold/70 sm:size-5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-2 top-2 z-10 size-4 border-e border-t border-luxury-gold/70 sm:size-5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 start-2 z-10 size-4 border-s border-b border-luxury-gold/70 sm:size-5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 end-2 z-10 size-4 border-e border-b border-luxury-gold/70 sm:size-5"
      />
    </>
  );

  if (fill) {
    return (
      <div
        className={cn("relative overflow-hidden bg-burgundy/5", className)}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {frameCorners}
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "100vw"}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy/20 via-transparent to-transparent"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative inline-block overflow-hidden bg-burgundy/5", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {frameCorners}
      <Image
        src={src}
        alt={alt}
        width={width ?? 800}
        height={height ?? 600}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy/20 via-transparent to-transparent"
      />
    </div>
  );
}
