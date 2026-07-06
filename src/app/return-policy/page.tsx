import type { Metadata } from "next";
import PolicyPageLayout from "@/components/policy/PolicyPageLayout";
import { returnPolicyContent } from "@/data/policies";
import { policyMetadata } from "@/data/seo";

export const metadata: Metadata = policyMetadata(
  returnPolicyContent.title,
  returnPolicyContent.description,
);

export default function ReturnPolicyPage() {
  return <PolicyPageLayout content={returnPolicyContent} />;
}
