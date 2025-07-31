import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTeamMembersWithPresence } from "./use-team-members-with-presence";
import { ChatTab, MessageType, ChatState, TabConfig } from "@/types/chat";
import { getDisplayName } from "@/utils/user";

const DEFAULT_TEAM_ID = "team-1";

export function useChat() {
  // State management
  const [state, setState] = useState<ChatState>({
    selectedTeam: DEFAULT_TEAM_ID,
    activeTab: "general",
    newMessage: "",
    selectedMessage: null,
    showTaskDialog: false,
    selectedFile: null,
    isUploading: false,
    selectedDirectContact: null,
    showContactSelector: false,
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const currentUser = useQuery(api.users.current);
  const { members: teamMembers } = useTeamMembersWithPresence(
    state.selectedTeam
  );

  const messages = useQuery(api.messages.getMessages, {
    teamId: state.selectedTeam,
    messageType: getMessageTypeFromTab(state.activeTab),
    recipientId:
      state.activeTab === "direct"
        ? state.selectedDirectContact || undefined
        : undefined,
    currentUserId: currentUser?._id,
  });

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);
  const clearChat = useMutation(api.messages.clearChat);

  // Computed values
  const displayMessages = messages || [];
  const currentTabConfig = getTabConfig(state.activeTab);

  // Actions
  const updateState = useCallback((updates: Partial<ChatState>) => {
    setState((prev: ChatState) => ({ ...prev, ...updates }));
  }, []);

  const setActiveTab = useCallback(
    (tab: ChatTab) => {
      updateState({
        activeTab: tab,
        selectedDirectContact: null,
        newMessage: "",
      });
    },
    [updateState]
  );

  const setNewMessage = useCallback(
    (message: string) => {
      updateState({ newMessage: message });
    },
    [updateState]
  );

  const setSelectedFile = useCallback(
    (file: File | null) => {
      updateState({ selectedFile: file });
    },
    [updateState]
  );

  const setSelectedDirectContact = useCallback(
    (contactId: string | null) => {
      updateState({ selectedDirectContact: contactId });
    },
    [updateState]
  );

  const setShowContactSelector = useCallback(
    (show: boolean) => {
      updateState({ showContactSelector: show });
    },
    [updateState]
  );

  const setShowTaskDialog = useCallback(
    (show: boolean) => {
      updateState({ showTaskDialog: show });
    },
    [updateState]
  );

  const setSelectedMessage = useCallback(
    (message: MessageType | null) => {
      updateState({ selectedMessage: message });
    },
    [updateState]
  );

  const setIsUploading = useCallback(
    (uploading: boolean) => {
      updateState({ isUploading: uploading });
    },
    [updateState]
  );

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Message handling
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!state.newMessage.trim() || !currentUser) return;

      if (state.activeTab === "direct" && !state.selectedDirectContact) {
        throw new Error("Select a contact to send direct message");
      }

      try {
        const displayName = getDisplayName(currentUser);
        const recipientData = getRecipientData(state, teamMembers);

        await sendMessage({
          content: state.newMessage.trim(),
          authorId: currentUser._id,
          authorName: displayName,
          teamId: state.selectedTeam,
          messageType: getMessageTypeFromTab(state.activeTab),
          ...recipientData,
        });

        updateState({ newMessage: "" });
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [state, currentUser, teamMembers, sendMessage, updateState]
  );

  // File handling
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    [setSelectedFile]
  );

  const handleFileUpload = useCallback(async () => {
    if (!state.selectedFile || !currentUser) return;

    if (state.activeTab === "direct" && !state.selectedDirectContact) {
      throw new Error("Select a contact to send file");
    }

    setIsUploading(true);
    try {
      const displayName = getDisplayName(currentUser);
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": state.selectedFile.type },
        body: state.selectedFile,
      });
      const { storageId } = await result.json();

      const recipientData = getRecipientData(state, teamMembers);

      await sendFile({
        fileId: storageId,
        fileName: state.selectedFile.name,
        fileType: state.selectedFile.type,
        fileSize: state.selectedFile.size,
        teamId: state.selectedTeam,
        authorId: currentUser._id,
        authorName: displayName,
        messageType: getMessageTypeFromTab(state.activeTab),
        ...recipientData,
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [
    state,
    currentUser,
    teamMembers,
    generateUploadUrl,
    sendFile,
    setSelectedFile,
    setIsUploading,
  ]);

  // Task handling
  const handleCreateTask = useCallback(
    (message: MessageType) => {
      setSelectedMessage(message);
      setShowTaskDialog(true);
    },
    [setSelectedMessage, setShowTaskDialog]
  );

  // Chat clearing
  const handleClearChat = useCallback(async () => {
    if (!currentUser) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja limpar este chat? Esta ação não pode ser desfeita."
    );

    if (!confirmed) return;

    try {
      await clearChat({
        teamId: state.selectedTeam,
        messageType: getMessageTypeFromTab(state.activeTab),
        recipientId:
          state.activeTab === "direct"
            ? state.selectedDirectContact || undefined
            : undefined,
        currentUserId: currentUser._id,
      });
    } catch (error) {
      console.error("Error clearing chat:", error);
      throw error;
    }
  }, [state, currentUser, clearChat]);

  return {
    // State
    state,
    currentUser,
    teamMembers,
    directContacts: [], // Simplified - no direct contacts for now
    displayMessages,
    currentTabConfig,

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
    setSelectedMessage,

    // Handlers
    handleSendMessage,
    handleFileSelect,
    handleFileUpload,
    handleCreateTask,
    handleClearChat,

    // Computed
    isLoading: !currentUser,
  };
}

// Helper functions
function getMessageTypeFromTab(
  tab: ChatTab
): "general" | "announcement" | "direct" {
  switch (tab) {
    case "general":
      return "general";
    case "announcements":
      return "announcement";
    case "direct":
      return "direct";
  }
}

function getRecipientData(state: ChatState, teamMembers: any[]) {
  if (state.activeTab === "direct" && state.selectedDirectContact) {
    const recipient = teamMembers?.find(
      (m) => m._id === state.selectedDirectContact
    );
    if (recipient) {
      return {
        recipientId: recipient._id,
        recipientName: recipient.name,
      };
    }
  }
  return {};
}

function getTabConfig(tab: ChatTab): TabConfig {
  switch (tab) {
    case "general":
      return {
        icon: "Users",
        label: "General Chat",
        description: "Team conversations",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    case "announcements":
      return {
        icon: "Megaphone",
        label: "Announcements",
        description: "Important messages",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    case "direct":
      return {
        icon: "MessageCircle",
        label: "Direct Messages",
        description: "Private conversations",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
  }
}
