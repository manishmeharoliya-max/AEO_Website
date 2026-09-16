# Website and backend workspace

Start the full backend with `npm run dev` in `backend`, then start the website with `npm run dev` in `website`. The website forwards `/api` requests to `http://127.0.0.1:5000`. Use `API_PROXY` in `website/.env` if the backend runs on another port. The separate audit-only server does not provide authentication or dashboards.

For production, set `VITE_API_URL` to the backend origin (without `/api`) before building the website. Set the backend `CLIENT_URL` to the website origin. Configure the backend database, JWT secret and email delivery using its existing environment configuration. The existing backend seeds demo accounts in an empty database; replace those credentials before exposing a deployment.

## Routes and flow

- `/plans`: public plan comparison; all marketing pages and the AEO checker remain public.
- `/checkout?plan=growth`: requires authentication only when a visitor proceeds with a plan. The selected plan and website query survive login/signup.
- `/login`: email/password login, email OTP signup and password reset. Roles come from the backend; public signup cannot create staff accounts.
- `/account`: customer orders and billing status.
- `/admin`: client directory, editable client details, order list, search and real order metrics.
- `/superadmin`: platform overview plus team and role management. Own-role changes and own-account deletion are rejected by the API.

Existing seeded local accounts are `user@zepfly.com`, `admin@zepfly.com`, and `superadmin@zepfly.com`, with password `zepfly123`. These only apply to an unmodified seeded development database.

## Payment boundary

The current backend payment endpoints are demo stubs, not a payment gateway. Checkout deliberately does not call them or claim a successful charge. It creates a **pending** order with authoritative server pricing: Starter $199 one-time, Growth $499/month, Authority $999/month. Payment collection and activation require a real provider, credentials and verified server-side callbacks. The checkout communicates this clearly and collects no card information.

## Code organization

- `src/lib/api.js`: shared API client and session token storage.
- `src/features/auth/`: session context, role guards, login/signup/reset.
- `src/features/checkout/`: plan review and order submission.
- `src/features/dashboard/`: responsive workspace, customer/admin/superadmin views and scoped styles.
- `backend/src/config/plans.js`: authoritative order catalogue.
- Existing backend controllers/models/routes provide authorization and persistence.

Tokens use session storage and are validated with `/auth/me` on reload; API 401 responses clear the session. Role protection is enforced independently on the server. Dashboard metrics are calculated from actual orders rather than sample business performance figures. The website URL query remains contextual and is not stored on an order by the existing order schema.

## Verification

Run `npm run build` and `npx playwright test` in `website`. Browser tests cover public access, purchase/login continuity, pending orders, staff dashboards, mobile overflow and expired sessions with controlled API fixtures. Run `node test/workspace.test.js` in `backend` for real HTTP integration checks using a temporary isolated data store. These cover authorization, server prices, one-time billing, account editing and role restrictions.
