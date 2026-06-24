import { redirect } from "next/navigation";
import { getCustomerToken } from "@/lib/auth/session";

export async function requireAuthRedirect(path: string): Promise<void> {
  const token = await getCustomerToken();
  if (!token) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`);
  }
}
