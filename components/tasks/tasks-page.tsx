"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
import { useTeamMembersWithPresence } from "@/hooks/use-team-members-with-presence";

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

export function TasksPage() {
  const [selectedTeam] = useState("team-1");
  const [showManualTaskDialog, setShowManualTaskDialog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const tasks = useQuery(api.tasks.getTasks, { teamId: selectedTeam });
  const deleteTask = useMutation(api.tasks.deleteTask);

  // Use the new presence-enabled hook
  const { members: teamMembers } = useTeamMembersWithPresence(selectedTeam);

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
      <div className="h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Title */}
              <div className="flex items-center gap-4">
                <div className="ml-12">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Task Board
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Organize and track task progress
                  </p>
                </div>
              </div>

              {/* Right side - Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-3">
                <Button
                  onClick={() => setShowManualTaskDialog(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Task
                </Button>

                {/* Calendar Toggle - Mobile and Medium */}
                <Button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="lg:hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px]"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {showCalendar ? "Hide" : "Show"}
                </Button>

                {/* Calendar Toggle - Desktop */}
                <Button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="hidden lg:flex bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {showCalendar ? "Hide Calendar" : "Show Calendar"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 overflow-hidden">
          {/* Calendar - Appears below header on all screen sizes */}
          {showCalendar && (
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <TaskCalendar tasks={tasks || []} />
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
            {/* Task Board */}
            <div className="flex-1 h-full">
              {/* Mobile: Vertical scroll with proper height */}
              <div className="md:hidden space-y-4 overflow-y-auto h-full pr-6">
                {statusConfig.map((config) => (
                  <TaskColumn
                    key={config.status}
                    title={config.title}
                    count={config.count}
                    tasks={tasksByStatus[config.status]}
                    status={config.status}
                    teamMembers={teamMembers || []}
                  />
                ))}
              </div>

              {/* Medium screens: 2-column grid layout */}
              <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-4 md:gap-6 h-full">
                {statusConfig.map((config) => (
                  <TaskColumn
                    key={config.status}
                    title={config.title}
                    count={config.count}
                    tasks={tasksByStatus[config.status]}
                    status={config.status}
                    teamMembers={teamMembers || []}
                  />
                ))}
              </div>

              {/* Desktop: 3-column grid layout */}
              <div className="hidden lg:grid grid-cols-3 gap-6 h-full">
                {statusConfig.map((config) => (
                  <TaskColumn
                    key={config.status}
                    title={config.title}
                    count={config.count}
                    tasks={tasksByStatus[config.status]}
                    status={config.status}
                    teamMembers={teamMembers || []}
                  />
                ))}
              </div>
            </div>

            {/* Calendar Sidebar - Removed, now using toggle on all screen sizes */}
          </div>
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
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xl opacity-95 backdrop-blur-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              {activeTask.title}
            </h4>
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
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
