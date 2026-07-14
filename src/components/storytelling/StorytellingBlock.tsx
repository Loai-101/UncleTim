"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GoldDivider } from "@/components/shared/GoldDivider";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { QuoteBlock } from "@/components/storytelling/QuoteBlock";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { StoryBlock } from "@/types/content";

type StorytellingBlockProps = {
  story: StoryBlock;
  className?: string;
};

function MetaRow({ year, location }: { year?: string; location?: string }) {
  if (!year && !location) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] tracking-[0.18em] text-luxury-gold uppercase">
      {year ? <span>{year}</span> : null}
      {year && location ? (
        <span aria-hidden="true" className="text-luxury-gold/40">
          ·
        </span>
      ) : null}
      {location ? <span>{location}</span> : null}
    </div>
  );
}

function StoryCopy({
  story,
  className,
}: {
  story: StoryBlock;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="eyebrow-label">{story.eyebrow}</p>
      <h3 className="font-display text-2xl leading-snug text-burgundy sm:text-3xl lg:text-4xl">
        {story.title}
      </h3>
      <div className="max-w-[8rem]">
        <GoldDivider variant="thin" />
      </div>
      <MetaRow year={story.year} location={story.location} />
      <p className="body-standard max-w-xl">{story.description}</p>
      {story.quote ? <QuoteBlock quote={story.quote} className="mt-2" /> : null}
    </div>
  );
}

function ParallaxImage({
  src,
  alt,
  className,
  aspectRatio = "4 / 5",
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced = useReducedMotion();
  const enableParallax = isDesktop && !prefersReduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? ["-6%", "6%"] : ["0%", "0%"],
  );

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      <motion.div style={{ y }} className="absolute inset-[-8%] h-[116%] w-full">
        <ImagePlaceholder
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-full w-full"
        />
      </motion.div>
    </div>
  );
}

/**
 * Editorial storytelling block with layout variants and desktop-only parallax.
 */
export function StorytellingBlock({
  story,
  className,
}: StorytellingBlockProps) {
  const variant = story.layoutVariant;

  if (variant === "full-width-float") {
    return (
      <article className={cn("relative", className)}>
        <div className="relative min-h-[28rem] overflow-hidden sm:min-h-[34rem] lg:min-h-[40rem]">
          <ParallaxImage
            src={story.image}
            alt={story.imageAlt}
            className="absolute inset-0 h-full w-full"
            aspectRatio="auto"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-burgundy/85 via-burgundy/35 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
            <div className="max-w-xl border border-luxury-gold/35 bg-ivory/95 p-6 backdrop-blur-sm sm:p-8">
              <StoryCopy story={story} />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"
        />
      </article>
    );
  }

  if (variant === "dual-image") {
    return (
      <article
        className={cn(
          "grid items-center gap-8 lg:grid-cols-12 lg:gap-10",
          className,
        )}
      >
        <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:gap-4">
          <ParallaxImage
            src={story.image}
            alt={story.imageAlt}
            aspectRatio="3 / 4"
            className="mt-8"
          />
          <ParallaxImage
            src={story.secondaryImage ?? story.image}
            alt={story.secondaryImageAlt ?? story.imageAlt}
            aspectRatio="3 / 4"
            className="mb-8"
          />
        </div>
        <StoryCopy story={story} className="lg:col-span-5" />
        <div
          aria-hidden="true"
          className="col-span-full mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-luxury-gold to-transparent lg:mt-4"
        />
      </article>
    );
  }

  if (variant === "portrait-vertical") {
    return (
      <article
        className={cn(
          "grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12",
          className,
        )}
      >
        <div className="lg:col-span-5">
          <ParallaxImage
            src={story.image}
            alt={story.imageAlt}
            aspectRatio="3 / 4"
            className="h-full min-h-[22rem]"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 lg:col-span-7 lg:ps-4">
          <p
            aria-hidden="true"
            className="eyebrow-label hidden tracking-[0.35em] text-luxury-gold/50 lg:block"
            style={{ writingMode: "vertical-rl" }}
          >
            {story.eyebrow}
          </p>
          <StoryCopy story={story} />
        </div>
        <div
          aria-hidden="true"
          className="col-span-full mx-auto h-px w-24 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"
        />
      </article>
    );
  }

  const imageLeft = variant === "image-left";

  return (
    <article
      className={cn(
        "grid items-center gap-8 lg:grid-cols-12 lg:gap-12",
        className,
      )}
    >
      <div
        className={cn(
          "lg:col-span-6",
          imageLeft ? "lg:order-1" : "lg:order-2",
        )}
      >
        <ParallaxImage
          src={story.image}
          alt={story.imageAlt}
          aspectRatio="4 / 5"
        />
      </div>
      <StoryCopy
        story={story}
        className={cn(
          "lg:col-span-6",
          imageLeft ? "lg:order-2" : "lg:order-1",
        )}
      />
      <div
        aria-hidden="true"
        className="col-span-full mx-auto h-px w-24 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"
      />
    </article>
  );
}
