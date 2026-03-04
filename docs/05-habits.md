# Habits Module

The behavior layer. Habits are what goals are actually made of.

---

## What it does today

- User creates habits with: name, area, weekly frequency (default 7x/week)
- Daily log/unlog via a checkmark tap (toggle)
- 30-day heatmap visualization (`HABIT_HEATMAP_DAYS = 30`)
- Streak calculation (consecutive days logged)
- Consistency score: completion rate over last 7 days (`HABIT_CONSISTENCY_DAYS = 7`)
- Habit summary bar on Today view showing today's completion ratio
- Archived habits are soft-deleted (timestamp set on `archivedAt`)

---

## What's strong

The heatmap is the right visualization. It gives an immediate felt sense for density and consistency - you can see a month of behavior in a glance. GitHub popularized this pattern for code contributions; it works just as well for personal behavior.

Weekly frequency as the primary contract (rather than daily) is more realistic for most behaviors. A reading habit at 5x/week gives two guilt-free days instead of forcing daily completion. This reduces the binary "I failed today" that kills most habit systems.

---

## What's broken or missing

**No insight into what breaks streaks**
The system knows exactly when habits were missed. It doesn't analyze why or correlate with anything else. If a user consistently misses their workout habit on Mondays it's actionable data. If habit completion drops every week that has >5 zombie tasks, that's a system-level insight about capacity. Currently this data just sits in the DB unused.

**Habits have no "why"**
The only metadata per habit is name, area, and frequency. There's no field for intention - what goal this habit serves, what behavior it's replacing, or why the user cares about building it. Without the "why" anchored, habits break during stressful periods because the motivational infrastructure is missing. The "why" is also essential for the AI to give good habit-related suggestions.

**No habit editing after creation**
If weekly frequency changes (user set 7x/week but 4x is sustainable), there's no UI to update it. Real habit building involves calibration. Starting at 7x/week when 4x is the ceiling leads to failure then abandonment.

**Notification triggering is not wired to habits**
The notification infrastructure exists (push permission flow, edge function scaffold) but there's no habit-specific trigger. A 8pm "you haven't logged your reading habit yet" push is one of the highest-retention mechanisms in consumer habit apps. Headspace, Duolingo, and every successful habit app has this. It doesn't work here yet.

**No minimum habit prompting**
Related to notifications: when a user hasn't logged their habit and it's late in the day, the Today view could show a nudge inline. Not just the summary bar (which is passive) but an active "3 habits still unlogged today" call-to-action that opens the Habits page.

**Habit archiving with no re-activation**
Archived habits disappear. If someone pauses a habit for a 2-week vacation and wants to restart, they have to create it from scratch. Six months of historical data is orphaned. Re-activation should restore the habit with a fresh streak counter but with all historical logs intact.

**No habit templates or suggestions**
New users stare at an empty habits page with no guidance on what habits actually matter. The app has three life areas but no suggested starting habits for each. A curated list of 10-15 research-backed habits per area (with one-line explanations) would dramatically improve activation for the habits module.

---

## Improvement Ideas

### Weekly habit retrospective (in Weekly Review)
For each habit, add a dedicated step in the weekly review:
- Show the past 7 days as a hit/miss row
- Show current streak and 30-day consistency
- For any miss day: a simple text prompt "What got in the way?"
- AI incorporates miss reasons into next week's intentions

Over time you build a personal playbook: "I miss my reading habit when I have evening social events. Try blocking 20 minutes after lunch instead." The product becomes a habit **coach**, not just a tracker.

### Habit-to-goal linkage
See [Goals](./04-goals.md) for the full proposal. Short version: a habit should optionally be associated with a quarterly goal. The goal card then shows: "3 habits supporting this goal, 72% consistency this week." This makes the connection between daily behavior and quarterly outcomes explicit and visible.

### Habit editing
Allow changing: name, area, frequency, and the "why" field. When frequency changes downward, offer: "Want to update your past streak expectation too?" (i.e., should a frequency reduction retroactively improve consistency scores). The answer should be yes - you're calibrating, not cheating.

### Minimum viable habit prompting (inline Today view nudge)
If it's after 7pm and 2+ habits are unlogged, add a gentle inline card to the Today view: "3 habits still unlogged today" with a direct link to the Habits page. This is lower-friction than a push notification and keeps the user in flow.

### Habit templates / starter library
On the empty habits page, offer a "Try one of these" section organized by area:

**Work:** Deep work block (5x/week), No-meeting blocks (3x/week), Weekly planning session (1x/week)
**Personal:** Daily movement (5x/week), Read before bed (4x/week), Meal prep (1x/week)
**Identity:** Journaling (3x/week), Meditation (5x/week), Learning something new (3x/week)

One-tap to add from the template with a pre-filled "why" field the user can edit. This removes the cold-start problem entirely.

### Habit correlation insights
In a "Habit Insights" section (monthly cadence), surface automatically computed patterns:
- "You tend to miss [habit] on [day of week]"
- "Your habit completion rate drops by 40% in weeks where you have >4 zombie tasks - this suggests you may be overloading your plate early in the week"
- "Your [habit] streak correlates with higher mood scores in your daily closes"

These require the longitudinal mood data to be added (see [Daily Close](./06-daily-close.md)), but the habit-side infrastructure is already there.

### Re-activation flow
When re-activating an archived habit:
1. Restore it with all historical logs preserved
2. Reset streak counter to 0 (fresh start feeling)
3. Ask: "What's different this time? Set your frequency and why." (sets intention at re-entry)
4. Show historical best streak as a personal benchmark: "Your best streak was 22 days. Let's beat it."

---

## Related features

- [Today View](./01-today-view.md) - habit summary bar
- [Goals](./04-goals.md) - habit-to-goal linkage
- [Daily Close](./06-daily-close.md) - habit completion is part of day quality
- [Weekly Review](./07-weekly-review.md) - habit consistency in weekly stats
- [PWA & Offline](./08-pwa-offline.md) - push notifications for habit reminders
