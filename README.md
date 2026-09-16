> Production setup: follow [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md). It supersedes older cloud-connection notes below. No deployment or live Supabase verification has been performed.

# SavannahRental MVP / 萨凡纳房产管理 MVP

Bilingual (English / Simplified Chinese) Next.js website and private owner portal, built from the supplied specification and local coliving material. No source documents or private projections are published.

## Run locally / 本地运行

Requires Node.js 22+.

```
npm install
npm run setup-admin
npm run dev
```

Open http://127.0.0.1:3000. Use the EN / 中文 switch; the selection persists and is included in navigation URLs. `?lang=zh` opens a Chinese page directly.

The local admin is `agentkelly2024@gmail.com`. Its randomly generated password is saved in the gitignored `.data/LOCAL-ADMIN-LOGIN.txt`. Do not commit or publish that file. Owner registration does not grant admin rights. The setup script never overwrites an existing account; run it while the server is stopped.

本地管理员登录信息在 `.data/LOCAL-ADMIN-LOGIN.txt`，不要分享或提交此文件。业主可自行注册，管理员随后关联房产并上传文件。

## Working MVP flows

- Home, long-term rental, co-living, case study, how it works, evaluation, about, contact, registration, login.
- Bilingual navigation, marketing copy, forms, validation feedback, owner and admin interfaces.
- Contact/evaluation requests validated on the server and persisted in `.data/store.json`.
- Local scrypt password hashing, opaque HttpOnly sessions, sign out, origin checks, request limits.
- Owner dashboard, assigned properties and individual property pages; private document downloads.
- Admin reviews requests, assigns properties to registered owners, and uploads general or property-specific documents (up to 10 MB).
- Documents and property notes are shared only with their assigned owner and administrators. Admin access is checked server-side on every write.
- Optional Supabase and Resend adapters plus database/storage policies are included for later connection.

## Local storage limitations

`.data/` is private server-side storage and is gitignored. Back it up if local records matter. This local single-process preview is not a hosted production database. Do not run multiple server instances against the same local store. The app refuses local storage under production mode unless `ALLOW_LOCAL_PREVIEW=true` is explicitly set. That flag is ONLY for loopback testing of the production build.

Email is not connected: form confirmations accurately state that the request was saved and notification is pending. Review requests in `/admin`. Nothing is emailed until Resend is configured.

## Verification

```
npm run typecheck
npm run build
npm test
```

Integration tests require the local server to be running at `http://127.0.0.1:3000`. They create clearly labeled test accounts, records and a document, then remove only those records. Do not run tests against live production data.

## Connect cloud services later

1. Create a Supabase project and apply `supabase/schema.sql` once.
2. Set `DATA_BACKEND=supabase`, `NEXT_PUBLIC_SUPABASE_URL`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`. Remove `ALLOW_LOCAL_PREVIEW` from production.
3. Configure Supabase email confirmation, allowed site URLs, and outbound authentication email. The production adapter issues a session after login; expired sessions require re-login.
4. Register and verify the actual admin mailbox. Promote ONLY its verified profile using the commented SQL statement. A public registration never assigns admin privileges.
5. Configure `RESEND_API_KEY` and a verified sender in `NOTIFICATION_FROM`. Submissions notify `agentkelly2024@gmail.com` and remain stored even if delivery fails. Pending emails are visible to the admin; automatic retries are not part of this MVP.
6. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS deployment origin. Deploy to a Node-compatible Next.js host such as Vercel. Use HTTPS. Add a distributed rate limiter/CAPTCHA before accepting public traffic; the current limiter is per process.
7. Verify registration, confirmation, owner isolation, document downloads, form storage and email delivery on the actual deployment before launch. Cloud adapters and SQL are provided but have not been validated against a real Supabase project in this local-only build.

## Content provenance

- Build brief: `SavannahRental Website — Complete Codex Build Specification.md` supplied in Downloads. It ends partway through Contact; the complete email in preceding sections is used.
- Operational copy informed by local setup/procurement guides and resident notices. Vendor price tables, platform statistics, legal thresholds, private projections and email attachments are not copied to the public site.
- Photography: selected user-provided living room and bedroom photos from 101Seagrass and 23J, resized and stripped of metadata. No third-party stock imagery.
- Gold Host and educational-participation statements are supplied brand claims; no PadSplit endorsement is implied.
- Case studies now use owner-supplied Jan–Aug 2026 earnings data for Pooler 31322 and Atlanta 30342. August dues and payouts are distinct from owner-confirmed rental baselines (Pooler actual $2,700; Atlanta listed $3,200) and owner profit. Update `lib/case-studies.ts` and `components/case-studies.tsx`; private address/source mapping is retained in `.data/case-study-research.md`.

## Deferred from MVP

Live hosting, connected cloud/auth email, automatic notification retries, self-service password reset, property editing/deletion, accounting/report generation, and bulk owner imports are not configured. The requested local registration, login, lead intake, property assignment, and private file access are functional.

## Verified local build (2026-09-16)

- `npm run build`: passed (Next.js 16.3.5).
- TypeScript: passed.
- Integration suite: 13 passing tests, covering durable lead storage, authentication, privilege checks, owner isolation, uploads/downloads, validation, and session revocation.
- Browser suite: 56 route/language/viewport checks (14 routes × English/Chinese × desktop/mobile), with no horizontal overflow or broken images.
- Browser flows: Chinese contact submission, English property evaluation, language switching/mobile navigation, owner registration/logout, and admin login/logout passed. No uncaught page errors.
- Reviewed English and Chinese desktop screenshots and Chinese phone screenshot.
- Temporary test users, leads, properties, and documents removed. The local administrator remains.

Browser checks can be repeated with `node scripts/browser-test.mjs` while the local server runs; they use the installed Microsoft Edge browser through Playwright.


## Membership update

Registration requires matching passwords of at least 8 characters; both password fields have show/hide controls. Login also has a show/hide control. Property evaluation is members-only: its page redirects anonymous visitors to registration, switching to login retains the destination, and successful authentication returns the member to the evaluation form in the selected language. The submission API independently rejects anonymous evaluation requests. General contact inquiries remain public. Membership benefits copy describes the intended service offering; monthly content distribution is not automated by this change. Integration checks: 14 passed; focused registration/login browser flows passed.

### Shared member resources
The co-living page shows the shared library after sign-in. Original files live in `.data/member-resources/` and are served only by the session-protected `/api/member-resources/[id]` route. They are separate from owner/property documents. Preserve this folder with local data backups; it is not included in Git or public assets.

### Admin self-service
Log in as agentkelly2024@gmail.com to open /admin. Initial local credentials are in .data/LOCAL-ADMIN-LOGIN.txt. Change the password in the dashboard using the current password; the initial credential file is not updated and becomes obsolete after changing it. The shared-resource form publishes to all signed-in members. The private-owner form assigns documents to one account and optionally one property. Shared-resource metadata is persisted in store.json; uploaded files remain outside public assets.
