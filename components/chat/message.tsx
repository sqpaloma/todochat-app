"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Smile,
  Zap,
  Download,
  FileText,
  Image,
  Video,
  Music,
  Users,
  MessageCircle,
  Check,
  X,
  Calendar,
  User,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageType } from "@/types/chat";

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
  const [showReactions, setShowReactions] = useState(false);
  const [showNudgeConfirm, setShowNudgeConfirm] = useState(false);
  const [isNudging, setIsNudging] = useState(false);

  const addReaction = useMutation(api.messages.addReaction);
  const nudgeUser = useMutation(api.messages.nudgeUser);
  const fileUrl = useQuery(
    api.messages.getFileUrl,
    message.fileId ? { fileId: message.fileId as any } : "skip"
  );
  const respondToTask = useMutation(api.messages.respondToTask);
  const [isResponding, setIsResponding] = useState(false);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="w-5 h-5" />;

    if (fileType.startsWith("image/")) return <Image className="w-5 h-5" />;
    if (fileType.startsWith("video/")) return <Video className="w-5 h-5" />;
    if (fileType.startsWith("audio/")) return <Music className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const isCurrentUser = message.authorId === currentUserId;
  const hasFile = !!message.fileId;
  const isImageFile = message.fileType?.startsWith("image/");

  // Função para obter configuração do tipo de mensagem
  const getMessageTypeConfig = () => {
    switch (message.messageType) {
      case "direct":
        return {
          icon: MessageCircle,
          color: "text-primary",
          bgColor: "bg-primary/10",
          label: "Private",
        };
      case "general":
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

  const handleReaction = async (emoji: string) => {
    try {
      await addReaction({
        messageId: message._id as any,
        emoji,
        userId: currentUserId,
        userName: currentUserName,
      });
      setShowReactions(false);
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

      // Show success feedback
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

  const handleFileDownload = () => {
    if (fileUrl && message.fileName) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = message.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Get reaction counts from the message
  const getReactionCount = (emoji: string) => {
    const reaction = message.reactions?.find((r) => r.emoji === emoji);
    return reaction?.users.length || 0;
  };

  const handleTaskResponse = async (status: "accepted" | "rejected") => {
    if (!message._id) return;

    setIsResponding(true);
    try {
      await respondToTask({
        messageId: message._id as any, // Cast para o tipo correto do Convex
        status,
        currentUserId,
        currentUserName,
      });
    } catch (error) {
      console.error("Error responding to task:", error);
      alert("Erro ao responder à tarefa. Tente novamente.");
    } finally {
      setIsResponding(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDueDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFileContent = () => {
    if (!hasFile || !fileUrl) return null;

    if (isImageFile) {
      return (
        <div className="mt-2">
          <img
            src={fileUrl}
            alt={message.fileName}
            className="max-w-sm max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(fileUrl, "_blank")}
          />
          {message.fileName && (
            <p className="text-xs text-muted-foreground mt-1">
              {message.fileName}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="mt-2 bg-muted rounded-lg p-3 border border-border max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="text-primary">{getFileIcon(message.fileType)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {message.fileName}
            </p>
            {message.fileSize && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(message.fileSize)}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFileDownload}
            className="p-1 text-primary hover:bg-primary/10 rounded"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Current user's message - Right aligned
  if (isCurrentUser) {
    return (
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
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center space-x-2 bg-background rounded-xl shadow-lg border border-border px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-2 h-auto hover:bg-muted rounded-lg"
                >
                  <Smile className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateTask}
                  className="p-2 h-auto hover:bg-muted rounded-lg"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>

              {/* Quick reaction popup */}
              {showReactions && (
                <div className="absolute top-full left-0 mt-2 bg-background rounded-xl shadow-lg border border-border px-3 py-2 flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("👍")}
                    className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                  >
                    👍
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("❤️")}
                    className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                  >
                    ❤️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("😂")}
                    className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                  >
                    😂
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("😮")}
                    className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                  >
                    😮
                  </Button>
                </div>
              )}
            </div>

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
              <div
                className={`
                  bg-primary text-primary-foreground 
                  px-4 py-3 shadow-md relative
                  ${
                    isGrouped
                      ? "rounded-2xl rounded-br-lg"
                      : "rounded-2xl rounded-br-md"
                  }
                `}
              >
                {/* Indicador do tipo de mensagem */}
                {!isGrouped &&
                  message.messageType &&
                  message.messageType !== "general" && (
                    <div
                      className={`flex items-center space-x-2 mb-2 text-xs ${typeConfig.bgColor} px-3 py-2 rounded-full w-fit`}
                    >
                      <TypeIcon className={`w-3 h-3 ${typeConfig.color}`} />
                      <span className={typeConfig.color}>
                        {typeConfig.label}
                      </span>
                      {message.messageType === "direct" &&
                        message.recipientName && (
                          <span className="text-muted-foreground">
                            → {message.recipientName}
                          </span>
                        )}
                    </div>
                  )}

                {!hasFile && (
                  <p className="text-sm leading-relaxed break-words">
                    {message.content}
                  </p>
                )}
                {hasFile && isImageFile && renderFileContent()}

                {/* Task Status - Minimalista e integrado */}
                {message.isTask && (
                  <div className="flex items-center space-x-1 mt-3 pt-2 border-t border-primary/20">
                    {message.taskStatus === "pending" && (
                      <>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-xs opacity-80">Pendente</span>
                      </>
                    )}
                    {message.taskStatus === "accepted" && (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs opacity-80">Aceita</span>
                      </>
                    )}
                    {message.taskStatus === "rejected" && (
                      <>
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-xs opacity-80">Rejeitada</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* File content outside bubble for non-images */}
              {hasFile && !isImageFile && (
                <div className="mt-3">{renderFileContent()}</div>
              )}

              {/* Show reactions below message */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex items-center space-x-2 mt-2 justify-end">
                  {message.reactions.map((reaction, index) => (
                    <div
                      key={`${message._id}-reaction-${index}`}
                      className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 text-xs flex items-center space-x-2 shadow-sm border border-border cursor-pointer hover:bg-background"
                      onClick={() => handleReaction(reaction.emoji)}
                    >
                      <span className="text-base">{reaction.emoji}</span>
                      <span className="text-primary font-semibold">
                        {reaction.users.length}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Other user's message - Left aligned
  return (
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
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center space-x-2 bg-background rounded-xl shadow-lg border border-border px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(!showReactions)}
                className="p-2 h-auto hover:bg-muted rounded-lg"
              >
                <Smile className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNudge}
                className="p-2 h-auto hover:bg-muted rounded-lg"
                title="Nudge user"
                disabled={isNudging}
              >
                <Zap
                  className={`w-4 h-4 ${isNudging ? "text-muted-foreground" : "text-primary"}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateTask}
                className="p-2 h-auto hover:bg-muted rounded-lg"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Quick reaction popup */}
            {showReactions && (
              <div className="absolute top-full right-0 mt-2 bg-background rounded-xl shadow-lg border border-border px-3 py-2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("👍")}
                  className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                >
                  👍
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("❤️")}
                  className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                >
                  ❤️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("😂")}
                  className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                >
                  😂
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("😮")}
                  className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
                >
                  😮
                </Button>
              </div>
            )}
          </div>

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
            <div
              className={`
                bg-background border border-border 
                px-4 py-3 shadow-md relative
                ${
                  isGrouped
                    ? "rounded-2xl rounded-bl-lg"
                    : "rounded-2xl rounded-bl-md"
                }
              `}
            >
              {!isGrouped && (
                <p className="text-xs font-bold text-primary mb-2">
                  {message.authorName}
                </p>
              )}

              {/* Indicador do tipo de mensagem */}
              {!isGrouped &&
                message.messageType &&
                message.messageType !== "general" && (
                  <div
                    className={`flex items-center space-x-2 mb-2 text-xs ${typeConfig.bgColor} px-3 py-2 rounded-full w-fit`}
                  >
                    <TypeIcon className={`w-3 h-3 ${typeConfig.color}`} />
                    <span className={typeConfig.color}>{typeConfig.label}</span>
                    {message.messageType === "direct" &&
                      message.recipientName && (
                        <span className="text-muted-foreground">
                          → {message.recipientName}
                        </span>
                      )}
                  </div>
                )}

              {!hasFile && (
                <p className="text-sm text-foreground leading-relaxed break-words">
                  {message.content}
                </p>
              )}
              {hasFile && isImageFile && renderFileContent()}

              {/* Task Status - Minimalista e integrado */}
              {message.isTask && (
                <div className="flex items-center space-x-1 mt-3 pt-2 border-t border-border/20">
                  {message.taskStatus === "pending" && (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600">Pendente</span>
                    </>
                  )}
                  {message.taskStatus === "accepted" && (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">Aceita</span>
                    </>
                  )}
                  {message.taskStatus === "rejected" && (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">Rejeitada</span>
                    </>
                  )}
                </div>
              )}

              {/* Task Response Buttons */}
              {message.isTask &&
                message.taskStatus === "pending" &&
                message.taskAssigneeId === currentUserId && (
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleTaskResponse("accepted")}
                      disabled={isResponding}
                      className="bg-transparent border border-primary/20 hover:bg-primary/5 text-primary px-2 py-1 text-xs rounded-full"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleTaskResponse("rejected")}
                      disabled={isResponding}
                      className="bg-transparent border border-destructive/20 hover:bg-destructive/5 text-destructive px-2 py-1 text-xs rounded-full"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Recusar
                    </Button>
                  </div>
                )}
            </div>

            {/* File content outside bubble for non-images */}
            {hasFile && !isImageFile && (
              <div className="mt-3">{renderFileContent()}</div>
            )}

            {/* Show reactions below message */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                {message.reactions.map((reaction, index) => (
                  <div
                    key={`${message._id}-reaction-${index}`}
                    className="bg-muted rounded-full px-3 py-2 text-xs flex items-center space-x-2 shadow-sm border border-border cursor-pointer hover:bg-muted/80"
                    onClick={() => handleReaction(reaction.emoji)}
                  >
                    <span className="text-base">{reaction.emoji}</span>
                    <span className="text-primary font-semibold">
                      {reaction.users.length}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timestamp outside bubble */}
        <span className="text-xs text-muted-foreground flex-shrink-0 pb-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
