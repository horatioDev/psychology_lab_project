# MERN Starter Kit

Production-ready full-stack starter using **MongoDB**, **Express**, **React**, and **Node.js** with free-tier integrations for auth, storage, email, analytics, monitoring, and payments.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express (ES Modules) |
| Database | MongoDB Atlas (M0 free cluster) |
| Auth | Clerk (email/password + OAuth) |
| File Storage | Cloudinary |
| Email | Resend |
| Analytics | PostHog |
| Monitoring | Sentry |
| Payments | Stripe |

## Project Structure

```
mern-starter/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js              # Express entry point
│       ├── config/
│       │   ├── db.js             # MongoDB connection
│       │   └── sentry.js         # Sentry init
│       ├── middleware/
│       │   ├── auth.js           # Clerk protect middleware
│       │   ├── errorHandler.js
│       │   └── upload.js         # Multer for Cloudinary
│       ├── models/
│       │   └── User.js
│       ├── routes/
│       │   ├── index.js
│       │   ├── users.js
│       │   ├── upload.js
│       │   ├── email.js
│       │   └── stripe.js
│       └── utils/
│           ├── cloudinary.js
│           ├── sendEmail.js
│           └── emailTemplates.js
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── config/
│       │   ├── sentry.js
│       │   └── posthog.js
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── FileUpload.jsx
│       │   ├── PricingPage.jsx
│       │   └── SentryTestButton.jsx
│       ├── hooks/
│       │   └── usePostHog.js
│       ├── lib/
│       │   └── api.js
│       └── pages/
│           ├── Home.jsx
│           ├── Dashboard.jsx
│           ├── SignIn.jsx
│           └── SignUp.jsx
└── README.md
```

## Quick Start

### 1. Clone and install

```bash
npm run install:all
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in credentials from each service dashboard (see Free Tier Limits below).

### 3. Set up external services

1. **MongoDB Atlas** — Create a free M0 cluster, add your IP to the allowlist, copy the connection string.
2. **Clerk** — Create an app, enable Email + OAuth providers, copy publishable and secret keys.
3. **Cloudinary** — Copy cloud name, API key, and API secret from the dashboard.
4. **Resend** — Create an API key; use `onboarding@resend.dev` for testing.
5. **PostHog** — Create a project, copy the project API key.
6. **Sentry** — Create Node.js and React projects, copy DSNs for each.
7. **Stripe** — Create products/prices for subscription and one-time, copy price IDs and secret key.

### 4. Run development servers

```bash
# Terminal 1 — backend (port 5000)
npm run dev:backend

# Terminal 2 — frontend (port 5173)
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173).

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/users/health` | No | Health check |
| POST | `/api/users/sync` | Yes | Sync Clerk user to MongoDB + welcome email |
| GET | `/api/users/me` | Yes | Get current user |
| POST | `/api/upload` | Yes | Upload file to Cloudinary |
| POST | `/api/email/send` | Yes | Send transactional email |
| POST | `/api/stripe/create-checkout-session` | Yes | Create Stripe checkout |
| POST | `/api/stripe/webhook` | Stripe sig | Handle payment webhooks |
| GET | `/api/sentry-test` | No | Trigger backend Sentry error |
| GET | `/api/sentry-capture` | No | Send backend Sentry message |

## Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| MongoDB Atlas M0 | 512MB storage, shared cluster |
| Clerk | 10,000 MAU |
| Cloudinary | 25 credits/month |
| Resend | 3,000 emails/month, 100/day |
| PostHog | 1M events/month |
| Sentry | 5,000 errors/month |
| Stripe | Pay-per-transaction (2.9% + 30¢) |

## Stripe Webhook (local dev)

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `backend/.env`.
