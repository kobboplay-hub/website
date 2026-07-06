import type { Metadata } from "next";
import PolicyPageLayout from "@/components/policy/PolicyPageLayout";
import { shippingPolicyContent } from "@/data/policies";
import { policyMetadata } from "@/data/seo";

export const metadata: Metadata = policyMetadata(
  shippingPolicyContent.title,
  shippingPolicyContent.description,
);

export default function ShippingPolicyPage() {
  return <PolicyPageLayout content={shippingPolicyContent} />;
}
