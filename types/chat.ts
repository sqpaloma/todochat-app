export type ChatTab = "direct";

export interface MessageType {
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
  // Campos para tarefas
  isTask?: boolean;
  taskStatus?: "pending" | "accepted" | "rejected";
  taskAssigneeId?: string;
  taskAssigneeName?: string;
  taskDueDate?: number;
  taskCreatedBy?: string;
  taskRespondedBy?: string;
  taskRespondedByName?: string;
  taskRespondedAt?: number;
}

export interface ChatState {
  selectedTeam: string;
  activeTab: ChatTab;
  newMessage: string;
  selectedMessage: MessageType | null;
  showTaskDialog: boolean;
  selectedFile: File | null;
  isUploading: boolean;
  selectedDirectContact: string | null;
  showContactSelector: boolean;
  // Estado para tarefas
  isTaskMode: boolean;
  taskAssigneeId: string | null;
}

export interface TabConfig {
  icon: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
