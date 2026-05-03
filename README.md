# NovaCart Commerce Starter

A modern ecommerce starter with two experiences:

- Public storefront for customers
- Admin panel for product, order, payment, and delivery management

## Included pages

- `/` homepage
- `/products` product listing
- `/products/[slug]` product details
- `/checkout` checkout
- `/admin` dashboard
- `/admin/products` product management
- `/admin/orders` order management

## Suggested next build steps

1. Connect a database such as PostgreSQL with Prisma.
2. Add authentication for the admin panel.
3. Replace mock data with API-backed CRUD.
4. Integrate a payment gateway such as Stripe or SSLCommerz.
5. Add delivery and order status update actions.

## Deployment (Vercel / Other Hosting)

This project now includes deploy-safe fallbacks so it can run without filesystem crashes.

- Data store path:
  - Local default: `./data/store.json`
  - Vercel default fallback: `/tmp/zazzo-data/store.json`
  - Optional override: set `DATA_DIR`

- Image uploads:
  - Local development: files are saved in `public/uploads`
  - Serverless hosting (Vercel): direct local file upload is disabled by default
  - Recommended production setup: Cloudinary

### Required environment variables for production uploads

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_UPLOAD_PRESET`
- Optional: `CLOUDINARY_FOLDER` (default: `zazzo`)

If Cloudinary env vars are not set on serverless hosting, image upload API returns a clear error message instead of breaking the app.
