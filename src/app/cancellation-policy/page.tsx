import { redirect } from "next/navigation";

/** Cancellation is now part of Returns & Refunds. */
export default function CancellationPolicyRedirect() {
  redirect("/return-policy");
}
