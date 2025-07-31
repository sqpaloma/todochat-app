"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MessagesList } from "@/components/chat/messages-list";
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
    onlineCount,
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
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen">
        {/* Main Chat Area - Usando toda a largura */}
        <div className="flex flex-col max-w-7xl mx-auto">
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

          {/* Conversation Container - Expandido para toda a largura */}
          <div className="flex-1 p-8">
            <div className="h-[700px] bg-white rounded-3xl border-2 border-purple-200 shadow-xl flex flex-col overflow-hidden">
              {/* Chat Header */}
              <ChatHeader
                activeTab={state.activeTab}
                selectedDirectContact={state.selectedDirectContact}
                teamMembers={teamMembers || []}
                onlineCount={onlineCount}
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
