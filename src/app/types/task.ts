export type Task = {
  id: number;
  title: string;
  dueDate?: string;
  status: "pending" | "in-progress" | "completed";
};
