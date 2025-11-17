# CryptoGuard – Wallet Security & Transaction Verifier

CryptoGuard is a full-stack MVP that showcases how security teams can monitor multi-chain wallets (BTC, ETH, SOL), detect suspicious behavior, and export audit-ready reports. It ships with a responsive marketing site, an authenticated dashboard, and a secure Node.js API.

## Tech Stack

- **Frontend:** React (Vite), React Router, TailwindCSS, Axios, lucide-react
- **Backend:** Node.js, Express 5, JWT auth, Nodemailer, PDFKit, json2csv
- **Auth:** Email/password, passwordless magic links, simulated Google OAuth
- **Notifications:** Email (via Nodemailer JSON transport by default) + webhook placeholder

## Features

- Marketing site with hero, pricing, testimonials, CTA, About & Contact pages
- Detailed features page covering blockchain support, alerts, and enterprise workflows
- Auth experiences for signup/login, passwordless magic links, and Google OAuth mock
- Dashboard with wallet summaries, live transactions, alert feed, connect-wallet form, CSV/PDF export helpers, and test notifications
- Backend APIs for wallets, transactions, alerts, exports, notifications, and enterprise overviews
- Role-aware plans: Free (2 wallets), Pro (10 wallets), Enterprise (unlimited + admin APIs)
- Sample data + demo credentials (`demo@cryptoguard.dev` / `password123`)

## Project Structure

```
/frontend   React + Tailwind single-page app
/backend    Express API with authentication, wallets, alerts, exports
```

## Getting Started

### 1. Clone & install

```bash
git clone <repo>
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

Copy the provided examples and update secrets as needed.

```bash
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env
```

**Backend `.env`**

```
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=1d
EMAIL_FROM=alerts@cryptoguard.dev
EMAIL_USER=your-smtp-username
EMAIL_PASS=your-smtp-password
NOTIFICATION_WEBHOOK=
MAGIC_LINK_TTL=15
```

**Frontend `.env`**

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=replace-with-google-client-id
```

If you leave `EMAIL_USER`/`EMAIL_PASS` blank the backend falls back to Nodemailer’s JSON transport (logs emails instead of sending).

### 3. Run the backend

```bash
cd backend
npm run dev
```

The API defaults to `http://localhost:5000`. Important endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Email/password signup with plan selection |
| POST | `/api/auth/login` | JWT login |
| POST | `/api/auth/passwordless` | Sends passwordless email |
| POST | `/api/auth/passwordless/verify` | Completes magic-link login |
| POST | `/api/auth/oauth/google` | Simulated Google OAuth |
| GET | `/api/wallets/overview` | Wallet cards + transactions + alerts |
| POST | `/api/wallets` | Connect wallet (plan limits enforced) |
| GET | `/api/wallets/:id/export?format=csv|pdf` | Download report |
| GET | `/api/wallets/alerts` | Real-time suspicious activity |
| POST | `/api/notifications/test` | Test email/webhook |
| GET | `/api/admin/*` | Enterprise-only overviews & reports |

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`. Use the demo credentials or sign up with your own email. The dashboard will call the Express API configured in `VITE_API_URL`.

### 5. Production builds

- Frontend: `npm run build` (outputs to `frontend/dist`)
- Backend: `npm run start` (after setting `NODE_ENV=production`)

## Security & Development Notes

- Secrets are loaded via `dotenv`; keep real credentials out of source control.
- JWT signing uses `JWT_SECRET` with configurable expiry.
- Passwords are hashed with `bcryptjs`; passwordless & OAuth flows keep the same user object.
- Suspicious-activity heuristics flag large transfers, unknown counterparties, and repeated failures.
- CSV exports rely on `json2csv`; PDF exports use `pdfkit`.
- Notification service gracefully degrades when SMTP/webhook settings are missing.

## Testing the Experience

1. `npm run dev` in `backend` and `frontend` directories.
2. Navigate to `/auth`, sign in (or use `demo@cryptoguard.dev` / `password123`).
3. Explore the dashboard, connect wallets, trigger test notifications, and export CSV/PDF reports.

## License

MIT (see `LICENSE`).