# UrbanThread

Full-stack e-commerce platform for fashion retail — React, TypeScript, Express, PostgreSQL (Neon DB), Redis, Clerk auth, Razorpay payments.

---

## Architecture

```
Browser (React 18 + Vite + Tailwind)
  │  Clerk session JWT via Axios interceptor
  ▼
Express API (TypeScript + tsx)
  ├─ clerkMiddleware() ── session verification
  ├─ helmet / CORS / compression / morgan
  ├─ rate limiting (Redis-backed in production)
  ├─ Zod validation on all write endpoints
  ├─ protect → JIT user provisioning from Clerk
  ├─ authorize(...roles) → RBAC
  └─ asyncHandler → centralised error handler
       │          │          │
  Neon DB     Redis      ImageKit
  (Prisma)   (cache)    (image CDN)
       │
   Razorpay
  (payments)
```

**Roles:** `customer` · `seller` · `admin`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, React Router |
| Auth | Clerk (email/password + Google OAuth + OTP verification) |
| Backend | Node.js, Express 4, TypeScript (tsx runtime) |
| Database | PostgreSQL on Neon DB via Prisma ORM |
| Cache | Redis (ioredis) — user sessions, product catalog, rate limiting |
| Payments | Razorpay (HMAC-SHA256 signature verification with timing-safe compare) |
| Storage | ImageKit (image upload + CDN) |
| Validation | Zod 3 (request body/query/params) |
| Logging | Winston (dev: colorized, prod: JSON + file rotation) + Morgan |
| Security | Helmet, express-rate-limit, CORS allowlist, field whitelisting |

---

## Features

- **Auth** — Clerk-delegated sign-up/sign-in, Google OAuth, OTP email verification, JIT DB provisioning
- **Catalog** — Category filtering, search (ILIKE), sorting, pagination, Redis-cached listings (5 min TTL)
- **Cart & Wishlist** — Persistent per-user, backed by PostgreSQL with unique constraints
- **Checkout** — Saved address book, Razorpay integration (card/UPI/COD), atomic stock decrement in Prisma transaction
- **Orders** — Line-item snapshots, status lifecycle (Processing → Delivered), server-computed totals
- **Reviews** — 1 per user per product (DB constraint), auto-computed product rating via aggregate
- **Seller Center** — Product CRUD with multi-image upload (up to 10)
- **Admin Panel** — Dashboard stats (raw SQL aggregations), user/product/order management, role & status controls
- **Redis Caching** — Auth middleware user cache (5 min), product catalog (5-10 min), graceful degradation when Redis is down

---

## Project Structure

```
backend/
├── config/          prisma.ts, redis.ts, razorpay.ts, imagekit.ts
├── controllers/     auth, product, order, cart, wishlist, review, address, user, admin, payment, upload
├── middleware/       auth.ts (protect + authorize + cache bust), errorHandler.ts, rateLimiter.ts, validate.ts
├── routes/          one file per resource
├── validators/      Zod schemas per resource
├── prisma/          schema.prisma (13 models, PostgreSQL enums)
├── utils/           ApiError.ts, asyncHandler.ts, logger.ts
├── types/           express.d.ts (Request augmentation)
├── server.ts        bootstrap, middleware stack, graceful shutdown
└── tsconfig.json

frontend/
├── src/
│   ├── components/  pages + UI (Radix/shadcn)
│   ├── context/     AuthContext, CartContext, WishlistContext
│   ├── services/    api.ts (Clerk token interceptor), resource services
│   ├── App.tsx      ClerkTokenSync + routes
│   └── main.tsx     ClerkProvider root
```

---

## Getting Started

**Prerequisites:** Node.js >= 18, [Clerk](https://clerk.com) account, [Neon DB](https://neon.tech) project, Razorpay test keys, ImageKit account

```bash
git clone <repo-url> && cd Urban-Thread

# Backend
cd backend
npm install
cp .env.example .env        # fill in values
npm run db:push              # create tables in Neon DB
npm run dev                  # tsx watch server.ts

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env        # fill in VITE_CLERK_PUBLISHABLE_KEY
npm run dev                  # Vite on :5173
```

### Promote first admin

```bash
cd backend
ADMIN_EMAIL=you@example.com npm run promote-admin
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon DB pooled connection string |
| `DATABASE_URL_UNPOOLED` | Yes | Neon DB direct connection (for migrations) |
| `CLERK_PUBLISHABLE_KEY` | Yes | `pk_test_...` from Clerk dashboard |
| `CLERK_SECRET_KEY` | Yes | `sk_test_...` from Clerk dashboard |
| `REDIS_URL` | No | Redis connection string (defaults to `localhost:6379`) |
| `ALLOWED_ORIGINS` | Yes | Comma-separated frontend URLs |
| `RAZORPAY_KEY_ID` | Yes | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret |
| `ImagekitID` / `PUBLIC_KEY` / `PRIVATE_KEY` | Yes | ImageKit credentials |
| `PORT` | No | Default: `5001` |
| `NODE_ENV` | No | `development` / `production` |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend base URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | `pk_test_...` |

---

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload (`tsx watch`) |
| `npm run dev:debug` | Start with Node inspector |
| `npm start` | Production start (`tsx server.ts`) |
| `npm run build` | Type-check (`tsc --noEmit`) |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:migrate` | Create migration file |
| `npm run seed` | Seed sample products |
| `npm run promote-admin` | Promote user to admin by email |
| `npm run lint` | ESLint check |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript check |

---

## Security

| Concern | Mitigation |
|---------|-----------|
| Authentication | Clerk-issued short-lived JWTs, no passwords stored |
| Authorization | Role-based middleware (`protect` + `authorize`) |
| Input validation | Zod schemas on all write endpoints |
| SQL injection | Prisma parameterized queries; `$queryRaw` uses tagged templates |
| Mass assignment | Field whitelisting in update controllers |
| Payment fraud | HMAC-SHA256 signature verification with `crypto.timingSafeEqual` |
| Race conditions | Atomic stock decrement inside Prisma `$transaction` (decrement-then-check) |
| Rate limiting | 4-tier: global (100/15min), auth (10/15min), payment (20/hr), upload (30/hr) |
| CORS | Strict origin allowlist, exact-match for Razorpay domains |
| File upload | Folder allowlist, filename regex validation |
| Security headers | Helmet (HSTS, X-Frame-Options, etc.) |
| Cache | Redis with graceful degradation; user cache busted on role/status changes |
| Error leaks | Production mode hides stack traces and internal errors |

---

## API Endpoints

All prefixed with `/api`. Protected routes require `Authorization: Bearer <clerk-token>`.

| Resource | Endpoints | Access |
|----------|-----------|--------|
| Auth | `GET /auth/me` | Protected |
| Users | `GET /users/profile`, `PUT /users/profile` | Protected |
| Products | `GET /products`, `GET /products/:id`, `POST`, `PUT`, `DELETE` | Public (read) / Seller+Admin (write) |
| Orders | `POST /orders`, `GET /orders/my-orders`, `GET /orders/:id` | Protected |
| Cart | `GET`, `POST`, `PUT /:itemId`, `DELETE /:itemId`, `DELETE /` | Protected |
| Wishlist | `GET`, `POST /:productId`, `DELETE /:productId` | Protected |
| Reviews | `GET /:productId`, `POST`, `PUT /:id`, `DELETE /:id` | Public (read) / Protected (write) |
| Addresses | `GET`, `POST`, `PUT /:id`, `DELETE /:id` | Protected |
| Payment | `GET /razorpay-key`, `POST /create-order`, `POST /verify-payment` | Protected |
| Upload | `GET /auth`, `POST /`, `POST /multiple`, `DELETE /:fileId` | Protected |
| Admin | Stats, users, products, orders CRUD | Admin only |
| Health | `GET /health` | Public |
