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
}

export interface TabConfig {
  icon: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
