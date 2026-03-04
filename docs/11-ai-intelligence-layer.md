# AI Intelligence Layer

Cadence has two distinct AI systems. The first is the **user-facing AI** — interactive flows where the user triggers an LLM call and sees the result immediately (task creation, zombie check, daily close, weekly review, goal refinement). The second is the **AI Engine** — a background intelligence layer that runs on a cron schedule and enriches the app with scored, contextualized data that improves UI without requiring user action.

This document covers both systems, their architecture, the specific signals they compute, and how they connect to the UI.

---

## User-Facing AI Flows

These are synchronous, request/response interactions. Each flow has one route file and one prompt file.

### 1. Task Creation

**Route**: `POST /api/ai/create-task`
**Prompt**: `src/modules/ai/prompts/create-task.ts`

When a user types a task intent in natural language, the AI interprets it in the context of their active goals and daily task limit, returning a structured task suggestion.

**Input**:
```typescript
{
  intent: string          // raw user text
  existingTaskCount: number
  goals: { id, title, area }[]
  date: string            // ISO date string
}
```

**Output**:
```typescript
{
  title: string           // clean, action-oriented task title
  area: "work" | "personal" | "identity"
  date: string            // proposed date (today or tomorrow)
  goalId?: string         // auto-linked goal ID if confident
  warning?: string        // shown if daily limit would be exceeded
}
```

**Design decisions**:
- The prompt never invents a goal link unless the intent is clearly related. A vague match gets no `goalId` rather than a wrong one.
- If `existingTaskCount >= DAILY_TASK_LIMIT`, the AI proposes tomorrow's date and includes a `warning` string so the UI can display it to the user without blocking them.
- The title rewrite normalizes passive/vague language into imperative, specific form ("buy groceries" → "Buy groceries for the week").

---

### 2. Zombie Detection & Recovery

**Route**: `POST /api/ai/zombie-check`
**Prompt**: `src/modules/ai/prompts/zombie-check.ts`

A zombie task is one that has been postponed two or more times. It indicates the original framing was probably wrong — too vague, too large, or unclear on the next physical action. The AI reformulates it into something specific enough to actually do.

**Input**:
```typescript
{
  originalTitle: string
  area: string
  daysSinceCreated: number
  goals: { id, title }[]
}
```

**Output**:
```typescript
{
  suggestedTitle: string  // reformulated, specific title
  reasoning: string       // one sentence explaining the change
}
```

**Design decisions**:
- The reformulation is atomic — it changes the title only, not the goal link, area, or date. That keeps the ownership model simple.
- The `reasoning` field feeds the zombie card UI directly, giving the user context for why the suggestion differs from the original.
- The user can accept the suggestion (updates title) or dismiss it (marks it as reviewed without change).

---

### 3. Daily Close Reflection

**Route**: `POST /api/ai/daily-close`
**Prompt**: `src/modules/ai/prompts/daily-close.ts`

At the end of the day, the user writes a short free-text reflection. The AI synthesizes it with their completed task list into a compressed summary and assigns a mood.

**Input**:
```typescript
{
  completedTitles: string[]
  reflection: string
  date: string
}
```

**Output**:
```typescript
{
  summary: string         // 2 sentences max
  mood: "great" | "good" | "okay" | "tough"
}
```

**Design decisions**:
- The summary is short by design — it gets stored in `daily_reviews` and used as context for the weekly review and AI Engine's user snapshot. Longer = noisier signal.
- Mood is a 4-level enum rather than numeric to make it human-interpretable in the weekly review aggregations.
- The AI is instructed to be generous with `great` and `good` — the feature should reinforce momentum, not produce anxiety.

---

### 4. Weekly Review

**Route**: `POST /api/ai/weekly-review`
**Prompt**: `src/modules/ai/prompts/weekly-review.ts`

Takes the user's self-reported wins and blockers plus computed stats from the week and returns concrete suggestions for the coming week.

**Input**:
```typescript
{
  wins: string
  blockers: string
  goals: { id, title, area }[]
  stats: {
    completionRateByArea: Record<string, number>   // 0.0-1.0
    habitConsistency: number                        // 0.0-1.0
    zombieCount: number
    totalCompleted: number
  }
}
```

**Output**:
```typescript
{
  suggestions: string[]   // 2-4 concrete action items
  intentions: string      // one paragraph, first-person, forward-looking
}
```

**Design decisions**:
- `suggestions` are meant to be actionable (task-level), not motivational. The prompt explicitly asks for verbs.
- `intentions` is free-form prose that the user can edit before saving — it's a starting point, not a final output.
- Stats are passed so the AI can ground suggestions in actual behavior patterns, not just stated wins/blockers.

---

### 5. Goal Refinement

**Route**: `POST /api/ai/refine-goal`
**Prompt**: `src/modules/ai/prompts/goal-refine.ts`

When a user creates or edits a goal, the AI evaluates whether it is specific enough to generate meaningful milestones and tasks, and provides feedback or a refined version.

**Input**:
```typescript
{
  title: string
  description?: string
  area: string
  quarter: string         // e.g. "2026-Q1"
}
```

**Output**:
```typescript
{
  isSpecific: boolean
  feedback?: string       // one-sentence critique if not specific
  questions?: string[]    // clarifying questions to improve specificity
  refinedTitle?: string   // suggested rewrite
  refinedDescription?: string
}
```

**Design decisions**:
- If `isSpecific` is true, no further fields are needed — the flow immediately proceeds.
- `questions` are for the UI's clarification step — they surface as inline prompts that the user can answer to help the AI produce a better refinement on the next round.
- The prompt applies the SMART criteria implicitly: Specific, Measurable, Achievable, Relevant, Time-bound. Goals that are vague on any axis get feedback targeted to that axis.

---

## AI Engine (Background Intelligence)

The AI Engine is a cron-driven system that continuously enriches the database with precomputed signals. Routes are protected with a `cronSecret` bearer token — they are not callable by the client directly.

The Engine solves a core UX problem: you cannot put a loading spinner on a task list. By computing scores asynchronously and caching them in the database, the Today view renders instantly with already-computed intelligence.

---

### 1. Task Scoring

**Route**: `POST /api/ai/engine/score-tasks`
**Prompt**: `src/modules/ai-engine/prompts/score-tasks.ts`
**Cache window**: 24 hours

Scores all of a user's pending tasks across three dimensions. This is the most computationally expensive Engine operation.

**Signals computed per task**:

| Signal | Type | Description |
|--------|------|-------------|
| `impactScore` | `numeric(3,2)` | How strongly this task advances an active goal. Range 0.00–1.00. |
| `urgencyScore` | `numeric(3,2)` | Time pressure from due dates, upcoming milestones, or habit deadlines. Range 0.00–1.00. |
| `opportunityCost` | `UUID[]` | IDs of tasks that compete for the same energy/time slot. |
| `reasoning` | `text` | One-sentence explanation for use in UI tooltips. |

**How opportunity cost works**:

The AI is given the full list of pending tasks and asked to identify, for each task, which other tasks become less likely to happen today if this one is chosen. A task that requires deep focus competes with other deep-focus tasks. A quick admin task doesn't compete with a 2-hour writing block.

This is not a similarity score. It is a **trade-off model**: completing task A makes task B less likely. The count of tasks in `opportunityCost` becomes the number shown in the `OpportunityCostBadge` on each TaskCard.

**RAG context**:

Before scoring, the Engine queries the vector store for semantically similar historical data (past tasks, completed goals, old reflections). This gives the AI context about patterns — for example, if the user consistently reschedules creative work to evenings, the AI can weight morning deep-work tasks higher.

---

### 2. Goal Breakdown

**Route**: `POST /api/ai/engine/goal-breakdown`
**Prompt**: `src/modules/ai-engine/prompts/goal-breakdown.ts`
**Cache window**: 72 hours

Generates a quarterly roadmap for each active goal as a set of 3–6 milestones, each with suggested tasks.

**Milestone schema**:
```typescript
{
  title: string
  targetDate: string        // ISO YYYY-MM-DD
  suggestedTasks: string[]  // 2-4 task titles
  weekOffset: number        // weeks from today
}
```

**Design decisions**:
- `weekOffset` is relative so the UI can display milestones on a timeline without absolute date math.
- `suggestedTasks` are strings only — they are displayed as suggestions in the goal detail view, not auto-created. The user converts them to real tasks manually.
- The 72-hour cache window acknowledges that goals change slowly. Recomputing on every cron run would waste tokens on stable data.

---

### 3. Embeddings

**Route**: `POST /api/ai/engine/embed`
**Model**: Google `text-embedding-004` (768-dimensional vectors)
**Storage**: `ai_embeddings` table with pgvector column

Every meaningful piece of user data is embedded and stored for vector similarity search:
- Tasks
- Goals
- Habits
- Daily reviews
- Weekly reviews

The embedding content is a short text representation of the entity (title + description + area + date). On update, the embedding is overwritten via `onConflictDoUpdate` on the `(entityId, entityType)` unique constraint.

**How embeddings are used**:

All AI Engine operations use `context-builder.ts` to fetch relevant historical context before invoking the LLM. The flow is:

1. Embed the current query (e.g., the task titles being scored)
2. Run vector similarity search against `ai_embeddings` filtered by `userId`
3. Return the top 6 most semantically similar entities
4. Inject them into the prompt as historical context

This is a lightweight RAG setup. It does not use a separate vector database — pgvector is sufficient at this scale.

---

### 4. User Context Snapshot

**Route**: `POST /api/ai/engine/user-context`
**Prompt**: `src/modules/ai-engine/prompts/user-context.ts`
**Storage**: `ai_user_context` (per-user singleton)

Builds a ~500-word behavioral profile of the user from their activity data:
- Active goals (area + quarter)
- Task completion patterns over the last 30 days
- Habit consistency metrics
- Recent daily reflections

The output is a second-person narrative:

> "You tend to be most productive in the morning. Your strongest area is Work, where you complete 78% of planned tasks. You consistently defer personal tasks to later in the week. Your current quarter focus is on shipping a product milestone and improving physical health."

This snapshot is included as a system-level prefix in all Engine prompts, giving the scoring and breakdown AI a stable, compressed model of who the user is without querying multiple tables on every run.

---

## Staleness Model

Freshness is enforced by `stale.ts`. Each table has a staleness threshold:

| Data | Threshold |
|------|-----------|
| Task scores | 24 hours |
| Goal breakdowns | 72 hours |
| User context | 24 hours |
| Embeddings | No TTL (updated on entity change) |

Cron jobs check `computedAt` before running. If the data is fresh, the route returns early without invoking the LLM.

---

## UI Integration

### TaskCard Signals

`TaskCard` receives an optional `AiTaskScore` prop. When present:

- **ImpactBar**: 4 segments, each filled proportionally to `impactScore`. Colored with the area accent. Hidden when score is 0.
- **OpportunityCostBadge**: Zap icon + count of deferred tasks. Tap opens a `BottomSheet` with the `reasoning` sentence and an explanation of what the number means.

Neither element renders if the task is completed — scores only apply to pending work.

### Goal Detail

The goal breakdown milestones are displayed as a timeline. Each milestone shows its target date, title, and the list of suggested tasks as tappable items that open the task creation sheet pre-populated with the suggestion.

### Today View Score Fetching

`page.tsx` (server component) calls `getTaskScores(userId)` alongside the task list query. Both are passed as `initialData` to `TodayClient`. The client uses `useTaskScoreMap()` to build a `Map<taskId, AiTaskScore>` for O(1) lookup per TaskCard render.

---

## Model Configuration

All AI calls use `getModel()` from `src/modules/ai/client.ts`, which reads `AI_PROVIDER` and `AI_MODEL` from environment variables.

| Provider | Default model |
|----------|--------------|
| `anthropic` | `claude-sonnet-4-6` |
| `google` | `gemini-2.0-flash` |
| `xai` | `grok-4-1-fast-reasoning` |

Embeddings always use Google's `text-embedding-004` regardless of the main provider — it produces 768-dimensional vectors that match the pgvector column definition.

---

## What is Not Yet Built

- **Feedback loop**: There is no mechanism for the user to signal whether AI suggestions were helpful. Task scores are not adjusted based on whether the user accepted or ignored high-impact recommendations.
- **Proactive nudges**: The Engine scores tasks but does not surface its own prioritization recommendations. The UI shows scores passively. A "recommended order" sort mode is a natural next step.
- **Opportunity cost visualization**: The `OpportunityCostBadge` shows a count and opens a sheet with reasoning, but does not show which specific tasks are being deferred. Naming the competing tasks would give the user more actionable trade-off information.
- **Score history**: `ai_task_scores` is a single-row-per-task upsert. There is no history of how a task's score changed over time, which would be useful for understanding urgency drift as deadlines approach.
