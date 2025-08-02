"use client";

import { useChat } from "@/stores/chat-store";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MessagesList } from "@/components/chat/messages-list";
import { ContactSelector } from "@/components/chat/contact-selector";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CreateTaskDialog } from "@/components/chat/create-task-dialog";
import { formatFileSize } from "@/utils/file";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useRef } from "react";

export default function ChatPage() {
  const {
    // State
    activeTab,
    newMessage,
    selectedMessage,
    showTaskDialog,
    selectedFile,
    isUploading,
    selectedDirectContact,
    showContactSelector,
    isTaskMode,
    taskAssigneeId,
    selectedTeam,

    // Actions
    setActiveTab,
    setNewMessage,
    setSelectedFile,
    setSelectedDirectContact,
    setShowContactSelector,
    setShowTaskDialog,
    setIsTaskMode,
    setTaskAssigneeId,

    // Data
    currentUser,
    teamMembers,
    directContacts,
    displayMessages,
    isLoading,
    onlineCount,
    messagesEndRef,

    // Handlers
    handleSendMessage,
    handleFileSelect,
    handleFileUpload,
    handleCreateTask,
    handleClearChat,
  } = useChat();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const handleCancelFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AuthGuard pageName="Chat">
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen">
        {/* Main Chat Area - Usando toda a largura */}
        <div className="flex flex-col max-w-7xl mx-auto">
          {/* Contact Selector */}
          <ContactSelector
            activeTab={activeTab}
            selectedDirectContact={selectedDirectContact}
            teamMembers={teamMembers || []}
            directContacts={directContacts || []}
            currentUser={currentUser}
            onSelectContact={setSelectedDirectContact}
            onShowContactSelector={() => setShowContactSelector(true)}
          />

          {/* Conversation Container - Expandido para toda a largura */}
          <div className="flex-1 p-8">
            <div className="h-[700px] bg-white rounded-3xl border-2 border-purple-200 shadow-xl flex flex-col overflow-hidden">
              {/* Chat Header */}
              <ChatHeader
                activeTab={activeTab}
                selectedDirectContact={selectedDirectContact}
                teamMembers={teamMembers || []}
                onlineCount={onlineCount}
                onClearChat={handleClearChat}
                onBack={() => setSelectedDirectContact(null)}
              />

              {/* Messages List */}
              <MessagesList
                messages={displayMessages}
                currentUser={currentUser!}
                activeTab={activeTab}
                selectedDirectContact={selectedDirectContact}
                directContacts={directContacts || []}
                onCreateTask={handleCreateTask}
                messagesEndRef={messagesEndRef}
              />

              {/* Chat Input */}
              <ChatInput
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                onFileSelect={handleFileSelect}
                onFileUpload={handleFileUpload}
                selectedFile={selectedFile}
                isUploading={isUploading}
                activeTab={activeTab}
                selectedDirectContact={selectedDirectContact}
                fileInputRef={fileInputRef}
                formatFileSize={formatFileSize}
                onCancelFile={handleCancelFile}
                // Props para tarefas
                isTaskMode={isTaskMode}
                onTaskModeChange={setIsTaskMode}
                taskAssigneeId={taskAssigneeId}
                onTaskAssigneeChange={setTaskAssigneeId}
                teamMembers={teamMembers || []}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        message={selectedMessage}
        teamMembers={teamMembers || []}
        teamId={selectedTeam}
      />
    </AuthGuard>
  );
}
