import type { Metadata } from "next";
import PolicyPageLayout from "@/components/policy/PolicyPageLayout";
import { termsPolicyContent } from "@/data/policies";
import { policyMetadata } from "@/data/seo";

export const metadata: Metadata = policyMetadata(
  termsPolicyContent.title,
  termsPolicyContent.description,
);

export default function TermsPage() {
  return <PolicyPageLayout content={termsPolicyContent} />;
}
