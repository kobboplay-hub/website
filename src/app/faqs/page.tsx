import type { Metadata } from "next";
import PolicyPageLayout from "@/components/policy/PolicyPageLayout";
import { faqsPageContent } from "@/data/policies";
import { policyMetadata } from "@/data/seo";

export const metadata: Metadata = policyMetadata(
  faqsPageContent.title,
  faqsPageContent.description,
);

export default function FaqsPage() {
  return <PolicyPageLayout content={faqsPageContent} />;
}
