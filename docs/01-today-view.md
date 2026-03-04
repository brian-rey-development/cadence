# Today View

The entry point. Where a user spends most of their time in Cadence.

---

## What it does today

- Shows all tasks scheduled for the current date, ordered by creation time
- Swipe-to-archive gesture via Framer Motion (threshold at -80px)
- Zombie badge on tasks postponed 2+ times
- Soft warning banner at 5 tasks, hard cap at 7
- Habit summary bar showing today's completion ratio
- "Close Day" button appears after 6pm OR when all tasks are done
- Button glow color tied to dominant area (work teal, personal amber, identity purple)

---

## What's strong

The constraint is enforced at the UI level, not just the data layer - that's the right call. Most apps let you add 40 tasks and then silently let you fail. Cadence makes the limit visible and even a little playful.

The glowing close-day button keyed to dominant area color is a subtle but excellent design detail. It ties identity to action in a way the user feels without noticing.

---

## What's broken or missing

**No temporal ordering**
Tasks float in arbitrary creation order. A user with a meeting-heavy morning vs. a deep work afternoon has no way to sequence their day. Drag-to-reorder or simple time-of-day grouping (morning / afternoon / evening) would unlock a fundamentally different planning experience.

**Goal context is invisible on the card**
The goal link exists in the DB and the `TaskWithGoal` type carries it, but the card doesn't surface it prominently. A user looking at "Write Q1 report" doesn't see which quarterly goal it serves. The connection between today's work and the north star is hidden unless you navigate away.

**Completion is binary**
A task is pending or complete. Real work is messier: partially done, blocked, waiting on someone else. A "blocked" status that surfaces in the daily close would dramatically improve the quality of AI reflection and reduce zombie formation upstream.

**No momentum indicator**
The app knows the user's last 30 days of completion rate. It never uses that data on the Today view. A subtle streak or rolling 7-day completion rate creates exactly the dopamine loop that drives daily retention.

**Empty state teaches nothing**
A user's first day in Cadence lands on an empty list with no guidance. The product's philosophy - constraint as feature, three areas, quarterly goals, daily ritual - is invisible. This is an onboarding problem that bleeds into the Today view.

---

## Improvement Ideas

### Planning Mode (start-of-day ritual)
A 60-second flow triggered on first open each day. The user sequences their 3 non-negotiables (MITs - Most Important Tasks) and confirms the day's slate. The AI pre-populates suggestions based on:
- Quarterly goals with no recent task activity
- Yesterday's postponed tasks
- Day-of-week patterns from historical data

This turns the Today view from a passive list into a **daily commitment device**.

### Time-of-day grouping
Optional toggle: "Morning / Afternoon / Evening" buckets. User drags tasks between buckets. No hard times - just zones. This is low-implementation-cost and gives planners a structuring tool without adding scheduling complexity.

### Inline goal chip on task card
Below the task title, show a small colored chip with the goal title (truncated to 20 chars). Tapping it opens the goal detail. This closes the loop between today's work and quarterly intent without a full navigation event.

### Completion streak on Today header
"7-day streak" or "83% last 7 days" as a tiny stat in the header. Pulled from existing data. No new DB queries needed. Creates the retention hook that most productivity apps charge subscription fees to keep.

### Blocked status + "Who's it waiting on?"
Add a third task state: blocked. When marked blocked, a simple text field captures the blocker (person name or short phrase). This surfaces in the daily close as a separate section: "What's still stuck?" The AI can then factor blockers into its reflection, rather than treating incomplete as the same as abandoned.

---

## Related features

- [Daily Close](./06-daily-close.md) - triggered from the Close Day button
- [Zombie Detection](./03-zombie-detection.md) - badge shown on task cards
- [Task Creation](./02-task-creation.md) - adds tasks to today
- [Onboarding](./09-auth-onboarding.md) - first-time empty state problem
