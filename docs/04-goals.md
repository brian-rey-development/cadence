# Goals Module

The north star layer. Goals give the daily task chaos meaning and direction.

---

## What it does today

- User creates quarterly goals per area: max 3 per area, 9 total
- Each goal has: title, description, area, quarter (`YYYY-QN`), status (active/completed/abandoned)
- Tasks link to goals at creation (via `goalId` on the task)
- Goals page shows task completion count per goal
- Active goals are fetched and included in the AI context for task creation and weekly review
- Goal status can be updated (active → completed / abandoned)

---

## What's strong

The quarterly cadence is the right time horizon for ambitious-but-achievable work. Research in goal-setting (Locke & Latham's goal-setting theory) supports 90-day cycles as optimal: long enough for meaningful progress, short enough that course-correction is still possible.

The 3-per-area cap prevents the classic trap of declaring 20 "goals" that are really wishes. Hard limits are underrated UX decisions.

Feeding active goals into the AI context for task creation is smart architecture. It means the AI has the full picture when helping the user plan.

---

## What's broken or missing

**No milestones or key results**
A goal without measurable checkpoints is a wish. "Write a book" is a goal; "Complete chapter 1 outline by March 15" is a milestone. Without milestones, there's no way to track progress within a quarter - only whether the goal was eventually marked complete. The user has no leading indicator - only a lagging one.

**Goal health is invisible**
The system knows: how many tasks linked to this goal were completed this week, how many became zombies, whether the user has done any work toward it in the last 7 days. None of this is surfaced. A goal with zero task completions in 2 weeks should visually communicate distress - a different card treatment, a quiet alert. Currently all goals look identical regardless of whether they're thriving or dying.

**No quarter-close ritual**
When Q1 ends, goals don't get reviewed. There's no prompt to reflect on what was achieved vs. abandoned vs. needs to carry forward. The quarter-boundary moment is the single highest-signal reflection point in the entire system and it's completely unhandled. The data just sits there.

**No goal-to-habit linkage**
Many quarterly goals are achieved through consistent behavior, not individual tasks. "Get fitter" isn't a task, it's a cluster of habits. A goal should optionally link to associated habits, so the user can see: "My identity goal 'Build a fitness foundation' is served by 3 habits, currently at 72% consistency this week." This surfaces the behavior that actually drives goal achievement.

**No carry-forward logic**
When a goal is abandoned or doesn't complete within a quarter, there's no path to carry it into the next quarter with context intact. Users recreate it from scratch, losing the history of what was tried, why it stalled, and what the AI previously suggested. Historical context is permanently discarded.

**Goal view isn't a dashboard, just a list**
The goals page shows a list of goal cards. There's no aggregate view of how the quarter is progressing across all three areas. No progress ring for the quarter, no "you're behind in personal but strong in work" type of summary.

---

## Improvement Ideas

### Key results as first-class concept
Each goal gets 1-3 measurable outcomes (key results). Examples:
- Goal: "Launch my freelance business" -> KR1: "Sign 2 paying clients", KR2: "Ship portfolio site"
- Goal: "Build a fitness foundation" -> KR1: "Run 100km total", KR2: "Gym 3x/week for 8 weeks"

Where KRs are countable, track progress automatically (e.g., completed tasks count toward KR1 if linked). Show a progress ring on the goal card. This single change transforms goals from aspirational labels into a real commitment-tracking system.

### Goal health score
Computed weekly, displayed on the goal card:
- Green: tasks completed this week, on pace for goal
- Yellow: no task activity in 5+ days, review recommended
- Red: no activity in 10+ days, goal is at risk

One-line explanation below the indicator: "No tasks completed toward this goal in 8 days." This is not a failure shaming mechanism - it's a gentle attention prompt.

### Quarter-close ritual
A dedicated AI flow triggered at the end of each quarter (or manually via a CTA on the Goals page). Steps:
1. For each goal: mark as completed, abandoned, or carry forward
2. Free-text reflection: "What went well? What got in the way?"
3. AI generates a quarter retrospective: patterns observed, what to carry into the next quarter, how goal areas shifted
4. For carried-forward goals: the AI notes the history and adjusts suggestions in the new quarter accordingly

This is the equivalent of the daily close but at the 90-day level.

### Habit linkage on goal cards
On the goal card, show a row of linked habits with their current 7-day consistency. Tapping opens the habit. This makes the goal page a true portfolio view: "Here's what I'm working toward, and here's the behavior infrastructure supporting it."

### Goal carry-forward with context preservation
When carrying a goal into the next quarter:
1. Original goal and all task history are archived and linked
2. New goal is created with a `parentGoalId` reference
3. AI is aware of the history: "You carried this goal from Q4 2025. Here's what was completed, what stalled, and what the blockers were. What's different this quarter?"

### Quarter dashboard view
Above the goal list, add a 3-column (work / personal / identity) summary header showing:
- Goals active / completed / abandoned count
- Task completion rate for goal-linked tasks this quarter
- A simple "quarter health" indicator per area

---

## Related features

- [Task Creation](./02-task-creation.md) - goal linking at task creation
- [Weekly Review](./07-weekly-review.md) - goals reviewed weekly
- [Habits](./05-habits.md) - habit-to-goal linkage opportunity
- [Zombie Detection](./03-zombie-detection.md) - zombie patterns by goal area
