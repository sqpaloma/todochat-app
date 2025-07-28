"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Paperclip,
  Smile,
  Users,
  Megaphone,
  MessageCircle,
  Plus,
  Wifi,
} from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";
import { useTeamMembersWithPresence } from "@/hooks/use-team-members-with-presence";

interface MessageType {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  teamId: string;
  messageType?: "general" | "announcement" | "direct";
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

type ChatTab = "general" | "announcements" | "direct";

export function ChatPage() {
  const [selectedTeam] = useState("team-1");
  const [activeTab, setActiveTab] = useState<ChatTab>("general");
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
    null
  );
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDirectContact, setSelectedDirectContact] = useState<
    string | null
  >(null);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useQuery(api.users.current);

  // Get messages based on active tab
  const messages = useQuery(api.messages.getMessages, {
    teamId: selectedTeam,
    messageType:
      activeTab === "general"
        ? "general"
        : activeTab === "announcements"
          ? "announcement"
          : "direct",
    recipientId:
      activeTab === "direct" ? selectedDirectContact || undefined : undefined,
    currentUserId: currentUser?._id,
  });

  // Search contacts for direct messages
  const directContacts = useQuery(
    api.messages.getDirectMessageContacts,
    currentUser
      ? {
          teamId: selectedTeam,
          currentUserId: currentUser._id,
        }
      : "skip"
  );

  // Use the new presence-enabled hook
  const { members: teamMembers } = useTeamMembersWithPresence(selectedTeam);

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset when changing tabs
  useEffect(() => {
    setSelectedDirectContact(null);
    setNewMessage("");
  }, [activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    // Specific validations by type
    if (activeTab === "direct" && !selectedDirectContact) {
      alert("Select a contact to send direct message");
      return;
    }

    try {
      const displayName =
        [currentUser.firstName, currentUser.lastName]
          .filter(Boolean)
          .join(" ") || "Anonymous";

      let recipientData = {};
      if (activeTab === "direct" && selectedDirectContact) {
        const recipient = teamMembers?.find(
          (m) => m._id === selectedDirectContact
        );
        if (recipient) {
          recipientData = {
            recipientId: recipient._id,
            recipientName: recipient.name,
          };
        }
      }

      await sendMessage({
        content: newMessage.trim(),
        authorId: currentUser._id,
        authorName: displayName,
        teamId: selectedTeam,
        messageType:
          activeTab === "general"
            ? "general"
            : activeTab === "announcements"
              ? "announcement"
              : "direct",
        ...recipientData,
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

    // Specific validations by type
    if (activeTab === "direct" && !selectedDirectContact) {
      alert("Select a contact to send file");
      return;
    }

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

      let recipientData = {};
      if (activeTab === "direct" && selectedDirectContact) {
        const recipient = teamMembers?.find(
          (m) => m._id === selectedDirectContact
        );
        if (recipient) {
          recipientData = {
            recipientId: recipient._id,
            recipientName: recipient.name,
          };
        }
      }

      // Step 3: Save file message to database
      await sendFile({
        fileId: storageId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        teamId: selectedTeam,
        authorId: currentUser._id,
        authorName: displayName,
        messageType:
          activeTab === "general"
            ? "general"
            : activeTab === "announcements"
              ? "announcement"
              : "direct",
        ...recipientData,
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

  const getTabConfig = (tab: ChatTab) => {
    switch (tab) {
      case "general":
        return {
          icon: Users,
          label: "General Chat",
          description: "Team conversations",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "announcements":
        return {
          icon: Megaphone,
          label: "Announcements",
          description: "Important messages",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case "direct":
        return {
          icon: MessageCircle,
          label: "Direct Messages",
          description: "Private conversations",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
    }
  };

  const displayMessages = messages || [];
  const currentTabConfig = getTabConfig(activeTab);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
        style={{ height: "calc(100vh - 120px)", minHeight: "700px" }}
      >
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6">
            <div className="flex items-center max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold">Chat</h1>
            </div>
          </div>

          {/* Contact selector for direct messages */}
          {activeTab === "direct" && (
            <div className="px-6 pb-3 border-t border-gray-200 bg-white/90">
              <div className="flex items-center space-x-3 mt-3 max-w-7xl mx-auto">
                {selectedDirectContact ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {teamMembers
                        ?.find((m) => m._id === selectedDirectContact)
                        ?.name.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2) || "U"}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">
                        {
                          teamMembers?.find(
                            (m) => m._id === selectedDirectContact
                          )?.name
                        }
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        (Online)
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-700">
                      Select contact to chat:
                    </span>
                    <div className="flex-1">
                      {directContacts && directContacts.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {directContacts.map((contact) => (
                            <Button
                              key={contact._id}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedDirectContact(contact._id)
                              }
                              className="hover:bg-purple-50"
                            >
                              {contact.name}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowContactSelector(true)}
                          variant="outline"
                          size="sm"
                          className="hover:bg-purple-50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Select Contact
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Conversation Container */}
          <div className="flex-1 p-6">
            <div className="h-[600px] bg-white rounded-2xl border-2 border-purple-200 shadow-lg flex flex-col overflow-hidden">
              {/* Conversation Header */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-4 border-b border-purple-200 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {activeTab === "general" ? (
                    <Users className="w-5 h-5" />
                  ) : activeTab === "announcements" ? (
                    <Megaphone className="w-5 h-5" />
                  ) : selectedDirectContact ? (
                    teamMembers
                      ?.find((m) => m._id === selectedDirectContact)
                      ?.name.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2) || "DM"
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {activeTab === "general"
                      ? "Team General"
                      : activeTab === "announcements"
                        ? "Announcements"
                        : selectedDirectContact
                          ? teamMembers?.find(
                              (m) => m._id === selectedDirectContact
                            )?.name || "Direct Message"
                          : "Select a Contact"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {activeTab === "general"
                      ? "Team conversations"
                      : activeTab === "announcements"
                        ? "Important messages"
                        : selectedDirectContact
                          ? "Private conversation"
                          : "Choose someone to chat with"}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-4 relative scroll-smooth"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23e879f9' fill-opacity='0.02'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
                  backgroundColor: "#fafafa",
                }}
                ref={messagesEndRef}
              >
                {/* Empty state for direct messages */}
                {activeTab === "direct" &&
                  !selectedDirectContact &&
                  !directContacts?.length && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                          No conversations yet
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Select a team member to start chatting
                        </p>
                      </div>
                    </div>
                  )}

                {/* Messages */}
                {displayMessages.length > 0 && (
                  <div className="space-y-2 max-w-4xl mx-auto">
                    {displayMessages
                      .sort((a, b) => a.timestamp - b.timestamp)
                      .map(
                        (
                          message: MessageType,
                          index: number,
                          sortedMessages
                        ) => {
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
                        }
                      )}
                  </div>
                )}

                {/* Empty state when there are no messages */}
                {displayMessages.length === 0 &&
                  (activeTab !== "direct" || selectedDirectContact) && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <currentTabConfig.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                          No messages yet
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Be the first to send a message!
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {/* File Preview */}
              {selectedFile && (
                <div className="bg-purple-50 border-t border-purple-200 px-4 py-3">
                  <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Paperclip className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
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
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        disabled={isUploading}
                        className="px-3 py-1 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleFileUpload}
                        disabled={isUploading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-3 py-1 text-xs"
                      >
                        {isUploading ? "Uploading..." : "Send"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="bg-white border-t border-purple-200 p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end space-x-3"
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
                    className="p-2 text-purple-500 hover:bg-purple-100 rounded-lg flex-shrink-0"
                    disabled={
                      isUploading ||
                      selectedFile !== null ||
                      (activeTab === "direct" && !selectedDirectContact)
                    }
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>

                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={
                        activeTab === "general"
                          ? "Type a message for the team..."
                          : activeTab === "announcements"
                            ? "Type an important announcement..."
                            : selectedDirectContact
                              ? "Type a private message..."
                              : "Select a contact first..."
                      }
                      className="pr-12 py-3 rounded-xl border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white text-sm"
                      disabled={
                        selectedFile !== null ||
                        (activeTab === "direct" && !selectedDirectContact)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:bg-purple-100 rounded-lg"
                      disabled={
                        activeTab === "direct" && !selectedDirectContact
                      }
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      !newMessage.trim() ||
                      selectedFile !== null ||
                      (activeTab === "direct" && !selectedDirectContact)
                    }
                    className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md disabled:opacity-50 disabled:bg-gray-400 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>

                {/* Warning for direct messages */}
                {activeTab === "direct" && !selectedDirectContact && (
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    💡 Select a contact to start messaging
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat Options */}
        <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-purple-200 p-6">
          <div className="space-y-6">
            {/* Chat Options Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                Chat Options
              </h3>

              <div className="space-y-3">
                {(["general", "announcements", "direct"] as ChatTab[]).map(
                  (tab) => {
                    const config = getTabConfig(tab);
                    const isActive = activeTab === tab;
                    return (
                      <Button
                        key={tab}
                        variant={isActive ? "default" : "ghost"}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full justify-start p-4 rounded-xl transition-all ${
                          isActive
                            ? `bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg`
                            : `text-gray-600 hover:${config.bgColor} hover:${config.color}`
                        }`}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <config.icon className="w-5 h-5 flex-shrink-0" />
                          <div className="text-left flex-1">
                            <div className="text-sm font-semibold">
                              {config.label}
                            </div>
                            <div className="text-xs opacity-75">
                              {config.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Online Members Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Online Members
                <span className="ml-2 text-sm font-medium text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                  {teamMembers?.filter((m) => m.status === "online").length ||
                    0}
                </span>
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {teamMembers && teamMembers.length > 0 ? (
                  teamMembers
                    .filter((member) => member.status === "online")
                    .map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl border border-purple-100 hover:bg-white/80 transition-colors cursor-pointer"
                        onClick={() => {
                          if (member._id !== currentUser?._id) {
                            setActiveTab("direct");
                            setSelectedDirectContact(member._id);
                          }
                        }}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {member.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                            <Wifi className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {member.name}
                            {member._id === currentUser?._id && (
                              <span className="text-xs text-purple-600 ml-1">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {member.email}
                          </div>
                        </div>
                        {member._id !== currentUser?._id && (
                          <div className="text-xs text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No members online</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        message={selectedMessage}
        teamMembers={teamMembers || []}
        teamId={selectedTeam}
      />

      {/* Contact Selector Modal */}
      {showContactSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Select Contact
              </h3>
              <p className="text-sm text-gray-600">
                Choose a team member to start a private conversation
              </p>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {teamMembers
                  ?.filter((member) => member._id !== currentUser?._id)
                  .map((member) => (
                    <Button
                      key={member._id}
                      variant="ghost"
                      onClick={() => {
                        setSelectedDirectContact(member._id);
                        setShowContactSelector(false);
                      }}
                      className="w-full justify-start p-4 h-auto rounded-xl hover:bg-purple-50"
                    >
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-800">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowContactSelector(false)}
                className="w-full rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
