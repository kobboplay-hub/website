import type { Metadata } from "next";
import PolicyPageLayout from "@/components/policy/PolicyPageLayout";
import { privacyPolicyContent } from "@/data/policies";
import { policyMetadata } from "@/data/seo";

export const metadata: Metadata = policyMetadata(
  privacyPolicyContent.title,
  privacyPolicyContent.description,
);

export default function PrivacyPolicyPage() {
  return <PolicyPageLayout content={privacyPolicyContent} />;
}
