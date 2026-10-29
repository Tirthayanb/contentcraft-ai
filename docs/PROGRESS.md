# Progress / Changelog

## 2026-10-29
### Database migration & cleanup (Native Driver)
- Migrated from Mongoose to official `mongodb` Native Driver; removed Mongoose from dependencies.
- Added server-only cached Atlas connection (`src/lib/db/mongodb.ts`) using `MONGODB_URI` from `.env.local`.
- Implemented models/helpers with TypeScript types, validation, and indexes:
  - `src/models/User.ts` (role: `visitor` | `free_customer` | `paid_customer`, optional email unique/sparse, no passwords/secrets)
  - `src/models/Subscription.ts` (status enum, indexes)
  - `src/models/Usage.ts` (per-user/month unique index)
  - `src/models/UploadedFile.ts` (metadata indexes)
- Cleaned unused imports; `npm run lint` and `npm run build` passed cleanly.
- Created `.env.local` from `.env.local.example` (template only); `MONGODB_URI` must be added manually.

### Authentication (signup/login/session)
- Installed: `bcryptjs`, `jsonwebtoken`, `zod`, `@types/bcryptjs`, `@types/jsonwebtoken`
- Added auth utilities:
  - `src/lib/auth/password.ts` (bcryptjs hashing/verification, 12 rounds)
  - `src/lib/auth/session.ts` (JWT signing/verification, httpOnly cookie session via `SESSION_COOKIE_NAME`)
  - `src/lib/auth/validation.ts` (zod schemas for signup/login)
  - `src/lib/auth/require-auth.ts` (server helper for protected routes)
- Extended `src/models/User.ts` to include optional `passwordHash` (never stored in plain text; not exposed)
- API routes:
  - `POST /api/auth/signup` - validates input, prevents duplicate accounts (409), hashes password, creates `free_customer`, sets session cookie (201)
  - `POST /api/auth/login` - validates input, verifies credentials (401 on invalid), sets session cookie (200)
  - `GET /api/auth/me` - returns current user or 401
- Added `POST /api/auth/logout` - clears the httpOnly session cookie (200)
- Unified `User` schema: `createdAt`/`updatedAt`/`lastLoginAt` stored as Unix timestamps in milliseconds (`Date.now()`); `lastLoginAt` updated on successful login; `updatedAt` updated whenever the user record is modified; `passwordHash` never exposed in API responses; JWT `exp` remains seconds-based JWT NumericDate via `expiresIn`.
- Pages:
  - `src/app/signup/page.tsx`, `src/app/login/page.tsx` (client forms)
  - `src/app/dashboard/page.tsx` (server-protected route, redirects to `/login` if unauthenticated)
- Updated `.env.local.example` with `JWT_SECRET` and `SESSION_COOKIE_NAME` placeholders.

### Test results (actual)
- `npm run lint`: passed cleanly (no errors, no warnings)
- `npm run build`: passed (Next.js 16.4.3 Turbopack; routes `/`, `/_not-found`, `/api/auth/login`, `/api/auth/me`, `/api/auth/signup`, `/dashboard`, `/login`, `/signup`)
- Functional tests executed against `http://localhost:3001` (dev server):
  - `GET /api/auth/me` (no session) → 401 (unauthenticated access rejected)
  - `POST /api/auth/signup` invalid input `{email:"bad", password:"123"}` → 400 (zod validation before DB)
  - `GET /dashboard` (no session) → 307 redirect to `/login` (protected route enforcement)
  - `POST /api/auth/login` wrong credentials → 500 (environmental: MongoDB Atlas unreachable, DNS `querySrv ETIMEOUT`; would return 401 with a reachable DB)

Checks not performed (require reachable MongoDB Atlas):
- Successful signup (creates user in DB)
- Duplicate signup prevention (409 "Account already exists")
- Successful login + session cookie set
- Logout / session expiry
- Protected API routes with valid session
- Successful login → `GET /api/auth/me` returns user

Notes: `MONGODB_URI` in `.env.local` points to an Atlas cluster that cannot be resolved from this network. No secrets printed or committed. Landing page preserved. `.env.local` preserved (not overwritten). No commits/pushes made.

### API documentation (Swagger / OpenAPI)
- Added OpenAPI 3.0 specification at `/api/openapi` (`src/lib/openapi.ts`, `src/app/api/openapi/route.ts`).
- Added Swagger UI at `/api/docs` (`src/app/api/docs/route.ts`) loading Swagger UI from CDN and pointing at `/api/openapi`.
- Documented signup, login, logout, and session check endpoints with request schemas, responses, status codes, and cookie-based JWT auth.
- Added `POST /api/auth/logout` to clear the session cookie (`src/app/api/auth/logout/route.ts`).

### Schema & Role System Update (visitor, customer, member + embedded subscription)
- **Roles strictly enforced:**
  - Allowed roles: `visitor` (unauthenticated, no DB record required), `customer` (free registered user), `member` (paid subscriber).
  - New signups unconditionally receive `customer`; role input from client is ignored and rejected via type safety.
  - `member` cannot be granted via signup, login, or client-controlled parameters.
- **Embedded subscription object on User:**
  - `subscription`: `{ status: "inactive" | "active" | "past_due" | "cancelled", planId: string | null, currentPeriodEnd: number | null }`.
  - Timestamps stored as Unix milliseconds (`Date.now()`); `createdAt`, `updatedAt`, and `lastLoginAt` maintained consistently.
  - All new signups initialize with `status: "inactive"`, `planId: null`, `currentPeriodEnd: null`.
- **Legacy record migration / backward compatibility:**
  - Added `normalizeUserRecord` helper in `src/models/User.ts`:
    - Legacy `free_customer` or unknown roles are mapped safely to `customer`.
    - Legacy `paid_customer` or `member` are only permitted as `member` if their subscription status is verified `active`; otherwise fall back safely to `customer` without silently granting paid access.
    - Missing subscription object defaults to `{ status: "inactive", planId: null, currentPeriodEnd: null }`.
- **API and Response Safety:**
  - `toSafeUser` helper ensures `passwordHash` is never returned in API responses.
  - `GET /api/auth/me` returns `{ user: null, role: "visitor" }` with 200 for unauthenticated requests, preventing unnecessary DB queries and avoiding 401 noise for normal visitor browsing.
  - Updated OpenAPI specifications in `src/lib/openapi.ts` to reflect the updated role enum and subscription schema.
- **Data Migration Note:**
  - Running a background or one-time MongoDB update query is recommended for pre-existing documents:
    ```javascript
    db.User.updateMany(
      { subscription: { $exists: false } },
      {
        $set: {
          subscription: { status: "inactive", planId: null, currentPeriodEnd: null },
          role: "customer"
        }
      }
    );
    db.User.updateMany(
      { role: "free_customer" },
      { $set: { role: "customer" } }
    );
    db.User.updateMany(
      { role: "paid_customer", "subscription.status": "active" },
      { $set: { role: "member" } }
    );
    db.User.updateMany(
      { role: "paid_customer", "subscription.status": { $ne: "active" } },
      { $set: { role: "customer" } }
    );
    ```
    *(The runtime application code also automatically normalizes unmigrated documents upon reading via `normalizeUserRecord`).*

### Zod → OpenAPI Architecture & Spec Modularization
- Reused existing `src/lib/auth/validation.ts` (`signupSchema`, `loginSchema`) as the single source of truth for runtime validation and OpenAPI request schemas.
- Converted Zod schemas to OpenAPI 3.0-compliant JSON schemas via Zod v4's native `toJSONSchema(schema, { target: "openApi3" })`, adding 0 third-party dependencies.
- Modularized the OpenAPI specification under `src/lib/openapi/`:
  - `src/lib/openapi/config.ts`: General metadata, API title, servers, and cookie security schemes.
  - `src/lib/openapi/schemas.ts`: Reusable schemas combining Zod-derived request models and core entity contracts.
  - `src/lib/openapi/paths/auth.ts`: Auth endpoints (`/api/auth/signup`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`).
  - `src/lib/openapi.ts`: Re-assembles and exports the complete specification.
- Maintained compatibility with `GET /api/openapi` and `GET /api/docs` without any modifications to frontend files.



