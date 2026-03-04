# Flowday

A personal productivity system built as a mobile-first PWA. Constraint as a feature: 5-7 tasks per day, three areas of life, AI-assisted daily planning, and a habit tracker with real metrics.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (Postgres + Auth + Realtime) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS + shadcn/ui |
| Data fetching | TanStack Query v5 |
| Animations | Framer Motion |
| AI | Anthropic Claude API (Sonnet) |
| PWA | Serwist (next-pwa successor) |
| Deploy | Vercel |

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase account
- Anthropic API key

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/youruser/flowday.git
cd flowday

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your keys (see Environment Variables section)

# 4. Push the database schema
pnpm db:push

# 5. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database

Drizzle ORM with Supabase Postgres. All tables have RLS policies — users can only read and write their own rows.

```bash
# Generate a migration from schema changes
pnpm db:generate

# Push schema directly to the database (dev only)
pnpm db:push

# Run pending migrations (production)
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

Schema lives in `src/db/schema.ts`. All types are inferred from the schema — never defined manually.

---

## Project Structure

```
src/
├── app/                          # Next.js App Router (routing and layouts only)
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (app)/                    # Protected group, requires session
│   │   ├── layout.tsx            # App shell with bottom nav
│   │   ├── today/page.tsx
│   │   ├── week/page.tsx
│   │   ├── quarter/page.tsx
│   │   ├── habits/page.tsx
│   │   └── review/page.tsx
│   ├── api/
│   │   └── ai/
│   │       ├── create-task/route.ts
│   │       ├── daily-close/route.ts
│   │       ├── zombie-check/route.ts
│   │       └── weekly-review/route.ts
│   ├── manifest.ts               # PWA manifest
│   ├── globals.css
│   └── layout.tsx
│
├── modules/                      # Feature modules (domain-driven)
│   ├── tasks/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── queries/
│   │   ├── mutations/
│   │   ├── utils/
│   │   └── types.ts
│   ├── habits/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── queries/
│   │   ├── mutations/
│   │   ├── utils/
│   │   └── types.ts
│   ├── goals/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── queries/
│   │   ├── mutations/
│   │   ├── utils/
│   │   └── types.ts
│   ├── reviews/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── queries/
│   │   ├── mutations/
│   │   └── types.ts
│   ├── ai/
│   │   ├── client.ts
│   │   ├── prompts/
│   │   └── types.ts
│   └── auth/
│       ├── components/
│       ├── mutations/
│       └── utils.ts
│
├── shared/                       # Truly shared across 2+ modules
│   ├── components/
│   │   ├── ui/                   # shadcn primitives
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   └── bottom-nav.tsx
│   │   └── common/
│   │       ├── area-badge.tsx
│   │       ├── empty-state.tsx
│   │       ├── loading-spinner.tsx
│   │       └── error-boundary.tsx
│   ├── hooks/
│   │   ├── use-offline.ts
│   │   └── use-media-query.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   ├── string.ts
│   │   ├── array.ts
│   │   └── number.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # createBrowserClient()
│   │   │   └── server.ts         # createServerClient()
│   │   └── query-client.ts
│   └── config/
│       ├── areas.ts              # Area definitions, colors, labels
│       └── constants.ts          # DAILY_TASK_LIMIT, ZOMBIE_DAYS, etc.
│
└── db/
    ├── index.ts                  # Drizzle instance
    ├── schema.ts                 # Full schema in one file
    └── migrations/               # Generated by drizzle-kit
```

---

## Module Anatomy

Every feature module follows the same internal structure. Nothing leaks out, nothing leaks in.

```
modules/tasks/
├── components/          # React components scoped to this domain
│   ├── task-card.tsx
│   ├── task-list.tsx
│   ├── add-task-sheet.tsx
│   ├── daily-limit-banner.tsx
│   └── zombie-badge.tsx
├── hooks/               # TanStack Query hooks
│   ├── use-tasks-for-day.ts
│   ├── use-complete-task.ts
│   ├── use-create-task.ts
│   └── use-daily-limit.ts
├── queries/             # Read-only Drizzle queries (used in Server Components + hooks)
│   ├── get-tasks-for-day.ts
│   ├── get-tasks-for-week.ts
│   ├── get-zombies.ts
│   └── get-tasks-by-goal.ts
├── mutations/           # Server Actions that write to the database
│   ├── create-task.ts
│   ├── complete-task.ts
│   ├── archive-task.ts
│   ├── reschedule-task.ts
│   └── update-task.ts
├── utils/               # Pure functions, no DB or React dependencies
│   ├── zombie.ts        # isZombie(), getZombieAge()
│   └── limit.ts         # isDailyLimitReached(), getRemainingSlots()
└── types.ts             # Types inferred from schema + DTOs
```

---

## Dependency Rules

```
app/pages       →  modules/* + shared/*
modules/*       →  db/* + shared/*
shared/*        →  (nothing internal)
db/*            →  (nothing internal, only drizzle)
```

Modules do not import from other modules. If two modules need to share data, the meeting point is a joined query in one of them or a shared type in `shared/`. The dependency arrow always points inward, never sideways.

---

## Naming Conventions

```
Files           kebab-case always         task-card.tsx, get-tasks-for-day.ts
Components      PascalCase                export function TaskCard() {}
Server Actions  camelCase verbs           createTask, completeTask, archiveTask
Queries         get* prefix               getTasksForDay, getZombies
Types           PascalCase, no prefix     Task, NewTask, TaskWithGoal
```

Types are always derived from Drizzle's inference, never written by hand:

```typescript
type Task        = typeof tasks.$inferSelect
type NewTask     = typeof tasks.$inferInsert
type TaskWithGoal = Task & { goal: Goal | null }
```

---

## PWA

The app installs to the home screen via Web App Manifest. Once installed it runs in standalone mode with no browser chrome.

Offline support covers: viewing today's tasks, completing tasks (optimistic update, syncs on reconnect), logging habits, and writing a daily review. AI features require connectivity.

Service worker strategy:
- App shell: stale-while-revalidate
- Data: network-first with fallback to cache

Icons required in `public/icons/`: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`.

---

## AI Flows

All AI routes live under `app/api/ai/`. They call the Anthropic SDK via the client configured in `modules/ai/client.ts`. Prompts are versioned files in `modules/ai/prompts/` and export a typed `buildPrompt()` function alongside the expected response shape.

```typescript
// modules/ai/prompts/create-task.ts
export function buildPrompt(input: CreateTaskInput): string { ... }
export type CreateTaskResponse = { title: string; area: Area; date: string; goalId?: string }
```

The API route handles parsing, error handling, and returning a typed response. The client never calls Claude directly.

---

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm db:generate  # Generate Drizzle migration
pnpm db:push      # Push schema to DB (dev)
pnpm db:migrate   # Run migrations (prod)
pnpm db:studio    # Drizzle Studio GUI
```

---

## Auth

Magic link via Supabase Auth. No passwords. The `(app)` route group is protected by a middleware check in `src/middleware.ts` that redirects unauthenticated users to `/login`.

Session is read server-side via `createServerClient()` from `shared/lib/supabase/server.ts` and client-side via `createBrowserClient()` from `shared/lib/supabase/client.ts`.

---

## Key Constants

Defined in `shared/config/constants.ts` and imported wherever needed. Never hardcoded inline.

```typescript
export const DAILY_TASK_LIMIT = 7
export const DAILY_TASK_SOFT_WARNING = 5
export const ZOMBIE_DAYS = 2
export const MAX_GOALS_PER_AREA = 3
export const AREAS = ['work', 'personal', 'identity'] as const
```
