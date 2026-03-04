# Task Creation with AI

The moment a user turns an intention into a commitment. The quality of this flow determines whether the system stays clean.

---

## What it does today

- User types natural language intent in a bottom sheet text field
- AI (`create-task` prompt) returns: title, area, date, goalId, optional warning
- User reviews the suggestion in a card and confirms or edits
- Handles daily limit gracefully: auto-schedules to tomorrow with a warning
- Goal linking: AI matches intent to active goals by relevance, never forces a connection

---

## What's strong

The NL-to-structured-task flow is genuinely useful. Most task managers make you fill in fields. Cadence lets you say "I need to prep the deck for Thursday" and handles the classification. The goal-linking logic - linking only when clearly relevant - is the right default.

The daily limit warning surfaced at creation time is a smart constraint enforcement pattern. The alternative (silently adding a 9th task) would erode the system's integrity.

---

## What's broken or missing

**Single task only**
Real work generates multiple tasks at once. "Prepare for the Q2 planning session" is 4-5 tasks. The current flow creates one and stops. Users either enter the same intent multiple times with diminishing returns, or abandon the flow and add tasks manually, bypassing the AI entirely.

**No project decomposition**
For complex intents, the AI should recognize when a task is actually a project and offer to break it down. "Plan the team offsite" should trigger: "This looks like a multi-step project - want me to break it into specific tasks?" This is one of the highest-value AI interactions possible in a task manager and no mainstream app does it well.

**Scheduling has no behavioral awareness**
The AI knows today's task count but not: the complexity distribution of existing tasks, the user's historical completion velocity by day-of-week, or whether tomorrow is a Friday (data shows most people have lower execution willpower late in the week). Scheduling could be dramatically smarter with longitudinal data.

**No quick capture path**
The user has to be inside the app, navigate to Today, and open the create sheet. Most tasks are captured outside the app - while reading email, in a meeting, walking between rooms. The friction of context-switching to Cadence and re-explaining the intent is a silent daily churn driver.

**No recurrence**
"Go to the gym Monday/Wednesday/Friday" creates three separate tasks or gets awkwardly handled as a habit. But gym sessions are really recurring tasks: they need completion tracking tied to a goal, not just a streak counter. The task/habit boundary is blurry and the data model doesn't bridge it.

**Manual task entry bypasses AI**
If the create sheet has any loading friction, users can manually type a task without going through AI suggestion. This means tasks created manually have no area auto-classification, no goal linking, and no quality check. The AI should run on manual titles too, just silently.

---

## Improvement Ideas

### Batch intake
After a task is confirmed, offer: "Add another?" Pre-fill the same area as the last task confirmed. Allow 3-5 tasks to be created in a single session without re-opening the sheet. Useful for the start-of-week planning moment when a user is loading up their week.

### Project decomposition
When AI detects that an intent implies multiple steps (keywords: "plan," "prepare for," "research and," "organize"), return an array of suggested subtasks instead of a single task. User selects which ones to add. Each gets scheduled intelligently across available days.

### Voice capture via PWA shortcut
An iOS Shortcut that captures voice input, sends to the Cadence API (with auth token from a generated API key), creates a task, and returns a confirmation notification. No app-opening required. Capture-to-committed in under 10 seconds. This is the difference between a tool you use when you remember to and one that becomes your capture layer.

### Share Sheet integration
Register Cadence as a Share target on Android PWA. User shares a URL, email excerpt, or text snippet to Cadence. The AI extracts the implied task from the shared content. "Just share the email to Cadence and it'll know what needs to happen."

### Day-of-week pattern-aware scheduling
After 4+ weeks of data: if the user's Monday task completion is consistently 85% but Thursday is 40%, the AI should default complex tasks to early-week and lightweight tasks to Thursday. Surface this as an explanation: "Scheduled for Tuesday - your data shows you complete more tasks earlier in the week."

### Background AI quality check on manual titles
When a user types a task title manually (bypassing AI suggestion flow), run a silent background classification to assign area and try to link a goal. Show the suggestion passively below the confirmed task: "Looks like this belongs under Work - your goal: 'Launch Q2 campaign.' Add?" This keeps the graph clean without forcing users through the full AI flow.

---

## Related features

- [Today View](./01-today-view.md) - where created tasks appear
- [Goals](./04-goals.md) - goal-linking at creation
- [Zombie Detection](./03-zombie-detection.md) - poor task framing at creation causes zombies later
