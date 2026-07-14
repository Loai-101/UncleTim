/**
 * Injects Schema.org JSON-LD without affecting visual layout.
 * Escapes `<` so string content cannot break out of the script element (XSS).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // Trusted structured data built server-side from static content only.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
