"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDraggable } from "@dnd-kit/core";

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

interface TaskProps {
  task: TaskType;
}

export function Task({ task }: TaskProps) {
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
    });

  const handleStatusChange = async (
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    await updateTaskStatus({ taskId: task._id, status: newStatus });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR");
  };

  return (
    <Card
      ref={setNodeRef}
      className={`bg-white border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-200 cursor-grab active:cursor-grabbing rounded-xl ${
        isDragging ? "opacity-50 rotate-3 scale-105" : ""
      }`}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <CardContent className="p-6 bg-white rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900 leading-tight pr-2">
            {task.title}
          </h4>
          {task.status !== "done" && (
            <div className="flex items-center gap-2 -mt-1">
              {task.originalMessage && (
                <MessageSquare className="w-3 h-3 text-purple-400 flex-shrink-0" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask({ taskId: task._id })}
                className="p-1 h-auto text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-full"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
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
              <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
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
          {task.status === "done" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteTask({ taskId: task._id })}
              className="flex-1 text-xs rounded-full border-purple-300 bg-white hover:bg-purple-50 shadow-md text-purple-600 font-medium"
            >
              Delete
            </Button>
          ) : (
            <>
              {task.status !== "todo" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("todo")}
                  className="flex-1 text-xs rounded-lg border-purple-300 bg-white hover:bg-purple-50 shadow-md text-purple-700 font-medium"
                >
                  To Do
                </Button>
              )}
              {task.status !== "in-progress" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("in-progress")}
                  className="flex-1 text-xs rounded-lg border-purple-300 bg-white hover:bg-purple-50 shadow-md text-purple-700 font-medium"
                >
                  In Progress
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("done")}
                className="flex-1 text-xs rounded-lg border-purple-300 bg-white hover:bg-purple-50 shadow-md text-purple-700 font-medium"
              >
                Done
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
