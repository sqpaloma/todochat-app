"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MessagesList } from "@/components/chat/messages-list";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ContactSelector } from "@/components/chat/contact-selector";
import { ContactSelectorModal } from "@/components/chat/contact-selector-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CreateTaskDialog } from "@/components/chat/create-task-dialog";
import { formatFileSize } from "@/utils/file";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function ChatPage() {
  const {
    // State
    state,
    currentUser,
    teamMembers,
    directContacts,
    displayMessages,

    // Refs
    messagesEndRef,
    fileInputRef,

    // Actions
    setActiveTab,
    setNewMessage,
    setSelectedFile,
    setSelectedDirectContact,
    setShowContactSelector,
    setShowTaskDialog,

    // Handlers
    handleSendMessage,
    handleFileSelect,
    handleFileUpload,
    handleCreateTask,
    handleClearChat,

    // Computed
    isLoading,
  } = useChat();

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
      <div className="flex bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6">
            <div className="flex items-center max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold">Chat</h1>
            </div>
          </div>

          {/* Contact Selector */}
          <ContactSelector
            activeTab={state.activeTab}
            selectedDirectContact={state.selectedDirectContact}
            teamMembers={teamMembers || []}
            directContacts={directContacts || []}
            currentUser={currentUser}
            onSelectContact={setSelectedDirectContact}
            onShowContactSelector={() => setShowContactSelector(true)}
          />

          {/* Conversation Container */}
          <div className="flex-1 p-6">
            <div className="h-[600px] bg-white rounded-2xl border-2 border-purple-200 shadow-lg flex flex-col overflow-hidden">
              {/* Chat Header */}
              <ChatHeader
                activeTab={state.activeTab}
                selectedDirectContact={state.selectedDirectContact}
                teamMembers={teamMembers || []}
                onClearChat={handleClearChat}
              />

              {/* Messages List */}
              <MessagesList
                messages={displayMessages}
                currentUser={currentUser!}
                activeTab={state.activeTab}
                selectedDirectContact={state.selectedDirectContact}
                directContacts={directContacts || []}
                onCreateTask={handleCreateTask}
                messagesEndRef={messagesEndRef}
              />

              {/* Chat Input */}
              <ChatInput
                newMessage={state.newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                onFileSelect={handleFileSelect}
                onFileUpload={handleFileUpload}
                selectedFile={state.selectedFile}
                isUploading={state.isUploading}
                activeTab={state.activeTab}
                selectedDirectContact={state.selectedDirectContact}
                fileInputRef={fileInputRef}
                formatFileSize={formatFileSize}
                onCancelFile={handleCancelFile}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <ChatSidebar
          activeTab={state.activeTab}
          teamMembers={teamMembers || []}
          currentUser={currentUser || null}
          onTabChange={setActiveTab}
          onSelectDirectContact={setSelectedDirectContact}
        />
      </div>

      {/* Modals */}
      <CreateTaskDialog
        open={state.showTaskDialog}
        onOpenChange={setShowTaskDialog}
        message={state.selectedMessage}
        teamMembers={teamMembers || []}
        teamId={state.selectedTeam}
      />

      <ContactSelectorModal
        isOpen={state.showContactSelector}
        teamMembers={teamMembers || []}
        currentUser={currentUser}
        onSelectContact={setSelectedDirectContact}
        onClose={() => setShowContactSelector(false)}
      />
    </AuthGuard>
  );
}
