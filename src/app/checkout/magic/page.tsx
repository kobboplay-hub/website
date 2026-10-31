import { redirect } from "next/navigation";

import MagicCheckoutClient from "./MagicCheckoutClient";

export default async function MagicCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ cartId?: string }>;
}) {
  const { cartId } = await searchParams;
  if (!cartId) redirect("/cart");

  return <MagicCheckoutClient cartId={cartId} />;
}
