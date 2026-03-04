# Authentication & Onboarding

The first impression. Most productivity apps lose users before they ever experience value.

---

## What it does today

- Magic link authentication via Supabase Auth (no passwords)
- Login page at `(auth)/login/` with `LoginForm` component
- Route protection via `src/proxy.ts` (Next.js 16 middleware equivalent)
- `requireAuth()` utility in `modules/auth/utils.ts` for server-side auth checks
- Auth redirects unauthenticated users to `/login`
- After auth, user lands directly on Today view
- User settings seeded on first access via `upsert-user-settings`

---

## What's strong

Magic link is the right auth choice for a mobile-first productivity PWA. No password means no "forgot password" support burden, no credential stuffing risk, and no friction for the target user (who likely uses this on a phone where typing passwords is painful).

The `requireAuth()` pattern is clean - server-side auth checks in one place, not scattered across routes.

---

## What's broken or missing

**No onboarding flow**
A new user who installs Cadence and logs in lands on an empty Today view. No tasks, no habits, no goals. No guidance. The product's philosophy - constraint as feature, three life areas, quarterly goals, the daily close ritual - is completely invisible. Users who don't immediately intuit the model will churn before they ever experience the value loop.

This is the #1 activation problem. Every other feature is irrelevant if users don't survive the first 5 minutes.

**Goal-setting isn't the first thing a new user does**
The most important thing a new user should do is set quarterly goals first. Every subsequent feature in Cadence gets dramatically better once goals exist: task creation AI has context to link to, weekly review has goals to evaluate, zombie detection has a north star to orient reformulations toward. Nothing pushes the user toward goals first - or at all, on first login.

**Magic link has friction on iOS**
Tapping a magic link from a mail client on iOS (Mail.app, Gmail, etc.) opens Safari, not the installed PWA. From Safari, the redirect back to the app URL often opens another Safari tab, not the PWA. For an installed PWA user, this breaks the expected native-app experience.

This is a known iOS limitation with PWA deep links. It's solvable with careful redirect handling and a "you seem to be in a browser - open in Cadence?" detection page, but it requires intentional work.

**No return user experience**
Magic link means every new device/browser requires a new link. A user who clears their browser storage or gets a new phone has to re-authenticate and then... lands on an empty Today view again. Their data is in Supabase but the experience feels like starting over. Post-auth should feel like returning home, not starting fresh.

**No value demonstration before login**
The login page is just a login form. There's no product showcase, no "here's what Cadence does" explanation, no social proof or screenshots. A user who discovers Cadence via a link has nothing to evaluate before committing an email address. For consumer apps this is a silent conversion killer.

---

## Improvement Ideas

### 5-step onboarding flow (priority)
Triggered on first login (detected by checking if the user has any goals in the DB). A full-screen modal flow, not a bottom sheet - this is a commitment moment.

**Step 1: The philosophy** (60 seconds to read)
"Cadence is built around one idea: fewer things, done better. You get 7 tasks a day. Three areas of life. And a daily close ritual. That's the whole system."
One illustration. One continue button.

**Step 2: Define your areas**
Work, Personal, Identity are preset labels. Let the user rename them to make them personal: "Work" → "Freelance", "Identity" → "Health & Growth". These are just display labels - the area enum stays fixed in the DB. This tiny personalization dramatically increases attachment to the system.

**Step 3: Set your first goals (one per area)**
Three cards, one per area, each with a text field: "What do you want to achieve this quarter in [area]?" Pre-populated with area-specific examples (contextual, not generic). Creating goals here is mandatory for the first area; the other two are optional but prompted. Cannot skip all three.

**Step 4: Create your first habits**
Show 3 habit suggestions per area (from the curated library - see [Habits doc](./05-habits.md)). Tap to add. Or add a custom one. Minimum 1 required to proceed. This seeds the habit module immediately.

**Step 5: Create your first task**
A simplified task creation flow (no AI on first task - keep it simple). Pre-filled area from the goal they just created. After confirming: "Your day is ready. Here's how to close it when you're done." Brief walkthrough of the Close Day button.

By end of onboarding: user has 1-3 goals, 1-3 habits, 1 task. They've experienced the mental model. The product now has context to give them good AI suggestions.

### Interactive product preview on login page
Before login, show an interactive preview:
- Animated demo of the Today view (fake data, auto-playing)
- 3 one-liners: "7 tasks max. No more endless lists." / "AI that reformulates your stuck tasks." / "A daily close to end the work day with intention."
- "Start with your email" below the preview

This converts curious visitors before they've committed anything.

### iOS PWA deep link handling
1. Set `Referrer-Policy` headers and check `document.referrer` post-auth-redirect to detect Safari vs. PWA context
2. On auth callback landing, if `display-mode` is `browser` and iOS detected, show a one-time banner: "Tap the share button and 'Add to Home Screen' to open Cadence as an app"
3. Add a `?pwa=1` query param to the magic link URL and detect it on the auth callback to bypass the redirect to browser

### Post-auth homecoming for returning users
When a returning user logs in on a new device/browser, the Today view should reflect continuity:
- Show today's tasks normally (pulled from DB)
- If no closes in the last 3 days: "Welcome back. You haven't closed your day in 3 days - want to catch up?" with a link to the last open day
- The app should feel like returning to something in progress, not starting fresh

### Empty state education (Today view)
When a user has no tasks (before onboarding or after onboarding if they haven't added any), show an empty state that teaches the model:
- Illustration (minimal, on-brand)
- "Your day is empty. Add up to 7 tasks - the limit is the feature."
- CTA: "Add your first task" (opens create sheet)

Not a generic "Nothing here yet" empty state - one that explains the philosophy in the moment.

---

## Related features

- [Today View](./01-today-view.md) - empty state problem
- [Goals](./04-goals.md) - goal-setting as first onboarding step
- [Habits](./05-habits.md) - habit templates for onboarding
- [PWA & Offline](./08-pwa-offline.md) - iOS auth deep link issues
