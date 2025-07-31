"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Megaphone, Wifi } from "lucide-react";
import { ChatTab, TabConfig } from "@/types/chat";
import { User } from "@/types/user";
import { getInitials } from "@/utils/user";

interface ChatSidebarProps {
  activeTab: ChatTab;
  teamMembers: any[];
  currentUser: User | null;
  onTabChange: (tab: ChatTab) => void;
  onSelectDirectContact: (contactId: string) => void;
}

export function ChatSidebar({
  activeTab,
  teamMembers,
  currentUser,
  onTabChange,
  onSelectDirectContact,
}: ChatSidebarProps) {
  const getTabConfig = (tab: ChatTab): TabConfig => {
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
  };

  const getTabIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return Users;
      case "Megaphone":
        return Megaphone;
      case "MessageCircle":
        return MessageCircle;
      default:
        return Users;
    }
  };

  const onlineMembers = teamMembers?.filter((m) => m.status === "online") || [];

  return (
    <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-purple-200 p-6">
      <div className="space-y-6">
        {/* Chat Options Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
            Chat Options
          </h3>

          <div className="space-y-3">
            {(["general", "announcements", "direct"] as ChatTab[]).map(
              (tab) => {
                const config = getTabConfig(tab);
                const IconComponent = getTabIcon(config.icon);
                const isActive = activeTab === tab;

                return (
                  <Button
                    key={tab}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => onTabChange(tab)}
                    className={`w-full justify-start p-4 rounded-xl transition-all ${
                      isActive
                        ? `bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg`
                        : `text-gray-600 hover:${config.bgColor} hover:${config.color}`
                    }`}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left flex-1">
                        <div className="text-sm font-semibold">
                          {config.label}
                        </div>
                        <div className="text-xs opacity-75">
                          {config.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              }
            )}
          </div>
        </div>

        {/* Online Members Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Online Members
            <span className="ml-2 text-sm font-medium text-gray-500 bg-green-100 px-2 py-1 rounded-full">
              {onlineMembers.length}
            </span>
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {onlineMembers.length > 0 ? (
              onlineMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl border border-purple-100 hover:bg-white/80 transition-colors cursor-pointer"
                  onClick={() => {
                    if (member._id !== currentUser?._id) {
                      onTabChange("direct");
                      onSelectDirectContact(member._id);
                    }
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(member.name)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                      <Wifi className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {member.name}
                      {member._id === currentUser?._id && (
                        <span className="text-xs text-purple-600 ml-1">
                          (You)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {member.email}
                    </div>
                  </div>
                  {member._id !== currentUser?._id && (
                    <div className="text-xs text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No members online</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
