# Production setup — no deployment performed

## Vercel environment variables

Required for Production (and separately for any Preview deployment being tested):

| Name | Value to enter |
| --- | --- |
| DATA_BACKEND | supabase |
| NEXT_PUBLIC_SITE_URL | Exact website origin, e.g. https://your-site.vercel.app; no path/query; use the final custom domain when it becomes primary |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Project publishable key (public; legacy anon key also works) |
| SUPABASE_SERVICE_ROLE_KEY | Project service-role key, server-only; never prefix with NEXT_PUBLIC |

Optional email notifications: RESEND_API_KEY and NOTIFICATION_FROM (verified sender).

Do NOT set ADMIN_INITIAL_PASSWORD or ALLOW_LOCAL_PREVIEW on Vercel. These are local development/setup only. NODE_ENV is supplied by Next.js/Vercel; do not override it. APP_ORIGIN has been replaced by NEXT_PUBLIC_SITE_URL and is no longer read by the app.

.env.example contains names with blank values only. Never upload .env.local or .data. Both Git and Vercel upload exclusions cover them. This workspace currently has no Git repository/history; remote GitHub history has not been audited.

## Exact SQL order for a NEW Supabase project

1. Open Supabase Dashboard → SQL Editor → New query.
2. Paste and run the complete contents of `supabase/schema.sql` ONCE. It includes all current tables, triggers, constraints, grants, indexes, RLS policies, and the two private storage buckets. Run this before registering application users.
3. Do NOT additionally run files under `supabase/migrations` for a new project; those are historical upgrades already incorporated in schema.sql. Do not run schema.sql on an existing populated installation.
4. In Authentication → URL Configuration, set Site URL to exactly NEXT_PUBLIC_SITE_URL and add `https://YOUR-DOMAIN/login` to Redirect URLs. Add a separate exact preview URL only if testing there. Production requires HTTPS; there is no localhost production fallback.
5. Keep email confirmation enabled. Configure production authentication email/SMTP in Supabase. The confirmation link verifies the email and returns the user to /login; the user then signs in. The app deliberately does not auto-login using URL-fragment tokens.
6. Register agentkelly2024@gmail.com through the production website and verify its email. Then run `supabase/promote-admin.sql`. It refuses to promote an unverified email. Local accounts/passwords are not automatically migrated.
7. Log in again. The admin dashboard can upload the existing original documents to the shared library and assign private documents to owners. Local .data files are never bundled with the site and must be transferred deliberately through the admin forms.

## Access and storage behavior

- Supabase Auth validates the HttpOnly session cookie with getUser. Server-rendered portal/admin routes and API writes check authentication/role. Cookie lifetime follows the Supabase access-token lifetime; an expired token requires signing in again. Refresh tokens are not stored.
- User-scoped database/storage clients send the signed-in user's JWT with the publishable key, so RLS is enforced. The server service key is reserved for public contact-form ingestion, Auth administration, and signing upload tickets.
- Owners may read only their own profiles, properties, and documents. Financial files use the same private documents table and policies. Owners can submit an unsigned property for themselves, but cannot mark it signed, edit roles, or upload shared/private documents.
- Document/property owner matching is also enforced by a composite foreign key.
- `owner-documents` and `member-resources` buckets are PRIVATE. The latter is readable by all authenticated members only after a metadata record is published. Only administrators can upload.
- Cloud uploads go directly to Supabase through scoped signed upload tokens, retaining the existing 10 MB limit without passing file bodies through Vercel's smaller request limit. The finalize request checks an expiring, admin-bound signed ticket and verifies the uploaded size. Private downloads authorize access first, then redirect to a 60-second signed download URL; the URL remains usable until it expires.
- Incomplete direct uploads can leave unpublished storage objects. They are not available to ordinary members; administrators can remove abandoned objects in Supabase Storage.
- Supabase revokes refresh sessions on signout/password change, but already issued access JWTs may remain valid until expiry. Choose an appropriate access-token lifetime in Supabase.

## Verification completed locally

- npm run build: passed.
- npm test: 15 passing local functional/isolation tests; uses disposable accounts, not Kelly's password.
- npm run test:rls: 22 PostgreSQL/RLS checks using local PGlite and mocked Supabase auth/storage system tables. Includes owner isolation, financial-document isolation, private bucket declarations, role escalation denial, member upload denial, and verified-email admin promotion.
- node scripts/test-production-url.mjs: 9 URL checks.
- node scripts/test-cloud-adapter.mjs: mock-transport checks of JWT/RLS headers, database resource reads, signed downloads, and production signup redirects.
- node scripts/audit-source.mjs: no secret-pattern matches in scanned source files; blank env template checked. A pattern scan cannot prove the absence of every possible secret or audit a remote repository.

## Required hosted smoke test before launch

No live Supabase credentials were used, SQL was NOT applied remotely, and no website was deployed. Production readiness is conditional on completing configuration and the hosted checks below; a successful build alone does not certify a live deployment.

Test email confirmation/login, owner A vs owner B property/document/financial-file access (including direct Supabase API access), admin uploads, member-only downloads, a 6–10 MB upload/download, password change, expiry and logout, and anonymous denial. Check both buckets still show PRIVATE in the dashboard. Test form notification delivery if Resend is enabled. Existing in-memory app request limits are per server instance; configure appropriate Supabase Auth/Vercel abuse controls before public launch.
