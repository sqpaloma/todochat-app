"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { TaskColumn } from "./task-column";
import { TaskCalendar } from "./task-calendar";
import { CreateManualTaskDialog } from "./create-manual-task-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

  const tasks = useQuery(api.tasks.getTasks, { teamId: selectedTeam });
  const teamMembers = useQuery(api.teams.getTeamMembers, {
    teamId: selectedTeam,
  });

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
      title: "A Fazer",
      count: tasksByStatus.todo.length,
    },
    {
      status: "in-progress" as const,
      title: "Em Progresso",
      count: tasksByStatus["in-progress"].length,
    },
    {
      status: "done" as const,
      title: "Concluído",
      count: tasksByStatus.done.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView="tasks" />

      <div className="h-[calc(100vh-4rem)] p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-600">
              Organize e acompanhe o progresso das tarefas
            </p>
          </div>

          <Button
            onClick={() => setShowManualTaskDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Task Board */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
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

          {/* Calendar Sidebar */}
          <div className="w-80">
            <TaskCalendar tasks={tasks || []} />
          </div>
        </div>

        <CreateManualTaskDialog
          open={showManualTaskDialog}
          onOpenChange={setShowManualTaskDialog}
          teamMembers={teamMembers || []}
          teamId={selectedTeam}
        />
      </div>
    </div>
  );
}
