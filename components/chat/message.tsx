"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Clock } from "lucide-react";

interface MessageType {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  teamId: string;
}

interface MessageProps {
  message: MessageType;
  onCreateTask: () => void;
}

export function Message({ message, onCreateTask }: MessageProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
            {message.authorName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">
                {message.authorName}
              </h4>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatTime(message.timestamp)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateTask}
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full p-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-gray-800 leading-relaxed">{message.content}</p>
        </div>
      </div>
    </Card>
  );
}
