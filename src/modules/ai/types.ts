export type Area = "work" | "personal" | "identity";

export type CreateTaskInput = {
  intent: string;
  existingTaskCount: number;
  userId: string;
};

export type CreateTaskResponse = {
  title: string;
  area: Area;
  date: string;
  goalId?: string;
  warning?: string;
};
