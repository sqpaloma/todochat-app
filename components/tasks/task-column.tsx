"use client";

import { useDroppable } from "@dnd-kit/core";
import { Task } from "./task";
import { Id } from "@/convex/_generated/dataModel";

interface TaskType {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assigneeId: string;
  assigneeName: string;
  createdBy: string;
  createdAt: number;
  dueDate?: number;
  originalMessage?: string;
  teamId: string;
  priority: "low" | "medium" | "high";
}

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: TaskType[];
  status: "todo" | "in-progress" | "done";
}

export function TaskColumn({ title, count, tasks, status }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-900">{title}</h3>
        <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
          {count}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-4 min-h-[200px] p-2 rounded-lg transition-colors ${
          isOver ? "bg-purple-50 border-2 border-purple-200 border-dashed" : ""
        }`}
      >
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}
