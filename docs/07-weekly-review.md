# Weekly Review

The zoom-out moment. Where the daily grind becomes a pattern and patterns become decisions.

---

## What it does today

- Multi-step bottom sheet: stats → wins/blockers → AI suggestions → intentions
- Stats: task completion by area, habit consistency %, zombie count
- User writes free-text wins and blockers (open fields)
- AI (`weekly-review` prompt) returns: 2-3 suggestions for next week, a first-person intentions statement
- Intentions are stored on `weeklyReviews.intentions` and shown as a banner in Today/Week views
- Week bounds use Monday-anchored logic (`weekStart()` / `weekEnd()` in `shared/utils/week.ts`)

---

## What's strong

The intentions banner is a behaviorally informed design pattern. It implements "implementation intentions" from Gollwitzer's research: people who write "I will do X" complete their goals at significantly higher rates than those who just set goals. Cadence is leveraging behavioral science without advertising it.

The 4-step flow (stats → reflect → AI → commit) mirrors the structure of a real planning session. Stats first so the user is grounded in what actually happened, not what they remember. Reflection before AI so the AI responds to the user's context, not generic patterns.

---

## What's broken or missing

**Stats are flat, not trended**
Showing 68% task completion this week is less useful than showing it was 82% last week and 91% the week before. Trend direction matters more than absolute value. A declining trend should trigger a different AI response than a stable or improving one. The system has all the data for this - it's a display problem.

**No week-over-week comparison**
The user has no way to see if they're improving over time. Each weekly review is disconnected from all prior reviews. Week 12 of using Cadence has no knowledge of Weeks 1-11. This creates a fundamental problem: the product never rewards growth or signals stagnation.

**AI suggestions aren't tracked for follow-through**
The AI makes 3 suggestions. Next week's review never asks "how did those suggestions go?" The loop is never closed, which makes the suggestions feel advisory rather than commitments. At minimum, next week's prompt should include last week's suggestions so the AI can acknowledge what worked.

**Wins and blockers have no structure**
Some users won't fill them in at all. Free text is maximally flexible but minimally generative for users who need a prompt. Two structured questions would work better for most people: "Name 1 task you're most proud of completing" and "Name 1 thing that consistently got in your way this week." Short, specific, answerable. Still free text, but with a tighter container.

**No explicit goal check-in**
The weekly review shows task stats but doesn't ask: "Are your quarterly goals on track?" It's the most natural moment to surface goal health and it's absent. At the weekly level you can still course-correct. By the end of the quarter, it's too late.

**Intentions are text, not commitments**
The intentions statement is stored and shown as a banner, which is good. But it's passive. There's no mechanism to derive concrete tasks from the intentions, or to connect last week's intentions to this week's completions. The loop between intention and action is informational, not structural.

---

## Improvement Ideas

### Week Score - a single composite number
Computed from:
- Task completion rate (40% weight)
- Habit consistency (30% weight)
- Zombie formation rate (20% weight) - lower is better
- Mood trend (10% weight) - requires daily close energy data

Show the score (0-100) with a trend arrow vs. last week. Show an 8-week sparkline. The AI response adapts based on the score: strong week gets affirmation + higher challenge, weak week gets pattern analysis + recovery focus, 3 consecutive weak weeks triggers: "I've noticed three rough weeks. Want to talk through what's getting in the way?"

This creates a single leading indicator the user can optimize.

### Trend view on stats step
Instead of showing only this week's numbers, show a 4-week mini trend for each stat:
- Task completion: 91% → 82% → 68% → this week (with direction arrow)
- Habit consistency: 85% → 80% → 72% → this week
- Zombie count: 1 → 2 → 3 → this week

Direction and velocity matter more than any single week's numbers.

### AI suggestion follow-up
At the start of the stats step, show last week's AI suggestions (stored on `weeklyReviews.aiSuggestions`). A simple "Did this happen?" yes/no for each. The AI weekly-review prompt receives this follow-up data and factors it in: "You said you'd time-block mornings this week - it looks like you completed 4/5 morning tasks, so it's working. Let's build on that."

### Goal check-in step
Between the wins/blockers step and AI suggestions, add a goal health step:
- Show all active goals with their health indicator (see [Goals doc](./04-goals.md))
- For any goal with no task activity in 7+ days: "This goal hasn't seen any work this week. Is it still relevant?" (keep / pause / abandon)
- Goal decisions feed into the AI suggestion prompt context

### Intentions → task seeding
After the intentions statement is generated and accepted, offer: "Want me to create a few tasks that support your intentions for next week?" The AI takes the intentions text and generates 2-3 specific task suggestions pre-assigned to next week's dates. User selects which ones to add.

This bridges the gap between aspiration (intentions) and execution (scheduled tasks).

### Monthly letter insight
Once a month, instead of the regular weekly review, trigger an expanded "Monthly Letter" AI generation (see [Cross-Cutting](./10-cross-cutting.md)). A narrative summary of the month's patterns, told in second person like a letter from the system to the user. Deeply personal, impossible to get anywhere else.

---

## Related features

- [Goals](./04-goals.md) - goal health should be reviewed weekly
- [Daily Close](./06-daily-close.md) - mood + energy data feeds into weekly stats
- [Habits](./05-habits.md) - consistency rates in weekly stats
- [Zombie Detection](./03-zombie-detection.md) - zombie count and patterns in weekly review
