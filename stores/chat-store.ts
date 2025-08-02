import { create } from "zustand";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTeamPresence } from "@/hooks/use-team-presence";
import { ChatTab, MessageType } from "@/types/chat";
import { getDisplayName } from "@/utils/user";
import { useEffect, useRef } from "react";

const DEFAULT_TEAM_ID = "team-1";

interface ChatState {
  // State
  selectedTeam: string;
  activeTab: ChatTab;
  newMessage: string;
  selectedMessage: MessageType | null;
  showTaskDialog: boolean;
  selectedFile: File | null;
  isUploading: boolean;
  selectedDirectContact: string | null;
  showContactSelector: boolean;
  isTaskMode: boolean;
  taskAssigneeId: string | null;
  taskDueDate: number | null;

  // Actions
  setActiveTab: (tab: ChatTab) => void;
  setNewMessage: (message: string) => void;
  setSelectedFile: (file: File | null) => void;
  setSelectedDirectContact: (contactId: string | null) => void;
  setShowContactSelector: (show: boolean) => void;
  setShowTaskDialog: (show: boolean) => void;
  setIsTaskMode: (isTaskMode: boolean) => void;
  setTaskAssigneeId: (assigneeId: string | null) => void;
  setTaskDueDate: (dueDate: number | null) => void;
  setSelectedMessage: (message: MessageType | null) => void;
  setIsUploading: (uploading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set: any, get: any) => ({
  // Initial state
  selectedTeam: DEFAULT_TEAM_ID,
  activeTab: "direct",
  newMessage: "",
  selectedMessage: null,
  showTaskDialog: false,
  selectedFile: null,
  isUploading: false,
  selectedDirectContact: null,
  showContactSelector: false,
  isTaskMode: false,
  taskAssigneeId: null,
  taskDueDate: null,

  // Actions
  setActiveTab: (tab) =>
    set({
      activeTab: tab,
      selectedDirectContact: null,
      newMessage: "",
    }),

  setNewMessage: (message) => set({ newMessage: message }),

  setSelectedFile: (file) => set({ selectedFile: file }),

  setSelectedDirectContact: (contactId) =>
    set({ selectedDirectContact: contactId }),

  setShowContactSelector: (show) => set({ showContactSelector: show }),

  setShowTaskDialog: (show) => set({ showTaskDialog: show }),

  setIsTaskMode: (isTaskMode) =>
    set({
      isTaskMode,
      ...(isTaskMode ? {} : { taskAssigneeId: null, taskDueDate: null }),
    }),

  setTaskAssigneeId: (assigneeId) => set({ taskAssigneeId: assigneeId }),

  setTaskDueDate: (dueDate) => set({ taskDueDate: dueDate }),

  setSelectedMessage: (message) => set({ selectedMessage: message }),

  setIsUploading: (uploading) => set({ isUploading: uploading }),

  clearChat: () => set({ newMessage: "", selectedFile: null }),
}));

// Hook that combines Zustand store with Convex queries and mutations
export function useChat() {
  const store = useChatStore();

  // Queries
  const currentUser = useQuery(api.users.current);
  const { members: teamMembers, onlineCount } = useTeamPresence(
    store.selectedTeam,
    currentUser
  );

  const messages = useQuery(api.messages.getMessages, {
    teamId: store.selectedTeam,
    messageType: store.selectedDirectContact ? "direct" : "general",
    recipientId: store.selectedDirectContact || undefined,
    currentUserId: currentUser?._id,
  });

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);
  const clearChat = useMutation(api.messages.clearChat);

  // Computed values
  const displayMessages = messages || [];
  const directContacts = teamMembers || [];
  const isLoading = !currentUser;

  // Auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Helper functions
  const getRecipientData = (teamMembers: any[]) => {
    if (!store.selectedDirectContact || !teamMembers) return {};

    const recipient = teamMembers.find(
      (member) => member._id === store.selectedDirectContact
    );

    return {
      recipientId: store.selectedDirectContact,
      recipientName: recipient ? getDisplayName(recipient) : "Unknown User",
    };
  };

  // Handlers
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store.newMessage.trim() || !currentUser) return;

    // Validation for group tasks
    if (
      store.isTaskMode &&
      !store.selectedDirectContact &&
      !store.taskAssigneeId
    ) {
      alert(
        "Para enviar uma tarefa em grupo, você deve selecionar um responsável."
      );
      return;
    }

    try {
      const displayName = getDisplayName(currentUser);
      const messageType = store.selectedDirectContact ? "direct" : "general";
      const recipientData = store.selectedDirectContact
        ? getRecipientData(teamMembers)
        : {};

      const taskData = store.isTaskMode
        ? {
            isTask: true,
            taskStatus: "pending" as const,
            taskCreatedBy: currentUser._id,
            ...(store.selectedDirectContact
              ? {
                  taskAssigneeId: store.selectedDirectContact,
                  taskAssigneeName: recipientData.recipientName,
                }
              : {
                  taskAssigneeId: store.taskAssigneeId,
                  taskAssigneeName: teamMembers.find(
                    (m) => m._id === store.taskAssigneeId
                  )?.name,
                }),
            ...(store.taskDueDate && { taskDueDate: store.taskDueDate }),
          }
        : {};

      await sendMessage({
        content: store.newMessage,
        authorId: currentUser._id,
        authorName: displayName,
        teamId: store.selectedTeam,
        messageType,
        ...recipientData,
        ...taskData,
      });

      store.clearChat();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      store.setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!store.selectedFile || !currentUser) return;

    try {
      store.setIsUploading(true);

      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": store.selectedFile.type },
        body: store.selectedFile,
      });
      const { storageId } = await result.json();

      const displayName = getDisplayName(currentUser);
      const messageType = store.selectedDirectContact ? "direct" : "general";
      const recipientData = store.selectedDirectContact
        ? getRecipientData(teamMembers)
        : {};

      await sendFile({
        fileId: storageId,
        fileName: store.selectedFile.name,
        fileType: store.selectedFile.type,
        fileSize: store.selectedFile.size,
        teamId: store.selectedTeam,
        authorId: currentUser._id,
        authorName: displayName,
        messageType,
        ...recipientData,
      });

      store.setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      store.setIsUploading(false);
    }
  };

  const handleCreateTask = (message: MessageType) => {
    store.setSelectedMessage(message);
    store.setShowTaskDialog(true);
  };

  const handleClearChat = async () => {
    if (!currentUser) return;

    try {
      await clearChat({
        teamId: store.selectedTeam,
        messageType: store.selectedDirectContact ? "direct" : "general",
        recipientId: store.selectedDirectContact || undefined,
        currentUserId: currentUser._id,
      });
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return {
    // State
    ...store,
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
  };
}
