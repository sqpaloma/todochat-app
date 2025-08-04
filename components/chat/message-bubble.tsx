"use client";

import { MessageTypeIndicator } from "./message-type-indicator";
import { MessageFile } from "./message-file";
import { MessageTask } from "./message-task";

interface MessageBubbleProps {
  message: any;
  isCurrentUser: boolean;
  isGrouped: boolean;
  fileUrl?: string | null;
  isResponding: boolean;
  onTaskResponse: (status: "accepted" | "rejected") => void;
  currentUserId: string;
}

export function MessageBubble({
  message,
  isCurrentUser,
  isGrouped,
  fileUrl,
  isResponding,
  onTaskResponse,
  currentUserId,
}: MessageBubbleProps) {
  const hasFile = !!message.fileId;
  const isImageFile = message.fileType?.startsWith("image/");

  const bubbleClasses = isCurrentUser
    ? `bg-primary text-primary-foreground px-4 py-3 shadow-md relative ${
        isGrouped ? "rounded-2xl rounded-br-lg" : "rounded-2xl rounded-br-md"
      }`
    : `bg-background border border-border px-4 py-3 shadow-md relative ${
        isGrouped ? "rounded-2xl rounded-bl-lg" : "rounded-2xl rounded-bl-md"
      }`;

  return (
    <div className={bubbleClasses}>
      {/* Author name for other users */}
      {!isGrouped && !isCurrentUser && (
        <p className="text-xs font-bold text-primary mb-2">
          {message.authorName}
        </p>
      )}

      {/* Message type indicator */}
      <MessageTypeIndicator
        messageType={message.messageType}
        recipientName={message.recipientName}
        isGrouped={isGrouped}
      />

      {/* Message content */}
      {!hasFile && (
        <p
          className={`text-sm leading-relaxed break-words ${
            isCurrentUser ? "" : "text-foreground"
          }`}
        >
          {message.content}
        </p>
      )}

      {/* File content */}
      {hasFile && (
        <MessageFile
          fileId={message.fileId}
          fileName={message.fileName}
          fileType={message.fileType}
          fileSize={message.fileSize}
          fileUrl={fileUrl}
        />
      )}

      {/* Task component */}
      <MessageTask
        isTask={message.isTask}
        taskStatus={message.taskStatus}
        taskAssigneeId={message.taskAssigneeId}
        currentUserId={currentUserId}
        isResponding={isResponding}
        onTaskResponse={onTaskResponse}
        isCurrentUser={isCurrentUser}
      />
    </div>
  );
}
