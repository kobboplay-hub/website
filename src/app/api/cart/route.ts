import { NextResponse } from "next/server";
import {
  createCart,
  getCart,
  addToCart,
  buyNowCart,
  updateCartItem,
  removeCartItem,
} from "@/lib/shopify/cart";
import {
  prepareCheckout,
  withCustomerIdentity,
} from "@/lib/shopify/cart-customer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");

  if (!cartId) {
    return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }
    return NextResponse.json({ cart });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "create": {
        const cart = await withCustomerIdentity(await createCart());
        return NextResponse.json({ cart });
      }

      case "add": {
        const { cartId, merchandiseId, quantity = 1 } = body;
        if (!merchandiseId) {
          return NextResponse.json(
            { error: "Product variant is required" },
            { status: 400 },
          );
        }

        let id = cartId as string | undefined;
        if (!id) {
          const newCart = await withCustomerIdentity(await createCart());
          id = newCart.id;
        }

        try {
          const cart = await withCustomerIdentity(
            await addToCart(id, merchandiseId, quantity),
          );
          return NextResponse.json({ cart });
        } catch {
          const newCart = await withCustomerIdentity(await createCart());
          const cart = await withCustomerIdentity(
            await addToCart(newCart.id, merchandiseId, quantity),
          );
          return NextResponse.json({ cart });
        }
      }

      case "update": {
        const { cartId, lineId, quantity } = body;
        if (!cartId || !lineId || quantity === undefined) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
          );
        }
        const cart = await withCustomerIdentity(
          await updateCartItem(cartId, lineId, quantity),
        );
        return NextResponse.json({ cart });
      }

      case "remove": {
        const { cartId, lineId } = body;
        if (!cartId || !lineId) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
          );
        }
        const cart = await withCustomerIdentity(
          await removeCartItem(cartId, lineId),
        );
        return NextResponse.json({ cart });
      }

      case "buyNow": {
        const { merchandiseId, quantity = 1 } = body;
        if (!merchandiseId) {
          return NextResponse.json(
            { error: "Product variant is required" },
            { status: 400 },
          );
        }
        const cart = await withCustomerIdentity(
          await buyNowCart(merchandiseId, quantity),
        );
        return NextResponse.json({ cart });
      }

      case "prepareCheckout": {
        const { cartId } = body;
        if (!cartId) {
          return NextResponse.json(
            { error: "Cart ID is required" },
            { status: 400 },
          );
        }
        const cart = await prepareCheckout(cartId);
        return NextResponse.json({ cart });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cart operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
