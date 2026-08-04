import type { Metadata } from "next";
import PolicyPageLayout from "@/components/policy/PolicyPageLayout";
import { cancellationPolicyContent } from "@/data/policies";
import { policyMetadata } from "@/data/seo";

export const metadata: Metadata = policyMetadata(
  cancellationPolicyContent.title,
  cancellationPolicyContent.description,
);

export default function CancellationPolicyPage() {
  return <PolicyPageLayout content={cancellationPolicyContent} />;
}
