import { handleCustomerAccountCallback } from "@/lib/auth/customer-account-callback-handler";

export async function GET(request: Request) {
  return handleCustomerAccountCallback(request);
}
