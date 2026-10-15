/**
 * Policy & FAQ page content — Official Kobbo brand policies.
 * Purged of any former legal entities. 100% Kobbo.
 */

import { footerBrand } from "./footer";

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
  description: "Quick answers about Kobbo developmental play kits, shipping, and order support.",
  sections: [
    {
      title: "What age groups are Kobbo Play Kits designed for?",
      blocks: [
        {
          type: "paragraph",
          text: "Kobbo Play Kits are specifically tailored for two crucial developmental windows: Year 2 (24–36 Months) with The Little Explorer Kit, and Year 3–5 (36–60 Months) with The Tinker Kit. Each kit is matched to child development milestones.",
        },
      ],
    },
    {
      title: "How long does delivery take?",
      blocks: [
        {
          type: "paragraph",
          text: "Orders are usually dispatched within 5 business days from our warehouse. Domestic shipping across India typically takes 7–15 days from dispatch. You will receive a tracking link once your kit ships.",
        },
      ],
    },
    {
      title: "What is your return and refund policy?",
      blocks: [
        {
          type: "paragraph",
          text: "As opened or used products cannot be resold, we do not accept returns or exchanges once an order has been delivered. However, if any product reaches you damaged, broken, or with missing parts, Kobbo provides full replacement or refund support when reported within 24–48 hours with an unboxing video.",
        },
      ],
    },
    {
      title: "Can I cancel my order?",
      blocks: [
        {
          type: "paragraph",
          text: "Yes, you can request cancellation within 5–6 hours of placing the order before dispatch. For prepaid orders, eligible refunds are returned to the original payment method within 15 days.",
        },
      ],
    },
    {
      title: "Are shipping charges applicable?",
      blocks: [
        {
          type: "paragraph",
          text: "We provide free shipping across India on all orders.",
        },
      ],
    },
    {
      title: "How do I contact Kobbo customer support?",
      blocks: [
        {
          type: "paragraph",
          text: "You can reach us at hello@kobbo.in or call/WhatsApp our customer care team at +91 8329195232.",
        },
      ],
    },
  ],
};

export const contactPageContent: PolicyPageContent = {
  title: "Contact Us",
  description: "Have a question about our play kits or your order? We're here to help.",
  sections: [
    {
      title: "Email Support",
      blocks: [{ type: "paragraph", text: footerBrand.email }],
    },
    {
      title: "Customer Care Phone",
      blocks: [{ type: "paragraph", text: footerBrand.phone }],
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
          text: "Kobbo | Stage-Based Play for Your Child’s Developing Brain",
        },
      ],
    },
  ],
};

export const shippingPolicyContent: PolicyPageContent = {
  title: "Shipping Policy",
  description: "We provide free shipping across India on all orders. Learn about dispatch times and tracking.",
  intro: "We want your Kobbo order to reach you safely and on time. Please find our shipping details below.",
  sections: [
    {
      title: "Shipping Costs",
      blocks: [
          { type: "paragraph", text: "We provide free shipping across India on all orders." },
      ],
    },
    {
      title: "Domestic Shipping",
      blocks: [
          { type: "paragraph", text: "Orders are generally delivered within 7–15 days from the date of dispatch." },
      ],
    },
    {
      title: "Dispatch Time",
      blocks: [
          { type: "paragraph", text: "Orders are usually dispatched within 5 business days of placing the order, subject to product availability." },
          { type: "paragraph", text: "Our warehouse operates Monday to Friday during standard business hours, excluding holidays. We make every effort to keep delays to a minimum." },
      ],
    },
    {
      title: "Change of Delivery Address",
      blocks: [
          { type: "paragraph", text: "If you need to change your delivery address, please contact us before your order is shipped. Once an order has been dispatched, we will not be able to change the delivery address." },
      ],
    },
    {
      title: "Out of Stock Items",
      blocks: [
          { type: "paragraph", text: "In case an item is out of stock, we will get in touch with you regarding the order and the expected availability." },
      ],
    },
    {
      title: "Delivery Delays",
      blocks: [
          { type: "paragraph", text: "If your order has taken longer than the expected delivery time, please contact us so that we can check the status of your shipment with the courier partner." },
      ],
    },
    {
      title: "Tracking Your Order",
      blocks: [
          { type: "paragraph", text: "Once your order has been dispatched, you will receive a tracking link to follow your shipment and view the latest delivery updates." },
      ],
    },
    {
      title: "Damaged Parcels",
      blocks: [
          { type: "paragraph", text: "If your package appears damaged or tampered with at the time of delivery, we kindly request you to refuse the package, if possible, and contact us." },
          { type: "paragraph", text: "If the package has already been delivered, please get in touch with us at the earliest. We will assist you after the courier partner has completed the necessary investigation." },
      ],
    },
    {
      title: "Lost Parcels",
      blocks: [
          { type: "paragraph", text: "In the event that a parcel is lost in transit, we will assist with a resolution once the courier partner has completed its investigation and confirmed the parcel as lost." },
      ],
    },
  ],
};

export const returnPolicyContent: PolicyPageContent = {
  title: "Return Policy",
  description: "Quality assurance, transit replacement support, and refund terms for Kobbo orders.",
  sections: [
    {
      title: "Return Policy",
      blocks: [
          { type: "paragraph", text: "At Kobbo, we are committed to providing you with a smooth and enjoyable shopping experience. As opened or used products cannot be resold, we do not accept returns or exchanges once an order has been delivered." },
          { type: "paragraph", text: "In rare cases, a product or its parts may be affected during transit. If you receive a product with damaged or missing parts, Kobbo will provide replacement support where applicable." },
          { type: "paragraph", text: "Any issue regarding a damaged or missing product/part must be reported to us within 24 hours of delivery, along with the relevant order details and clear photographs/videos of the issue for verification." },
          { type: "paragraph", text: "Once the concern has been reviewed and verified, Kobbo will assist with the replacement of the affected part(s), as applicable." },
          { type: "paragraph", text: "Please note: Replacement support is applicable only to issues arising during transit and does not cover damage caused after delivery, misuse, or normal wear and tear." },
      ],
    },
    {
      title: "Refund Policy",
      blocks: [
          { type: "paragraph", text: "At Kobbo, we take care to ensure that every order is packed and dispatched with the utmost attention to quality. As our products are intended to be enjoyed in their original condition, we do not generally offer refunds once an order has been delivered, opened, or used." },
          { type: "paragraph", text: "However, we understand that on rare occasions, an issue may occur during transit. If a product reaches you with damage, breakage, leakage, missing items, or an incorrect product, Kobbo may provide a refund or replacement after the issue has been verified." },
          { type: "paragraph", text: "For any such claim, an unboxing video along with the original packaging is mandatory. If the package appears visibly tampered with, damaged, or dented at the time of delivery, we request that you refuse the shipment from the delivery partner." },
          { type: "paragraph", text: "Kobbo will not be responsible for damage that occurs after delivery of the product." },
          { type: "paragraph", text: "If your order is marked as delivered but you have not received it, please contact our customer care team at +91 8329195232 within 3 days of the order being marked as delivered. Refund requests made after this period will not be considered." },
          { type: "paragraph", text: "Where a refund is applicable:" },
          { type: "bullet", text: "COD refunds will be transferred to the bank account provided by the customer within 4–7 working days." },
          { type: "paragraph", text: "Other refunds may take up to 15 days from the date of refund acceptance to be credited." },
          { type: "paragraph", text: "Once the refund is initiated, Kobbo will share the relevant refund details, including the transaction ID and applicable screenshots." },
          { type: "paragraph", text: "In exceptional cases where a return is accepted by Kobbo, the applicable logistics and courier charges may be borne by the customer." },
      ],
    },
    {
      title: "Cancellation Policy",
      blocks: [
          { type: "paragraph", text: "If you've changed your mind, please contact us as soon as possible after placing your order." },
          { type: "paragraph", text: "We recommend requesting cancellation within 5–6 hours of placing the order, as this gives us the best chance of stopping the order before it enters the dispatch process and helps avoid unnecessary shipping costs." },
      ],
    },
    {
      title: "Before your order is dispatched",
      blocks: [
          { type: "paragraph", text: "If we receive your cancellation request before the order leaves our warehouse, the order can be cancelled. For prepaid orders, the eligible refund will be returned to the original payment method within 15 days of cancellation approval." },
      ],
    },
    {
      title: "After your order has been dispatched",
      blocks: [
          { type: "paragraph", text: "Once the order has left our warehouse, it cannot simply be cancelled while in transit. The shipment will need to return to our warehouse first." },
          { type: "paragraph", text: "Once the returned shipment reaches us, the applicable refund will be processed after deducting any forward and return logistics charges." },
      ],
    },
  ],
};

export const cancellationPolicyContent: PolicyPageContent = {
  title: "Cancellation Policy",
  description: "Information on cancelling your Kobbo order before or after dispatch.",
  sections: [
    {
      title: "Cancellation Policy",
      blocks: [

      ],
    },
    {
      title: "Need to cancel your order?",
      blocks: [
          { type: "paragraph", text: "If you've changed your mind, please contact us as soon as possible after placing your order." },
          { type: "paragraph", text: "We recommend requesting cancellation within 5–6 hours of placing the order, as this gives us the best chance of stopping the order before it enters the dispatch process and helps avoid unnecessary shipping costs." },
      ],
    },
    {
      title: "Before your order is dispatched",
      blocks: [
          { type: "paragraph", text: "If we receive your cancellation request before the order leaves our warehouse, the order can be cancelled. For prepaid orders, the eligible refund will be returned to the original payment method within 15 days of cancellation approval." },
      ],
    },
    {
      title: "After your order has been dispatched",
      blocks: [
          { type: "paragraph", text: "Once the order has left our warehouse, it cannot simply be cancelled while in transit. The shipment will need to return to our warehouse first." },
          { type: "paragraph", text: "Once the returned shipment reaches us, the applicable refund will be processed after deducting any forward and return logistics charges." },
      ],
    },
  ],
};

export const privacyPolicyContent: PolicyPageContent = {
  title: "Privacy Policy",
  description: "How Kobbo collects, uses, and safeguards your personal information.",
  intro: "At Kobbo, we value your privacy and take reasonable steps to protect the information you share with us. This Privacy Policy explains what information we collect when you use our website, how we use it, and the circumstances in which it may be shared.",
  sections: [
    {
      title: "1. Information We Collect",
      blocks: [
          { type: "paragraph", text: "When you purchase something from our store, we collect the personal information that you provide as part of the buying and selling process. This may include your name, address, and email address." },
          { type: "paragraph", text: "When you browse our website, we may also automatically receive your Internet Protocol (IP) address. This helps us understand information about your browser and operating system and allows us to improve your experience on our website." },
          { type: "paragraph", text: "Where applicable and with your permission, we may also use your email address to send you information about Kobbo, new products, and other updates." },
      ],
    },
    {
      title: "2. How Your Consent Works",
      blocks: [
          { type: "paragraph", text: "When you provide us with personal information for a specific purpose, such as completing a transaction, making a payment, placing an order, arranging delivery, or requesting a return, you give us permission to collect and use that information for that particular purpose." },
          { type: "paragraph", text: "If we need to use your information for another purpose, we will seek your consent where required." },
      ],
    },
    {
      title: "3. When We May Share Your Information",
      blocks: [
          { type: "paragraph", text: "We may disclose your personal information when we are legally required to do so, or when such disclosure is necessary in connection with a violation of our Terms of Service." },
          { type: "paragraph", text: "Apart from these circumstances, your information is handled only as necessary for the operation of our store and the services associated with it." },
      ],
    },
    {
      title: "4. Payment Processing",
      blocks: [
          { type: "paragraph", text: "Payments made through the Kobbo website are processed through Razorpay." },
          { type: "paragraph", text: "Kobbo and Razorpay do not store your card information on our own servers. Payment information is encrypted and handled in accordance with applicable Payment Card Industry Data Security Standards (PCI-DSS) during the payment process." },
          { type: "paragraph", text: "Your payment details are used only for completing the transaction you have initiated. Once the transaction has been completed, the purchase transaction information is not retained by us." },
          { type: "paragraph", text: "Our payment processing service follows the security standards established by the PCI Security Standards Council, which is supported by major payment card networks including Visa, Mastercard, American Express, and Discover." },
          { type: "paragraph", text: "For additional information regarding payment processing and Razorpay's terms and conditions, you may refer to Razorpay's official terms and policies." },
      ],
    },
    {
      title: "5. Third-Party Services",
      blocks: [
          { type: "paragraph", text: "Kobbo may use third-party service providers to support certain functions of our store." },
          { type: "paragraph", text: "These providers may collect, use, or disclose information only to the extent that is necessary for them to provide the services they perform for us." },
          { type: "paragraph", text: "Their handling of information may also be subject to their own terms and privacy policies." },
      ],
    },
    {
      title: "6. Protection of Your Information",
      blocks: [
          { type: "paragraph", text: "We take reasonable precautions and follow appropriate industry practices to protect your personal information from being lost, misused, accessed without authorisation, disclosed, altered, or destroyed." },
          { type: "paragraph", text: "While we take reasonable measures to safeguard your information, no method of transmitting or storing information electronically can be guaranteed to be completely secure." },
      ],
    },
    {
      title: "7. Cookies",
      blocks: [
          { type: "paragraph", text: "Our website may use cookies and similar technologies to maintain your website session and support the functioning of our website." },
          { type: "paragraph", text: "Cookies may also help us understand how visitors interact with our website. They are not intended to personally identify you when you visit other websites." },
          { type: "paragraph", text: "You may manage cookie preferences through your browser settings. However, restricting cookies may affect certain features or functionality of the website." },
      ],
    },
    {
      title: "8. Age of Consent",
      blocks: [
          { type: "paragraph", text: "By using this website, you represent that you are at least the age of majority in your state or province of residence." },
          { type: "paragraph", text: "If you are the parent or legal guardian of a minor, you may provide consent for your minor dependent to use this website where applicable." },
      ],
    },
    {
      title: "9. Changes to This Privacy Policy",
      blocks: [
          { type: "paragraph", text: "Kobbo may update or modify this Privacy Policy from time to time." },
          { type: "paragraph", text: "We encourage you to review this page periodically so that you remain aware of any changes. Any updates or clarifications will take effect once they are published on the website." },
          { type: "paragraph", text: "If we make material changes to the way we collect, use, or disclose personal information, we will provide appropriate notice so that you are aware of the updated practices." },
      ],
    },
    {
      title: "Questions & Contact Information",
      blocks: [
          { type: "paragraph", text: "If you have any questions about this Privacy Policy, or would like to access, correct, amend, or request deletion of personal information that Kobbo holds about you, please contact us." },
          { type: "paragraph", text: "Email: hello@kobbo.in" },
          { type: "paragraph", text: "Kobbo will be happy to assist with your request." },
      ],
    },
  ],
};

export const termsPolicyContent: PolicyPageContent = {
  title: "Terms of Service",
  description: "Terms and conditions governing your use of Kobbo website and services.",
  sections: [
    {
      title: "Overview",
      blocks: [
          { type: "paragraph", text: "This website is operated by Kobbo. Throughout this website, the terms “we,” “us,” and “our” refer to Kobbo. Kobbo provides this website, including the information, tools, and services available through it, subject to your acceptance of the terms, conditions, policies, and notices mentioned here." },
          { type: "paragraph", text: "By accessing our website and/or purchasing from us, you are using our “Service” and agree to be bound by these Terms of Service, together with any additional terms, conditions, and policies referred to or linked on this website." },
          { type: "paragraph", text: "Please read these Terms of Service carefully before using or accessing our website. By accessing any part of the website, you agree to these Terms. If you do not agree with all of the terms and conditions contained in this agreement, you may not access the website or use any of its services. Where these Terms are considered an offer, your acceptance is expressly limited to these Terms." },
          { type: "paragraph", text: "Any new features or tools added to the current store will also be subject to these Terms of Service. The latest version of these Terms can be reviewed on this page at any time. Kobbo reserves the right to update, modify, or replace any part of these Terms by publishing changes on the website. It is your responsibility to check this page periodically for updates. Your continued use of or access to the website after changes have been posted constitutes acceptance of those changes." },
      ],
    },
    {
      title: "SECTION 1 – ONLINE STORE TERMS",
      blocks: [
          { type: "paragraph", text: "By agreeing to these Terms of Service, you confirm that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province and have provided consent for any minor dependents to use this website." },
          { type: "paragraph", text: "You may not use Kobbo's products for any unlawful or unauthorised purpose, nor may you violate any applicable laws in your jurisdiction while using the Service, including copyright laws." },
          { type: "paragraph", text: "You must not transmit any worms, viruses, or any other code of a destructive nature. Any breach or violation of these Terms may result in immediate termination of your Services." },
      ],
    },
    {
      title: "SECTION 2 – GENERAL CONDITIONS",
      blocks: [
          { type: "paragraph", text: "Kobbo reserves the right to refuse service to anyone at any time and for any reason." },
          { type: "paragraph", text: "You understand that your content, excluding credit card information, may be transferred across various networks without encryption and may be changed where necessary to meet the technical requirements of connecting networks or devices. Credit card information is encrypted whenever it is transferred over networks." },
          { type: "paragraph", text: "You agree not to reproduce, duplicate, copy, sell, resell, or exploit any part of the Service, your use of the Service, access to the Service, or any contact available through the website without our express written permission." },
          { type: "paragraph", text: "The headings used throughout these Terms are provided only for convenience and do not affect or otherwise change the meaning of these Terms." },
      ],
    },
    {
      title: "SECTION 3 – MODIFICATIONS TO THE SERVICE AND PRICES",
      blocks: [
          { type: "paragraph", text: "Prices of our products may change without prior notice. Kobbo reserves the right to modify or discontinue the Service, or any part or content of it, at any time without notice." },
          { type: "paragraph", text: "Kobbo shall not be liable to you or any third party for any modification, change in price, suspension, or discontinuation of the Service." },
      ],
    },
    {
      title: "SECTION 4 – PRODUCTS",
      blocks: [
          { type: "paragraph", text: "Certain products may be available exclusively through our website. Such products may be available in limited quantities and are subject to returns or exchanges only in accordance with our Return Policy." },
          { type: "paragraph", text: "We make reasonable efforts to display product images and colours as accurately as possible on the website. However, we cannot guarantee that the display of any colour on your particular computer or device will be completely accurate." },
          { type: "paragraph", text: "Kobbo reserves the right, although it is not obligated, to limit the sale of products to any individual, geographic region, or jurisdiction. These limitations may be applied on a case-by-case basis." },
          { type: "paragraph", text: "We also reserve the right to limit the quantities of products offered and to modify product descriptions or pricing at any time without notice. Kobbo may discontinue any product at any time. Any offer for a product or service made on this website is void where prohibited." },
          { type: "paragraph", text: "We do not warrant that the quality of any products, information, or other materials purchased or obtained through the Service will meet your expectations, or that any errors in the Service will necessarily be corrected." },
      ],
    },
    {
      title: "SECTION 5 – ACCURACY OF BILLING AND ACCOUNT INFORMATION",
      blocks: [
          { type: "paragraph", text: "Kobbo reserves the right to refuse any order placed through our store. We may, at our discretion, limit or cancel quantities purchased per person, household, or order." },
          { type: "paragraph", text: "Such restrictions may apply to orders placed using the same customer account, the same credit card, and/or the same billing or shipping address." },
          { type: "paragraph", text: "If we make a change to or cancel an order, we may attempt to notify you using the email address and/or billing address or phone number provided when the order was placed." },
          { type: "paragraph", text: "We also reserve the right to limit or prohibit orders that, in our sole judgment, appear to have been placed by dealers, resellers, or distributors." },
          { type: "paragraph", text: "You agree to provide current, complete, and accurate purchase and account information for all purchases made through our store. You also agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you when necessary." },
          { type: "paragraph", text: "For further details regarding returns, please refer to our Return Policy." },
      ],
    },
    {
      title: "SECTION 6 – THIRD-PARTY LINKS",
      blocks: [
          { type: "paragraph", text: "The website may contain links to third-party websites that are not affiliated with Kobbo." },
          { type: "paragraph", text: "Kobbo is not responsible for reviewing or evaluating the content, accuracy, or practices of third-party websites. We do not warrant and will not have any liability or responsibility for third-party materials, websites, products, or services." },
      ],
    },
    {
      title: "SECTION 7 – USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS",
      blocks: [
          { type: "paragraph", text: "If you send us specific submissions at our request, such as contest entries, or voluntarily send us creative ideas, suggestions, proposals, plans, or other materials by email, post, or any other means, you agree that Kobbo may, without restriction, edit, copy, publish, distribute, translate, or otherwise use such comments in any medium." },
          { type: "paragraph", text: "We are under no obligation to:" },
          { type: "paragraph", text: "Maintain any comments in confidence;" },
          { type: "paragraph", text: "Pay compensation for any comments; or" },
          { type: "paragraph", text: "Respond to any comments." },
          { type: "paragraph", text: "Kobbo may, but is not obligated to, monitor, edit, or remove content that we determine, at our sole discretion, to be unlawful, offensive, threatening, libellous, defamatory, pornographic, obscene, or otherwise objectionable, or that violates any party's intellectual property rights or these Terms of Service." },
          { type: "paragraph", text: "You agree that your comments will not violate any rights of a third party, including copyright, trademark, privacy, personality, or other personal or proprietary rights." },
          { type: "paragraph", text: "You further agree that your comments will not contain libellous, unlawful, abusive, or obscene material, or any computer virus or other malware that could affect the operation of the Service or any related website." },
          { type: "paragraph", text: "You may not use a false email address, pretend to be someone other than yourself, or otherwise mislead Kobbo or third parties regarding the origin of any comments." },
          { type: "paragraph", text: "You are solely responsible for the comments you make and for ensuring their accuracy. Kobbo accepts no responsibility and assumes no liability for comments posted by you or any third party." },
      ],
    },
    {
      title: "SECTION 8 – PERSONAL INFORMATION",
      blocks: [
          { type: "paragraph", text: "Any personal information submitted through the store is governed by our Privacy Policy." },
      ],
    },
    {
      title: "SECTION 9 – ERRORS, INACCURACIES AND OMISSIONS",
      blocks: [
          { type: "paragraph", text: "From time to time, information on our website or within the Service may contain typographical errors, inaccuracies, or omissions relating to product descriptions, pricing, promotions, offers, product shipping charges, transit times, and availability." },
          { type: "paragraph", text: "Kobbo reserves the right to correct such errors, inaccuracies, or omissions and to change or update information or cancel orders if any information within the Service or on any related website is found to be inaccurate at any time, including after an order has been submitted." },
          { type: "paragraph", text: "We are under no obligation to update, amend, or clarify information contained in the Service or any related website, including pricing information, except where required by law." },
          { type: "paragraph", text: "The absence of a specified update or refresh date should not be understood to mean that all information on the Service or related website has not been modified or updated." },
      ],
    },
    {
      title: "SECTION 10 – PROHIBITED USES",
      blocks: [
          { type: "paragraph", text: "In addition to other restrictions contained in these Terms of Service, you are prohibited from using the website or its content:" },
          { type: "paragraph", text: "For any unlawful purpose;" },
          { type: "paragraph", text: "To encourage or participate in unlawful activities;" },
          { type: "paragraph", text: "To violate any applicable international, federal, provincial, state, or local laws, rules, or regulations;" },
          { type: "paragraph", text: "To infringe upon or violate our intellectual property rights or those of others;" },
          { type: "paragraph", text: "To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate against others based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;" },
          { type: "paragraph", text: "To submit false or misleading information;" },
          { type: "paragraph", text: "To upload or transmit viruses or any other form of malicious code that may affect the functionality or operation of the Service, related websites, other websites, or the Internet;" },
          { type: "paragraph", text: "To collect or track the personal information of others;" },
          { type: "paragraph", text: "To spam, phish, pharm, pretext, spider, crawl, or scrape;" },
          { type: "paragraph", text: "For any obscene or immoral purpose; or" },
          { type: "paragraph", text: "To interfere with or bypass the security features of the Service, related websites, other websites, or the Internet." },
          { type: "paragraph", text: "Kobbo reserves the right to terminate your use of the Service or any related website for violating any of these prohibited uses." },
      ],
    },
    {
      title: "SECTION 11 – DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY",
      blocks: [
          { type: "paragraph", text: "Kobbo does not guarantee, represent, or warrant that your use of our Service will be uninterrupted, timely, secure, or free from errors." },
          { type: "paragraph", text: "We do not warrant that the results obtained through use of the Service will be accurate or reliable." },
          { type: "paragraph", text: "You agree that Kobbo may remove the Service for indefinite periods or cancel the Service at any time, without notice." },
          { type: "paragraph", text: "You expressly agree that your use of, or inability to use, the Service is at your sole risk. The Service, as well as all products and services delivered to you through the Service, are provided “as is” and “as available”, unless expressly stated otherwise by Kobbo, without representations, warranties, or conditions of any kind, whether express or implied." },
          { type: "paragraph", text: "This includes implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement." },
          { type: "paragraph", text: "In no event shall Kobbo, its partners, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, or consequential damages of any kind." },
          { type: "paragraph", text: "This includes, without limitation, lost profits, lost revenue, lost savings, loss of data, replacement costs, or similar damages, whether based in contract, tort including negligence, strict liability, or otherwise, arising from your use of the Service or any products purchased through the Service, or from any other claim relating in any way to your use of the Service or any product." },
          { type: "paragraph", text: "This limitation applies even where Kobbo has been advised of the possibility of such damages. As certain states or jurisdictions may not allow the exclusion or limitation of liability for consequential or incidental damages, our liability shall be limited to the maximum extent permitted by applicable law." },
      ],
    },
    {
      title: "SECTION 12 – INDEMNIFICATION",
      blocks: [
          { type: "paragraph", text: "You agree to indemnify, defend, and hold harmless Kobbo and its parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, subcontractors, suppliers, interns, and employees from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your breach of these Terms of Service or the documents incorporated by reference, or your violation of any law or the rights of a third party." },
      ],
    },
    {
      title: "SECTION 13 – SEVERABILITY",
      blocks: [
          { type: "paragraph", text: "If any provision of these Terms of Service is found to be unlawful, void, or unenforceable, that provision shall nevertheless remain enforceable to the fullest extent permitted by applicable law." },
          { type: "paragraph", text: "The unenforceable portion shall be treated as separated from these Terms of Service, and such determination shall not affect the validity or enforceability of the remaining provisions." },
      ],
    },
    {
      title: "SECTION 14 – TERMINATION",
      blocks: [
          { type: "paragraph", text: "Any obligations and liabilities incurred by the parties before the termination date shall continue after termination for all applicable purposes." },
          { type: "paragraph", text: "These Terms of Service remain effective unless terminated by either you or Kobbo." },
          { type: "paragraph", text: "You may terminate these Terms at any time by notifying us that you no longer wish to use our Services, or when you stop using our website." },
          { type: "paragraph", text: "If, in our sole judgment, you fail or we suspect that you have failed to comply with any term or provision of these Terms of Service, Kobbo may also terminate this agreement at any time without notice." },
          { type: "paragraph", text: "You will remain responsible for all amounts due up to and including the date of termination, and we may accordingly deny you access to our Services or any part of them." },
      ],
    },
    {
      title: "SECTION 15 – ENTIRE AGREEMENT",
      blocks: [
          { type: "paragraph", text: "If Kobbo does not exercise or enforce any right or provision contained in these Terms of Service, this shall not constitute a waiver of that right or provision." },
          { type: "paragraph", text: "These Terms of Service, together with any policies or operating rules posted by us on this website or relating to the Service, constitute the complete agreement and understanding between you and Kobbo concerning your use of the Service." },
          { type: "paragraph", text: "They supersede any prior or contemporaneous agreements, communications, and proposals, whether oral or written, between you and us, including previous versions of these Terms of Service." },
          { type: "paragraph", text: "Any ambiguity in interpreting these Terms of Service shall not be construed against the party responsible for drafting them." },
      ],
    },
    {
      title: "SECTION 16 – GOVERNING LAW",
      blocks: [
          { type: "paragraph", text: "These Terms of Service and any separate agreements under which we provide Services shall be governed by and interpreted in accordance with the laws of India and the jurisdiction of Delhi." },
      ],
    },
    {
      title: "SECTION 17 – CHANGES TO TERMS OF SERVICE",
      blocks: [
          { type: "paragraph", text: "You may review the latest version of these Terms of Service at any time on this page." },
          { type: "paragraph", text: "Kobbo reserves the right, at its sole discretion, to update, modify, or replace any part of these Terms by posting the revised terms or changes on the website." },
          { type: "paragraph", text: "It is your responsibility to review the website periodically for updates. Your continued use of or access to the website or the Service after any changes have been posted constitutes acceptance of those changes." },
      ],
    },
    {
      title: "SECTION 18 – CONTACT INFORMATION",
      blocks: [
          { type: "paragraph", text: "If you have any questions regarding these Terms of Service, please contact us at:" },
          { type: "paragraph", text: "Kobbo" },
          { type: "paragraph", text: "Email: hello@kobbo.in" },
      ],
    },
  ],
};
