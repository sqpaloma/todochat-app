"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";

interface MessageType {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  teamId: string;
  reactions?: Array<{
    emoji: string;
    users: Array<{ userId: string; userName: string; timestamp: number }>;
  }>;
  fileId?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export function ChatPage() {
  const [selectedTeam] = useState("team-1");
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
    null
  );
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useQuery(api.users.current);
  const messages = useQuery(api.messages.getMessages, { teamId: selectedTeam });
  const teamMembers = useQuery(api.teams.getTeamMembers, {
    teamId: selectedTeam,
  });
  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      const displayName =
        [currentUser.firstName, currentUser.lastName]
          .filter(Boolean)
          .join(" ") || "Anonymous";
      await sendMessage({
        content: newMessage.trim(),
        authorId: currentUser._id,
        authorName: displayName,
        teamId: selectedTeam,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !currentUser) return;

    setIsUploading(true);
    try {
      const displayName =
        [currentUser.firstName, currentUser.lastName]
          .filter(Boolean)
          .join(" ") || "Anonymous";

      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();

      // Step 3: Save file message to database
      await sendFile({
        fileId: storageId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        teamId: selectedTeam,
        authorId: currentUser._id,
        authorName: displayName,
      });

      // Reset file selection
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateTask = (message: MessageType) => {
    setSelectedMessage(message);
    setShowTaskDialog(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
        style={{ height: "calc(100vh - 120px)" }}
      >
        {/* Header with website's purple-pink palette */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">TC</span>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Team Chat</h1>
              <p className="text-xs text-purple-100">
                {teamMembers?.length || 0} members online
              </p>
            </div>
          </div>
        </div>

        {/* Chat Background with subtle website-themed pattern */}
        <div
          className="flex-1 overflow-y-auto p-4 relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23e879f9' fill-opacity='0.03'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
            backgroundColor: "transparent",
          }}
        >
          <div className="space-y-1">
            {(messages || [])
              .sort((a, b) => a.timestamp - b.timestamp) // Sort by timestamp, oldest first
              .map((message: MessageType, index: number) => {
                const sortedMessages = messages!.sort(
                  (a, b) => a.timestamp - b.timestamp
                );
                const previousMessage =
                  index > 0 ? sortedMessages[index - 1] : null;
                const isGrouped =
                  previousMessage?.authorId === message.authorId;
                const currentUserName =
                  [currentUser.firstName, currentUser.lastName]
                    .filter(Boolean)
                    .join(" ") || "Anonymous";

                return (
                  <Message
                    key={message._id}
                    message={message}
                    currentUserId={currentUser._id}
                    currentUserName={currentUserName}
                    isGrouped={isGrouped}
                    onCreateTask={() => handleCreateTask(message)}
                  />
                );
              })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="bg-purple-50 border-t border-purple-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                  <Paperclip className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isUploading ? "Uploading..." : "Send File"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area with website's color scheme */}
        <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-purple-200">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end space-x-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-purple-500 hover:bg-purple-100 rounded-full"
              disabled={isUploading || selectedFile !== null}
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="pr-12 py-3 rounded-3xl border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                disabled={selectedFile !== null}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:bg-purple-100 rounded-full"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!newMessage.trim() || selectedFile !== null}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg disabled:opacity-50 disabled:bg-gray-400"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>

      <CreateTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        message={selectedMessage}
        teamMembers={teamMembers || []}
        teamId={selectedTeam}
      />
    </>
  );
}
