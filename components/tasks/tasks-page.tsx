"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { TaskColumn } from "./task-column";
import { TaskCalendar } from "./task-calendar";
import { CreateManualTaskDialog } from "./create-manual-task-dialog";
import { Task } from "./task";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

interface TaskType {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "high" | "medium" | "low";
  assigneeId?: string;
  dueDate?: number;
  teamId: string;
}

export function TasksPage() {
  const [selectedTeam] = useState("team-1");
  const [showManualTaskDialog, setShowManualTaskDialog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const tasks = useQuery(api.tasks.getTasks, { teamId: selectedTeam });
  const teamMembers = useQuery(api.teams.getTeamMembers, {
    teamId: selectedTeam,
  });
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByStatus = {
    todo: (tasks || []).filter((task: TaskType) => task.status === "todo"),
    "in-progress": (tasks || []).filter(
      (task: TaskType) => task.status === "in-progress"
    ),
    done: (tasks || []).filter((task: TaskType) => task.status === "done"),
  };

  const statusConfig = [
    {
      status: "todo" as const,
      title: "To Do",
      count: tasksByStatus.todo.length,
    },
    {
      status: "in-progress" as const,
      title: "In Progress",
      count: tasksByStatus["in-progress"].length,
    },
    {
      status: "done" as const,
      title: "Done",
      count: tasksByStatus.done.length,
    },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = (tasks || []).find((t) => t._id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id as "todo" | "in-progress" | "done";

    const task = (tasks || []).find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await updateTaskStatus({ taskId: task._id, status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Task Board
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Organize and track task progress
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setShowCalendar(!showCalendar)}
              variant="outline"
              className="w-full sm:w-auto lg:hidden rounded-2xl font-semibold px-4 py-2.5"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {showCalendar ? "Hide" : "Show"} Calendar
            </Button>

            <Button
              onClick={() => setShowManualTaskDialog(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold px-4 sm:px-6 py-2.5 sm:py-3"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 h-full">
          {/* Task Board */}
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 h-full">
              {statusConfig.map((config) => (
                <TaskColumn
                  key={config.status}
                  title={config.title}
                  count={config.count}
                  tasks={tasksByStatus[config.status]}
                  status={config.status}
                />
              ))}
            </div>
          </div>

          {/* Calendar Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-80 lg:min-h-0">
            <TaskCalendar tasks={tasks || []} />
          </div>

          {/* Calendar Mobile Toggle */}
          {showCalendar && (
            <div className="lg:hidden mt-4">
              <TaskCalendar tasks={tasks || []} />
            </div>
          )}
        </div>

        <CreateManualTaskDialog
          open={showManualTaskDialog}
          onOpenChange={setShowManualTaskDialog}
          teamMembers={teamMembers || []}
          teamId={selectedTeam}
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg opacity-90">
            <h4 className="font-semibold text-gray-900">{activeTask.title}</h4>
            {activeTask.description && (
              <p className="text-sm text-gray-600 mt-1">
                {activeTask.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
