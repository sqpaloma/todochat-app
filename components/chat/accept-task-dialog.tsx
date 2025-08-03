"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
    {
      value: "today",
      label: "Hoje",
      description: formatDueDate(getDueDateFromOption("today")),
    },
    {
      value: "tomorrow",
      label: "Amanhã",
      description: formatDueDate(getDueDateFromOption("tomorrow")),
    },
    {
      value: "1week",
      label: "1 Semana",
      description: formatDueDate(getDueDateFromOption("1week")),
    },
    {
      value: "2weeks",
      label: "2 Semanas",
      description: formatDueDate(getDueDateFromOption("2weeks")),
    },
    {
      value: "1month",
      label: "1 Mês",
      description: formatDueDate(getDueDateFromOption("1month")),
    },
  ];

  const priorityColors = {
    low: "text-green-600 bg-green-50",
    medium: "text-yellow-600 bg-yellow-50",
    high: "text-red-600 bg-red-50",
  };

  const priorityLabels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span>Aceitar Tarefa</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Content */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tarefa:</p>
            <p className="text-sm font-medium">"{message.content}"</p>
            <p className="text-xs text-gray-500 mt-1">
              Por {message.authorName}
            </p>
          </div>

          {/* Due Date Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Data de Entrega *</Label>
            <div className="grid gap-2">
              {dueDateOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    dueDateOption === option.value ? "default" : "outline"
                  }
                  onClick={() => setDueDateOption(option.value)}
                  className={`justify-start h-auto p-4 ${
                    dueDateOption === option.value
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Clock className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div
                        className={`text-xs ${
                          dueDateOption === option.value
                            ? "text-purple-100"
                            : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Prioridade *</Label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setPriority(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors.low}`}
                  >
                    🟢 {priorityLabels.low}
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors.medium}`}
                  >
                    🟡 {priorityLabels.medium}
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors.high}`}
                  >
                    🔴 {priorityLabels.high}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAccept}
              disabled={isLoading || !dueDateOption}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLoading ? "Aceitando..." : "Aceitar Tarefa"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
