"use client";

import { Message } from "./message";
import { MessageType, ChatTab } from "@/types/chat";
import { User } from "@/types/user";
import { getDisplayName } from "@/utils/user";
import { MessageCircle } from "lucide-react";

interface MessagesListProps {
  messages: MessageType[];
  currentUser: User;
  activeTab: ChatTab;
  selectedDirectContact: string | null;
  directContacts: any[];
  onCreateTask: (message: MessageType) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessagesList({
  messages,
  currentUser,
  activeTab,
  selectedDirectContact,
  directContacts,
  onCreateTask,
  messagesEndRef,
}: MessagesListProps) {
  const currentUserName = getDisplayName(currentUser);

  const getEmptyStateConfig = () => {
    if (selectedDirectContact) {
      return {
        icon: MessageCircle,
        title: "No messages yet",
        description: "Be the first to send a message!",
      };
    } else {
      return {
        icon: MessageCircle,
        title: "No team messages yet",
        description: "Be the first to send a message to the team!",
      };
    }
  };

  const renderEmptyState = () => {
    const config = getEmptyStateConfig();

    if (messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <config.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {config.title}
            </h3>
            <p className="text-gray-500 text-sm">{config.description}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4 relative scroll-smooth"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23e879f9' fill-opacity='0.02'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        backgroundColor: "#fafafa",
      }}
      ref={messagesEndRef}
    >
      {renderEmptyState()}

      {messages.length > 0 && (
        <div className="space-y-2 max-w-4xl mx-auto">
          {messages
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((message: MessageType, index: number, sortedMessages) => {
              const previousMessage =
                index > 0 ? sortedMessages[index - 1] : null;
              const isGrouped = previousMessage?.authorId === message.authorId;

              return (
                <Message
                  key={message._id}
                  message={message}
                  currentUserId={currentUser._id}
                  currentUserName={currentUserName}
                  isGrouped={isGrouped}
                  onCreateTask={() => onCreateTask(message)}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
