# Zombie Detection

Tasks that keep getting postponed aren't just incomplete - they're signals. Cadence is the only mainstream task manager that treats them this way.

---

## What it does today

- Tasks with `postponeCount >= ZOMBIE_DAYS` (2) get a zombie badge on the card
- During daily close, zombie tasks are surfaced in a dedicated resolution step
- AI (`zombie-check` prompt) rewrites the task title to be specific, concrete, and actionable
- AI receives: original title, area, days since created, active goals
- User can accept the reformulation (updates the task) or dismiss
- After resolution, the `postponeCount` does not reset - current behavior

---

## What's strong

The naming is inspired. "Zombie" is vivid, a little darkly funny, and exactly right - these are tasks that look alive but are functionally undead. The name makes users laugh, which lowers defensiveness when confronting avoidance patterns.

The AI reformulation intervention is correct at the product level. The insight that zombie tasks are almost always caused by poor task framing (too vague, too large, ambiguous verb) is real and well-supported by GTD and productivity research. No mainstream app does this.

---

## What's broken or missing

**Reformulation only, no escalation path**
When a zombie survives multiple reformulations, there are really only three options: break it into smaller tasks (it's actually a project), delegate it (it's not yours to do), or delete it (it was never real). The current system only re-words. After 3 zombie cycles on the same task, the app should surface a harder question: "This has been zombie for 9 days. Break it down, delete it, or mark it as blocked?"

**No zombie prevention upstream**
The system catches zombies after they form, but does nothing to prevent them. When the AI creates a task, it should score specificity and actionability internally. If a title fails the check (too long, no clear verb, vague scope), flag it at creation time: "This task might be too vague - want me to make it more specific?" Catching bad framing at day 0 is 10x better than catching it at day 3.

**Postpone count doesn't reset after successful reformulation**
If a user accepts the AI reformulation, the task's `postponeCount` stays at 2+. If they complete the reformulated task the next day, it still technically "died as a zombie." The count should reset after a successful reformulation to give the task a clean start.

**Zombie patterns aren't analyzed over time**
The weekly review shows a zombie count but it's just a number. After 12 weeks, a user might see that 80% of their identity-area tasks become zombies. That's a crucial signal about their relationship with self-development work - and it never gets surfaced. Pattern recognition over quarters is completely missing.

**Context is lost in the reformulation prompt**
The AI rewrites zombie tasks knowing: original title, area, days-since-created, active goals. It doesn't know: what the user has successfully completed in the same area (signal for what actually works for them), what they wrote in daily reflections around when this task was created, or whether this task has been reformulated before. Richer context produces richer reformulations.

**No "this is a project" exit path**
Sometimes a zombie isn't a badly-framed task - it's a badly-classified project. The AI should be able to say: "This looks like a multi-step project. Want me to break it into 3 specific tasks?" and offer decomposition as an alternative to reformulation.

---

## Improvement Ideas

### Zombie severity tiers
Not all zombies are the same:
- **Fresh zombie** (2-4 days): gentle badge, AI reformulation offered
- **Veteran zombie** (5-9 days): stronger visual treatment, escalation options surfaced
- **Ancient zombie** (10+ days): aggressive intervention - forced decision (break down / delete / delegate), can't be postponed again without resolution

This creates a natural escalation that matches the psychological reality of avoidance.

### Zombie Graveyard insight
A section in the weekly review showing:
- Zombie count by area (last 4 weeks, trended)
- Most common zombie patterns ("tasks starting with 'Research...' become zombies 70% of the time")
- Longest-lived zombie ever (the hall of shame)

Over a quarter, the app can say: "Your identity area generates 3x more zombies than work. Your most common zombie pattern is tasks that start with 'Research...' - these tend to be open-ended. Try breaking research tasks into: 'Find 3 sources on X' instead." This turns a problem indicator into a self-knowledge engine.

### Zombie prevention score at creation
When the create-task AI generates a suggestion, include an internal `specificity_score` (0-1). If below threshold, the warning field gets populated with a gentle nudge: "This task might be hard to start - consider being more specific about the first action." Show the warning passively - don't block creation.

### Multi-reformulation history
Store reformulation history on the task (a JSON array in the DB). If a task has been reformulated twice and is still zombie, the AI has the full history to work with: "I've tried rephrasing this twice. Here's what I suggested before: [history]. Let's try a different approach."

### Delegate option
Add "assign to contact" as a resolution option in the zombie flow. Not a full collaboration feature - just a text field that captures "waiting on: [name]" and marks the task as blocked. This acknowledges that zombie tasks often exist because they depend on someone else.

---

## Related features

- [Task Creation](./02-task-creation.md) - zombie prevention starts at creation
- [Daily Close](./06-daily-close.md) - where zombie resolution happens
- [Weekly Review](./07-weekly-review.md) - where zombie patterns should be analyzed
