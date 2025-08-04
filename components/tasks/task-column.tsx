"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Task } from "./task";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Task as TaskType, TaskStatus, TeamMember } from "@/types/tasks";

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: TaskType[];
  status: TaskStatus;
  teamMembers: TeamMember[];
}

export function TaskColumn({
  title,
  count,
  tasks,
  status,
  teamMembers,
}: TaskColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h3 className="text-lg font-semibold text-purple-900">{title}</h3>
        <div className="flex items-center gap-2">
          {/* Mobile Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
            {count}
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-4 min-h-[200px] p-2 rounded-lg transition-all duration-300 ${
          isOver ? "bg-purple-50 border-2 border-purple-200 border-dashed" : ""
        } ${isCollapsed ? "lg:hidden hidden" : "block"}`}
      >
        {/* Mobile: Normal layout */}
        <div className="lg:hidden space-y-4">
          {tasks.map((task) => (
            <Task key={task._id} task={task} teamMembers={teamMembers} />
          ))}
        </div>

        {/* Desktop: Scrollable layout */}
        <div className="hidden lg:block max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-4">
          {tasks.map((task) => (
            <Task key={task._id} task={task} teamMembers={teamMembers} />
          ))}
        </div>
      </div>
    </div>
  );
}
