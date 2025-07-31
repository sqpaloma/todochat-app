"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Users, Megaphone, MessageCircle } from "lucide-react";
import { ChatTab } from "@/types/chat";
import { getInitials } from "@/utils/user";

interface ChatHeaderProps {
  activeTab: ChatTab;
  selectedDirectContact: string | null;
  teamMembers: any[];
  onClearChat: () => void;
}

export function ChatHeader({
  activeTab,
  selectedDirectContact,
  teamMembers,
  onClearChat,
}: ChatHeaderProps) {
  const getHeaderConfig = () => {
    switch (activeTab) {
      case "general":
        return {
          icon: Users,
          title: "Team General",
          description: "Team conversations",
          initials: "TG",
        };
      case "announcements":
        return {
          icon: Megaphone,
          title: "Announcements",
          description: "Important messages",
          initials: "AN",
        };
      case "direct":
        const recipient = teamMembers?.find(
          (m) => m._id === selectedDirectContact
        );
        return {
          icon: MessageCircle,
          title: recipient?.name || "Select a Contact",
          description: selectedDirectContact
            ? "Private conversation"
            : "Choose someone to chat with",
          initials: recipient ? getInitials(recipient.name) : "DM",
        };
    }
  };

  const config = getHeaderConfig();

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-4 border-b border-purple-200 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {activeTab === "direct" && selectedDirectContact ? (
            config.initials
          ) : (
            <config.icon className="w-5 h-5" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{config.title}</h3>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearChat}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
        title="Limpar chat"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
