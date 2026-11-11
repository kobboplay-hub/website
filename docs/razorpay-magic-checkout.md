# Razorpay Magic Checkout

The headless storefront sends every INR cart to Razorpay Magic Checkout when the feature flag and credentials are set. Shopify checkout is used only as a fallback when Magic Checkout cannot start before payment.

## Razorpay and Shopify configuration

1. Razorpay's Magic Checkout app must stay connected to the Shopify store and the merchant ID. The headless API returns `Authorization Failed` if this link is removed.
2. Every product must be a physical product in Shopify (**Shipping → Physical product**). Razorpay hides COD for orders that do not require shipping.
3. Shipping uses Razorpay **Magic Shipping** (Magic Checkout → Setup & Settings → Shipping Setup). The Domestic zone is free and allows COD, matching the storefront shipping policy.
4. COD is enabled in Magic Checkout → Setup & Settings → Cash on Delivery. The **OTP for all COD orders** workflow (Advanced COD Workflows) asks for an OTP on every COD order.
5. Partial COD applies only to Play Kits through the **Partial COD - Play Kits** slab, which targets the **Play Kits** catalog segment (Magic Checkout → Segments). Add a new kit's Shopify product ID to that segment, or it will get full COD only. Change the advance amount on the slab in the dashboard, not in storefront code.
6. The `PREPAID150` coupon gives ₹150 off on Play Kits, restricts COD, applies once per order, and is not auto-applied. The older Razorpay payment offer for prepaid orders is disabled so the discount cannot stack.

## Storefront configuration

Set these server environment variables in the hosting project, then redeploy:

```text
RAZORPAY_MAGIC_KEY_ID=rzp_live_...
RAZORPAY_MAGIC_KEY_SECRET=<secret stored only in the hosting environment>
RAZORPAY_MAGIC_CHECKOUT_ENABLED=true
```

Remove the flag or set it to anything other than `true` to send customers back to Shopify checkout. Never commit the key secret.

## Checkout behavior

- A fresh Shopify cart is read on the server before starting Magic Checkout. Product IDs, variant IDs, and quantities come from Shopify, not from browser input.
- If setup fails before payment, the customer can use the regular Shopify checkout.
- After payment, the server verifies Razorpay's signature before calling its Shopify order completion API. If that completion fails, the screen shows the payment ID and **does not** start a second checkout, preventing a duplicate charge.

## Launch tests

- Kit-only cart: `PREPAID150` is offered, COD shows the Partial COD advance, and COD asks for an OTP.
- Toy-only cart: no `PREPAID150` discount, COD without a Partial COD advance, and an OTP on COD.
- Mixed kit and toy cart: the discount applies only to the kit.
- Successful prepaid, Partial COD, and COD orders appear in Shopify Admin with matching totals and payment status.

References: [Razorpay headless Shopify integration](https://razorpay.com/docs/payments/magic-checkout/shopify/custom/web-integration-nextjs), [Razorpay Shopify features and Partial COD](https://razorpay.com/docs/payments/magic-checkout/shopify/features).
