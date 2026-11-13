import { redirect } from "next/navigation";
import { getCustomerToken } from "@/lib/auth/session";
import { getLoginPath } from "@/lib/storefront/product-routing";

export async function requireAuthRedirect(path: string): Promise<void> {
  const token = await getCustomerToken();
  if (!token) {
    redirect(getLoginPath(path));
  }
}
