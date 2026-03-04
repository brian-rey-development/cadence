# PWA & Offline

The delivery mechanism. A productivity app that only works when you're online is a weather app.

---

## What it does today

- Installable to iOS/Android home screen via Web App Manifest
- Service worker via Serwist (turbopack-compatible migration done)
- App shell: stale-while-revalidate strategy
- Data: network-first with cache fallback
- Offline-capable core loop: view today, complete tasks, log habits, write review
- Optimistic updates for offline task completion (sync on reconnect)
- `OfflineBanner` shown in `AppShell` when network unavailable
- `InstallPrompt` component exists in `shared/components/common/`
- Push notification permission flow: `NotificationPermissionPrompt` triggered after first daily close
- Edge function scaffold at `supabase/functions/send-notifications/index.ts` (not deployed)
- `useOffline` hook in `shared/hooks/use-offline.ts`

---

## What's strong

Getting offline right is architecturally hard. Having it working for the core loop at this stage is excellent. The service worker strategy (SWR for shell, network-first for data) is textbook correct for a task management PWA.

The notification permission prompt being triggered after the first daily close is smart placement. It's the highest-intent moment - the user has just completed a full ritual and is most likely to want to be reminded to do it again tomorrow. Conversion rate for permission at that moment should be significantly higher than on first launch.

---

## What's broken or missing

**Push notifications aren't live - the single biggest gap**
The edge function exists but isn't deployed. The daily close reminder at 6pm is the highest-ROI retention mechanism in any productivity app's playbook. Without it, Cadence relies entirely on the user remembering to open the app. Most won't, daily. Apps that don't remind users to come back have dramatically higher churn than apps that do. This is not a nice-to-have.

**Sync conflict handling is undefined**
What happens when a user completes a task offline on their phone, and then someone (or the user on a different device) has changed the task in the meantime? The optimistic update rollback is there for the happy path, but conflict resolution strategy for the edge cases isn't defined. With daily use across devices, edge cases compound into real data loss.

**No install prompt strategy**
The `InstallPrompt` component exists but there's no documented logic for when to show it. Common bad patterns: showing on first visit (too soon, user doesn't understand the value), showing during a task flow (disruptive), never showing (loses conversions). The right moment is after a successful daily close, the same as the notification permission. "You're building a real habit here - install Cadence to your home screen for faster access."

**iOS PWA limitations aren't mitigated**
On iOS, tapping a magic link from email often opens Safari instead of the installed PWA. This breaks the auth flow for installed users. The fix requires `<meta name="apple-mobile-web-app-capable">` and proper deep link handling, plus server-side redirect logic that detects PWA context via query params. Without this, a non-trivial percentage of iOS users will see a broken auth experience on subsequent logins.

**No background sync for failed writes**
If a user logs a habit or completes a task while offline and then closes the app before reconnecting, the optimistic update is lost. Background sync (via Service Worker's `sync` event) would queue the write and replay it on reconnect even if the app is closed. Currently offline writes that don't complete before app close are silently lost.

**Share target not registered**
Android PWAs can register as a share target (files, text, URLs). This would allow "share to Cadence" from any app on Android to trigger task creation from the shared content. This is one of the highest-leverage capture mechanisms available to PWAs and it's not implemented.

---

## Improvement Ideas

### Deploy the push notification edge function (immediate priority)
The scaffold exists. Deploy it. Set up two triggers:

1. **Daily close reminder**: 6pm local time (or user-configured time from settings). "Time to close your day. You've completed X/Y tasks." Deep links to Today view.

2. **Weekly review reminder**: Sunday evening or Monday morning (user choice). "Your week awaits - 3 minutes to set your intentions." Deep links to the weekly review sheet.

Both notifications should be smart enough to skip if: the user already completed the action today, or it's a Saturday/holiday (optional user config). Use the `userSettings` table to store notification preferences.

### Install prompt moment engineering
Show the install banner exactly once, triggered by:
- User has completed their first daily close (they understand the value)
- User has not already installed (check `window.matchMedia('(display-mode: standalone)')`)
- At least 24 hours since first session (not on Day 1)

Message: "You closed your first day. Install Cadence to your home screen for the daily reminder and faster access." CTA: "Add to Home Screen" (triggers the native prompt). Dismiss: "Maybe later" (no re-prompt for 7 days).

### Background sync for offline writes
Register a sync tag in the service worker for task completions and habit logs. If the write fails (user offline), store it in IndexedDB. On reconnect, the service worker fires the `sync` event and replays the queued writes. Cadence already uses optimistic updates - this extends the offline window from "until the app closes" to "until the device reconnects, even days later."

### iOS deep link hardening
1. Add `<link rel="apple-touch-startup-image">` and `apple-mobile-web-app-status-bar-style` meta tags
2. Auth callback URL should detect if the user has Cadence installed as a PWA (via a stored flag in localStorage set on first install) and redirect accordingly
3. Add a post-login landing page that detects "opened in browser vs. installed PWA" and prompts non-installed iOS users to switch

### Share target on Android
Register Cadence as a share target in `manifest.ts`. When a user shares text/URL to Cadence, open the create-task sheet with the shared content pre-filled as the intent. The AI task creation flow handles the rest. Zero additional UI work needed beyond the manifest update.

### Offline indicator intelligence
The current `OfflineBanner` is binary (online/offline). Make it smarter:
- Show which features are unavailable offline (AI flows require connectivity)
- Show a "queued changes" count when there are pending writes
- Show a sync status indicator when reconnecting: "Syncing 3 changes..."

---

## Related features

- [Daily Close](./06-daily-close.md) - primary trigger for notification permission
- [Task Creation](./02-task-creation.md) - share target integration
- [Habits](./05-habits.md) - habit-specific reminder notifications
- [Auth & Onboarding](./09-auth-onboarding.md) - iOS deep link auth issues
