import { shopifyFetch } from "./index";
import {
  CART_CREATE_MUTATION,
  GET_CART_QUERY,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from "./cart-queries";
import type {
  Cart,
  CartLine,
  ShopifyCartNode,
  ShopifyCartUserError,
} from "./cart-types";
import type { Product } from "./types";

const CART_FETCH_OPTIONS = { revalidate: false as const, cache: "no-store" as RequestCache };

function parseUserErrors(errors: ShopifyCartUserError[]): void {
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }
}

function normalizeCartLine(node: ShopifyCartNode["lines"]["edges"][0]["node"]): CartLine {
  const merchandise = node.merchandise;
  return {
    id: node.id,
    quantity: node.quantity,
    merchandiseId: merchandise.id,
    variantTitle: merchandise.title,
    productTitle: merchandise.product.title,
    productHandle: merchandise.product.handle,
    imageUrl: merchandise.product.featuredImage?.url ?? null,
    imageAlt: merchandise.product.featuredImage?.altText ?? null,
    price: parseFloat(merchandise.price.amount),
    lineTotal: parseFloat(node.cost.totalAmount.amount),
    currencyCode: node.cost.totalAmount.currencyCode,
  };
}

export function normalizeCart(node: ShopifyCartNode | null): Cart | null {
  if (!node) return null;

  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    subtotal: parseFloat(node.cost.subtotalAmount.amount),
    total: parseFloat(node.cost.totalAmount.amount),
    currencyCode: node.cost.subtotalAmount.currencyCode,
    lines: node.lines.edges.map((edge) => normalizeCartLine(edge.node)),
  };
}

async function fetchCartNode(cartId: string): Promise<ShopifyCartNode | null> {
  const data = await shopifyFetch<{ cart: ShopifyCartNode | null }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    ...CART_FETCH_OPTIONS,
  });
  return data.cart;
}

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query: CART_CREATE_MUTATION,
    variables: { input: {} },
    ...CART_FETCH_OPTIONS,
  });

  parseUserErrors(data.cartCreate.userErrors);

  const cart = normalizeCart(data.cartCreate.cart);
  if (!cart) throw new Error("Failed to create cart");
  return cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const node = await fetchCartNode(cartId);
  return normalizeCart(node);
}

export async function addToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }],
    },
    ...CART_FETCH_OPTIONS,
  });

  parseUserErrors(data.cartLinesAdd.userErrors);

  const cart = normalizeCart(data.cartLinesAdd.cart);
  if (!cart) throw new Error("Failed to add item to cart");
  return cart;
}

export async function updateCartItem(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    ...CART_FETCH_OPTIONS,
  });

  parseUserErrors(data.cartLinesUpdate.userErrors);

  const cart = normalizeCart(data.cartLinesUpdate.cart);
  if (!cart) throw new Error("Failed to update cart item");
  return cart;
}

export async function removeCartItem(
  cartId: string,
  lineId: string,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds: [lineId],
    },
    ...CART_FETCH_OPTIONS,
  });

  parseUserErrors(data.cartLinesRemove.userErrors);

  const cart = normalizeCart(data.cartLinesRemove.cart);
  if (!cart) throw new Error("Failed to remove cart item");
  return cart;
}

/** Pick first available variant, or first variant as fallback */
export function getDefaultMerchandiseId(product: Product): string | null {
  const available = product.variants.find((v) => v.availableForSale);
  const variant = available ?? product.variants[0];
  return variant?.id ?? null;
}

export const CART_STORAGE_KEY = "kobbo-cart-id";

export const FREE_SHIPPING_THRESHOLD = 999;
