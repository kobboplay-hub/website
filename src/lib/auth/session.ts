import { cookies } from "next/headers";

export const CUSTOMER_TOKEN_COOKIE = "kobbo_customer_token";

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

export async function setCustomerToken(
  accessToken: string,
  expiresAt: string,
): Promise<void> {
  const cookieStore = await cookies();
  const expiresDate = new Date(expiresAt);
  const maxAge = Math.max(
    0,
    Math.floor((expiresDate.getTime() - Date.now()) / 1000),
  );

  cookieStore.set(CUSTOMER_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24 * 14,
  });
}

export async function clearCustomerToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
}

export async function requireCustomerToken(): Promise<string> {
  const token = await getCustomerToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  return token;
}
