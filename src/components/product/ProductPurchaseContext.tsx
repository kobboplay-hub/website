"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { Product } from "@/lib/shopify/types";

interface ProductPurchaseState {
  product: Product;
  selectedVariantId: string;
  setSelectedVariantId: Dispatch<SetStateAction<string>>;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
}

const ProductPurchaseContext = createContext<ProductPurchaseState | null>(null);

export function ProductPurchaseProvider({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((variant) => variant.availableForSale)?.id ??
      product.variants[0]?.id ??
      "",
  );
  const [quantity, setQuantity] = useState(1);

  return (
    <ProductPurchaseContext.Provider
      value={{ product, selectedVariantId, setSelectedVariantId, quantity, setQuantity }}
    >
      {children}
    </ProductPurchaseContext.Provider>
  );
}

export function useProductPurchase() {
  const context = useContext(ProductPurchaseContext);
  if (!context) {
    throw new Error("Product purchase controls must be inside ProductPurchaseProvider");
  }
  return context;
}
