import EmptyState from "@/components/ui/EmptyState";
import { errorStates } from "@/data/empty-states";

export default function ShopError() {
  return (
    <div className="mt-8">
      <EmptyState
        title={errorStates.shop.title}
        description={errorStates.shop.description}
        cta="Browse Shop"
        ctaHref="/shop"
      />
    </div>
  );
}
