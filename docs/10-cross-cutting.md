# Cross-Cutting Opportunities

These aren't features - they're architectural bets that make every other feature better.

---

## 1. Longitudinal AI Intelligence

### The problem
Every AI flow in Cadence operates in isolation. The daily close prompt doesn't know about the weekly review. The zombie reformulation doesn't know the user's historical completion patterns. The create-task flow doesn't know that this user consistently overloads Thursdays. Each interaction starts from zero.

### The data that exists (but isn't used)
After 90 days of using Cadence, a user has generated:
- 90 daily task completion records by area
- 90 habit log records per habit
- 12-13 weekly review reflections (wins, blockers, intentions)
- 90 daily close reflections + AI summaries + mood ratings
- Zombie formation and resolution history
- Goal creation and completion across 1+ quarters

This is a deeply personal longitudinal dataset that no other app has. Currently none of it is synthesized across time.

### The fix: persistent user context object
A `userContext` JSON field on `userSettings` (or a dedicated `user_context` table), updated after each significant AI interaction:

```typescript
type UserContext = {
  moodTrend: 'improving' | 'declining' | 'stable'  // last 7 days
  avgEnergyScore: number                             // last 7 days
  strongestArea: Area                                // highest completion rate
  weakestArea: Area                                  // lowest completion rate
  zombiePattern: string | null                       // e.g. "identity tasks"
  currentStreaks: { tasks: number; habits: number }
  recentWins: string[]                               // last 3 weekly review wins
  lastWeekIntentions: string | null
  activeGoalHealth: Record<string, 'on-track' | 'at-risk' | 'stalled'>
}
```

Injected into every AI prompt as a preamble. The AI on Day 90 knows who the user is and responds accordingly. This is the difference between a tool that uses AI and one that learns from you.

### The Monthly Letter
Once a month, generate a narrative AI summary of the user's data. Not a dashboard - a **letter**. Delivered as a push notification "Your monthly letter from Cadence is ready." Formatted as a narrative, second-person:

> "Over the last 30 days, you completed 87% of your work tasks but only 43% of your identity tasks. Your reading habit has a 22-day streak - your longest ever. Three tasks became zombies and stayed zombie: all three were in your identity area and started with 'Research...' - you may prefer learning by doing rather than reading. Your mood trended from 'okay' to 'good' over the month. Your strongest week was the one where you pre-planned your tasks the night before."

This is the retention hook that keeps users for years. It's impossible to get anywhere else.

---

## 2. The Missing Time Dimension

### The problem
Tasks have a date but no time. Habits have no scheduled time. The daily close has no time metadata. Cadence has zero knowledge of how a user structures their day.

### Why it matters
Without time-of-day data:
- Task scheduling is arbitrary within the day
- No ability to suggest "schedule this for your high-energy morning" vs. "this is a good late afternoon task"
- No correlation between time-of-day and completion rate
- No time-blocking suggestions

### The fix (no calendar integration required)
Add two lightweight concepts:

1. **User day profile** (in settings): "When does your best work happen?" - three options: Morning person (7-11am), Afternoon focused (1-5pm), Evening worker (6-10pm). This is a 1-question onboarding addition.

2. **Task energy tags**: Light touch, optional. When creating a task, the AI can suggest an energy level: `deep-work` (requires focus, schedule in peak hours) / `shallow` (email, admin - schedule in low-energy slots) / `quick` (under 15 min, fill gaps). Not a time field - just a hint for the user and AI.

These two additions unlock scheduling suggestions without requiring a full calendar integration, which is a product scope rabbit hole.

---

## 3. Social Accountability

### The problem
Cadence is hermetically sealed - personal productivity only, no social layer. Every study on behavior change shows social accountability dramatically outperforms solo tracking.

### The minimum viable social feature
**Accountability partner** - one-to-one, opt-in:
- User invites a friend via email
- Partner can see: your daily close completion (yes/no), your current habit streaks, your weekly review completion (yes/no)
- Partner **cannot** see: task titles, reflection content, goal details
- Both users see a shared "streak" counter: "You and [name] have both closed 7 days in a row"

This is not collaboration. It's visibility. The asymmetry of "someone knowing" is enough to meaningfully improve follow-through.

### The virality angle
Two people using Cadence together is stickier than one. The accountability partner feature is also a viral growth mechanism - every activated user invites one other person. Organic growth compounding.

---

## 4. The Week View (currently underbuilt)

### The problem
There's a `/week` route in the navigation but the current implementation is underspecified relative to the Today view. The week view is where planning at a higher resolution happens - seeing all 7 days at once reveals overloading patterns that the Today view can't.

### What it should do
- 7-column calendar grid (Monday-anchored)
- Tasks as chips within each day column
- Color-coded by area
- Drag-to-reschedule between days (reschedule mutation already exists)
- Visual overload warning: days with 7 tasks show a "full" indicator
- Zombie tasks highlighted across the week
- Habit completion shown as a row beneath each day column

The week view should be the planning surface, not just a list view. Seeing "I have 6 tasks on Wednesday and 2 on Friday" is immediately actionable in a way that Today view can't reveal.

---

## 5. The Data Export / Portability Story

### The problem
Users who commit deeply to Cadence generate a rich, personal dataset. They should own it. An app that traps user data erodes trust - especially for productivity users who tend to be privacy-aware and technically sophisticated.

### Minimum viable portability
A "Export my data" option in Settings that generates a JSON or CSV export of:
- All tasks (historical)
- All habit logs
- All daily close reflections and AI summaries
- All weekly review content
- All goals

No exotic format required. A zip file download. This feature costs almost nothing to build (one Drizzle query per table, zip, download) and provides significant trust signal.

### The API story (longer term)
An authenticated personal API key (generated in settings) that exposes read endpoints for the user's data. This enables power users to pipe Cadence data into Obsidian, Notion, their own dashboards, or automation tools. The productivity-tool-power-user market expects this. It's also a retention mechanism: the more integrated Cadence is with a user's workflow, the more costly it is to leave.

---

## 6. The Missing Feedback Loop on AI Quality

### The problem
The AI generates suggestions, reformulations, summaries, and recommendations. There's no mechanism for the user to signal quality. The AI prompt system has no way to improve over time based on user reactions.

### Simple feedback signals to add
- After AI task suggestion: thumbs up / thumbs down (stored, used to refine future prompts)
- After zombie reformulation: "This helped" / "Not quite" (if "Not quite," ask why - one tap option: "Still too vague", "Wrong area", "Doesn't fit my goals")
- After weekly review suggestions: for each suggestion, a checkbox "I did this" at the following week's review

These signals feed into a user-level quality model that adjusts prompt parameters over time. Not fine-tuning - just context. "This user prefers very specific task titles" becomes part of the user context object.

---

## 7. Notifications Architecture (full picture)

Currently: scaffold exists, nothing deployed.

### Notification types to support (prioritized)

| Priority | Type | Trigger | Message |
|---|---|---|---|
| P0 | Daily close reminder | 6pm (user-configurable) | "Time to close your day. X/Y tasks done." |
| P0 | Weekly review prompt | Sunday 7pm (or Monday 7am) | "Your week ended. 3 minutes to set next week's intentions." |
| P1 | Habit reminder | User-configured time per habit | "[Habit name] - still unlogged today." |
| P1 | Zombie alert | Day 3 of no completion | "You have a zombie. [Task title] has been postponed 3 times." |
| P2 | Quarter end reminder | Last week of quarter | "Your quarter ends in 7 days. How are your goals doing?" |
| P2 | Goal at-risk | 10+ days no activity on a goal | "[Goal] hasn't seen any work in 10 days." |
| P3 | Streak milestone | 7/14/30 day streaks | "7-day streak on [habit]. Keep it going." |

Each notification links directly to the relevant action (deep link to Today, habits, or review sheet).

---

*The product has excellent bones. The philosophy is right, the design system is cohesive, and the AI integration is genuinely useful rather than bolted-on. The gap between "interesting prototype" and "app people tell their friends about" is closing the longitudinal loop (the app learns who you are over time) and getting the retention hooks deployed. Both are achievable.*
