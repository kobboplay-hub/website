import { notFound } from "next/navigation";
import { getAgeGroupByHandle } from "@/lib/shopify";

/**
 * Validates the handle above the segment's loading boundary so unknown age
 * groups respond with a real 404 status instead of a streamed soft 404.
 */
export default async function ShopByAgeHandleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let exists = true;
  try {
    exists = (await getAgeGroupByHandle(handle)) !== null;
  } catch {
    // Shopify unavailable — the page renders its own error state
  }

  if (!exists) notFound();

  return children;
}
