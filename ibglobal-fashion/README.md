# IBGLOBAL FASHION — Online Store

A working prototype online store for a tailor shop: customers browse and buy
ready-to-wear pieces or request a made-to-measure order, and you (the admin)
manage products, sizes, fabric/quality descriptions, orders, and custom
measurement requests from a separate admin panel.

## What's included

**Customer-facing site**
- Product catalog by category, product pages with photos, sizes, fabric,
  quality grade, and care instructions
- "Made to measure" form for custom orders with the customer's own measurements
- Cart, checkout (cash on delivery / bank transfer / card placeholder),
  delivery or pickup
- Order tracking by a code emailed/shown at checkout
- WhatsApp contact button
- Customer reviews and star ratings per product

**Admin panel** (`/admin`)
- Secure login
- Add, edit, delete products — including photos, size chart with stock per
  size, fabric, quality/grade, and care instructions (this is the screen
  that answers "where do I insert sizes, quality, and describe the cloth")
- Mark items in stock / made-to-order
- View and update orders through new → in progress → ready → delivered
- View and update custom measurement requests
- Dashboard with order count, revenue, and low-stock warnings

## Project structure

```
ibglobal-fashion/
  backend/     Node.js + Express API, JSON file database
  frontend/    React + Vite + Tailwind CSS storefront and admin panel
```

## Before you run anything

This code was written and syntax-checked in a sandbox with no internet
access, so **it has not been run end-to-end**. It follows standard,
well-established patterns (Express, React, Vite, Tailwind) and every file
was checked for syntax errors, but please treat the first `npm install` /
`npm run dev` as the real first test, and expect to fix small issues if
they come up — that's normal for a freshly generated codebase.

## Setup

You'll need [Node.js](https://nodejs.org) 18 or later installed.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set:
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login (used the first time the database is created)
- `SHOP_WHATSAPP_NUMBER` — the shop's WhatsApp number, digits only with country code (e.g. `2348012345678`)

Then start the server:

```bash
npm run dev
```

The first time it runs, it creates `backend/data/db.json` with your admin
account and four sample products, and prints your admin login to the
console. The API runs at `http://localhost:4000`.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The storefront runs at `http://localhost:5173` and talks to the API
automatically in development.

Visit `http://localhost:5173/admin/login` to sign in as admin.

## Mobile

This is one responsive web app — it already adapts to phone screens and
works in any mobile browser, which is what "web app and mobile app" usually
means for a store at this stage: one site, works everywhere. A true native
app (something installable from the App Store / Play Store) is a separate,
larger project. Two realistic paths, when you're ready:
1. **Wrap this site** with a tool like [Capacitor](https://capacitorjs.com)
   to ship it to app stores with minimal extra code.
2. **Build a native app** with React Native, reusing this same backend API.

## Going to production

This prototype makes deliberate simplifications so it runs anywhere with
zero setup. Before real customers and real money touch it, you'd want to:

- **Database**: replace `backend/utils/db.js` (JSON file) with a real
  database (Postgres, MySQL, etc.) — it's the only file the rest of the
  app talks to for data, so it's a contained swap.
- **Payments**: the "card" option at checkout is a placeholder. Integrate a
  real gateway such as Paystack or Flutterwave for card payments.
- **Image storage**: uploaded photos are saved to `backend/uploads/` on
  disk. For production, use a cloud storage service (e.g. AWS S3,
  Cloudinary) so images survive redeploys.
- **Hosting**: deploy the backend (e.g. Render, Railway, a VPS) and the
  frontend (e.g. Vercel, Netlify), and set `VITE_API_URL` in the frontend
  to your deployed API URL.
- **HTTPS & secrets**: always run behind HTTPS in production, and never
  commit your `.env` file.

## Design notes

Colors and type were chosen specifically for this brand: deep ink navy,
brass gold, and a warm parchment background, with a serif display face
(Fraunces) for headings and a clean sans (Inter) for body text and forms.
A tape-measure tick pattern is used as the one recurring divider motif
across the site, referencing tailoring itself rather than a generic
template look. The logo is a monogram "IB" inside a tailor's-tape ring.
