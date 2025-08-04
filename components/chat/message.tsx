"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageType } from "@/types/chat";
import { AcceptTaskDialog } from "./accept-task-dialog";
import { MessageReactions, ReactionDisplay } from "./message-reactions";
import { MessageFile } from "./message-file";
import { MessageBubble } from "./message-bubble";

interface MessageProps {
  message: MessageType;
  currentUserId: string;
  currentUserName: string;
  isGrouped: boolean;
  onCreateTask: () => void;
}

export function Message({
  message,
  currentUserId,
  currentUserName,
  isGrouped,
  onCreateTask,
}: MessageProps) {
  const [isNudging, setIsNudging] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  const addReaction = useMutation(api.messages.addReaction);
  const nudgeUser = useMutation(api.messages.nudgeUser);
  const fileUrl = useQuery(
    api.messages.getFileUrl,
    message.fileId ? { fileId: message.fileId as any } : "skip"
  );
  const respondToTask = useMutation(api.messages.respondToTask);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCurrentUser = message.authorId === currentUserId;
  const hasFile = !!message.fileId;
  const isImageFile = message.fileType?.startsWith("image/");

  const handleReaction = async (emoji: string) => {
    try {
      await addReaction({
        messageId: message._id as any,
        emoji,
        userId: currentUserId,
        userName: currentUserName,
      });
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleNudge = async () => {
    if (isCurrentUser) {
      alert("You cannot nudge yourself!");
      return;
    }

    setIsNudging(true);
    try {
      await nudgeUser({
        messageId: message._id as any,
        nudgerUserId: currentUserId,
        nudgerUserName: currentUserName,
      });

      const successMessage = `🔔 Nudged ${message.authorName}! They'll receive an email notification.`;
      alert(successMessage);
    } catch (error) {
      console.error("Error nudging user:", error);
      if (
        error instanceof Error &&
        error.message === "You cannot nudge yourself"
      ) {
        alert("You cannot nudge yourself!");
      } else {
        alert("Failed to nudge user. Please try again.");
      }
    } finally {
      setIsNudging(false);
    }
  };

  const handleTaskResponse = async (status: "accepted" | "rejected") => {
    if (!message._id) return;

    if (status === "accepted") {
      setShowAcceptDialog(true);
      return;
    }

    setIsResponding(true);
    try {
      await respondToTask({
        messageId: message._id as any,
        status,
        currentUserId,
        currentUserName,
      });
    } catch (error) {
      console.error("Error responding to task:", error);
      alert("Error responding to task. Please try again.");
    } finally {
      setIsResponding(false);
    }
  };

  // Current user's message - Right aligned
  if (isCurrentUser) {
    return (
      <>
        <div
          className={`flex items-start justify-end space-x-3 ${isGrouped ? "mt-1" : "mt-4"}`}
        >
          <div className="flex items-end space-x-3 flex-1 justify-end">
            {/* Timestamp outside bubble */}
            <span className="text-xs text-muted-foreground flex-shrink-0 pb-2">
              {formatTime(message.timestamp)}
            </span>

            <div className="max-w-[75%] group relative">
              {/* Reaction bar for current user */}
              <MessageReactions
                reactions={message.reactions}
                onReaction={handleReaction}
                position="right"
                onCreateTask={onCreateTask}
              />

              <div className="relative">
                {/* Tail for first message only */}
                {!isGrouped && (
                  <div
                    className="absolute top-3 -right-2 w-0 h-0"
                    style={{
                      borderStyle: "solid",
                      borderWidth: "8px 0 8px 12px",
                      borderColor:
                        "transparent transparent transparent hsl(var(--primary))",
                    }}
                  />
                )}

                <MessageBubble
                  message={message}
                  isCurrentUser={isCurrentUser}
                  isGrouped={isGrouped}
                  fileUrl={fileUrl}
                  isResponding={isResponding}
                  onTaskResponse={handleTaskResponse}
                  currentUserId={currentUserId}
                />

                {/* File content outside bubble for non-images */}
                {hasFile && !isImageFile && (
                  <div className="mt-3">
                    <MessageFile
                      fileId={message.fileId}
                      fileName={message.fileName}
                      fileType={message.fileType}
                      fileSize={message.fileSize}
                      fileUrl={fileUrl}
                    />
                  </div>
                )}

                {/* Show reactions below message */}
                <ReactionDisplay
                  reactions={message.reactions}
                  onReaction={handleReaction}
                />
              </div>
            </div>
          </div>
        </div>

        <AcceptTaskDialog
          open={showAcceptDialog}
          onOpenChange={setShowAcceptDialog}
          message={message}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      </>
    );
  }

  // Other user's message - Left aligned
  return (
    <>
      <div
        className={`flex items-start space-x-3 ${isGrouped ? "mt-1" : "mt-4"}`}
      >
        <div className="flex-shrink-0">
          {!isGrouped ? (
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {message.authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>

        <div className="flex items-end space-x-3 flex-1">
          <div className="max-w-[75%] group relative">
            {/* Reaction bar for other users */}
            <MessageReactions
              reactions={message.reactions}
              onReaction={handleReaction}
              position="left"
              showNudge={true}
              onNudge={handleNudge}
              isNudging={isNudging}
            />

            <div className="relative">
              {/* Tail for first message only */}
              {!isGrouped && (
                <div
                  className="absolute top-3 -left-2 w-0 h-0"
                  style={{
                    borderStyle: "solid",
                    borderWidth: "8px 12px 8px 0",
                    borderColor: "transparent white transparent transparent",
                  }}
                />
              )}

              <MessageBubble
                message={message}
                isCurrentUser={isCurrentUser}
                isGrouped={isGrouped}
                fileUrl={fileUrl}
                isResponding={isResponding}
                onTaskResponse={handleTaskResponse}
                currentUserId={currentUserId}
              />

              {/* File content outside bubble for non-images */}
              {hasFile && !isImageFile && (
                <div className="mt-3">
                  <MessageFile
                    fileId={message.fileId}
                    fileName={message.fileName}
                    fileType={message.fileType}
                    fileSize={message.fileSize}
                    fileUrl={fileUrl}
                  />
                </div>
              )}

              {/* Show reactions below message */}
              <ReactionDisplay
                reactions={message.reactions}
                onReaction={handleReaction}
              />
            </div>
          </div>

          {/* Timestamp outside bubble */}
          <span className="text-xs text-muted-foreground flex-shrink-0 pb-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>

      <AcceptTaskDialog
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        message={message}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
      />
    </>
  );
}
