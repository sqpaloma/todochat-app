"use client";

import { Task } from "@/types/tasks";

interface TaskDragOverlayProps {
  activeTask: Task | null;
}

export function TaskDragOverlay({ activeTask }: TaskDragOverlayProps) {
  if (!activeTask) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xl opacity-95 backdrop-blur-sm">
      <h4 className="font-semibold text-gray-900 mb-2">{activeTask.title}</h4>
      {activeTask.description && (
        <p className="text-sm text-gray-600 line-clamp-2">
          {activeTask.description}
        </p>
      )}
      <div className="flex items-center gap-2 mt-3">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <span className="text-xs text-gray-500 capitalize">
          {activeTask.status}
        </span>
      </div>
    </div>
  );
}
