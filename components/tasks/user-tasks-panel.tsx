"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface UserTasksPanelProps {
  userId: string;
  teamId: string;
  currentUserName: string;
}

export function UserTasksPanel({
  userId,
  teamId,
  currentUserName,
}: UserTasksPanelProps) {
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "done">(
    "all"
  );

  const tasks = useQuery(api.tasks.getTasksForUser, {
    userId,
    teamId,
    status: filter === "all" ? undefined : filter,
  });

  const overdueTasks = useQuery(api.tasks.getOverdueTasks, {
    userId,
    teamId,
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "done":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR");
  };

  const isOverdue = (dueDate: number) => {
    return dueDate < Date.now();
  };

  if (!tasks) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Minhas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Minhas Tarefas
        </CardTitle>
        <div className="flex gap-2">
          {(["all", "todo", "in-progress", "done"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === "all" && "Todas"}
              {status === "todo" && "A Fazer"}
              {status === "in-progress" && "Em Progresso"}
              {status === "done" && "Concluídas"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {overdueTasks && overdueTasks.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">
                {overdueTasks.length} tarefa{overdueTasks.length > 1 ? "s" : ""}{" "}
                em atraso
              </span>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {filter === "all" && "Nenhuma tarefa encontrada"}
            {filter === "todo" && "Nenhuma tarefa pendente"}
            {filter === "in-progress" && "Nenhuma tarefa em progresso"}
            {filter === "done" && "Nenhuma tarefa concluída"}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`p-4 border rounded-lg ${
                  task.dueDate && isOverdue(task.dueDate)
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        {task.status === "todo" && "A Fazer"}
                        {task.status === "in-progress" && "Em Progresso"}
                        {task.status === "done" && "Concluída"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority === "high" && "Alta"}
                        {task.priority === "medium" && "Média"}
                        {task.priority === "low" && "Baixa"}
                      </Badge>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span
                            className={
                              isOverdue(task.dueDate)
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate) && " (Atrasada)"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
