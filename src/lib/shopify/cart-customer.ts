import "server-only";

import { getCustomerToken } from "@/lib/auth/session";
import {
  isIndiaCountry,
  normalizeCountry,
  normalizeIndianProvince,
} from "@/lib/data/india-provinces";
import { shopifyFetch } from "./index";
import { getCurrentCustomer } from "./customer";
import { CART_BUYER_IDENTITY_UPDATE_MUTATION } from "./cart-queries";
import { getCart, normalizeCart } from "./cart";
import type { Cart, ShopifyCartNode, ShopifyCartUserError } from "./cart-types";

const CART_FETCH_OPTIONS = { revalidate: false as const, cache: "no-store" as RequestCache };

interface CartBuyerIdentityInput {
  customerAccessToken?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  deliveryAddressPreferences?: Array<{
    deliveryAddress: Record<string, string>;
    oneTimeUse?: boolean;
  }>;
}

function parseUserErrors(errors: ShopifyCartUserError[]): void {
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }
}

function compactAddress(
  address: Record<string, string | null | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(address).filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" && entry[1].trim().length > 0,
    ),
  );
}

async function buildCartBuyerIdentity(): Promise<CartBuyerIdentityInput | null> {
  const token = await getCustomerToken();
  if (!token) return null;

  const customer = await getCurrentCustomer(token);
  if (!customer) return null;

  const identity: CartBuyerIdentityInput = {
    customerAccessToken: token,
    email: customer.email,
  };

  const phone = customer.phone ?? customer.defaultAddress?.phone;
  if (phone) {
    identity.phone = phone;
  }

  const address = customer.defaultAddress;
  if (address?.address1 && address.city && address.country) {
    let province = address.province ?? "";
    const country = normalizeCountry(address.country);

    if (isIndiaCountry(country)) {
      identity.countryCode = "IN";
      province = normalizeIndianProvince(province) ?? province;
    }

    identity.deliveryAddressPreferences = [
      {
        oneTimeUse: false,
        deliveryAddress: compactAddress({
          firstName: address.firstName ?? customer.firstName,
          lastName: address.lastName ?? customer.lastName,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          province,
          country,
          zip: address.zip,
          phone: address.phone ?? customer.phone,
        }),
      },
    ];
  }

  return identity;
}

async function attachCustomerToCart(cart: Cart): Promise<Cart> {
  const buyerIdentity = await buildCartBuyerIdentity();
  if (!buyerIdentity) return cart;

  const data = await shopifyFetch<{
    cartBuyerIdentityUpdate: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query: CART_BUYER_IDENTITY_UPDATE_MUTATION,
    variables: { cartId: cart.id, buyerIdentity },
    ...CART_FETCH_OPTIONS,
  });

  parseUserErrors(data.cartBuyerIdentityUpdate.userErrors);

  const updatedCart = normalizeCart(data.cartBuyerIdentityUpdate.cart);
  if (!updatedCart) throw new Error("Failed to update checkout details");
  return updatedCart;
}

export async function withCustomerIdentity(cart: Cart): Promise<Cart> {
  try {
    return await attachCustomerToCart(cart);
  } catch {
    return cart;
  }
}

export async function prepareCheckout(cartId: string): Promise<Cart> {
  const cart = await getCart(cartId);
  if (!cart) throw new Error("Cart not found");
  if (cart.lines.length === 0) throw new Error("Your cart is empty");

  return attachCustomerToCart(cart);
}
