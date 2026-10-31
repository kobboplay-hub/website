# Play Kit Magic Checkout rollout

The headless storefront has an opt-in Magic Checkout path for carts containing only products with the Shopify `custom.kit` metafield set to `true`. All other carts keep using Shopify checkout. This path is disabled until the account and credentials are ready.

## Razorpay and Shopify prerequisites

1. Confirm Razorpay's Magic Checkout app is connected to the Shopify store and the merchant ID. The headless API returns `Authorization Failed` until Razorpay completes this link.
2. Complete shipping setup in Razorpay Magic Checkout. Check the rates against Shopify checkout before launch.
3. Have Razorpay enable Partial COD for this account. In Magic Checkout → Setup & Settings → Cash on Delivery, enable COD, then configure Partial COD for the desired buyer categories. Use **Custom Value** to set or change the advance as a rupee amount or percentage. Do not put the advance amount in storefront code.
4. Review the existing Razorpay prepaid offer. At the time of implementation, the enabled offer was a flat ₹150 discount with a ₹2,999 minimum payment and no product restriction. Confirm it appears only where intended before launch. Razorpay offers cannot be edited; disable and replace an offer if its terms need to change.
5. Check that Razorpay's offer and COD configuration produces matching Shopify order totals, payment status, refund amount, and remaining COD balance. Razorpay warns that Shopify can show the full order amount as captured when an offer reduces the actual Razorpay payment.

## Storefront configuration

Set these server environment variables in the hosting project, then redeploy:

```text
RAZORPAY_MAGIC_KEY_ID=rzp_live_...
RAZORPAY_MAGIC_KEY_SECRET=<secret stored only in the hosting environment>
RAZORPAY_MAGIC_CHECKOUT_ENABLED=true
```

Keep the flag off until an end-to-end test passes. Never commit the key secret. The existing Razorpay key cannot be reconstructed from its public key ID; use the securely stored original secret or create a separate key in Razorpay with the account owner's approval.

## Checkout behavior

- A fresh Shopify cart is read on the server before starting Magic Checkout. Product IDs, variant IDs, quantities, and the kit flag come from Shopify, not from browser input.
- The Magic Checkout SDK opens only for INR carts whose items are all Play Kits. If setup fails before payment, the customer can use the normal Shopify checkout.
- After payment, the server verifies Razorpay's signature before calling its Shopify order completion API. If that completion fails, the screen shows the payment ID and **does not** start a second checkout, preventing a duplicate charge.

## Required launch tests

- One kit, multiple kits, mixed kit/toy cart, and toy-only cart.
- Full prepaid with ₹150 discount; cart below and above the ₹2,999 offer threshold.
- Partial COD with both a rupee amount and a percentage in a test environment, including a low-value cart where Razorpay's 50% advance cap applies.
- Cancelled checkout, failed payment, successful payment, Shopify order creation, order email, refund, and remaining COD collection.
- Ensure the discount is unavailable on toy-only orders. If the existing Razorpay offer remains available on the native Shopify Razorpay gateway, disable or replace it before launch.

References: [Razorpay headless Shopify integration](https://razorpay.com/docs/payments/magic-checkout/shopify/custom/web-integration-nextjs), [Razorpay Shopify features and Partial COD](https://razorpay.com/docs/payments/magic-checkout/shopify/features).
