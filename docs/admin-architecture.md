# RPV Admin Architecture Plan

## Current Site

- Type: Static website
- Stack: HTML, CSS, JavaScript
- Hosting now: GitHub Pages from `Newwic/RPVWEBSITE`
- Product source now: `data/rpv-products.js`
- Images now: `assets/`
- Backend: none
- Database: none
- Login: none
- Build step: none
- GitHub Actions: none found

## Recommended Architecture

Use GitHub for source code and Supabase for live editable content.

- GitHub: stores website code, admin code, styles, migrations, and fallback static data.
- Supabase Auth: admin login, session, password reset, future MFA.
- Supabase PostgreSQL: products, categories, site content, settings, admin profiles, revisions.
- Supabase Storage: product images and media library.
- Supabase RLS: real permission enforcement. UI hiding is not security.

## Why Not Save To GitHub Or localStorage

- GitHub commits for every content edit are slow and risky for non-developers.
- localStorage only saves on one browser and disappears easily.
- Customers on other phones/computers would not see localStorage edits.
- Admin editing must persist in a shared database.

## Admin Routes

- `/admin/login.html`
- `/admin/`

Admin routes must:

- have `noindex, nofollow`
- not appear in customer navigation
- not appear in sitemap
- be disallowed in `robots.txt`
- still require real login and role checks

## Roles

- `super_admin`: can manage everything and invite/administer users.
- `editor`: can manage products, categories, content, images, and revisions.
- `viewer`: can view and preview only.

## Safe First Admin Setup

Do not put passwords or service role keys in the repo.

Recommended setup:

1. Create the first user in Supabase Auth manually.
2. In Supabase SQL Editor, insert that user's `id` into `admin_profiles` with role `super_admin`.
3. After that, additional admins should be invited by a super admin.

## Data Flow

1. Admin logs in with Supabase Auth.
2. Admin page reads `admin_profiles` to verify role.
3. Admin edits a product as Draft.
4. Save validates data and writes to database.
5. `revision_history` stores before/after data.
6. Admin previews.
7. Admin publishes.
8. Customer site reads only `Published` rows.

## Fallback Strategy

During migration, keep `data/rpv-products.js` as fallback.

If Supabase is not configured or fails:

- customer site should keep showing current static data
- admin must show "not connected" or "save failed"
- never show a fake success message

## Rollback

Rollback is simple while phase 1 is isolated:

- remove `/admin`
- remove `/supabase`
- restore `robots.txt` if needed
- keep the existing static website files

When customer pages are later connected to Supabase, keep a feature flag so the site can switch back to static `data/rpv-products.js`.

## Required Values From Owner

Do not send these in chat.

Add them locally/deployment settings:

- Supabase project URL
- Supabase anon publishable key

Never put these in frontend:

- Supabase service role key
- database password
- GitHub token
- personal access token

