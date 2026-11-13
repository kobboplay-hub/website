import "server-only";

import { redirect } from "next/navigation";

import { getPathStorefront, getStorefrontPath } from "./product-routing";

export type AuthSearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Toys auth pages forward to their Lifestyle twin when the post-login destination is a
 * Lifestyle page, so older `/login?redirect=/lifestyle/...` links stay inside Lifestyle.
 */
export async function redirectToLifestyleAuthPage(path: string, searchParams: AuthSearchParams): Promise<void> {
  const params = await searchParams;
  const target = typeof params.redirect === "string" ? params.redirect : null;
  if (getPathStorefront(target) !== "lifestyle") return;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }
  redirect(`${getStorefrontPath("lifestyle", path)}?${query}`);
}
