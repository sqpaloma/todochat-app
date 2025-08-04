"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { gradientClasses } from "@/lib/gradient-classes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface MessageType {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  isTask?: boolean;
  taskStatus?: "pending" | "accepted" | "rejected";
  taskAssigneeId?: string;
  taskAssigneeName?: string;
  taskDueDate?: number;
  taskCreatedBy?: string;
}

interface AcceptTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: MessageType | null;
  currentUserId: string;
  currentUserName: string;
}

export function AcceptTaskDialog({
  open,
  onOpenChange,
  message,
  currentUserId,
  currentUserName,
}: AcceptTaskDialogProps) {
  const [dueDateOption, setDueDateOption] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isLoading, setIsLoading] = useState(false);

  const respondToTask = useMutation(api.messages.respondToTask);

  const getDueDateFromOption = (option: string): number => {
    const now = new Date();
    switch (option) {
      case "today":
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59
        ).getTime();
      case "tomorrow":
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          23,
          59,
          59
        ).getTime();
      case "1week":
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7,
          23,
          59,
          59
        ).getTime();
      case "2weeks":
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 14,
          23,
          59,
          59
        ).getTime();
      case "1month":
        return new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
          23,
          59,
          59
        ).getTime();
      default:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          23,
          59,
          59
        ).getTime();
    }
  };

  const formatDueDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleAccept = async () => {
    if (!message || !dueDateOption) return;

    setIsLoading(true);
    try {
      const dueDate = getDueDateFromOption(dueDateOption);

      await respondToTask({
        messageId: message._id as any,
        status: "accepted",
        currentUserId,
        currentUserName,
        dueDate,
        priority,
      });

      // Reset form
      setDueDateOption("");
      setPriority("medium");
      onOpenChange(false);
    } catch (error) {
      console.error("Error accepting task:", error);
      alert("Erro ao aceitar a tarefa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const dueDateOptions = [
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "1week", label: "1 Week" },
    { value: "2weeks", label: "2 Weeks" },
    { value: "1month", label: "1 Month" },
  ];

  const priorityLabels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span>Accept Task</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Content */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-700 mb-1">Task:</p>
            <p className="text-sm font-medium text-purple-900">
              "{message.content}"
            </p>
            <p className="text-xs text-purple-600 mt-1">
              By {message.authorName}
            </p>
          </div>

          {/* Due Date Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Due Date *</Label>
            <div className="flex flex-wrap gap-2">
              {dueDateOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    dueDateOption === option.value ? "default" : "outline"
                  }
                  onClick={() => setDueDateOption(option.value)}
                  size="sm"
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    dueDateOption === option.value
                      ? "bg-purple-500 text-white border-purple-500 hover:bg-purple-600"
                      : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Prioridade *</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={priority === "low" ? "default" : "outline"}
                onClick={() => setPriority("low")}
                size="sm"
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  priority === "low"
                    ? "bg-purple-500 text-white border-purple-500 hover:bg-purple-600"
                    : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                }`}
              >
                {priorityLabels.low}
              </Button>
              <Button
                variant={priority === "medium" ? "default" : "outline"}
                onClick={() => setPriority("medium")}
                size="sm"
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  priority === "medium"
                    ? "bg-purple-500 text-white border-purple-500 hover:bg-purple-600"
                    : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                }`}
              >
                {priorityLabels.medium}
              </Button>
              <Button
                variant={priority === "high" ? "default" : "outline"}
                onClick={() => setPriority("high")}
                size="sm"
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  priority === "high"
                    ? "bg-purple-500 text-white border-purple-500 hover:bg-purple-600"
                    : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                }`}
              >
                {priorityLabels.high}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAccept}
              disabled={isLoading || !dueDateOption}
              className={`${gradientClasses.primaryButton} text-white`}
            >
              {isLoading ? "Accepting..." : "Accept Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
