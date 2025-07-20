"use client";

import { Task } from "./task";

interface TaskType {
  _id: string;
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
}

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: TaskType[];
  status: "todo" | "in-progress" | "done";
}

export function TaskColumn({ title, count, tasks, status }: TaskColumnProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
          {count}
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}
