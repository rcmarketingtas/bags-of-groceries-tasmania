# Bags of Groceries Tasmania

A production-ready platform for connecting sponsors with Tasmanian families experiencing hardship.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Database | Supabase (Postgres + Auth) |
| Payments | Stripe Checkout |
| Email | Resend + React Email |
| Deployment | Vercel |
| Rate Limiting | Upstash Redis (optional) |

---

## Features

- **Sponsor page** — Choose 1 or 2 bags ($25/$50), pay via Stripe Checkout
- **Apply page** — Families submit assistance applications
- **Contact page** — Contact form with confirmation email
- **Admin dashboard** — Protected area with metrics, application management, CSV export
- **Webhooks** — Stripe webhook creates donation records (never trust client)
- **Emails** — Donation receipt, application confirmation, contact confirmation via Resend

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/bags-of-groceries-tasmania.git
cd bags-of-groceries-tasmania
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in all values — see [Environment Variables](#environment-variables) below.

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:

```bash
# Copy the contents of supabase/migrations/001_initial_schema.sql
# and run it in the Supabase SQL Editor
```

3. Go to **Authentication → Users** and create your admin user manually
4. Copy your project URL, anon key, and service role key into `.env.local`

### 4. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create two products in the Stripe dashboard:
   - **Sponsor 1 Grocery Bag** — $25 AUD, one-time
   - **Sponsor 2 Grocery Bags** — $50 AUD, one-time
3. Copy the **Price IDs** into `.env.local`
4. Set up a webhook (see below)

#### Stripe Webhook Setup

**Local development:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

**Production (Vercel):**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the signing secret into your Vercel environment variable

### 5. Set up Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your sending domain
3. Create an API key
4. Update `RESEND_FROM_EMAIL` with your verified domain email

### 6. Set up Upstash (optional — rate limiting)

1. Create a free Redis database at [upstash.com](https://upstash.com)
2. Copy the REST URL and token into `.env.local`

If you skip this, rate limiting is gracefully disabled (not recommended for production).

### 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual deploy

```bash
npm install -g vercel
vercel --prod
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Important Vercel settings

- **Framework Preset:** Next.js
- **Node.js Version:** 20.x
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_1_BAG` | Stripe Price ID for $25 (1 bag) |
| `STRIPE_PRICE_2_BAGS` | Stripe Price ID for $50 (2 bags) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified from email address |
| `NEXT_PUBLIC_SITE_URL` | Full site URL (no trailing slash) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (optional) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token (optional) |

---

## Admin Access

1. Create an admin user in **Supabase Dashboard → Authentication → Users**
2. Navigate to `/admin/login`
3. Sign in with the credentials you created

The admin area is protected by Supabase Auth middleware. Only authenticated users can access `/admin/*` routes.

---

## Database Schema

Three tables with Row Level Security enabled:

| Table | Description |
|---|---|
| `donations` | Records created via Stripe webhook only |
| `applications` | Submitted by families (anon insert allowed) |
| `contact_messages` | Contact form submissions (anon insert allowed) |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages with Header + Footer
│   │   ├── page.tsx       # Home
│   │   ├── sponsor/
│   │   ├── apply/
│   │   ├── thank-you/
│   │   ├── about/
│   │   └── contact/
│   ├── admin/
│   │   ├── login/         # Auth page (no sidebar)
│   │   └── (dashboard)/   # Protected pages with sidebar
│   │       ├── page.tsx   # Metrics dashboard
│   │       ├── applications/
│   │       └── donations/
│   └── api/
│       ├── webhooks/stripe/  # Stripe webhook handler
│       └── admin/export/     # CSV export
├── actions/               # Server Actions
├── components/            # UI + feature components
├── emails/                # React Email templates
├── lib/                   # Supabase, Stripe, Resend, utils
└── types/                 # TypeScript interfaces
```

---

## Security Checklist

- [x] Zod validation on all server actions
- [x] Stripe webhook signature verification
- [x] Never trust client-side payment confirmation
- [x] Supabase RLS enabled on all tables
- [x] Service role key only used server-side
- [x] Rate limiting on public forms (requires Upstash)
- [x] Admin routes protected by middleware + Supabase Auth
- [x] Input sanitisation via Zod `.trim()` + `.toLowerCase()`
- [x] CSRF protection via Next.js Server Actions (built-in)

---

## License

Private — All rights reserved.
