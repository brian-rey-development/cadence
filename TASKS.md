# Cadence — Implementation Backlog

## Epic 1: Project Foundation [x]
*The repo exists, runs locally, and connects to Supabase.*

- [x] As a developer, I can clone the repo and run `pnpm dev` to see a working Next.js 16 app with no errors
- [x] As a developer, I have a `.env.example` with all required variables documented so I know what to configure
- [x] As a developer, the folder structure matches the README exactly so any agent or teammate can navigate it without asking questions
- [x] As a developer, Drizzle is connected to Supabase and `pnpm db:push` applies the schema without errors
- [x] As a developer, Tailwind is configured with the Cadence color tokens from `design-system.json` so I never hardcode a color
- [x] As a developer, Fraunces, DM Sans, and DM Mono are loaded via `next/font` and available as Tailwind classes
- [x] As a developer, `pnpm typecheck` and `pnpm lint` pass clean on a fresh clone

---

## Epic 2: Database Schema & RLS [x]
*All tables exist with correct policies so no user can read another user's data.*

- [x] As a developer, all 7 tables from the data model exist in `schema.ts` with correct Drizzle types
- [x] As a developer, every table has an RLS policy that filters by `user_id` so data is isolated at the database level
- [x] As a developer, foreign keys are enforced so orphaned tasks or habit logs cannot exist
- [x] As a developer, Drizzle Studio opens with `pnpm db:studio` and shows all tables with correct columns

---

## Epic 3: Authentication [x]
*The user can log in with a magic link and reach a protected app.*

- [x] As a user, I see a minimal login screen with the Cadence wordmark and an email input when I'm not authenticated
- [x] As a user, I receive a magic link email after submitting my address so I can log in without a password
- [x] As a user, I am redirected to `/today` after clicking the magic link so I land in the right place immediately
- [x] As a user, unauthenticated routes redirect me to `/login` so my data is never exposed
- [x] As a developer, `requireAuth()` in `modules/auth/utils.ts` throws and redirects if there is no session so I never write the same guard twice

---

## Epic 4: App Shell & Navigation []
*The mobile shell feels native before any real content exists.*

- [ ] As a user, I see a bottom navigation bar with Today, Week, Plus, Habits, and Quarter tabs so I can move between sections with one tap
- [ ] As a user, the Plus button in the center of the nav is visually elevated so it always feels like the primary action
- [ ] As a user, the active tab is visually distinct so I always know where I am
- [ ] As a user, the app runs in standalone mode when installed to my home screen so there is no browser chrome
- [ ] As a user, a splash screen with the Cadence wordmark appears on launch so the experience feels native
- [ ] As a developer, the app shell works offline so the navigation never breaks without connectivity

---

## Epic 5: Today View []
*The core daily experience works end to end.*

- [ ] As a user, I see my tasks for today grouped by area (Work, Personal, Identity) so I understand my day at a glance
- [ ] As a user, each task card shows the area color bar on the left so I can distinguish areas without reading the label
- [ ] As a user, I see a counter showing how many tasks I have out of my daily limit (e.g. "4/7") so I always know my capacity
- [ ] As a user, the counter turns amber at 5 tasks and red at 7 so I feel the constraint before I hit it
- [ ] As a user, I can complete a task by tapping the checkbox and see a checkmark animation so the action feels satisfying
- [ ] As a user, I can swipe a task left to archive it so I can remove tasks without opening a menu
- [ ] As a user, completed tasks move to the bottom of their section with a strikethrough so the active list stays clean
- [ ] As a user, tasks that have been pending for 2+ days show a zombie indicator so I can't ignore them
- [ ] As a user, I see a habit summary bar at the bottom of the Today view showing how many habits I've completed today so I don't need to switch tabs to check

---

## Epic 6: Task Creation with AI []
*Adding a task is a natural language interaction, not a form.*

- [ ] As a user, tapping the Plus button opens a bottom sheet with a single text input so I can describe what I need to do in plain language
- [ ] As a user, after I type my intent and submit, the AI returns a structured task with a reformulated title, suggested area, suggested date, and optional goal link so I don't have to fill out fields manually
- [ ] As a user, I can edit any of the AI-suggested fields before confirming so I stay in control
- [ ] As a user, if I try to create a task when I'm at the 7-task limit, the AI warns me and asks which existing task to reschedule or remove so the limit is enforced with context
- [ ] As a user, the sheet closes and the new task appears in the list immediately after confirming so there is no perceived latency

---

## Epic 7: Habits []
*Habits are tracked separately from tasks with streaks and a heatmap.*

- [ ] As a user, I see all my habits on the Habits tab grouped by area so I can review them in one place
- [ ] As a user, each habit card shows the current streak, longest streak, and a 30-day heatmap so I have real evidence of consistency
- [ ] As a user, I can log a habit as complete for today directly from the habit card with a single tap
- [ ] As a user, I can create a new habit by providing a name, area, and weekly frequency so the setup is fast
- [ ] As a user, today's incomplete habits appear at the top of the list so I always see what still needs attention
- [ ] As a user, I see a summary header showing my combined consistency across all habits for the past 7 days so I get a single signal on how I'm doing

---

## Epic 8: Quarter Goals []
*Quarterly goals exist and connect to daily tasks.*

- [ ] As a user, I see the Quarter tab showing up to 3 goals per area for the current quarter so I can review my big picture commitments
- [ ] As a user, each goal card shows a progress ring calculated from linked completed tasks so I can see momentum
- [ ] As a user, I can create a new goal by providing a title, area, and optional description so setup takes under a minute
- [ ] As a user, I can mark a goal as achieved or abandoned before the quarter ends so the list stays honest
- [ ] As a user, when I create a task via the AI flow, the system suggests linking it to a relevant quarter goal so my daily work connects to my bigger intentions
- [ ] As a user, tasks that have no quarter goal link show a subtle note in the AI creation flow so I'm aware but not blocked

---

## Epic 9: Daily Close []
*The day ends with a structured 3-step reflection.*

- [ ] As a user, a "Close Day" button appears after 6pm (or when all tasks are resolved) so I know when it's time to wrap up
- [ ] As a user, the Close Day button has a subtle glow effect in the color of my most productive area so it draws attention without screaming
- [ ] As a user, the daily close flow shows me what I completed in step one so I start with a sense of what happened
- [ ] As a user, step two asks me to decide what to do with each incomplete task: tomorrow, pick a date, or archive so nothing silently carries over
- [ ] As a user, tasks I've postponed before are flagged with a count so the AI can surface that I've moved them multiple times
- [ ] As a user, step three prompts me for one reflection sentence so I capture something from the day without it feeling like homework
- [ ] As a user, the AI generates a 2-sentence summary of my day that is saved so I have a record without writing it myself

---

## Epic 10: Zombie Detection []
*Stale tasks are surfaced and resolved, not silently carried.*

- [ ] As a user, any task pending for 2+ days automatically gets a zombie flag so I can't miss it
- [ ] As a user, zombie tasks surface during the daily close flow with a direct question about whether they're still real
- [ ] As a user, the only options for a zombie task are: do it tomorrow, reformulate it (AI helps rewrite), or archive it — no plain postpone so I'm forced to make a real decision
- [ ] As a user, the AI presents zombie tasks with context about how many days they've been pending so I have the full picture

---

## Epic 11: Weekly Review []
*Sunday (or manual) review connects the week to the quarter.*

- [ ] As a user, I can open a Weekly Review flow from the Week tab so I have a dedicated time to reflect
- [ ] As a user, step one shows me auto-populated stats for the past 7 days including tasks completed by area, habit consistency, and zombie count so I don't have to reconstruct the week from memory
- [ ] As a user, step two asks what moved the needle this week so I articulate wins in my own words
- [ ] As a user, step three asks what I'm avoiding or carrying forward so I surface blockers honestly
- [ ] As a user, step four shows AI-generated focus suggestions for the coming week based on my quarter goals and review answers so I start next week with direction
- [ ] As a user, I can edit or regenerate the AI suggestions before saving so I own the final intentions
- [ ] As a user, the saved weekly intentions appear as a banner at the top of the Week view for the following 7 days so they stay visible

---

## Epic 12: PWA & Offline []
*The app installs cleanly and works without connectivity for core actions.*

- [ ] As a user, I see an "Add to Home Screen" prompt so I can install the app without going to an app store
- [ ] As a user, the installed app opens in standalone mode with the correct splash screen and icon so it feels native
- [ ] As a user, I can view today's tasks, complete them, log habits, and write a daily review while offline so a bad connection never blocks my core workflow
- [ ] As a user, changes I make offline sync automatically when connectivity returns so I never lose data
- [ ] As a user, a subtle offline indicator appears when I'm disconnected so I know why AI features are unavailable

## Epic 13: Notifications [ ]
*One morning anchor, one evening reminder. Nothing else.*

- [ ] As a user, I am asked for notification permission after completing my first daily close so I already understand the value before being asked
- [ ] As a user, I can set an optional morning notification time so it anchors my planning ritual at a consistent hour
- [ ] As a user, the morning notification is silent (no sound, no vibration) and reads "What are your 3 things today?" so it invites intention without creating urgency
- [ ] As a user, tapping the morning notification opens the app directly to Today so there is zero friction between the reminder and the action
- [ ] As a user, I can set an optional evening reminder time that only fires if I haven't closed my day yet so I never get a redundant notification
- [ ] As a user, the evening notification reads "Day not yet closed." — nothing more — so the tone matches the product voice
- [ ] As a user, tapping the evening notification opens the Close Day flow directly so I can act on it in under a minute
- [ ] As a user, I can disable either notification independently from a settings screen so I stay in control without having to revoke system permissions
- [ ] As a user, notifications never show badge counts, never use sound by default, and never fire more than twice a day so the app never feels demanding
- [ ] As a developer, notification permission is requested via the Web Push API after the first daily close event so the ask has context and conversion is higher
- [ ] As a developer, scheduled notifications are managed via a Supabase Edge Function that respects the user's local timezone so reminders fire at the right time regardless of where the user is
- [ ] As a developer, if the user has already closed their day, the evening notification job is cancelled before sending so it is never redundant
