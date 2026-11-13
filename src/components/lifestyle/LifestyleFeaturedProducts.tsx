import type { LifestyleCardProduct } from "@/lib/storefront/lifestyle-card";
import LifestyleProductCard from "./LifestyleProductCard";
import LifestyleSectionHeading from "./LifestyleSectionHeading";

export default function LifestyleFeaturedProducts({ products }: { products: LifestyleCardProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section id="featured" aria-labelledby="lifestyle-featured" className="scroll-mt-24 bg-ls-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LifestyleSectionHeading
          id="lifestyle-featured"
          eyebrow="Featured"
          title="Chosen for everyday living"
          action={{ label: "Shop all", href: "#all-products" }}
        />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {products.slice(0, 8).map((product, index) => (
            <li key={product.id}>
              <LifestyleProductCard product={product} priority={index < 2} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
