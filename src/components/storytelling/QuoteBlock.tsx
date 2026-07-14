import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type QuoteBlockProps = {
  quote: string;
  className?: string;
};

/**
 * Elegant archival quote with gold Quote icon.
 */
export function QuoteBlock({ quote, className }: QuoteBlockProps) {
  return (
    <blockquote
      className={cn(
        "relative border-s-2 border-luxury-gold/60 ps-5 sm:ps-6",
        className,
      )}
    >
      <Quote
        className="mb-3 size-6 text-luxury-gold sm:size-7"
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <p className="quote-text">{quote}</p>
    </blockquote>
  );
}
