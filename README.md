# Kohl & Spice Web Experience

SvelteKit storefront and marketing site for Kohl & Spice. This codebase powers:
- marketing pages and educational content
- Shopify-backed product and cart flows
- blog content sourced from Shopify
- customer reviews via Judge.me
- newsletter subscription (Mailchimp)
- contact form delivery via SMTP

## Tech Stack

- SvelteKit 2 + Svelte 5
- TypeScript
- Tailwind CSS v4
- GSAP + Lenis (scroll and interaction effects)
- Shopify Storefront GraphQL API
- Judge.me API
- Mailchimp API
- Nodemailer (SMTP)
- Microsoft Clarity + Mixpanel + Google Ads conversion hooks

## Requirements

- Node.js 18+
- `pnpm` (project lockfile is `pnpm-lock.yaml`)

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Create local env file:

```bash
cp .env.example .env
```

3. Fill required variables (see [Environment Variables](#environment-variables)).

4. Run dev server:

```bash
pnpm dev
```

## Handover Docs

- Final client delivery doc: `docs/CLIENT_FINAL_DELIVERY.md`
- Services/credentials sheet template: `docs/client-services-credentials-template.csv`

## Scripts

- `pnpm dev` - start local dev server
- `pnpm build` - production build
- `pnpm preview` - preview built app locally
- `pnpm check` - SvelteKit sync + type checks
- `pnpm check:watch` - type checks in watch mode
- `pnpm lint` - Prettier check + ESLint
- `pnpm format` - Prettier write

## Environment Variables

Use `.env.example` as the source of truth.

### Contact Form (SMTP)

Required for `/contact` form action in `src/routes/(web)/contact/+page.server.ts`.

- `SMTP_HOST`
- `SMTP_PORT` (default used by code: `587`)
- `SMTP_USER`
- `SMTP_PASSWORD`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` (optional; falls back to `SMTP_USER`)

### Mailchimp (Newsletter)

Required for `POST /api/subscribe`.

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_DATA_CENTER`
- `MAILCHIMP_LIST_ID`

### Shopify (Products, Blog, Cart)

Required for shop/catalog/blog/cart features and Shopify account login redirect.

- `SHOPIFY_DOMAIN`
- `SHOPIFY_STOREFRONT_TOKEN`
- `SHOPIFY_API_VERSION` (default in server code is `2025-01`; `.env.example` currently sets `2026-01`)
- `SHOPIFY_DEFAULT_PRODUCT_HANDLE` (optional, used to pin featured/default product)
- `PUBLIC_CUSTOM_CHECKOUT_SELLER_DOMAIN` (required for custom checkout script integration)
- `PUBLIC_CUSTOM_CHECKOUT_DISABLE_FALLBACK` (optional, set `true` temporarily to block auto-fallback and surface custom checkout errors)

### Analytics and Ad Conversion

All optional.

- `PUBLIC_CLARITY_PROJECT_ID`
- `PUBLIC_MIXPANEL_TOKEN`
- `PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO`
- `PUBLIC_GOOGLE_ADS_CONVERSION_PATH` (comma-separated paths)
- `PUBLIC_GOOGLE_ADS_CONVERSION_VALUE`
- `PUBLIC_GOOGLE_ADS_CONVERSION_CURRENCY`
- `PUBLIC_GOOGLE_ADS_CONVERSION_TRANSACTION_ID`

### Judge.me (Reviews)

Required for review fetch/submit/upload APIs.

- `JUDGEME_PRIVATE_TOKEN`
- `JUDGEME_SHOP_DOMAIN`

### Instagram Feed

Used by `GET /api/instagram`.

- `INSTAGRAM_ACCESS_TOKEN` (required)
- `INSTAGRAM_USER_ID` (optional)
- `INSTAGRAM_API_VERSION` (optional, default `v19.0`)
- `INSTAGRAM_API_BASE` (optional full endpoint override)

### Custom Checkout (Client-side)

Custom checkout runs in the browser through:

- Script: `https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js`
- Styles: `https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css`

Checkout uses `shiprocketCheckoutEvents.buyDirect(...)`. If custom checkout is unavailable or fails, the app
falls back automatically to Shopify store checkout via the cart `checkoutUrl`.

## API Surface

### Public API routes

- `GET /api/product` - featured/default product from Shopify
- `GET /api/blogs` - latest blog posts from Shopify
- `GET /api/instagram` - latest Instagram media
- `POST /api/subscribe` - subscribe email to Mailchimp
- `GET /api/reviews?productId=<shopify_gid>` - fetch Judge.me reviews
- `POST /api/reviews` - submit review to Judge.me
- `POST /api/reviews/upload-image` - upload review image via Judge.me presigned flow
- `GET /api/shopify/products?first=<n>` - list products
- `GET /api/shopify/products/[handle]` - fetch product by handle
- `GET /api/shopify/cart` - fetch cart from cookie-backed cart ID
- `POST /api/shopify/cart` - cart actions (`add`, `update`, `remove`, `buyerIdentity`)

### Other server routes

- `GET /account/login` - redirects to Shopify customer account login
- `/contact` - form action submits email via SMTP (not an `/api/*` endpoint)

## Cart Behavior

- Cart state is managed client-side in `src/lib/stores/cart.ts`.
- Server stores Shopify cart ID in httpOnly cookie: `shopifyCartId`.
- Cookie TTL is 30 days (`src/routes/api/shopify/cart/+server.ts`).
- Checkout first attempts client-side custom checkout and falls back to Shopify `checkoutUrl`.

## Project Structure

```text
src/
  lib/
    components/          # Svelte UI components (web sections, cart drawer, etc.)
    server/              # Shopify + Judge.me server helpers
    stores/              # Cart store
    types/               # Shared types
  routes/
    (web)/               # Main site pages (home, shop, blog, science, contact, policies)
    (landing)/           # Landing page variants
    api/                 # Backend endpoints
    account/login/       # Shopify account login redirect route
  app.css                # Global styles/tokens
  app.html               # Document shell
static/                  # Static files (images, icons, media)
```

## Build and Deployment

This repo currently uses `@sveltejs/adapter-auto`.

```bash
pnpm build
pnpm preview
```

For production hosting, switch to a target-specific adapter if needed and provide all required environment variables in your deployment platform.
