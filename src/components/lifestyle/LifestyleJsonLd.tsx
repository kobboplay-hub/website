/** Renders schema.org JSON-LD; `<` is escaped so product text cannot close the script tag. */
export default function LifestyleJsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
