import { NextResponse } from "next/server";
import {
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "@/lib/shopify/cart";

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
        const cart = await createCart();
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
          const newCart = await createCart();
          id = newCart.id;
        }

        try {
          const cart = await addToCart(id, merchandiseId, quantity);
          return NextResponse.json({ cart });
        } catch {
          const newCart = await createCart();
          const cart = await addToCart(newCart.id, merchandiseId, quantity);
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
        const cart = await updateCartItem(cartId, lineId, quantity);
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
        const cart = await removeCartItem(cartId, lineId);
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
