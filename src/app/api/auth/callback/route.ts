import { handleCustomerAccountCallback } from "@/lib/auth/customer-account-callback-handler";

/** Legacy alias — prefer /account/authorize in Shopify Headless callback settings. */
export async function GET(request: Request) {
  return handleCustomerAccountCallback(request);
}
