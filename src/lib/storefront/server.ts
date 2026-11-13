import "server-only";

import { cookies } from "next/headers";

import { STOREFRONT_COOKIE, parseStorefront, type Storefront } from "./product-routing";

/** Storefront for shared pages (account, login) based on the last storefront the visitor browsed. */
export async function getRequestStorefront(): Promise<Storefront> {
  const store = await cookies();
  return parseStorefront(store.get(STOREFRONT_COOKIE)?.value);
}
