"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Smile,
  Zap,
  Download,
  FileText,
  Image,
  Video,
  Music,
  Users,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface MessageType {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  teamId: string;
  messageType?: "general" | "direct";
  recipientId?: string;
  recipientName?: string;
  reactions?: Array<{
    emoji: string;
    users: Array<{ userId: string; userName: string; timestamp: number }>;
  }>;
  fileId?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

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
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Private",
        };
      case "general":
      default:
        return {
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
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
            <p className="text-xs text-gray-500 mt-1">{message.fileName}</p>
          )}
        </div>
      );
    }

    return (
      <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="text-purple-500">{getFileIcon(message.fileType)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {message.fileName}
            </p>
            {message.fileSize && (
              <p className="text-xs text-gray-500">
                {formatFileSize(message.fileSize)}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFileDownload}
            className="p-1 text-purple-500 hover:bg-purple-100 rounded"
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
          <span className="text-xs text-gray-400 flex-shrink-0 pb-2">
            {formatTime(message.timestamp)}
          </span>

          <div className="max-w-[75%] group relative">
            {/* Reaction bar for current user */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center space-x-2 bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-2 h-auto hover:bg-gray-100 rounded-lg"
                >
                  <Smile className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateTask}
                  className="p-2 h-auto hover:bg-gray-100 rounded-lg"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </Button>
              </div>

              {/* Quick reaction popup */}
              {showReactions && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2 flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("👍")}
                    className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
                  >
                    👍
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("❤️")}
                    className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
                  >
                    ❤️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("😂")}
                    className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
                  >
                    😂
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction("😮")}
                    className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
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
                    borderColor: "transparent transparent transparent #ec4899",
                  }}
                />
              )}
              <div
                className={`
                  bg-gradient-to-r from-purple-500 to-pink-500 text-white 
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
                          <span className="text-gray-500">
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
                      className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 text-xs flex items-center space-x-2 shadow-sm border border-purple-200 cursor-pointer hover:bg-white"
                      onClick={() => handleReaction(reaction.emoji)}
                    >
                      <span className="text-base">{reaction.emoji}</span>
                      <span className="text-purple-600 font-semibold">
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
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-sm font-bold">
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
            <div className="flex items-center space-x-2 bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(!showReactions)}
                className="p-2 h-auto hover:bg-gray-100 rounded-lg"
              >
                <Smile className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNudge}
                className="p-2 h-auto hover:bg-gray-100 rounded-lg"
                title="Nudge user"
                disabled={isNudging}
              >
                <Zap
                  className={`w-4 h-4 ${isNudging ? "text-gray-400" : "text-amber-500"}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateTask}
                className="p-2 h-auto hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Quick reaction popup */}
            {showReactions && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("👍")}
                  className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
                >
                  👍
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("❤️")}
                  className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
                >
                  ❤️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("😂")}
                  className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
                >
                  😂
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("😮")}
                  className="p-2 h-auto hover:bg-gray-100 rounded-lg text-lg"
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
                bg-white border border-purple-100 
                px-4 py-3 shadow-md relative
                ${
                  isGrouped
                    ? "rounded-2xl rounded-bl-lg"
                    : "rounded-2xl rounded-bl-md"
                }
              `}
            >
              {!isGrouped && (
                <p className="text-xs font-bold text-purple-600 mb-2">
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
                        <span className="text-gray-500">
                          → {message.recipientName}
                        </span>
                      )}
                  </div>
                )}

              {!hasFile && (
                <p className="text-sm text-gray-800 leading-relaxed break-words">
                  {message.content}
                </p>
              )}
              {hasFile && isImageFile && renderFileContent()}
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
                    className="bg-purple-50 rounded-full px-3 py-2 text-xs flex items-center space-x-2 shadow-sm border border-purple-200 cursor-pointer hover:bg-purple-100"
                    onClick={() => handleReaction(reaction.emoji)}
                  >
                    <span className="text-base">{reaction.emoji}</span>
                    <span className="text-purple-600 font-semibold">
                      {reaction.users.length}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timestamp outside bubble */}
        <span className="text-xs text-gray-400 flex-shrink-0 pb-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
