/**
 * EDITABLE: Product page FAQ defaults.
 * PDP uses these until Shopify metafield `custom.product_faqs` is wired.
 */

export interface ProductFAQ {
  question: string;
  answer: string;
}

export const productFaqs: ProductFAQ[] = [
  {
    question: "What age group is this toy suitable for?",
    answer:
      "Please refer to the product description for age recommendations. Always supervise play for younger children.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are typically delivered within 3–7 business days across India. Delivery timelines may vary by location.",
  },
  {
    question: "Can I return this product?",
    answer:
      "Yes. We offer a 7-day easy return policy on eligible products. Items must be unused and in original packaging.",
  },
  {
    question: "Is cash on delivery available?",
    answer:
      "Cash on delivery availability depends on your pin code and will be shown at checkout.",
  },
  {
    question: "How can I contact customer care?",
    answer:
      "Reach us at kobboplay@gmail.com or call +91 8329195232. We respond within 24 hours on business days.",
  },
];
