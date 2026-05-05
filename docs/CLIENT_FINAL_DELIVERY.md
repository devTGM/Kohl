# Kohl & Spice - Final Client Delivery Document

Last updated: 2026-02-18
Project: Kohl & Spice Web Experience (SvelteKit)
Deployment: Vercel (Production)

## 1) Delivery Summary

This document is the final handover guide for client delivery and future developer onboarding.

Final deliverables prepared:
- Source code repository
- Production deployment on Vercel
- Environment variable mapping
- Services and credentials tracker template (Google Sheet-ready CSV)
- Delivery ZIP package for Drive upload

## 2) Live Environment Details

Fill this section with final production values before sharing with client.

- Production platform: Vercel
- Production URL: `<ADD_PRODUCTION_URL>`
- Vercel project name: `<ADD_PROJECT_NAME>`
- Vercel team/account: `<ADD_TEAM_OR_ACCOUNT>`
- Primary branch for deployment: `<ADD_BRANCH>`
- DNS/domain owner: `<ADD_OWNER>`

## 3) Google Drive Final Folder Structure

Create this structure in your client Drive folder:

```text
KohlSpice_Final_Delivery/
  01_Documentation/
    CLIENT_FINAL_DELIVERY.md
    README.md
  02_Credentials_and_Access/
    client-services-credentials-template.csv
  03_Deployment/
    vercel-project-settings-export.pdf (optional)
    domain-dns-records.txt (optional)
  04_Source_Package/
    kohlspice-client-delivery-YYYY-MM-DD.zip
  05_Handover_Notes/
    open-items-and-support-window.md
```

## 4) Services and Credential Tracking Sheet

Use `docs/client-services-credentials-template.csv` as your Google Sheet base.

Recommended tabs:
- `Services & Credentials`
- `Environment Variables`
- `Access Owners`
- `Renewal/Rotation`

Important:
- Do not store raw passwords/tokens in plain text unless client explicitly requests it.
- Prefer storing "where secret is stored" (e.g. Vercel env, 1Password vault).
- Share least-privilege access only.

## 5) Required Environment Variables (Production)

Copy values from secure storage and verify in Vercel Project Settings.

### Core commerce
- `SHOPIFY_DOMAIN`
- `SHOPIFY_STOREFRONT_TOKEN`
- `SHOPIFY_API_VERSION`
- `SHOPIFY_DEFAULT_PRODUCT_HANDLE`

### Contact form (SMTP)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

### Newsletter
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_DATA_CENTER`
- `MAILCHIMP_LIST_ID`

### Reviews
- `JUDGEME_PRIVATE_TOKEN`
- `JUDGEME_SHOP_DOMAIN`

### Instagram
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `INSTAGRAM_API_VERSION`
- `INSTAGRAM_API_BASE`

### Analytics / tracking
- `PUBLIC_CLARITY_PROJECT_ID`
- `PUBLIC_MIXPANEL_TOKEN`
- `PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO`
- `PUBLIC_GOOGLE_ADS_CONVERSION_PATH`
- `PUBLIC_GOOGLE_ADS_CONVERSION_VALUE`
- `PUBLIC_GOOGLE_ADS_CONVERSION_CURRENCY`
- `PUBLIC_GOOGLE_ADS_CONVERSION_TRANSACTION_ID`
- `PUBLIC_SHOPIFY_SHOP_ID`
- `PUBLIC_SHOPIFY_STOREFRONT_ID`

## 6) Final QA Checklist Before Client Handover

- Production site loads and navigation works.
- Homepage product data loads from Shopify.
- Shop list and product detail pages load.
- Cart add/update/remove works and checkout URL opens.
- Blog pages load from Shopify.
- Contact form email is delivered.
- Newsletter subscription endpoint works.
- Reviews load and review submission works.
- Instagram feed endpoint works.
- Clarity/Mixpanel/Google Ads events fire as expected.
- `/account/login` redirects to Shopify account page.

## 7) Developer Onboarding Notes (For Next Developer)

1. Read root `README.md` first for architecture and API routes.
2. Copy `.env.example` to `.env` and fill required values.
3. Run:
   - `pnpm install`
   - `pnpm dev`
4. Verify key routes:
   - `/`
   - `/shop`
   - `/shop/[slug]`
   - `/blog`
   - `/contact`
5. Validate APIs:
   - `/api/product`
   - `/api/blogs`
   - `/api/instagram`
   - `/api/subscribe`
   - `/api/reviews`
   - `/api/shopify/products`
   - `/api/shopify/cart`

## 8) Post-Handover Support Window

Define and agree with client:
- Hypercare period (example: 7-14 days)
- SLA for bug fixes
- Contact channel and escalation owner
- Scope exclusions (new features vs defects)

## 9) Security and Access Transfer Rules

- Transfer ownership of Vercel, Shopify app access, Mailchimp audience access, Judge.me, analytics tools.
- Rotate all temporary/team-shared secrets after transfer.
- Remove personal accounts from production systems after confirmation.
- Keep an audit log of who received which access and when.
