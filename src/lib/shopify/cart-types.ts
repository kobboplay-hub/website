export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  productId: string;
  isKit: boolean;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: number;
  lineTotal: number;
  currencyCode: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  total: number;
  currencyCode: string;
  lines: CartLine[];
}

export interface ShopifyCartUserError {
  field: string[] | null;
  message: string;
}

export interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string; currencyCode: string };
    product: {
      id: string;
      title: string;
      handle: string;
      kitFlag: { value: string } | null;
      featuredImage: { url: string; altText: string | null } | null;
    };
  };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
}

export interface ShopifyCartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { edges: { node: ShopifyCartLineNode }[] };
}
