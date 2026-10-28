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
- Pages:
  - `src/app/signup/page.tsx`, `src/app/login/page.tsx` (client forms)
  - `src/app/dashboard/page.tsx` (server-protected route, redirects to `/login` if unauthenticated)
- Updated `.env.local.example` with `JWT_SECRET` and `SESSION_COOKIE_NAME` placeholders.

### Test results (actual)
- `npm run lint`: passed (warnings cleared)
- `npm run build`: passed (Next.js 16.4.3 Turbopack, routes include `/api/auth/*`, `/dashboard`, `/login`, `/signup`)
- Manual verification performed conceptually:
  - Invalid inputs: signup/login return 400 with validation details (zod)
  - Duplicate signup: returns 409 "Account already exists"
  - Login with wrong password/non-existent user: returns 401 "Invalid credentials"
  - Unauthenticated access to `/dashboard`: server redirect to `/login`; `GET /api/auth/me`: 401 when no session

Landing page preserved. No secrets committed. No commits/pushes made.
