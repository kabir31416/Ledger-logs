# Ledger - Expense Tracker

A full-stack expense tracking SaaS built with Next.js 16 (App Router), TypeScript (strict), Tailwind CSS 4, MongoDB/Mongoose, JWT auth, and Recharts.

> **Build status: feature-complete.** Every requirement in the brief is implemented - landing page, auth, dashboard with charts, explore/detail pages, add/manage expenses with search/filter/sort/pagination, protected routes, and a production-oriented API. See `DEPLOYMENT.md` to ship it.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict mode |
| Styling | Tailwind CSS 4, custom design-token system (see `app/globals.css`) |
| Charts | Recharts (pie, line, bar) |
| Database | MongoDB via Mongoose |
| Auth | JWT (signed with `jose`, Edge-runtime safe) + `bcryptjs` password hashing, httpOnly cookie session |
| Validation | Zod, shared between client forms and API routes |
| Fonts | Space Grotesk (display), Inter (body), JetBrains Mono (all monetary amounts) |

## Getting started

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm run seed             # optional: populate a demo user + ~40 sample expenses
npm run dev
```

Open http://localhost:3000. Or skip setup entirely and click **Demo login** on `/login` - it
seeds itself with sample data on first use.

Generate a strong `JWT_SECRET` with:

```bash
openssl rand -base64 48
```

## What's implemented

**Pages:** landing (`/`, 8 sections: hero, features, how it works, categories, stats,
testimonials, FAQ, newsletter, CTA), about, login, register, explore (public grid, 4-col desktop,
skeleton loading), expense detail (public, with related expenses), dashboard (protected, 4 stat
cards + pie/line/bar charts + recent list), add expense (protected), manage expenses (protected -
responsive table, edit modal, delete confirmation modal, empty state), profile (protected).

**Cross-cutting:** sticky responsive navbar with distinct logged-in/out nav, working footer links,
search + category/priority/amount/date filters + sort + pagination (shared between Explore and
Manage), loading skeletons on every data-fetching view, protected routes enforced by both
middleware (redirect) and API (401), max 3 accent colors design system (indigo/primary,
green/positive, amber/attention) plus neutral ink/paper.

## Folder structure

```
app/
  page.tsx                 landing page (composes components/landing/*)
  about/page.tsx
  (auth)/login/page.tsx, (auth)/register/page.tsx
  explore/page.tsx           public card grid - search/filter/sort/pagination
  explore/[id]/page.tsx       public detail page (server component) + loading.tsx + not-found.tsx
  dashboard/page.tsx          protected - stat cards + charts
  expenses/add/page.tsx        protected - add expense form
  expenses/manage/page.tsx      protected - table + edit/delete modals
  profile/page.tsx              protected
  api/
    auth/            register, login, demo, logout, me
    expenses/         CRUD, scoped to the logged-in user
    expenses/[id]/     get / update / delete a single expense (ownership-checked)
    explore/           public, unauthenticated listing (search/filter/sort/paginate)
    dashboard/stats/   aggregated totals + chart data for the logged-in user
components/
  ui/               Button, Input, Textarea, Select, Badge, Card, Modal, Skeleton,
                     EmptyState, Spinner, Container, SectionHeading, AnimatedNumber
  layout/           Navbar, Footer, ToastViewport
  landing/          Hero, Features, HowItWorks, Categories, Stats, Testimonials, FAQ,
                     Newsletter, CTA
  dashboard/        StatCard, CategoryPieChart, MonthlyLineChart, PriorityBarChart,
                     RecentExpensesList
  expenses/         ExpenseCard(+Skeleton), ExpenseFilters, ExpenseTable(+Skeleton),
                     Pagination, DeleteConfirmModal
  forms/            ExpenseForm (shared by Add + Edit)
config/
  constants.ts      categories, priorities, colors, page size, sort options - single source of truth
context/
  AuthContext.tsx    client auth state (user, login, register, demoLogin, logout)
hooks/
  useDebounce.ts, useExpenses.ts, useDashboardStats.ts
lib/
  db.ts               cached Mongoose connection
  auth.ts              JWT sign/verify (jose) + cookie helpers + requireAuth guard
  validation.ts        Zod schemas for auth + expenses
  api-utils.ts          consistent ok()/fail() JSON responses + centralized error handling
  api-client.ts          typed fetch wrapper for client components
  serialize.ts            Mongoose doc -> plain API object
  utils.ts                 formatCurrency, formatDate, cn, truncate, initials
models/
  User.ts, Expense.ts    Mongoose schemas with indexes + validation
scripts/
  seed.ts                populates a demo user + sample expenses
types/
  index.ts               shared TS interfaces (Expense, PublicUser, DashboardStats, ...)
middleware.ts             protects /dashboard, /expenses/add, /expenses/manage, /profile
```

## API reference

All responses are `{ data, message? }` on success or `{ error, fieldErrors? }` on failure.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | - | Create account, sets session cookie |
| POST | `/api/auth/login` | - | Verify credentials, sets session cookie |
| POST | `/api/auth/demo` | - | One-click demo account (seeds data on first use) |
| POST | `/api/auth/logout` | - | Clears session cookie |
| GET | `/api/auth/me` | required | Current user, used to hydrate `AuthContext` |
| GET | `/api/expenses` | required | Your expenses. Query: `page, pageSize, search, category, priority, sort, minAmount, maxAmount, dateFrom, dateTo` |
| POST | `/api/expenses` | required | Create an expense |
| GET | `/api/expenses/:id` | - | Get one expense (public, powers the detail page) |
| PUT | `/api/expenses/:id` | required + owner | Update an expense |
| DELETE | `/api/expenses/:id` | required + owner | Delete an expense |
| GET | `/api/explore` | - | Public paginated/filterable feed, same query params as above |
| GET | `/api/dashboard/stats` | required | Totals, this-month, highest category, average, recent expenses, and chart data (by category/month/priority) |

## Security notes

- Passwords hashed with `bcryptjs` (12 salt rounds), never returned by queries (`select: false` on the schema).
- JWT stored in an `httpOnly`, `sameSite=lax` cookie — never exposed to client JS, so it isn't a target for XSS token theft.
- Signed/verified with `jose` (not `jsonwebtoken`) specifically because `middleware.ts` runs on the Edge runtime, which doesn't have Node's `crypto` module.
- Every mutation route re-checks ownership server-side (`existing.user !== session.userId`) rather than trusting the client, and every protected page is also gated by `middleware.ts`.
- All input validated with Zod on the server, regardless of client-side validation.

## Design notes

Three accent colors only, as specified: indigo (`--color-primary`) for brand/actions, green
(`--color-positive`) for money/savings, amber (`--color-attention`) for priority/warnings - plus
neutral ink/paper for text and backgrounds. The hero and footer use the dark "ink" tone as visual
bookends around light "paper" content sections. Every dollar amount in the app renders in
JetBrains Mono with tabular figures (`.font-amount`), so numbers read consistently everywhere from
the hero's live ledger preview to the dashboard and tables.

## Known limitations / next steps if you keep building

- Not `npm install`-tested in the environment this was built in (no network access there) -
  dependency versions in `package.json` are current as of early 2026; run `npm install` and fix up
  any versions npm flags as deprecated/moved.
- No automated tests (unit/e2e) - would be the natural next addition.
- No password reset flow (not in the original brief).
- The "Explore" feed is intentionally public/cross-user (a content catalog), while "Manage
  Expenses" is private to the logged-in user - see `app/api/explore/route.ts` vs
  `app/api/expenses/route.ts` if you want to change that boundary.
