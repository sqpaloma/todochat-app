"use client";

import { Users, MessageCircle, Megaphone } from "lucide-react";

type MessageType = "direct" | "general" | "announcement";

interface MessageTypeIndicatorProps {
  messageType?: MessageType | null;
  recipientName?: string | null;
  isGrouped: boolean;
}

export function MessageTypeIndicator({
  messageType,
  recipientName,
  isGrouped,
}: MessageTypeIndicatorProps) {
  if (isGrouped || !messageType || messageType === "general") {
    return null;
  }

  const getMessageTypeConfig = () => {
    switch (messageType) {
      case "direct":
        return {
          icon: MessageCircle,
          color: "text-primary",
          bgColor: "bg-primary/10",
          label: "Private",
        };
      case "announcement":
        return {
          icon: Megaphone,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          label: "Announcement",
        };
      default:
        return {
          icon: Users,
          color: "text-primary",
          bgColor: "bg-primary/10",
          label: "General",
        };
    }
  };

  const typeConfig = getMessageTypeConfig();
  const TypeIcon = typeConfig.icon;

  return (
    <div
      className={`flex items-center space-x-2 mb-2 text-xs ${typeConfig.bgColor} px-3 py-2 rounded-full w-fit`}
    >
      <TypeIcon className={`w-3 h-3 ${typeConfig.color}`} />
      <span className={typeConfig.color}>{typeConfig.label}</span>
      {messageType === "direct" && recipientName && (
        <span className="text-muted-foreground">→ {recipientName}</span>
      )}
    </div>
  );
}
