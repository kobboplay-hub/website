import type { Metadata } from "next";
import PolicyPageLayout from "@/components/policy/PolicyPageLayout";
import { contactPageContent } from "@/data/policies";
import { policyMetadata } from "@/data/seo";

export const metadata: Metadata = policyMetadata(
  contactPageContent.title,
  contactPageContent.description,
);

export default function ContactPage() {
  return <PolicyPageLayout content={contactPageContent} />;
}
