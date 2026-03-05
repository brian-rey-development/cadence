type Quote = {
  text: string;
  author: string;
};

export const QUOTES: Quote[] = [
  {
    text: "You don't rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
  },
  {
    text: "Every action is a vote for the type of person you want to become.",
    author: "James Clear",
  },
  {
    text: "The most dangerous distractions are the ones that look like work.",
    author: "Cadence",
  },
  {
    text: "Clarity about what matters most is the rarest form of productivity.",
    author: "Cadence",
  },
  {
    text: "Small, consistent actions compound faster than occasional heroic efforts.",
    author: "Cadence",
  },
  {
    text: "A task half done is a decision not yet made.",
    author: "Cadence",
  },
  {
    text: "The energy you spend dreading a task usually exceeds the energy the task requires.",
    author: "Cadence",
  },
  {
    text: "Do less. Mean it more.",
    author: "Cadence",
  },
  {
    text: "The quality of your day is determined by the quality of your attention.",
    author: "Cadence",
  },
  {
    text: "Routine is not the enemy of creativity. It's the architecture that makes creativity possible.",
    author: "Cadence",
  },
  {
    text: "Identity precedes behavior. Become the person first, the habits follow.",
    author: "Cadence",
  },
  {
    text: "The present moment always will have been.",
    author: "Cadence",
  },
  {
    text: "Motion is not the same as progress.",
    author: "James Clear",
  },
  {
    text: "A goal without a system is just a wish with a deadline.",
    author: "Cadence",
  },
  {
    text: "Simplicity is the sophistication you arrive at, not where you start.",
    author: "Cadence",
  },
  {
    text: "What you do repeatedly, you become permanently.",
    author: "Cadence",
  },
  {
    text: "Focused hours beat scattered days.",
    author: "Cadence",
  },
  {
    text: "The obstacle is not in your way. It is the way.",
    author: "Marcus Aurelius",
  },
  {
    text: "An hour of planning saves three hours of confused execution.",
    author: "Cadence",
  },
  {
    text: "Your attention is your most valuable resource. Spend it like it.",
    author: "Cadence",
  },
  {
    text: "You can't think your way into right action. You act your way into right thinking.",
    author: "Cadence",
  },
  {
    text: "Perfectionism is procrastination wearing a sophisticated mask.",
    author: "Cadence",
  },
  {
    text: "Start before you're ready. Refine as you go.",
    author: "Cadence",
  },
  {
    text: "Consistency is the compound interest of effort.",
    author: "Cadence",
  },
  {
    text: "The gap between where you are and where you want to be is closed by habits, not motivation.",
    author: "Cadence",
  },
  {
    text: "Deep work is not a luxury. It is the skill that separates what's possible from what's average.",
    author: "Cal Newport",
  },
  {
    text: "Clarity of purpose makes hard decisions easy.",
    author: "Cadence",
  },
  {
    text: "Your future self is watching every choice you make today.",
    author: "Cadence",
  },
  {
    text: "The cost of doing nothing is always rising.",
    author: "Cadence",
  },
  {
    text: "Rest is not the absence of work. It's the preparation for it.",
    author: "Cadence",
  },
  {
    text: "What gets measured gets tended to. What gets tended to grows.",
    author: "Cadence",
  },
  {
    text: "A decision made once eliminates a thousand micro-decisions later.",
    author: "Cadence",
  },
  {
    text: "Urgency is often an illusion. Importance rarely announces itself.",
    author: "Cadence",
  },
  {
    text: "Intention without execution is just imagination with extra steps.",
    author: "Cadence",
  },
  {
    text: "The longest journey is the one from your head to your hands.",
    author: "Cadence",
  },
  {
    text: "Time is not managed. Attention is.",
    author: "Cadence",
  },
  {
    text: "We suffer more in imagination than in reality.",
    author: "Seneca",
  },
  {
    text: "The first hour of the day sets the temperature for all the hours that follow.",
    author: "Cadence",
  },
  {
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali",
  },
  {
    text: "The goal is not to be busy. The goal is to be useful.",
    author: "Cadence",
  },
];

export function getDailyQuote(): Quote {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
