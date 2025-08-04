import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useTeamPresence } from "./use-team-presence";
import {
  Task,
  TaskStatus,
  TaskFilters,
  TaskStats,
  TaskColumnConfig,
} from "@/types/tasks";

const DEFAULT_TEAM_ID = "team-1";

export function useTasks(teamId: string = DEFAULT_TEAM_ID) {
  // State
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({ searchTerm: "" });

  // Queries
  const tasks = useQuery(api.tasks.getTasks, { teamId });
  const { members: teamMembers } = useTeamPresence(teamId, null);

  // Mutations
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  // Computed values
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task: Task) => {
      const matchesSearch =
        !filters.searchTerm ||
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesAssignee =
        !filters.assigneeId || task.assigneeId === filters.assigneeId;
      const matchesPriority =
        !filters.priority || task.priority === filters.priority;

      // Date filtering
      let matchesDate = true;
      if (filters.dueDate && task.dueDate) {
        const now = Date.now();
        const taskDate = task.dueDate;
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        const endOfDay = new Date().setHours(23, 59, 59, 999);

        switch (filters.dueDate) {
          case "overdue":
            matchesDate = taskDate < now && task.status !== "done";
            break;
          case "today":
            matchesDate = taskDate >= startOfDay && taskDate <= endOfDay;
            break;
          case "upcoming":
            matchesDate = taskDate > endOfDay;
            break;
        }
      }

      return matchesSearch && matchesAssignee && matchesPriority && matchesDate;
    });
  }, [tasks, filters]);

  const tasksByStatus = useMemo(
    () => ({
      todo: filteredTasks.filter((task: Task) => task.status === "todo"),
      "in-progress": filteredTasks.filter(
        (task: Task) => task.status === "in-progress"
      ),
      done: filteredTasks.filter((task: Task) => task.status === "done"),
    }),
    [filteredTasks]
  );

  const taskStats: TaskStats = useMemo(() => {
    const total = filteredTasks.length;
    const todo = tasksByStatus.todo.length;
    const inProgress = tasksByStatus["in-progress"].length;
    const done = tasksByStatus.done.length;
    const overdue = filteredTasks.filter(
      (task: Task) =>
        task.dueDate && task.dueDate < Date.now() && task.status !== "done"
    ).length;

    return { total, todo, inProgress, done, overdue };
  }, [filteredTasks, tasksByStatus]);

  const columnConfigs: TaskColumnConfig[] = useMemo(
    () => [
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
    ],
    [tasksByStatus]
  );

  // Event handlers
  const handleDragStart = useCallback(
    (taskId: Id<"tasks">) => {
      const task = tasks?.find((t) => t._id === taskId);
      setActiveTask(task || null);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    async (taskId: Id<"tasks">, newStatus: TaskStatus) => {
      setActiveTask(null);

      const task = tasks?.find((t) => t._id === taskId);
      if (!task || task.status === newStatus) return;

      try {
        await updateTaskStatus({ taskId: task._id, status: newStatus });
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    },
    [tasks, updateTaskStatus]
  );

  const handleDeleteTask = useCallback(
    async (taskId: Id<"tasks">) => {
      try {
        await deleteTask({ taskId });
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    [deleteTask]
  );

  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ searchTerm: "" });
  }, []);

  return {
    // State
    showAddTaskDialog,
    setShowAddTaskDialog,
    showCalendar,
    setShowCalendar,
    activeTask,
    filters,

    // Data
    tasks: filteredTasks,
    tasksByStatus,
    taskStats,
    columnConfigs,
    teamMembers: teamMembers || [],

    // Loading state
    isLoading: tasks === undefined,

    // Actions
    handleDragStart,
    handleDragEnd,
    handleDeleteTask,
    updateFilters,
    clearFilters,
  };
}
