/**
 * Policy & FAQ page content — sourced from Kobbo legal PDFs (updated 04-08-2026).
 */

import { legalEntity } from "./footer";

export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullet"; text: string }
  | { type: "subtitle"; text: string };

export interface PolicySection {
  title: string;
  /** @deprecated Prefer blocks; kept for simple FAQ/contact pages */
  paragraphs?: string[];
  bullets?: string[];
  blocks?: PolicyBlock[];
}

export interface PolicyPageContent {
  title: string;
  description: string;
  lastUpdated?: string;
  intro?: string;
  sections: PolicySection[];
}

export const faqsPageContent: PolicyPageContent = {
  title: "Frequently Asked Questions",
  description: "Quick answers about shopping, delivery and returns at Kobbo.",
  sections: [
    {
      title: "What age group are Kobbo toys suitable for?",
      blocks: [
        {
          type: "paragraph",
          text: "Each product page lists recommended age ranges. Always supervise younger children during play.",
        },
      ],
    },
    {
      title: "How long does delivery take?",
      blocks: [
        {
          type: "paragraph",
          text: "Metro cities typically take 2–5 business days; most other locations 3–7 business days. Remote areas may take 5–10 business days. See our Shipping Policy for details.",
        },
      ],
    },
    {
      title: "Can I return a product?",
      blocks: [
        {
          type: "paragraph",
          text: "Yes. Eligible items can be returned within 7 calendar days of delivery if unused and in original packaging. See our Returns & Refunds policy for full conditions.",
        },
      ],
    },
    {
      title: "Is cash on delivery available?",
      blocks: [
        {
          type: "paragraph",
          text: "COD availability depends on your pin code and is shown at checkout. Kobbo may restrict COD for repeated refusals or failed delivery attempts.",
        },
      ],
    },
    {
      title: "How do I contact customer care?",
      blocks: [
        {
          type: "paragraph",
          text: "Email support@kobbo.in. We aim to respond within a reasonable timeframe on business days.",
        },
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
      blocks: [{ type: "paragraph", text: "support@kobbo.in" }],
    },
    {
      title: "Phone",
      blocks: [{ type: "paragraph", text: "+91 8329195232" }],
    },
    {
      title: "Website",
      blocks: [{ type: "paragraph", text: "www.kobbo.in" }],
    },
    {
      title: "Brand",
      blocks: [
        {
          type: "paragraph",
          text: legalEntity.ownershipLine,
        },
        {
          type: "paragraph",
          text: `Legal name: ${legalEntity.name}`,
        },
      ],
    },
  ],
};


export const shippingPolicyContent: PolicyPageContent = {
  title: "Shipping Policy",
  description: "How Kobbo packs and delivers orders across India — free shipping, timelines, and tracking.",
  lastUpdated: "04-08-2026",
  intro: `Welcome to Kobbo, a brand owned and operated by ${legalEntity.name}. We are committed to delivering your order safely and efficiently. Please read our Shipping Policy carefully before placing an order.`,
  sections: [
    {
      title: "1. Shipping Locations",
      blocks: [
          { type: "paragraph", text: "Currently, Kobbo ships only within India. We do not offer international shipping at this time." }
      ],
    },
    {
      title: "2. Order Processing",
      blocks: [
          { type: "bullet", text: "Orders are usually processed within 1–2 business days after successful payment confirmation." },
          { type: "bullet", text: "Orders placed on Sundays or public holidays will be processed on the next working day." },
          { type: "bullet", text: "During festive periods, promotional sales or unforeseen circumstances, processing may take slightly longer." }
      ],
    },
    {
      title: "3. Shipping Time",
      blocks: [
          { type: "paragraph", text: "Estimated delivery timelines:" },
          { type: "bullet", text: "Metro Cities: 2–5 business days" },
          { type: "bullet", text: "Tier 2 & Tier 3 Cities: 3–7 business days" },
          { type: "bullet", text: "Remote Locations: 5–10 business days" },
          { type: "paragraph", text: "These are estimated timelines only and are not guaranteed delivery dates." }
      ],
    },
    {
      title: "4. Free Shipping",
      blocks: [
          { type: "paragraph", text: "At Kobbo, we are pleased to offer FREE shipping on all orders across India. There are no hidden shipping charges. The price displayed at checkout is the final amount payable (excluding any applicable taxes or charges displayed during checkout, if any). In the event of any future changes to our shipping policy, the updated policy will be published on this page." }
      ],
    },
    {
      title: "5. Order Tracking",
      blocks: [
          { type: "paragraph", text: "Once your order has been dispatched, you will receive an email and/or SMS containing your tracking details. Customers are responsible for monitoring their shipment using the tracking link provided." }
      ],
    },
    {
      title: "6. Delivery Attempts",
      blocks: [
          { type: "paragraph", text: "Our courier partners generally make 2–3 delivery attempts. If delivery cannot be completed due to:" },
          { type: "bullet", text: "incorrect address" },
          { type: "bullet", text: "recipient unavailable" },
          { type: "bullet", text: "refusal to accept delivery" },
          { type: "paragraph", text: "the shipment may be returned to Kobbo. Re-shipping charges may apply." }
      ],
    },
    {
      title: "7. Incorrect Shipping Address",
      blocks: [
          { type: "paragraph", text: "Customers are responsible for providing an accurate shipping address. Kobbo shall not be responsible for delays or failed deliveries resulting from incorrect or incomplete address details." }
      ],
    },
    {
      title: "8. Delays",
      blocks: [
          { type: "paragraph", text: "While we strive to deliver every order on time, delays may occur due to:" },
          { type: "bullet", text: "weather conditions" },
          { type: "bullet", text: "strikes" },
          { type: "bullet", text: "courier delays" },
          { type: "bullet", text: "natural disasters" },
          { type: "bullet", text: "government restrictions" },
          { type: "bullet", text: "public holidays" },
          { type: "bullet", text: "force majeure events" },
          { type: "paragraph", text: "Such delays shall not make Kobbo liable for compensation." }
      ],
    },
    {
      title: "9. Damaged Packages",
      blocks: [
          { type: "paragraph", text: "If your package appears visibly damaged during delivery, we recommend:" },
          { type: "bullet", text: "taking photographs before opening the package," },
          { type: "bullet", text: "recording a continuous unboxing video," },
          { type: "bullet", text: "contacting us immediately." },
          { type: "paragraph", text: "Claims without supporting evidence may not be accepted." }
      ],
    },
    {
      title: "10. Lost Shipments",
      blocks: [
          { type: "paragraph", text: "If your shipment is marked delivered but you have not received it, please contact us within 48 hours. Kobbo will investigate the matter with the courier partner before determining the appropriate resolution." }
      ],
    },
    {
      title: "11. Order Cancellation Before Dispatch",
      blocks: [
          { type: "paragraph", text: "Orders may be cancelled before dispatch by contacting our support team. Once shipped, the order cannot be cancelled and will be governed by our Returns & Refunds policy." }
      ],
    },
    {
      title: "12. Contact",
      blocks: [
          { type: "paragraph", text: "For shipping-related assistance: Email: support@kobbo.in" }
      ],
    }
  ],
};

export const returnPolicyContent: PolicyPageContent = {
  title: "Returns & Refunds",
  description:
    "Returns, replacements, refunds and cancellations for Kobbo orders.",
  lastUpdated: "04-08-2026",
  intro:
    "At Kobbo, we strive to ensure every order reaches you in perfect condition. If you are not completely satisfied with your purchase, please review our policy below.",
  sections: [
    {
      title: "1. 7-Day Returns",
      blocks: [
        {
          type: "paragraph",
          text: "Eligible products may be returned within 7 calendar days from the date of delivery. To qualify for a return, the product must:",
        },
        { type: "bullet", text: "Be unused and unplayed with." },
        { type: "bullet", text: "Be in its original condition." },
        { type: "bullet", text: "Be returned with its original packaging." },
        {
          type: "bullet",
          text: "Include all accessories, manuals and tags.",
        },
        { type: "bullet", text: "Be accompanied by proof of purchase." },
        { type: "bullet", text: "Be in a condition suitable for resale." },
        {
          type: "paragraph",
          text: "Kobbo reserves the right to inspect returned products before approving a refund.",
        },
      ],
    },
    {
      title: "2. Items Eligible for Free Replacement",
      blocks: [
        { type: "paragraph", text: "We will gladly replace a product if:" },
        { type: "bullet", text: "The wrong product was delivered." },
        {
          type: "bullet",
          text: "The product arrived damaged during transit.",
        },
        {
          type: "bullet",
          text: "There is a verified manufacturing defect.",
        },
        {
          type: "bullet",
          text: "Essential components or accessories are missing.",
        },
        {
          type: "paragraph",
          text: "Customers must notify us within 48 hours of delivery.",
        },
      ],
    },
    {
      title: "3. Electronic Toys",
      blocks: [
        {
          type: "paragraph",
          text: "Electronic toys are not eligible for return or refund once delivered. However, if an electronic toy:",
        },
        { type: "bullet", text: "arrives damaged," },
        { type: "bullet", text: "has a verified manufacturing defect, or" },
        {
          type: "bullet",
          text: "is not functioning as intended upon first use,",
        },
        {
          type: "paragraph",
          text: "Kobbo will provide a free replacement, subject to verification. Customers must report such issues within 48 hours of delivery along with photographs or videos, and may be requested to provide an uninterrupted unboxing video.",
        },
      ],
    },
    {
      title: "4. Unboxing Video Requirement",
      blocks: [
        {
          type: "paragraph",
          text: "To help us resolve issues fairly and efficiently, customers are strongly encouraged to record a continuous, uninterrupted video while opening their package. This may be required for claims involving:",
        },
        { type: "bullet", text: "Damaged products" },
        { type: "bullet", text: "Incorrect products" },
        { type: "bullet", text: "Missing components" },
        {
          type: "bullet",
          text: "Electronic products not functioning upon delivery",
        },
        {
          type: "paragraph",
          text: "Failure to provide an unboxing video may affect our ability to process certain claims.",
        },
      ],
    },
    {
      title: "5. Non-Returnable Items",
      blocks: [
        { type: "paragraph", text: "Returns will not be accepted if:" },
        {
          type: "bullet",
          text: "The product has been used or played with.",
        },
        {
          type: "bullet",
          text: "The product has been intentionally damaged.",
        },
        {
          type: "bullet",
          text: "The product has been altered or repaired.",
        },
        {
          type: "bullet",
          text: "The original packaging is missing or significantly damaged.",
        },
        {
          type: "bullet",
          text: "Accessories, manuals or tags are missing.",
        },
        {
          type: "bullet",
          text: "The product has been damaged due to misuse, negligence or improper handling.",
        },
        { type: "bullet", text: "The product shows excessive wear." },
        {
          type: "bullet",
          text: "The product has been personalised or customised.",
        },
        {
          type: "bullet",
          text: "The return request is made after the applicable return period.",
        },
        {
          type: "bullet",
          text: "The item is an electronic toy (except for eligible replacement cases described above).",
        },
      ],
    },
    {
      title: "6. Natural Variations",
      blocks: [
        {
          type: "paragraph",
          text: "Products made from natural materials may exhibit slight variations in:",
        },
        { type: "bullet", text: "Wood grain" },
        { type: "bullet", text: "Colour" },
        { type: "bullet", text: "Texture" },
        { type: "bullet", text: "Finish" },
        {
          type: "paragraph",
          text: "These are natural characteristics and shall not be treated as manufacturing defects.",
        },
      ],
    },
    {
      title: "7. Colour Accuracy",
      blocks: [
        {
          type: "paragraph",
          text: "Actual product colours may vary slightly due to:",
        },
        { type: "bullet", text: "Studio lighting" },
        { type: "bullet", text: "Product photography" },
        { type: "bullet", text: "Device or monitor settings" },
        { type: "bullet", text: "Mobile screen display" },
        {
          type: "paragraph",
          text: "Minor colour variations do not qualify as defects.",
        },
      ],
    },
    {
      title: "8. Refund Process",
      blocks: [
        {
          type: "paragraph",
          text: "Once the returned product has been received and successfully inspected:",
        },
        {
          type: "bullet",
          text: "Approved refunds will be processed within 7–10 business days.",
        },
        {
          type: "bullet",
          text: "Refunds will be issued to the original payment method used at checkout.",
        },
        {
          type: "paragraph",
          text: "The time taken for the refund to reflect in your account may vary depending on your bank or payment provider.",
        },
      ],
    },
    {
      title: "9. Return Shipping",
      blocks: [
        { type: "paragraph", text: "For approved returns due to:" },
        { type: "bullet", text: "Manufacturing defects" },
        { type: "bullet", text: "Transit damage" },
        { type: "bullet", text: "Incorrect product delivered" },
        {
          type: "paragraph",
          text: "Kobbo will bear the return shipping cost. For approved returns due to change of mind (where eligible), customers may be required to bear the return shipping charges or arrange the return shipment, unless otherwise agreed by Kobbo.",
        },
      ],
    },
    {
      title: "10. Right to Reject Returns",
      blocks: [
        {
          type: "paragraph",
          text: "Kobbo reserves the right to decline any return or replacement request if:",
        },
        { type: "bullet", text: "The return conditions are not met." },
        {
          type: "bullet",
          text: "The product is found to be used, damaged or not in resalable condition.",
        },
        {
          type: "bullet",
          text: "Required accessories or packaging are missing.",
        },
        {
          type: "bullet",
          text: "The claim is found to be fraudulent or abusive.",
        },
        {
          type: "bullet",
          text: "The product fails inspection upon receipt.",
        },
      ],
    },
    {
      title: "11. Cancellation Policy",
      blocks: [
        { type: "subtitle", text: "Before Dispatch" },
        {
          type: "paragraph",
          text: "Orders may be cancelled free of charge any time before they have been dispatched from our warehouse.",
        },
        { type: "subtitle", text: "After Dispatch" },
        {
          type: "paragraph",
          text: "Once an order has been dispatched, it cannot be cancelled. If eligible, customers may request a return or replacement in accordance with this policy after the order has been delivered.",
        },
        { type: "subtitle", text: "Cancellation by Kobbo" },
        {
          type: "paragraph",
          text: "Kobbo reserves the right to cancel any order under circumstances including, but not limited to:",
        },
        { type: "bullet", text: "Product unavailability" },
        {
          type: "bullet",
          text: "Incorrect pricing due to technical or human error",
        },
        { type: "bullet", text: "Payment verification failure" },
        { type: "bullet", text: "Suspected fraudulent activity" },
        { type: "bullet", text: "Duplicate or suspicious orders" },
        {
          type: "bullet",
          text: "Force majeure events or circumstances beyond our reasonable control",
        },
        {
          type: "paragraph",
          text: "In such cases, any amount paid by the customer will be refunded in full to the original payment method.",
        },
        { type: "subtitle", text: "Cash on Delivery (COD)" },
        {
          type: "paragraph",
          text: "Kobbo reserves the right to refuse or restrict Cash on Delivery (COD) services for customers who repeatedly refuse deliveries, fail to accept orders, or misuse the COD facility.",
        },
      ],
    },
  ],
};

export const privacyPolicyContent: PolicyPageContent = {
  title: "Privacy Policy",
  description: `How Kobbo (${legalEntity.name}) collects, uses, and protects your personal information.`,
  lastUpdated: "04-08-2026",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
          { type: "paragraph", text: "Welcome to Kobbo, a brand owned and operated by Heena Ashok Shah (\"Kobbo\", \"we\", \"our\" or \"us\"). Your privacy matters to us. This Privacy Policy explains how we collect, use, store, process, share and protect your personal information when you visit www.kobbo.in, place an order, communicate with us or otherwise interact with our Website. By accessing or using our Website, you consent to the practices described in this Privacy Policy. If you do not agree with this Policy, please discontinue the use of our Website." }
      ],
    },
    {
      title: "2. Our Commitment",
      blocks: [
          { type: "paragraph", text: "At Kobbo, we believe trust extends beyond our products. We are committed to handling your personal information responsibly, transparently and in accordance with applicable Indian laws, including the Digital Personal Data Protection Act, 2023 (DPDP Act)." }
      ],
    },
    {
      title: "3. Information We Collect",
      blocks: [
          { type: "paragraph", text: "Depending on how you interact with us, we may collect:" },
          { type: "subtitle", text: "Personal Information" },
          { type: "bullet", text: "Full Name" },
          { type: "bullet", text: "Email Address" },
          { type: "bullet", text: "Shipping Address" },
          { type: "bullet", text: "Billing Address" },
          { type: "bullet", text: "Mobile Number (if provided)" },
          { type: "bullet", text: "Order History" },
          { type: "subtitle", text: "Payment Information" },
          { type: "paragraph", text: "Payments are processed through secure third-party payment providers. Kobbo does not store your:" },
          { type: "bullet", text: "Credit Card Number" },
          { type: "bullet", text: "Debit Card Number" },
          { type: "bullet", text: "CVV" },
          { type: "bullet", text: "UPI PIN" },
          { type: "bullet", text: "Banking Passwords" },
          { type: "paragraph", text: "Payment providers may securely process payment information according to their own privacy policies." },
          { type: "subtitle", text: "Technical Information" },
          { type: "paragraph", text: "When you browse our Website, we may automatically collect:" },
          { type: "bullet", text: "IP Address" },
          { type: "bullet", text: "Browser Type" },
          { type: "bullet", text: "Device Type" },
          { type: "bullet", text: "Operating System" },
          { type: "bullet", text: "Website Usage Information" },
          { type: "bullet", text: "Pages Visited" },
          { type: "bullet", text: "Referral Sources" },
          { type: "bullet", text: "Time Spent on Pages" },
          { type: "subtitle", text: "Cookies & Tracking Technologies" },
          { type: "paragraph", text: "We may use:" },
          { type: "bullet", text: "Cookies" },
          { type: "bullet", text: "Pixels" },
          { type: "bullet", text: "Analytics Tools" },
          { type: "bullet", text: "Session Storage" },
          { type: "bullet", text: "Browser Storage Technologies" },
          { type: "paragraph", text: "to improve Website functionality and customer experience." }
      ],
    },
    {
      title: "4. Why We Collect Your Information",
      blocks: [
          { type: "paragraph", text: "We collect information to:" },
          { type: "bullet", text: "Process orders" },
          { type: "bullet", text: "Deliver products" },
          { type: "bullet", text: "Provide customer support" },
          { type: "bullet", text: "Improve Website performance" },
          { type: "bullet", text: "Detect fraud" },
          { type: "bullet", text: "Prevent unauthorised activity" },
          { type: "bullet", text: "Process refunds" },
          { type: "bullet", text: "Manage returns" },
          { type: "bullet", text: "Respond to enquiries" },
          { type: "bullet", text: "Send order updates" },
          { type: "bullet", text: "Improve customer experience" },
          { type: "bullet", text: "Analyse shopping behaviour" },
          { type: "bullet", text: "Comply with legal obligations" }
      ],
    },
    {
      title: "5. Marketing Communications",
      blocks: [
          { type: "paragraph", text: "If you choose to subscribe, we may send:" },
          { type: "bullet", text: "Product launches" },
          { type: "bullet", text: "Promotional offers" },
          { type: "bullet", text: "Newsletters" },
          { type: "bullet", text: "Festival offers" },
          { type: "bullet", text: "Brand updates" },
          { type: "paragraph", text: "You may unsubscribe at any time using the unsubscribe link or by contacting us. We do not send unsolicited marketing after you opt out." }
      ],
    },
    {
      title: "6. Cookies",
      blocks: [
          { type: "paragraph", text: "Cookies help us:" },
          { type: "bullet", text: "Remember your preferences" },
          { type: "bullet", text: "Maintain your shopping cart" },
          { type: "bullet", text: "Improve Website speed" },
          { type: "bullet", text: "Understand customer behaviour" },
          { type: "bullet", text: "Measure Website traffic" },
          { type: "paragraph", text: "You may disable cookies through your browser settings. Please note that disabling cookies may affect certain Website features." }
      ],
    },
    {
      title: "7. Shopify",
      blocks: [
          { type: "paragraph", text: "Our Website is powered by Shopify. Shopify collects and processes certain information necessary for operating the online store. Your information may therefore also be processed according to Shopify's Privacy Policy." }
      ],
    },
    {
      title: "8. Payment Partners",
      blocks: [
          { type: "paragraph", text: "Payments may be processed through authorised payment partners. These providers independently process payment information in accordance with their own privacy policies. Kobbo does not control their internal data handling practices." }
      ],
    },
    {
      title: "9. Shipping Partners",
      blocks: [
          { type: "paragraph", text: "To deliver your order, we may share limited information including:" },
          { type: "bullet", text: "Name" },
          { type: "bullet", text: "Delivery Address" },
          { type: "bullet", text: "Contact Number (where provided)" },
          { type: "bullet", text: "Order Information" },
          { type: "paragraph", text: "with logistics partners solely for the purpose of completing delivery." }
      ],
    },
    {
      title: "10. Analytics",
      blocks: [
          { type: "paragraph", text: "We may use analytics services to better understand how customers interact with our Website. These tools may collect information regarding:" },
          { type: "bullet", text: "pages visited" },
          { type: "bullet", text: "clicks" },
          { type: "bullet", text: "browsing behaviour" },
          { type: "bullet", text: "session duration" },
          { type: "bullet", text: "device information" },
          { type: "paragraph", text: "The data collected is used to improve our Website and customer experience." }
      ],
    },
    {
      title: "11. Meta Pixel & Advertising",
      blocks: [
          { type: "paragraph", text: "We may use Meta Pixel and similar advertising technologies to:" },
          { type: "bullet", text: "measure advertising performance" },
          { type: "bullet", text: "understand customer interests" },
          { type: "bullet", text: "improve marketing campaigns" },
          { type: "bullet", text: "display relevant advertisements" },
          { type: "paragraph", text: "These technologies may collect certain browser and interaction data. You may manage advertising preferences through your respective platform settings." }
      ],
    },
    {
      title: "12. How Long We Keep Your Data",
      blocks: [
          { type: "paragraph", text: "We retain personal information only for as long as reasonably necessary to:" },
          { type: "bullet", text: "fulfil orders" },
          { type: "bullet", text: "comply with tax laws" },
          { type: "bullet", text: "maintain accounting records" },
          { type: "bullet", text: "resolve disputes" },
          { type: "bullet", text: "prevent fraud" },
          { type: "bullet", text: "comply with legal obligations" },
          { type: "paragraph", text: "When information is no longer required, we take reasonable steps to securely delete or anonymise it." }
      ],
    },
    {
      title: "13. Data Security",
      blocks: [
          { type: "paragraph", text: "We implement reasonable administrative, technical and organisational safeguards to protect your information. These include measures intended to prevent:" },
          { type: "bullet", text: "unauthorised access" },
          { type: "bullet", text: "accidental disclosure" },
          { type: "bullet", text: "misuse" },
          { type: "bullet", text: "alteration" },
          { type: "bullet", text: "destruction" },
          { type: "paragraph", text: "However, no internet transmission or electronic storage system can be guaranteed to be completely secure." }
      ],
    },
    {
      title: "14. Children'S Privacy",
      blocks: [
          { type: "paragraph", text: "Kobbo creates products intended for children. However, purchases must always be made by adults. We do not knowingly collect personal information directly from children. If we become aware that personal information has been collected directly from a child without appropriate consent where required, we will take reasonable steps to delete such information." }
      ],
    },
    {
      title: "15. Third-Party Links",
      blocks: [
          { type: "paragraph", text: "Our Website may contain links to third-party websites. We are not responsible for:" },
          { type: "bullet", text: "their privacy practices" },
          { type: "bullet", text: "security" },
          { type: "bullet", text: "policies" },
          { type: "bullet", text: "content" },
          { type: "paragraph", text: "Customers are encouraged to review the privacy policies of third-party websites before sharing personal information." }
      ],
    },
    {
      title: "16. Your Rights",
      blocks: [
          { type: "paragraph", text: "Subject to applicable law, you may request:" },
          { type: "bullet", text: "access to your personal information;" },
          { type: "bullet", text: "correction of inaccurate information;" },
          { type: "bullet", text: "deletion of information where appropriate;" },
          { type: "bullet", text: "withdrawal of consent where processing is based on consent." },
          { type: "paragraph", text: "To make such a request, please contact us using the details provided below. We may ask you to verify your identity before processing certain requests." }
      ],
    },
    {
      title: "17. Policy Updates",
      blocks: [
          { type: "paragraph", text: "We may update this Privacy Policy from time to time to reflect changes in our business, legal requirements or services. The updated version will be posted on this page with the revised \"Last Updated\" date. Your continued use of the Website after such changes constitutes acceptance of the revised Privacy Policy." }
      ],
    },
    {
      title: "18. Contact Us",
      blocks: [
          { type: "paragraph", text: `If you have any questions about this Privacy Policy or how we handle your information, please contact: Kobbo — ${legalEntity.ownershipLine} Legal name: ${legalEntity.name}. Website: www.kobbo.in Email: support@kobbo.in` }
      ],
    }
  ],
};

export const termsPolicyContent: PolicyPageContent = {
  title: "Terms & Conditions",
  description: "Terms governing your use of www.kobbo.in and purchases from Kobbo.",
  lastUpdated: "04-08-2026",
  sections: [
    {
      title: "1. Introduction",
      blocks: [
          { type: "paragraph", text: "Welcome to Kobbo (\"Kobbo\", \"Company\", \"we\", \"our\", or \"us\"), a brand owned and operated by Heena Ashok Shah. These Terms & Conditions (\"Terms\") govern your access to and use of www.kobbo.in (\"Website\"), including all purchases, services, features and content made available through the Website. By accessing, browsing or purchasing from our Website, you acknowledge that you have read, understood and agree to be legally bound by these Terms, together with our Privacy Policy, Shipping Policy, Returns & Refunds policy and all other policies published on our Website. If you do not agree with these Terms, please discontinue the use of this Website immediately." }
      ],
    },
    {
      title: "2. Eligibility",
      blocks: [
          { type: "paragraph", text: "By using this Website, you confirm that:" },
          { type: "bullet", text: "You are at least 18 years of age, or" },
          { type: "bullet", text: "You are accessing the Website under the supervision of a parent or legal guardian." },
          { type: "bullet", text: "You are legally capable of entering into a binding contract under the applicable laws of India." },
          { type: "paragraph", text: "Purchases intended for children must always be made by an adult." }
      ],
    },
    {
      title: "3. About Kobbo",
      blocks: [
          { type: "paragraph", text: "Kobbo is a children's toy brand operated by Heena Ashok Shah, committed to designing and curating safe, engaging and thoughtfully crafted toys that inspire curiosity, creativity and joyful learning. While we strive to provide accurate product descriptions, all purchases remain subject to these Terms." }
      ],
    },
    {
      title: "4. Acceptance Of Orders",
      blocks: [
          { type: "paragraph", text: "Placing an order on our Website constitutes an offer to purchase. Acceptance of your order occurs only after:" },
          { type: "bullet", text: "successful payment verification," },
          { type: "bullet", text: "inventory confirmation," },
          { type: "bullet", text: "fraud screening," },
          { type: "bullet", text: "and shipment confirmation." },
          { type: "paragraph", text: "Kobbo reserves the absolute right to refuse, cancel or limit any order without assigning any reason. Examples include:" },
          { type: "bullet", text: "product unavailable" },
          { type: "bullet", text: "pricing errors" },
          { type: "bullet", text: "suspected fraudulent transactions" },
          { type: "bullet", text: "duplicate orders" },
          { type: "bullet", text: "repeated abuse of return policies" },
          { type: "bullet", text: "payment verification failure" },
          { type: "bullet", text: "suspicious purchasing behaviour" },
          { type: "paragraph", text: "Where payment has already been received, the amount shall be refunded to the original payment method." }
      ],
    },
    {
      title: "5. Product Information",
      blocks: [
          { type: "paragraph", text: "We make every reasonable effort to ensure product descriptions, specifications, dimensions, photographs and pricing are accurate. However, slight differences may exist. Products may vary due to:" },
          { type: "bullet", text: "lighting" },
          { type: "bullet", text: "photography" },
          { type: "bullet", text: "monitor settings" },
          { type: "bullet", text: "mobile screen calibration" },
          { type: "bullet", text: "natural materials" },
          { type: "bullet", text: "manufacturing batches" },
          { type: "paragraph", text: "Such variations shall not be treated as manufacturing defects." }
      ],
    },
    {
      title: "6. Natural Material Disclaimer",
      blocks: [
          { type: "paragraph", text: "Certain Kobbo products may include natural materials such as wood. Accordingly, minor variations in:" },
          { type: "bullet", text: "grain" },
          { type: "bullet", text: "texture" },
          { type: "bullet", text: "finish" },
          { type: "bullet", text: "colour" },
          { type: "bullet", text: "knots" },
          { type: "bullet", text: "patterns" },
          { type: "paragraph", text: "are natural characteristics and enhance the uniqueness of each product. These shall not constitute defects and shall not be grounds for return or replacement." }
      ],
    },
    {
      title: "7. Product Dimensions",
      blocks: [
          { type: "paragraph", text: "Product dimensions provided on the Website are approximate. Minor variations resulting from manufacturing processes are normal and shall not be considered defects." }
      ],
    },
    {
      title: "8. Product Images",
      blocks: [
          { type: "paragraph", text: "Product photographs are for illustrative purposes. Accessories, props, furniture, decorative items or background elements shown in photographs are not included unless specifically stated." }
      ],
    },
    {
      title: "9. Age Recommendations",
      blocks: [
          { type: "paragraph", text: "Age recommendations displayed on the Website are provided for guidance only. Parents and guardians should independently assess whether a product is suitable for their child considering:" },
          { type: "bullet", text: "developmental stage" },
          { type: "bullet", text: "maturity" },
          { type: "bullet", text: "supervision requirements" },
          { type: "bullet", text: "individual abilities" },
          { type: "paragraph", text: "Kobbo shall not be responsible for misuse contrary to the recommended usage." }
      ],
    },
    {
      title: "10. Child Safety",
      blocks: [
          { type: "paragraph", text: "Some toys may contain:" },
          { type: "bullet", text: "small parts" },
          { type: "bullet", text: "detachable accessories" },
          { type: "bullet", text: "moving components" },
          { type: "paragraph", text: "Adult supervision is recommended wherever appropriate. Customers are responsible for ensuring that products are used safely and in accordance with the provided instructions." }
      ],
    },
    {
      title: "11. Product Care",
      blocks: [
          { type: "paragraph", text: "Customers are responsible for:" },
          { type: "bullet", text: "proper storage" },
          { type: "bullet", text: "safe usage" },
          { type: "bullet", text: "regular inspection" },
          { type: "bullet", text: "cleaning according to provided instructions" },
          { type: "paragraph", text: "Damage resulting from:" },
          { type: "bullet", text: "misuse" },
          { type: "bullet", text: "negligence" },
          { type: "bullet", text: "improper storage" },
          { type: "bullet", text: "accidental impact" },
          { type: "bullet", text: "water exposure" },
          { type: "bullet", text: "exposure to extreme temperatures" },
          { type: "paragraph", text: "shall not qualify for refunds or replacements." }
      ],
    },
    {
      title: "12. Pricing",
      blocks: [
          { type: "paragraph", text: "All prices displayed on the Website are quoted in Indian Rupees (INR) and are inclusive or exclusive of applicable taxes as indicated at checkout. Kobbo reserves the right to:" },
          { type: "bullet", text: "change prices without notice" },
          { type: "bullet", text: "discontinue products" },
          { type: "bullet", text: "introduce promotional pricing" },
          { type: "bullet", text: "modify offers" },
          { type: "paragraph", text: "Pricing changes shall not affect orders already confirmed." }
      ],
    },
    {
      title: "13. Pricing Errors",
      blocks: [
          { type: "paragraph", text: "Despite our best efforts, pricing errors may occasionally occur. If a product is mistakenly listed at an incorrect price due to:" },
          { type: "bullet", text: "technical issues" },
          { type: "bullet", text: "software errors" },
          { type: "bullet", text: "typographical mistakes" },
          { type: "paragraph", text: "Kobbo reserves the right to cancel the affected order even after payment has been received. In such cases, customers shall receive a full refund." }
      ],
    },
    {
      title: "14. Payment",
      blocks: [
          { type: "paragraph", text: "Payments may be processed through authorised third-party payment gateways. Kobbo does not store customers' complete debit card, credit card or banking credentials. Customers agree that payment information provided is accurate and authorised." }
      ],
    },
    {
      title: "15. Cash On Delivery",
      blocks: [
          { type: "paragraph", text: "Where Cash on Delivery (COD) is available, Kobbo reserves the right to restrict or withdraw COD facilities for customers with repeated order refusals, unsuccessful delivery attempts or suspected misuse." }
      ],
    },
    {
      title: "16. Promotions & Discount CODes",
      blocks: [
          { type: "paragraph", text: "Discounts, promotional offers and coupon codes:" },
          { type: "bullet", text: "cannot be exchanged for cash," },
          { type: "bullet", text: "may not be combined unless expressly stated," },
          { type: "bullet", text: "may be withdrawn without prior notice," },
          { type: "bullet", text: "remain subject to individual promotional terms." },
          { type: "paragraph", text: "Kobbo reserves the final decision regarding promotional eligibility." }
      ],
    },
    {
      title: "17. Shipping & Delivery",
      blocks: [
          { type: "paragraph", text: "Shipping timelines displayed on the Website are estimates only. While Kobbo makes every reasonable effort to dispatch and deliver orders promptly, delivery dates are not guaranteed. Delays may occur due to:" },
          { type: "bullet", text: "courier delays" },
          { type: "bullet", text: "adverse weather" },
          { type: "bullet", text: "natural disasters" },
          { type: "bullet", text: "strikes" },
          { type: "bullet", text: "public holidays" },
          { type: "bullet", text: "governmental restrictions" },
          { type: "bullet", text: "force majeure events" },
          { type: "bullet", text: "incorrect delivery information provided by the customer" },
          { type: "paragraph", text: "Kobbo shall not be liable for any direct or indirect loss arising from delivery delays beyond its reasonable control. Risk in the products passes to the customer upon successful delivery." }
      ],
    },
    {
      title: "18. Delivery Address",
      blocks: [
          { type: "paragraph", text: "Customers are solely responsible for ensuring that the shipping address, contact number and recipient details provided during checkout are accurate. Kobbo shall not be responsible for:" },
          { type: "bullet", text: "incorrect addresses" },
          { type: "bullet", text: "incomplete addresses" },
          { type: "bullet", text: "failed delivery attempts due to customer unavailability" },
          { type: "bullet", text: "orders delivered to the address provided by the customer" },
          { type: "paragraph", text: "Any additional shipping charges arising from re-dispatch shall be borne by the customer." }
      ],
    },
    {
      title: "19. Returns & Refunds",
      blocks: [
          { type: "paragraph", text: "Returns, refunds, replacements and cancellations shall be governed by the Kobbo Returns & Refunds policy available on the Website. Customers agree that acceptance of a return request shall be subject to compliance with the conditions specified therein. Submission of a return request does not automatically guarantee approval." }
      ],
    },
    {
      title: "20. Inspection Of Products",
      blocks: [
          { type: "paragraph", text: "Customers are requested to inspect products immediately upon delivery. Any claim relating to:" },
          { type: "bullet", text: "damaged products" },
          { type: "bullet", text: "incorrect products" },
          { type: "bullet", text: "missing items" },
          { type: "paragraph", text: "must be reported within 48 hours of delivery. Delayed claims may not be accepted." }
      ],
    },
    {
      title: "21. Unboxing Video",
      blocks: [
          { type: "paragraph", text: "For faster resolution of delivery-related issues, customers are strongly encouraged to record a continuous, uninterrupted video while opening the package. Such video may be requested while processing claims involving:" },
          { type: "bullet", text: "transit damage" },
          { type: "bullet", text: "incorrect products" },
          { type: "bullet", text: "missing components" },
          { type: "bullet", text: "manufacturing defects" },
          { type: "paragraph", text: "Failure to provide supporting evidence may affect our ability to process certain claims." }
      ],
    },
    {
      title: "22. Account Responsibility",
      blocks: [
          { type: "paragraph", text: "If customers create an account on the Website, they agree to:" },
          { type: "bullet", text: "maintain accurate information" },
          { type: "bullet", text: "safeguard login credentials" },
          { type: "bullet", text: "prevent unauthorised access" },
          { type: "bullet", text: "notify Kobbo immediately in case of suspected misuse" },
          { type: "paragraph", text: "Customers remain responsible for all activities carried out using their accounts." }
      ],
    },
    {
      title: "23. Customer Reviews",
      blocks: [
          { type: "paragraph", text: "Customers may voluntarily submit reviews, photographs or testimonials. By submitting such content, customers grant Kobbo a perpetual, worldwide, royalty-free, non-exclusive licence to:" },
          { type: "bullet", text: "publish" },
          { type: "bullet", text: "reproduce" },
          { type: "bullet", text: "edit" },
          { type: "bullet", text: "display" },
          { type: "bullet", text: "distribute" },
          { type: "paragraph", text: "such content for marketing, promotional and business purposes. Kobbo reserves the right to moderate, edit or remove content that is unlawful, misleading, offensive or irrelevant." }
      ],
    },
    {
      title: "24. User Submissions",
      blocks: [
          { type: "paragraph", text: "Any suggestions, feedback, ideas or recommendations voluntarily shared with Kobbo may be used without obligation to compensate the contributor." }
      ],
    },
    {
      title: "25. Intellectual Property",
      blocks: [
          { type: "paragraph", text: "Unless otherwise stated, all intellectual property rights relating to the Website remain the exclusive property of Heena Ashok Shah. This includes:" },
          { type: "bullet", text: "Kobbo name" },
          { type: "bullet", text: "logo" },
          { type: "bullet", text: "product designs" },
          { type: "bullet", text: "product descriptions" },
          { type: "bullet", text: "graphics" },
          { type: "bullet", text: "illustrations" },
          { type: "bullet", text: "icons" },
          { type: "bullet", text: "videos" },
          { type: "bullet", text: "photographs" },
          { type: "bullet", text: "website layout" },
          { type: "bullet", text: "written content" },
          { type: "bullet", text: "software" },
          { type: "bullet", text: "branding elements" },
          { type: "paragraph", text: "No part of the Website may be copied, reproduced, modified, republished, uploaded, transmitted, distributed or commercially exploited without prior written permission." }
      ],
    },
    {
      title: "26. Trademarks",
      blocks: [
          { type: "paragraph", text: "\"Kobbo\", associated logos, brand names, slogans and visual identity elements are proprietary trademarks belonging to Heena Ashok Shah. Unauthorised use is strictly prohibited." }
      ],
    },
    {
      title: "27. Website Content",
      blocks: [
          { type: "paragraph", text: "Information published on the Website is provided for general informational purposes. Although Kobbo strives for accuracy, we do not warrant that all information is complete, current or error-free. Customers should independently evaluate product suitability before making a purchase." }
      ],
    },
    {
      title: "28. Third-Party Links",
      blocks: [
          { type: "paragraph", text: "The Website may contain links to third-party websites or services. Kobbo neither controls nor endorses such third-party websites. We shall not be responsible for:" },
          { type: "bullet", text: "their content" },
          { type: "bullet", text: "availability" },
          { type: "bullet", text: "privacy practices" },
          { type: "bullet", text: "products" },
          { type: "bullet", text: "services" },
          { type: "paragraph", text: "Accessing third-party websites is entirely at the customer's own risk." }
      ],
    },
    {
      title: "29. Prohibited Activities",
      blocks: [
          { type: "paragraph", text: "Customers agree not to:" },
          { type: "bullet", text: "use the Website for unlawful purposes" },
          { type: "bullet", text: "interfere with Website security" },
          { type: "bullet", text: "attempt unauthorised access" },
          { type: "bullet", text: "introduce malware or viruses" },
          { type: "bullet", text: "scrape, copy or harvest Website content" },
          { type: "bullet", text: "impersonate another person" },
          { type: "bullet", text: "submit false information" },
          { type: "bullet", text: "disrupt Website functionality" },
          { type: "bullet", text: "misuse discount codes" },
          { type: "bullet", text: "engage in fraudulent transactions" },
          { type: "paragraph", text: "Violation of these Terms may result in suspension or permanent restriction of Website access." }
      ],
    },
    {
      title: "30. Fraud Prevention",
      blocks: [
          { type: "paragraph", text: "To protect customers and the integrity of our business, Kobbo reserves the right to:" },
          { type: "bullet", text: "verify customer identity" },
          { type: "bullet", text: "request additional information" },
          { type: "bullet", text: "cancel suspicious orders" },
          { type: "bullet", text: "refuse future orders" },
          { type: "bullet", text: "report fraudulent activities to relevant authorities" },
          { type: "paragraph", text: "Any attempt to misuse promotional offers, payment systems or return policies may result in permanent account restrictions." }
      ],
    },
    {
      title: "31. Website Availability",
      blocks: [
          { type: "paragraph", text: "While Kobbo aims to ensure uninterrupted access to the Website, we do not guarantee continuous availability. Temporary interruptions may occur due to:" },
          { type: "bullet", text: "maintenance" },
          { type: "bullet", text: "upgrades" },
          { type: "bullet", text: "technical issues" },
          { type: "bullet", text: "internet failures" },
          { type: "bullet", text: "cyber incidents" },
          { type: "bullet", text: "third-party service outages" },
          { type: "paragraph", text: "Kobbo shall not be liable for losses arising from such interruptions." }
      ],
    },
    {
      title: "32. Disclaimer Of Warranties",
      blocks: [
          { type: "paragraph", text: "To the fullest extent permitted by applicable law, the Website, its content, services and products are provided on an \"as is\" and \"as available\" basis. Except as expressly stated on the Website or required under applicable law, Kobbo makes no representation or warranty, express or implied, regarding:" },
          { type: "bullet", text: "uninterrupted availability of the Website," },
          { type: "bullet", text: "error-free operation," },
          { type: "bullet", text: "accuracy or completeness of information," },
          { type: "bullet", text: "suitability of products for every individual child," },
          { type: "bullet", text: "compatibility with every expectation or purpose," },
          { type: "bullet", text: "uninterrupted delivery services." },
          { type: "paragraph", text: "Nothing in these Terms excludes any statutory rights available to consumers under applicable Indian law." }
      ],
    },
    {
      title: "33. Product Disclaimer",
      blocks: [
          { type: "paragraph", text: "Kobbo designs and curates toys intended to encourage learning, creativity and play. However:" },
          { type: "bullet", text: "every child develops differently;" },
          { type: "bullet", text: "educational outcomes may vary;" },
          { type: "bullet", text: "product performance depends upon proper use, supervision and age appropriateness." },
          { type: "paragraph", text: "Kobbo does not guarantee any specific educational, developmental or behavioural outcome arising from the use of its products." }
      ],
    },
    {
      title: "34. Limitation Of Liability",
      blocks: [
          { type: "paragraph", text: "To the maximum extent permitted by law, Kobbo (Heena Ashok Shah), its directors, partners, employees, consultants, suppliers, service providers and affiliates shall not be liable for:" },
          { type: "bullet", text: "indirect losses," },
          { type: "bullet", text: "incidental damages," },
          { type: "bullet", text: "consequential damages," },
          { type: "bullet", text: "punitive damages," },
          { type: "bullet", text: "emotional distress," },
          { type: "bullet", text: "loss of profits," },
          { type: "bullet", text: "loss of revenue," },
          { type: "bullet", text: "business interruption," },
          { type: "bullet", text: "loss of opportunity," },
          { type: "bullet", text: "loss of goodwill," },
          { type: "bullet", text: "loss of data." },
          { type: "paragraph", text: "In any event, Kobbo's aggregate liability arising out of or relating to any order shall not exceed the amount actually paid by the customer for the product giving rise to the claim. Nothing in these Terms limits liability where such limitation is prohibited under applicable law." }
      ],
    },
    {
      title: "35. Customer Responsibility",
      blocks: [
          { type: "paragraph", text: "Customers acknowledge that they are responsible for:" },
          { type: "bullet", text: "selecting products appropriate for the intended child," },
          { type: "bullet", text: "reading all product descriptions," },
          { type: "bullet", text: "following safety instructions," },
          { type: "bullet", text: "ensuring appropriate adult supervision where necessary," },
          { type: "bullet", text: "using products only for their intended purpose." },
          { type: "paragraph", text: "Improper use of products shall be the sole responsibility of the customer." }
      ],
    },
    {
      title: "36. Misuse Of Products",
      blocks: [
          { type: "paragraph", text: "Kobbo shall not be responsible for injuries, damage or loss resulting from:" },
          { type: "bullet", text: "misuse," },
          { type: "bullet", text: "negligent handling," },
          { type: "bullet", text: "modification," },
          { type: "bullet", text: "improper assembly," },
          { type: "bullet", text: "use contrary to instructions," },
          { type: "bullet", text: "use beyond the recommended age," },
          { type: "bullet", text: "commercial or institutional use where not intended." }
      ],
    },
    {
      title: "37. Force Majeure",
      blocks: [
          { type: "paragraph", text: "Kobbo shall not be liable for any failure or delay in performing its obligations where such failure or delay arises due to circumstances beyond its reasonable control, including but not limited to:" },
          { type: "bullet", text: "natural disasters," },
          { type: "bullet", text: "floods," },
          { type: "bullet", text: "earthquakes," },
          { type: "bullet", text: "pandemics," },
          { type: "bullet", text: "epidemics," },
          { type: "bullet", text: "war," },
          { type: "bullet", text: "terrorism," },
          { type: "bullet", text: "labour strikes," },
          { type: "bullet", text: "government actions," },
          { type: "bullet", text: "internet failures," },
          { type: "bullet", text: "cyber-attacks," },
          { type: "bullet", text: "power outages," },
          { type: "bullet", text: "courier disruptions," },
          { type: "bullet", text: "transportation failures." },
          { type: "paragraph", text: "Performance shall resume as soon as reasonably practicable after the event ceases." }
      ],
    },
    {
      title: "38. Indemnity",
      blocks: [
          { type: "paragraph", text: "You agree to indemnify, defend and hold harmless Heena Ashok Shah, Kobbo, its directors, employees, affiliates, service providers and representatives against any claims, losses, damages, liabilities, costs and expenses (including reasonable legal fees) arising from:" },
          { type: "bullet", text: "your breach of these Terms;" },
          { type: "bullet", text: "your misuse of the Website;" },
          { type: "bullet", text: "your violation of any applicable law;" },
          { type: "bullet", text: "infringement of third-party rights;" },
          { type: "bullet", text: "fraudulent or unlawful activity committed through your account." }
      ],
    },
    {
      title: "39. Electronic Communications",
      blocks: [
          { type: "paragraph", text: "By using the Website or communicating with Kobbo electronically, you consent to receive communications from us through:" },
          { type: "bullet", text: "email," },
          { type: "bullet", text: "SMS," },
          { type: "bullet", text: "WhatsApp (where applicable)," },
          { type: "bullet", text: "notifications on the Website." },
          { type: "paragraph", text: "Electronic communications shall satisfy any legal requirement that such communications be in writing." }
      ],
    },
    {
      title: "40. Termination",
      blocks: [
          { type: "paragraph", text: "Kobbo reserves the right to suspend, restrict or terminate access to the Website, with or without prior notice, if we reasonably believe that a customer has:" },
          { type: "bullet", text: "violated these Terms," },
          { type: "bullet", text: "engaged in fraudulent activity," },
          { type: "bullet", text: "misused promotional offers," },
          { type: "bullet", text: "abused return policies," },
          { type: "bullet", text: "interfered with Website security," },
          { type: "bullet", text: "attempted unauthorised access," },
          { type: "bullet", text: "engaged in unlawful conduct." },
          { type: "paragraph", text: "Termination shall not affect any accrued rights or obligations of either party." }
      ],
    },
    {
      title: "41. Severability",
      blocks: [
          { type: "paragraph", text: "If any provision of these Terms is found by a court of competent jurisdiction to be invalid, unlawful or unenforceable, such provision shall be deemed severed only to the extent necessary. The remaining provisions shall continue in full force and effect." }
      ],
    },
    {
      title: "42. Waiver",
      blocks: [
          { type: "paragraph", text: "Failure by Kobbo to enforce any right or provision under these Terms shall not constitute a waiver of such right or provision. Any waiver shall be effective only if made expressly in writing." }
      ],
    },
    {
      title: "43. Entire Agreement",
      blocks: [
          { type: "paragraph", text: "These Terms, together with the Privacy Policy, Shipping Policy, Returns & Refunds policy and any other policies published on the Website, constitute the entire agreement between you and Kobbo regarding the use of the Website and supersede all prior communications or understandings relating to the subject matter herein." }
      ],
    },
    {
      title: "44. Changes To These Terms",
      blocks: [
          { type: "paragraph", text: "Kobbo reserves the right to modify or update these Terms at any time. Any changes shall become effective immediately upon publication on the Website unless otherwise stated. Customers are encouraged to review these Terms periodically. Continued use of the Website after such changes constitutes acceptance of the revised Terms." }
      ],
    },
    {
      title: "45. Governing Law",
      blocks: [
          { type: "paragraph", text: "These Terms shall be governed by and construed in accordance with the laws of India." }
      ],
    },
    {
      title: "46. Jurisdiction",
      blocks: [
          { type: "paragraph", text: "Any dispute arising out of or relating to these Terms, the Website or any transaction with Kobbo shall be subject to the exclusive jurisdiction of the competent courts at the place where the registered office of Heena Ashok Shah, is situated, unless otherwise required by applicable consumer protection laws." }
      ],
    },
    {
      title: "47. Grievance Redressal",
      blocks: [
          { type: "paragraph", text: "If you have any questions, complaints or grievances regarding our Website, products or these Terms, please contact us at: Email: support@kobbo.in We will endeavour to acknowledge and address genuine grievances within a reasonable timeframe in accordance with applicable law." }
      ],
    },
    {
      title: "48. Contact Information",
      blocks: [
          { type: "paragraph", text: "Brand: Kobbo" },
          { type: "paragraph", text: `Legal Name: ${legalEntity.name}` },
          { type: "paragraph", text: "Website: www.kobbo.in" },
          { type: "paragraph", text: "Customer Support: support@kobbo.in" },
      ],
    }
  ],
};
