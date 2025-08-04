"use client";

import { TaskColumn } from "./task-column";
import { TaskColumnConfig, Task, TeamMember } from "@/types/tasks";

interface TaskBoardProps {
  columnConfigs: TaskColumnConfig[];
  tasksByStatus: {
    todo: Task[];
    "in-progress": Task[];
    done: Task[];
  };
  teamMembers: TeamMember[];
}

export function TaskBoard({
  columnConfigs,
  tasksByStatus,
  teamMembers,
}: TaskBoardProps) {
  return (
    <div className="flex-1 h-full">
      {/* Mobile: Vertical scroll with proper height */}
      <div className="md:hidden space-y-4 overflow-y-auto h-full pr-6">
        {columnConfigs.map((config) => (
          <TaskColumn
            key={config.status}
            title={config.title}
            count={config.count}
            tasks={tasksByStatus[config.status]}
            status={config.status}
            teamMembers={teamMembers}
          />
        ))}
      </div>

      {/* Medium screens: 2-column grid layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-4 md:gap-6 h-full">
        {columnConfigs.map((config) => (
          <TaskColumn
            key={config.status}
            title={config.title}
            count={config.count}
            tasks={tasksByStatus[config.status]}
            status={config.status}
            teamMembers={teamMembers}
          />
        ))}
      </div>

      {/* Desktop: 3-column grid layout */}
      <div className="hidden lg:grid grid-cols-3 gap-6 h-full">
        {columnConfigs.map((config) => (
          <TaskColumn
            key={config.status}
            title={config.title}
            count={config.count}
            tasks={tasksByStatus[config.status]}
            status={config.status}
            teamMembers={teamMembers}
          />
        ))}
      </div>
    </div>
  );
}
