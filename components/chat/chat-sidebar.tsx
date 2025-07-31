"use client";

import { User } from "@/types/user";

interface ChatSidebarProps {
  activeTab: string;
  teamMembers: any[];
  currentUser: User | null;
  onTabChange: (tab: string) => void;
  onSelectDirectContact: (contactId: string) => void;
}

export function ChatSidebar({
  activeTab,
  teamMembers,
  currentUser,
  onTabChange,
  onSelectDirectContact,
}: ChatSidebarProps) {
  return (
    <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-purple-200 p-6">
      <div className="space-y-6">
        {/* Sidebar vazio - pode ser usado para futuras funcionalidades */}
      </div>
    </div>
  );
}
