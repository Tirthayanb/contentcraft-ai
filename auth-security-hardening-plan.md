# Auth Security Hardening Plan — ContentCraft AI

**Status:** Plan only. No application source code is modified by this document.  
**Scope:** Authentication and session security for `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, and supporting utilities under `src/lib/auth/`.

---

## 1. JWT Configuration

### 1.1 Verify `JWT_SECRET` is configured locally without exposing its value

**Goal:** Confirm the secret is present and meets minimum strength in development/CI without printing, logging, or transmitting the secret itself.

**Proposed check (runtime, not build-time):**
- On server startup or on first protected request, read `process.env.JWT_SECRET`.
- Assert it is defined and its length is above a minimum threshold (e.g. ≥ 32 characters).
- Report only a boolean result or a generic message such as `"JWT_SECRET configured"` / `"JWT_SECRET missing or too short"`.
- **Never** print, log, return, or transmit the value of `JWT_SECRET`, its hash, or any substring.

**Why not build-time:** A build-time failure would break `next build`/CI whenever the env var is absent, even for static/preview builds that do not serve auth routes. A runtime check fails safely per-request instead of blocking the build.

### 1.2 Missing / weak production configuration fails safely

- **Missing `JWT_SECRET` in production:** Protected routes should return `401 Unauthorized` (session invalid) rather than falling back to a predictable hardcoded secret. The fallback `"dev-secret-change-me"` in `src/lib/auth/session.ts:4` should be treated as a local-development convenience only and must not be relied on in production.
- **Weak secret detection:** The local verification check (Section 1.1) should reject secrets below the minimum length before the server accepts authenticated traffic.

### 1.3 Explicit HS256 restriction (defense-in-depth)

- Add `algorithms: ["HS256"]` to `jwt.verify` calls in `src/lib/auth/session.ts` so verification explicitly accepts only HS256.
- **Correction:** Omitting an algorithm allowlist does **not** automatically permit `alg: none`. The `jsonwebtoken` library defaults to HS256 when signing and rejects `alg: none` by default unless explicitly configured otherwise. The explicit allowlist is therefore defense-in-depth, not a remediation for an active `none`-algorithm vulnerability in this codebase.

**Files affected (plan only):**
- `src/lib/auth/session.ts` — `verifySession` and `signSession`

## 2. CSRF Scope

### 2.1 Cookie-authenticated state-changing routes reviewed

| Route | Method | State-changing? | Auth mechanism | CSRF exposure |
|-------|--------|-----------------|----------------|---------------|
| `/api/auth/signup` | POST | Yes | HttpOnly cookie + JWT | Yes |
| `/api/auth/login` | POST | Yes | HttpOnly cookie + JWT | Yes |
| `/api/auth/logout` | POST | Yes | HttpOnly cookie + JWT | Yes |
| `/api/auth/me` | GET | No | HttpOnly cookie + JWT | No (read-only) |

### 2.2 Threat model

- An attacker-controlled page can cause a victim's browser to send a cross-origin POST to these endpoints. Because the session cookie is HttpOnly and `SameSite=lax`, the browser will attach the cookie to same-site top-level navigations but may also attach it to certain cross-origin form submissions depending on the browser and request type.
- `SameSite=lax` mitigates CSRF for top-level navigation (e.g. `<form action>` submitted from another site) but does **not** fully protect AJAX/fetch-based cross-origin requests or same-site attacker contexts.

### 2.3 Origin validation — compatibility trade-offs

- **Pros:** Validating `Origin` or `Referer` on state-changing POST requests blocks cross-origin CSRF where `SameSite=lax` does not apply.
- **Cons/Risks:**
  - Some privacy-focused browsers or configurations strip `Origin`.
  - Mobile WebView clients, native wrappers, or older HTTP clients may omit `Origin`.
  - Same-origin single-page applications (SPAs) hosted on the same origin as the API will send `Origin` matching the server, so validation is safe for them.
- **Plan:** Do **not** automatically allow requests with missing `Origin` without documenting why that is appropriate for the supported clients. If missing `Origin` is permitted, document the client types that legitimately omit it and accept the residual risk.
- **Do not add new environment variables** unless they already exist in the project configuration pattern (e.g. no new `CSRF_*` vars unless consistent with existing env management).

### 2.4 Recommended next step (plan only)

Evaluate adding `Origin` / `Referer` validation on `POST /api/auth/login`, `POST /api/auth/signup`, and `POST /api/auth/logout`, with explicit documentation of which clients may omit `Origin` and why that is accepted. Do not implement in this plan phase.


## 3. Authorization

### 3.1 `requireAuth` usage audit

- `src/lib/auth/require-auth.ts` defines `requireAuth()` but a search of the source tree shows it is **not imported by any route**. It is currently unused.
- Protected routes (`/api/auth/me`) call `getSession()` directly rather than `requireAuth()`.

**Decision:** Because `requireAuth` is unused, do **not** present an optional helper change to `requireAuth` as an immediate security fix. Any hardening of `requireAuth` is a future, optional improvement.

### 3.2 Routes needing database-backed user / role / subscription revalidation

| Route | Current behavior | DB revalidation needed? | Justification |
|-------|------------------|-------------------------|---------------|
| `POST /api/auth/signup` | Creates user, issues cookie | No (creates record) | N/A — establishes identity |
| `POST /api/auth/login` | Verifies password, updates `lastLoginAt`, issues cookie | Yes (already via `findUserByEmail` + `updateUserLastLogin`) | Confirms user exists and password valid before issuing session |
| `POST /api/auth/logout` | Clears cookie only | No | Stateless cookie clearance |
| `GET /api/auth/me` | Calls `getSession()`, then `findUserById` + `normalizeUserRecord` | Yes (already implemented) | Re-fetches user record, normalizes role based on subscription status, returns safe user fields |
| `requireAuth` (unused) | Would only check JWT validity | Would need extension | Not currently protecting any route |

**Roles / subscriptions:**
- `src/models/User.ts` normalizes role on read: legacy `paid_customer` maps to `member` only if subscription status is `active`; otherwise falls back to `customer`. This is server-side role revalidation on `me`.
- **Do not invent permissions** (e.g. `admin`, `moderator`) or change API behavior without product justification.

### 3.3 Recommended next step (plan only)

If new protected API routes are added, use `getSession()` (or a hardened `requireAuth`) for authentication, and route-specific DB lookups for role/subscription authorization where business logic requires it. Do not apply blanket DB revalidation to stateless routes such as logout.

## 4. Verification

### 4.1 Checks that can be performed without exposing secrets

- Confirm `src/lib/auth/session.ts` calls `jwt.verify` (signature + expiry enforced by library default).
- Confirm `algorithms: ["HS256"]` is present after implementation (defense-in-depth).
- Confirm cookie attributes `httpOnly`, `secure`, `sameSite`, `path`, `maxAge` match between login/signup (7 days) and logout (0).
- Confirm `requireAuth` is unused and no route relies on it.
- Confirm `/api/auth/me` re-fetches user from MongoDB and normalizes role/subscription server-side.
- Confirm no new environment variables are introduced unless already consistent with project config.
- Confirm no secret values are printed, logged, or returned by any verification step.

### 4.2 Checks requiring later implementation

- Production `JWT_SECRET` strength check at runtime (Section 1.1).
- `Origin` / `Referer` validation on state-changing POST routes (Section 2.3).
- Any server-side token revocation / blocklist if immediate logout-on-all-devices becomes required (not currently implemented; stateless JWT cannot be revoked before expiry).

### 4.3 Tests and builds

- All `npm run lint`, `npm run build`, and functional tests are **proposed future checks only** and are not part of this plan phase.
- No tests, builds, migrations, or database queries are executed as part of this document.

---

## Summary of Changes to This Plan

This plan document was created (no prior `auth-security-hardening-plan.md` existed). It establishes:

1. **JWT configuration:** Local presence/strength verification without exposing the secret; runtime (not build-time) failure for missing/weak production config; explicit HS256 allowlist as defense-in-depth with a corrected statement that omitting the allowlist does not automatically permit `alg: none`.
2. **CSRF scope:** Review of all four cookie-authenticated routes; threat model for `SameSite=lax`; documented trade-offs for `Origin` validation including why missing `Origin` must not be auto-allowed without client justification; no new environment variables.
3. **Authorization:** Audit confirming `requireAuth` is defined but unused (not presented as an immediate fix); identification that `/api/auth/me` already performs DB-backed role/subscription revalidation while login/signup/logout do not require it; prohibition on inventing permissions.
4. **Verification:** Separation of no-secret checks (immediately verifiable) from checks requiring later implementation; all lint/build/test runs deferred as future checks.

No application source code was edited, no packages installed, no tests/builds run, no environment files changed, and nothing committed or pushed.

