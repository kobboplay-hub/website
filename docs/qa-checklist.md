# Kobbo Storefront — QA Checklist

Use this checklist before client handoff or deployment.

## Homepage
- [ ] Announcement bar displays correctly
- [ ] Hero section readable on mobile and desktop
- [ ] Best Sellers load from Shopify
- [ ] "View All Products" links to `/shop`
- [ ] Instagram section links to Kobbo profile
- [ ] Footer links work

## Shop
- [ ] Products load and grid is responsive
- [ ] Search/filter works on shop page
- [ ] Loading skeleton shows while fetching
- [ ] Empty/error states display friendly copy

## Product Page
- [ ] Images, price, variants display
- [ ] Read More / Show Less on description
- [ ] Product tabs hide when empty
- [ ] Videos section (YouTube / MP4 / Instagram)
- [ ] FAQ accordion works
- [ ] Delivery ETA visible near Add to Cart
- [ ] Reviews load (Judge.me)
- [ ] Recently viewed updates

## Cart
- [ ] Add to cart from product card and PDP
- [ ] Cart drawer opens/closes on mobile
- [ ] Cart page shows line items and totals
- [ ] ₹50 online payment note visible
- [ ] Delivery ETA visible
- [ ] Empty cart state is friendly

## Checkout Redirect
- [ ] "Proceed to Checkout" redirects to Shopify `checkoutUrl`
- [ ] Buy Now redirects to checkout
- [ ] Logged-in customer identity attaches (if applicable)
- [ ] Note: checkout form fields are controlled by Shopify

## Login / Register
- [ ] Email login works
- [ ] Show/hide password toggles work
- [ ] Google button shows "Coming soon" (disabled)
- [ ] Friendly error messages on wrong credentials
- [ ] Forgot / reset password flow works

## Account
- [ ] Dashboard loads profile summary
- [ ] Orders list loads (or empty state)
- [ ] Addresses CRUD works
- [ ] Wishlist page works

## Wishlist
- [ ] Add/remove from product cards
- [ ] Empty wishlist state
- [ ] Move to cart from wishlist

## Reviews
- [ ] Product reviews display on PDP
- [ ] Empty reviews state on new products
- [ ] Write review (eligible purchasers only)

## Search
- [ ] Header search overlay opens/closes
- [ ] Suggestions show image, title, price
- [ ] `/search?q=` results page works
- [ ] Empty search state

## Mobile
- [ ] No horizontal scroll on any page
- [ ] Header hamburger menu works
- [ ] Tap targets feel comfortable (44px min)
- [ ] Cart drawer full-width on small screens
- [ ] Product cards align in 2-column grid

## Policies
- [ ] `/faqs`
- [ ] `/shipping-policy`
- [ ] `/return-policy`
- [ ] `/privacy-policy`
- [ ] `/terms-and-conditions`
- [ ] `/contact`

## Payment Note
- [ ] "Get ₹50 off on online payments" on cart drawer/page
- [ ] Actual discount must be configured in Shopify checkout/payments

## Env Vars (do not commit)
- [ ] `SHOPIFY_STORE_DOMAIN`
- [ ] `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `JUDGEME_PRIVATE_TOKEN`
- [ ] `JUDGEME_PUBLIC_TOKEN`
- [ ] `NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN`
