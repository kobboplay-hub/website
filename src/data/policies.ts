/**
 * Default policy & FAQ page content — edit here until CMS/Shopify pages are wired.
 */

export interface PolicySection {
  title: string;
  paragraphs: string[];
}

export interface PolicyPageContent {
  title: string;
  description: string;
  sections: PolicySection[];
}

export const faqsPageContent: PolicyPageContent = {
  title: "Frequently Asked Questions",
  description: "Quick answers about shopping, delivery and returns at Kobbo.",
  sections: [
    {
      title: "What age group are Kobbo toys suitable for?",
      paragraphs: [
        "Each product page lists recommended age ranges. Always supervise younger children during play.",
      ],
    },
    {
      title: "How long does delivery take?",
      paragraphs: [
        "Most orders are delivered within 3–7 business days across India. Remote areas may take a little longer.",
      ],
    },
    {
      title: "Can I return a product?",
      paragraphs: [
        "Yes. Eligible items can be returned within 7 days if unused and in original packaging. See our Return Policy for details.",
      ],
    },
    {
      title: "Is cash on delivery available?",
      paragraphs: [
        "COD availability depends on your pin code and is shown at Shopify checkout.",
      ],
    },
    {
      title: "How do I contact customer care?",
      paragraphs: [
        "Email kobboplay@gmail.com or call +91 8329195232. We aim to respond within 24 hours on business days.",
      ],
    },
  ],
};

export const shippingPolicyContent: PolicyPageContent = {
  title: "Shipping Policy",
  description: "How we pack and deliver your Kobbo orders.",
  sections: [
    {
      title: "Processing time",
      paragraphs: [
        "Orders are processed within 1–2 business days after payment confirmation.",
      ],
    },
    {
      title: "Delivery timeline",
      paragraphs: [
        "Estimated delivery is 3–7 business days for most locations in India. You will receive tracking details when your order ships.",
      ],
    },
    {
      title: "Shipping charges",
      paragraphs: [
        "Free shipping may apply on qualifying orders. Final shipping cost is calculated at Shopify checkout.",
      ],
    },
  ],
};

export const returnPolicyContent: PolicyPageContent = {
  title: "Return Policy",
  description: "Our 7-day easy return guidelines.",
  sections: [
    {
      title: "Eligibility",
      paragraphs: [
        "Products must be unused, undamaged and in original packaging within 7 days of delivery.",
      ],
    },
    {
      title: "How to request a return",
      paragraphs: [
        "Contact us at kobboplay@gmail.com with your order number and reason for return. Our team will guide you through the next steps.",
      ],
    },
    {
      title: "Refunds",
      paragraphs: [
        "Approved refunds are processed to your original payment method within 5–10 business days after we receive the returned item.",
      ],
    },
  ],
};

export const privacyPolicyContent: PolicyPageContent = {
  title: "Privacy Policy",
  description: "How Kobbo handles your personal information.",
  sections: [
    {
      title: "Information we collect",
      paragraphs: [
        "We collect information you provide when creating an account, placing an order or contacting customer care — such as name, email, phone and shipping address.",
      ],
    },
    {
      title: "How we use it",
      paragraphs: [
        "Your data is used to process orders, provide support and improve your shopping experience. Payment processing is handled securely by Shopify and its payment partners.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        "For privacy questions, email kobboplay@gmail.com.",
      ],
    },
  ],
};

export const termsPolicyContent: PolicyPageContent = {
  title: "Terms & Conditions",
  description: "Terms for using the Kobbo website and purchasing products.",
  sections: [
    {
      title: "Orders & pricing",
      paragraphs: [
        "All prices are listed in INR unless stated otherwise. We reserve the right to correct pricing errors and cancel orders affected by such errors.",
      ],
    },
    {
      title: "Product information",
      paragraphs: [
        "We aim to display accurate product images and descriptions. Minor variations in colour or packaging may occur.",
      ],
    },
    {
      title: "Limitation of liability",
      paragraphs: [
        "Kobbo is not liable for indirect damages arising from use of our products beyond applicable consumer protection laws.",
      ],
    },
  ],
};

export const contactPageContent: PolicyPageContent = {
  title: "Customer Care",
  description: "We're here to help with orders, products and returns.",
  sections: [
    {
      title: "Email",
      paragraphs: ["kobboplay@gmail.com"],
    },
    {
      title: "Phone",
      paragraphs: ["+91 8329195232"],
    },
    {
      title: "Hours",
      paragraphs: [
        "Monday – Saturday, 10:00 AM – 6:00 PM IST. We respond to emails within 24 hours on business days.",
      ],
    },
  ],
};
