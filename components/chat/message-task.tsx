"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface MessageTaskProps {
  isTask: boolean;
  taskStatus?: "pending" | "accepted" | "rejected";
  taskAssigneeId?: string;
  currentUserId: string;
  isResponding: boolean;
  onTaskResponse: (status: "accepted" | "rejected") => void;
  isCurrentUser: boolean;
}

export function MessageTask({
  isTask,
  taskStatus,
  taskAssigneeId,
  currentUserId,
  isResponding,
  onTaskResponse,
  isCurrentUser,
}: MessageTaskProps) {
  if (!isTask) return null;

  const borderColor = isCurrentUser ? "border-primary/20" : "border-border/20";

  return (
    <>
      {/* Task Status */}
      <div
        className={`flex items-center space-x-1 mt-3 pt-2 border-t ${borderColor}`}
      >
        {taskStatus === "pending" && (
          <>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span
              className={`text-xs ${isCurrentUser ? "opacity-80" : "text-gray-600"}`}
            >
              Pending
            </span>
          </>
        )}
        {taskStatus === "accepted" && (
          <>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span
              className={`text-xs ${isCurrentUser ? "opacity-80" : "text-gray-600"}`}
            >
              Accepted
            </span>
          </>
        )}
        {taskStatus === "rejected" && (
          <>
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span
              className={`text-xs ${isCurrentUser ? "opacity-80" : "text-gray-600"}`}
            >
              Rejected
            </span>
          </>
        )}
      </div>

      {/* Task Response Buttons */}
      {taskStatus === "pending" && taskAssigneeId === currentUserId && (
        <div className="flex space-x-2 mt-3">
          <Button
            size="sm"
            onClick={() => onTaskResponse("accepted")}
            disabled={isResponding}
            className="bg-transparent border border-primary/20 hover:bg-primary/5 text-primary px-2 py-1 text-xs rounded-full"
          >
            <Check className="w-3 h-3 mr-1" />
            Accept
          </Button>
          <Button
            size="sm"
            onClick={() => onTaskResponse("rejected")}
            disabled={isResponding}
            className="bg-transparent border border-destructive/20 hover:bg-destructive/5 text-destructive px-2 py-1 text-xs rounded-full"
          >
            <X className="w-3 h-3 mr-1" />
            Decline
          </Button>
        </div>
      )}
    </>
  );
}
