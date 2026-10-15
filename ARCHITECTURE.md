# Kobbo Shopify Storefront – Architecture Overview

## Tech Stack
- **Framework**: Next.js 13 (App Router), React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via `globals.css`)
- **State**: React Context (Auth, Cart, Wishlist, AgeGroups)
- **Data**: Shopify Storefront/Admin API (GraphQL), Judge.me API (REST)
- **Auth**: Shopify Customer Account API (OAuth) + email/password
- **Deploy**: Vercel (Node.js server)

## Key Directories
- `src/app/` – Next.js pages, layouts, API routes
- `src/components/` – Reusable UI (atoms → organisms)
- `src/context/` – React providers (auth, cart, wishlist, age groups)
- `src/lib/` – Business logic: Shopify wrappers, auth helpers, Judge.me, newsletter
- `src/data/` – Static data (SEO, empty states, policies)

## Data Flow (Product Browse)
1. **Server Component** (`app/shop/page.tsx`) calls `getShopProductsByCursor` → Shopify GraphQL.
2. Optionally fetches review summaries (Judge.me) with timeout.
3. Passes products to `<ShopInfiniteGrid />` (client) → renders `<ProductCard />`.
4. Clicking a product → `/products/[handle]` → fetches product by handle + metadata.
5. **Add to Cart**: UI → cart context → `/api/cart` route → `lib/shopify/cart` → Shopify cart mutation.
6. Cart context updates → UI reflects change (badge, drawer).

## Authentication
- **Email/Password**: `/api/auth/login` → sets HTTP‑only cookies (`kobbo_customer_token`).
- **OAuth (Google)**: `/api/auth/google` → PKCE → redirect to Shopify → `/api/auth/callback` exchanges token → sets cookie with provider=`customer_account`.
- **Guard**: `requireAuthRedirect` protects pages/APIs.

## State Management
- **AuthContext**: user profile, login/logout.
- **CartContext**: cart items, totals, add/remove/update (syncs with Shopify cart ID).
- **WishlistContext**: handles in `localStorage`; refetches product data via `/api/wishlist`.
- **AgeGroupsContext**: age‑group metaobjects for navigation/filtering.

## API Routes
- All under `src/app/api/` (REST‑style).
- Examples: `/api/cart`, `/api/auth/*`, `/api/reviews/*`, `/api/newsletter/subscribe`.
- Use `lib/` services; errors handled via `apiErrorResponse`.

## SEO & Metadata
- Centralized in `src/data/seo.ts` (`homeMetadata`, `productMetadata`, etc.).
- Dynamic `generateMetadata` in page components uses fetched data.

## Styling
- Tailwind CSS + custom CSS variables (`--font-baloo`, `--font-inter`).
- UI primitives in `src/components/ui/` (buttons, spinners, skeletons).

## Potential Improvements
- Persist cart ID in localStorage/cookie to survive refreshes.
- Add error boundaries (`app/error.tsx`).
- Increase `getProducts(20)` limit for static generation or use fallback SSR.
- Audit accessibility (ARIA labels, contrast).
- Add unit/integration tests.
- Consider stale‑while‑revalidate for Judge.me reviews.
