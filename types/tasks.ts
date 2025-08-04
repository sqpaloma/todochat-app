import { Id } from "@/convex/_generated/dataModel";

export interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  assigneeName: string;
  createdBy: string;
  createdAt: number;
  dueDate?: number;
  originalMessage?: string;
  teamId: string;
  priority: TaskPriority;
}

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskColumnConfig {
  status: TaskStatus;
  title: string;
  count: number;
}

export interface TaskFilters {
  searchTerm: string;
  assigneeId?: string;
  priority?: TaskPriority;
  dueDate?: "overdue" | "today" | "upcoming";
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  isOnline?: boolean;
}
