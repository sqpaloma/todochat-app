"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MessageSquare } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TaskType {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assigneeId: Id<"users">;
  assigneeName: string;
  createdBy: Id<"users">;
  createdAt: number;
  dueDate?: number;
  originalMessage?: string;
  teamId: Id<"teams">;
}

interface TaskProps {
  task: TaskType;
}

export function Task({ task }: TaskProps) {
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  const handleStatusChange = async (
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    await updateTaskStatus({ taskId: task._id, status: newStatus });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR");
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900 leading-tight pr-2">
            {task.title}
          </h4>
          {task.originalMessage && (
            <MessageSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
          )}
        </div>

        {task.description && (
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                {task.assigneeName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{task.assigneeName}</span>
          </div>

          {task.dueDate && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {task.status !== "todo" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("todo")}
              className="flex-1 text-xs rounded-full border-gray-200"
            >
              To Do
            </Button>
          )}
          {task.status !== "in-progress" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("in-progress")}
              className="flex-1 text-xs rounded-full border-gray-200"
            >
              In Progress
            </Button>
          )}
          {task.status !== "done" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("done")}
              className="flex-1 text-xs rounded-full border-gray-200"
            >
              Done
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
