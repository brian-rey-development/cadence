# Cadence — Claude Instructions

See full architecture: [README.md](./README.md)
See design tokens: [design-system.json](./design-system.json)

## Stack
Next.js 16, Supabase, Drizzle ORM, TanStack Query v5, Tailwind CSS, shadcn/ui, Framer Motion, Anthropic SDK, Serwist (PWA). TypeScript strict mode everywhere.

## Non-negotiables

- No file exceeds 150 lines. Split before it gets there.
- No logic in pages. Pages compose components, nothing else.
- No types written by hand if Drizzle can infer them.
- Never add migrations directly. Use drizzle and generate them with pnpm db:generate.
- No hardcoded values. Colors, limits, and constants live in `design-system.json` and `shared/config/constants.ts`.
- No `any`. No `// @ts-ignore`. Fix the type.
- No inline styles. Tailwind classes only, using the design system tokens.
- Focus on performance, clean code and never add unnecesary comments.

## File size rules

| File type | Max lines |
|---|---|
| Page (don't use client) | 40 |
| Component | 150 |
| Hook | 120 |
| Query / Mutation | 40 |
| Utility function | 50 |
| Schema | unlimited (single file) |

When a file approaches its limit, split by responsibility before continuing.

## Module structure

Every feature lives in `src/modules/{name}/` with this exact shape:
```
components/   React components scoped to this domain
hooks/        TanStack Query hooks
queries/      Read-only Drizzle queries, one per file
mutations/    Server Actions, one per file
utils/        Pure functions, no DB or React, one concern per file
types.ts      Types inferred from schema + DTOs
```

`src/shared/` for anything used by 2+ modules. Never cross-import between modules — if two modules share data, the meeting point is a joined query.

## Naming
```
Files           kebab-case              task-card.tsx
Components      PascalCase              TaskCard
Server Actions  camelCase verbs         completeTask
Queries         get* prefix             getTasksForDay
Types           PascalCase, no prefix   Task, NewTask, TaskWithGoal
```

## Types

Always infer from Drizzle. Never duplicate.
```typescript
type Task         = typeof tasks.$inferSelect
type NewTask      = typeof tasks.$inferInsert
type TaskWithGoal = Task & { goal: Goal | null }
```

## Data fetching

- Server Components call queries directly (no hooks, no useEffect)
- Client Components use TanStack Query hooks from `modules/{name}/hooks/`
- Mutations are Server Actions in `modules/{name}/mutations/`, imported directly into hooks
- Optimistic updates on all mutations that touch the Today view

## Design system usage

Read `design-system.json` before writing any UI. Key rules:

- Font families: `font-['Fraunces']` for headings, `font-['DM_Sans']` for body, `font-['DM_Mono']` for counters and metrics
- Icon stroke-width is always 1.5, never the Lucide default of 2
- Area colors (work → `#4AADA8`, personal → `#C17D4E`, identity → `#7B6FA0`) are never hardcoded inline — import from `shared/config/areas.ts`
- Dark mode is default. Light mode has its own token set, not an inversion
- Elevation in dark mode = background color shift, never box-shadow
- Single easing for all animations: `cubic-bezier(0.25, 0, 0, 1)`
- No bounces, no springs, no confetti

## Component rules
```typescript
// Always: explicit prop types, no FC<>, default export
type TaskCardProps = {
  task: TaskWithGoal
  onComplete: (id: string) => void
}

export default function TaskCard({ task, onComplete }: TaskCardProps) {}
```

- Touch targets minimum 44px
- Swipe gestures via Framer Motion `drag="x"` with `dragConstraints`
- All modals and detail views are bottom sheets, never full-screen pushes
- Loading states use skeleton components, never spinners on primary content

## AI routes

All AI logic lives in `src/app/api/ai/{flow}/route.ts` and calls the Anthropic client from `modules/ai/client.ts`. Prompts are versioned functions in `modules/ai/prompts/{flow}.ts` that export `buildPrompt(input)` and the expected response type. Routes never build prompts inline.

## Database

One `schema.ts` file. All tables have `userId` with RLS. Never query without a `where userId = ...` clause. Prefer `db.query.*` relational API over raw joins.

## PWA

Offline-capable actions: view today, complete tasks, log habits, write review. AI features require connectivity. Show `use-offline.ts` indicator, never block the user.

## Commit style
```
feat(tasks): add zombie detection to daily close
fix(habits): correct streak calculation on week boundary
refactor(goals): split progress utils into separate file
```

Scope is always the module name.
