"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Cart } from "@/lib/shopify/cart-types";
import { CART_STORAGE_KEY } from "@/lib/shopify/cart";

type PendingAction =
  | { type: "add"; merchandiseId: string }
  | { type: "buyNow"; merchandiseId: string }
  | { type: "line"; lineId: string }
  | { type: "checkout" }
  | null;

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  cartCount: number;
  subtotal: number;
  currencyCode: string;
  checkoutUrl: string | null;
  isDrawerOpen: boolean;
  isAddingMerchandise: (merchandiseId: string) => boolean;
  isLineLoading: (lineId: string) => boolean;
  isCheckoutLoading: boolean;
  addToCart: (
    merchandiseId: string,
    quantity?: number,
    options?: { openDrawer?: boolean },
  ) => Promise<Cart | null>;
  buyNow: (
    merchandiseId: string,
    quantity?: number,
  ) => Promise<string | null>;
  isBuyNowLoading: (merchandiseId: string) => boolean;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  clearError: () => void;
  refreshCart: () => Promise<void>;
  proceedToCheckout: () => Promise<string | null>;
  setCheckoutLoading: (loading: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

async function fetchCart(cartId: string): Promise<Cart | null> {
  const res = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    const data = await res.json();
    throw new Error(data.error ?? "Failed to load cart");
  }
  const data = await res.json();
  return data.cart;
}

async function postCart(body: Record<string, unknown>): Promise<Cart> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Cart operation failed");
  return data.cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const saveCartId = useCallback((cartId: string) => {
    localStorage.setItem(CART_STORAGE_KEY, cartId);
  }, []);

  const removeCartId = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartId) {
      setCart(null);
      return;
    }
    const fetched = await fetchCart(cartId);
    if (!fetched) {
      removeCartId();
      setCart(null);
      return;
    }
    setCart(fetched);
    saveCartId(fetched.id);
  }, [removeCartId, saveCartId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshCart();
      } catch (err) {
        if (!cancelled) {
          console.error("Cart init error:", err);
          removeCartId();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshCart, removeCartId]);

  const isAddingMerchandise = useCallback(
    (merchandiseId: string) =>
      pendingAction?.type === "add" &&
      pendingAction.merchandiseId === merchandiseId,
    [pendingAction],
  );

  const isBuyNowLoading = useCallback(
    (merchandiseId: string) =>
      pendingAction?.type === "buyNow" &&
      pendingAction.merchandiseId === merchandiseId,
    [pendingAction],
  );

  const isLineLoading = useCallback(
    (lineId: string) =>
      pendingAction?.type === "line" && pendingAction.lineId === lineId,
    [pendingAction],
  );

  const isCheckoutLoading = pendingAction?.type === "checkout";

  const setCheckoutLoading = useCallback((loading: boolean) => {
    setPendingAction(loading ? { type: "checkout" } : null);
  }, []);

  const proceedToCheckout = useCallback(async (): Promise<string | null> => {
    const cartId = cart?.id ?? localStorage.getItem(CART_STORAGE_KEY);
    if (!cartId) return null;

    setPendingAction({ type: "checkout" });
    setError(null);

    try {
      const updated = await postCart({
        action: "prepareCheckout",
        cartId,
      });
      setCart(updated);
      saveCartId(updated.id);
      return updated.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not start checkout",
      );
      return null;
    } finally {
      setPendingAction(null);
    }
  }, [cart?.id, saveCartId]);

  const buyNow = useCallback(
    async (merchandiseId: string, quantity = 1): Promise<string | null> => {
      setPendingAction({ type: "buyNow", merchandiseId });
      setError(null);
      try {
        const checkoutCart = await postCart({
          action: "buyNow",
          merchandiseId,
          quantity,
        });
        setCart(checkoutCart);
        saveCartId(checkoutCart.id);
        return checkoutCart.checkoutUrl;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not start checkout",
        );
        return null;
      } finally {
        setPendingAction(null);
      }
    },
    [saveCartId],
  );

  const addToCart = useCallback(
    async (
      merchandiseId: string,
      quantity = 1,
      options?: { openDrawer?: boolean },
    ): Promise<Cart | null> => {
      setPendingAction({ type: "add", merchandiseId });
      setError(null);
      try {
        const cartId = localStorage.getItem(CART_STORAGE_KEY);
        const updated = await postCart({
          action: "add",
          cartId,
          merchandiseId,
          quantity,
        });
        setCart(updated);
        saveCartId(updated.id);
        if (options?.openDrawer !== false) setIsDrawerOpen(true);
        return updated;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not add item to cart",
        );
        if (options?.openDrawer !== false) setIsDrawerOpen(true);
        return null;
      } finally {
        setPendingAction(null);
      }
    },
    [saveCartId],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      const cartId = cart?.id ?? localStorage.getItem(CART_STORAGE_KEY);
      if (!cartId) return;

      setPendingAction({ type: "line", lineId });
      setError(null);

      const previousCart = cart;
      if (cart) {
        setCart({
          ...cart,
          lines: cart.lines.map((line) =>
            line.id === lineId ? { ...line, quantity } : line,
          ),
        });
      }

      try {
        if (quantity < 1) {
          const updated = await postCart({ action: "remove", cartId, lineId });
          setCart(updated);
          saveCartId(updated.id);
        } else {
          const updated = await postCart({
            action: "update",
            cartId,
            lineId,
            quantity,
          });
          setCart(updated);
          saveCartId(updated.id);
        }
      } catch (err) {
        setCart(previousCart);
        setError(
          err instanceof Error ? err.message : "Could not update quantity",
        );
      } finally {
        setPendingAction(null);
      }
    },
    [cart, saveCartId],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      const cartId = cart?.id ?? localStorage.getItem(CART_STORAGE_KEY);
      if (!cartId) return;

      setPendingAction({ type: "line", lineId });
      setError(null);
      try {
        const updated = await postCart({ action: "remove", cartId, lineId });
        setCart(updated);
        saveCartId(updated.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not remove item");
      } finally {
        setPendingAction(null);
      }
    },
    [cart, saveCartId],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      error,
      cartCount: cart?.totalQuantity ?? 0,
      subtotal: cart?.subtotal ?? 0,
      currencyCode: cart?.currencyCode ?? "INR",
      checkoutUrl: cart?.checkoutUrl ?? null,
      isDrawerOpen,
      isAddingMerchandise,
      isBuyNowLoading,
      isLineLoading,
      isCheckoutLoading,
      addToCart,
      buyNow,
      updateQuantity,
      removeItem,
      openCart: () => setIsDrawerOpen(true),
      closeCart: () => setIsDrawerOpen(false),
      clearError: () => setError(null),
      refreshCart,
      proceedToCheckout,
      setCheckoutLoading,
    }),
    [
      cart,
      loading,
      error,
      isDrawerOpen,
      isAddingMerchandise,
      isBuyNowLoading,
      isLineLoading,
      isCheckoutLoading,
      addToCart,
      buyNow,
      updateQuantity,
      removeItem,
      refreshCart,
      proceedToCheckout,
      setCheckoutLoading,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
