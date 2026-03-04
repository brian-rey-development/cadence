# Daily Close

The most emotionally resonant feature in Cadence. The ritual that makes the system feel alive.

---

## What it does today

- Multi-step bottom sheet with a step indicator
- Step 1: Incomplete tasks - user postpones or archives each one
- Step 2: Zombie resolution - AI reformulations offered for zombie tasks
- Step 3: Reflection - free-text input, user writes their day's narrative
- Step 4: AI summary - 2 sentences, mood classification (great/good/okay/tough)
- Mood and summary stored in `dailyReviews` table
- Close Day button glows with the dominant area color (work/personal/identity)
- Button appears after 6pm OR when all tasks are done (`CLOSE_DAY_AFTER_HOUR = 18`)

---

## What's strong

The ritual design is excellent. The glow tied to dominant area, the multi-step bottom sheet, the AI summary - this is the most emotionally resonant feature in the product. It's what makes Cadence feel like a system, not just a list.

The gating logic (6pm or all done) is behaviorally smart. It signals that the day isn't "closeable" until it's genuinely over - the app has a point of view about what constitutes a complete day.

The AI mood classification (great/good/okay/tough) is the right vocabulary. Simple enough that users can intuit the mapping instantly, specific enough to be meaningful in aggregate.

---

## What's broken or missing

**Mood data is captured, never shown back**
The mood is stored in the DB and never surfaced to the user again. After 30 closes, there should be a visible mood trend. After 90 days, the user has a full quarter's emotional map. Seeing "you've had 8 'tough' days in the last 30" is a signal worth surfacing. Right now the data is collected and buried.

**No energy or focus rating**
Mood captures emotional state but not physical/cognitive capacity. These are different. A day can be emotionally great (you were in flow) but cognitively exhausted. A day can be tough emotionally but high-energy (you pushed through). Adding a 1-5 energy rating at the close step takes 2 seconds and unlocks correlation analysis with habit completion, task throughput, and zombie formation. This is the data that makes the AI measurably smarter over time.

**Tomorrow isn't pre-seeded from today's close**
When the user closes their day, they often know tomorrow's priorities - it comes up naturally during reflection. There should be a final step: "What are your 3 non-negotiables for tomorrow?" These get pre-populated into the next day's Today view as "pre-planned" tasks in a distinct visual state. This closes the open-to-close-to-open loop, which is the daily retention mechanism.

**AI summary has no longitudinal awareness**
Each day's summary is generated in isolation. The AI doesn't know this was the user's 5th consecutive "tough" day, or that they completed their first task linked to a goal they've been avoiding for 3 weeks. A shared user context (a persistent JSON object updated after each close and injected into subsequent AI calls) would make the summary meaningfully more personal and insightful over time.

**Reflection quality varies wildly**
Some users write paragraphs; others write "ok." Both get the same AI summary quality. Placeholder text as a prompt scaffold - "What went well today? What got in the way? What would you do differently?" - would improve reflection depth for the terse writers without restricting the verbose ones. Optional scaffolding is better than none.

**No way to review past closes**
There's no view of past daily closes. If a user wants to look back at what they wrote last Tuesday, there's no path. A simple calendar view of past close summaries (with mood indicators) would make the closes feel permanent and worth writing, not ephemeral.

---

## Improvement Ideas

### Mood + energy sparkline on Today view header
A 14-day mini sparkline showing mood (color) and energy (height). Built from the existing `dailyReviews` data plus the new energy field. Tapping it opens a detail view with the full history.

No new AI calls needed. This is a pure data visualization feature that makes users feel the product is learning about them.

### Energy rating at close
Add a single 1-5 tap-rating for energy level after the reflection step. Represented as 5 icons (battery levels or sun intensity). Stored on `dailyReviews`. Used in:
- The mood sparkline (two dimensions: mood and energy)
- AI weekly review prompt (includes avg energy for the week)
- Habit correlation analysis (low energy weeks → lower habit completion)

### Tomorrow pre-seeding step
Final step in the daily close flow: "What are your 3 priorities for tomorrow?" Pre-populated with:
1. Any tasks explicitly marked for tomorrow during today's close
2. AI suggestion based on quarterly goals with no recent activity
3. User's historical "what do I tend to schedule for this day of week"

User confirms or edits. Tasks are created in the DB for tomorrow with a "pre-planned" flag. On tomorrow's Today view, pre-planned tasks appear at the top in a distinct visual state.

### Longitudinal AI context
Store a `userContext` JSON object (updated after each close) that summarizes:
- Mood trend (last 7 days)
- Current streaks (tasks, habits)
- Any notable events ("first time completing all tasks 3 days in a row")
- Recent zombie patterns
- Active goal progress summary

Inject this into every AI prompt as a preamble. The AI response on Day 90 is meaningfully richer than Day 1 because it knows who the user is.

### Past closes timeline
A simple reverse-chronological list of past daily closes, accessible from the profile or review section. Each entry shows: date, mood indicator (colored dot), AI summary (2 sentences), and completion count. Tapping expands to show the full reflection text and task list. This gives the closes permanence and makes writing them feel worthwhile.

### Reflection prompt scaffolding
When the reflection text field is empty, show placeholder text:
> "What went well today? What got in the way? Anything to carry into tomorrow?"

The AI already generates a warm 2-sentence summary from even sparse input. Placeholder prompts would improve the average input quality without adding friction.

---

## Related features

- [Today View](./01-today-view.md) - where the Close Day button lives
- [Zombie Detection](./03-zombie-detection.md) - zombie resolution is a step in the daily close
- [Weekly Review](./07-weekly-review.md) - daily moods aggregate into weekly stats
- [PWA & Offline](./08-pwa-offline.md) - daily close reminder notification
