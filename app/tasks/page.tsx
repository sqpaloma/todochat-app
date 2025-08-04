"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskDragDrop } from "@/hooks/use-task-drag-drop";
import { TaskHeader } from "@/components/tasks/task-header";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskCalendar } from "@/components/tasks/task-calendar";
import { TaskDragOverlay } from "@/components/tasks/task-drag-overlay";

import { CreateManualTaskDialog } from "@/components/tasks/create-manual-task-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthGuard } from "@/components/auth/auth-guard";
import ErrorBoundary from "@/components/team/error-boundary";

function TasksPageContent() {
  const {
    // State
    showAddTaskDialog,
    setShowAddTaskDialog,
    showCalendar,
    setShowCalendar,
    activeTask,
    filters,

    // Data
    tasks,
    tasksByStatus,
    columnConfigs,
    teamMembers,
    taskStats,

    // Loading state
    isLoading,

    // Actions
    handleDragStart,
    handleDragEnd,
    updateFilters,
    clearFilters,
  } = useTasks();

  const {
    sensors,
    handleDragStart: onDragStart,
    handleDragEnd: onDragEnd,
  } = useTaskDragDrop(handleDragStart, handleDragEnd);

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col overflow-hidden">
        {/* Header Section */}
        <TaskHeader
          showCalendar={showCalendar}
          onToggleCalendar={() => setShowCalendar(!showCalendar)}
          onAddTask={() => setShowAddTaskDialog(true)}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 overflow-hidden">
          {/* Calendar - Appears below header on all screen sizes */}
          {showCalendar && (
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <TaskCalendar tasks={tasks} />
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
            {/* Task Board */}
            <TaskBoard
              columnConfigs={columnConfigs}
              tasksByStatus={tasksByStatus}
              teamMembers={teamMembers}
            />
          </div>
        </div>

        {/* Dialogs */}
        <CreateManualTaskDialog
          open={showAddTaskDialog}
          onOpenChange={setShowAddTaskDialog}
          teamMembers={teamMembers}
          teamId="team-1"
        />
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        <TaskDragOverlay activeTask={activeTask} />
      </DragOverlay>
    </DndContext>
  );
}

export default function Tasks() {
  return (
    <AuthGuard pageName="Tasks">
      <ErrorBoundary>
        <TasksPageContent />
      </ErrorBoundary>
    </AuthGuard>
  );
}
