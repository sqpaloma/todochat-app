"use client";

import { Button } from "@/components/ui/button";
import { Trash2, MessageCircle, Wifi } from "lucide-react";
import { ChatTab } from "@/types/chat";
import { getInitials } from "@/utils/user";

interface ChatHeaderProps {
  activeTab: ChatTab;
  selectedDirectContact: string | null;
  teamMembers: any[];
  onlineCount?: number;
  onClearChat: () => void;
}

export function ChatHeader({
  activeTab,
  selectedDirectContact,
  teamMembers,
  onlineCount = 0,
  onClearChat,
}: ChatHeaderProps) {
  const getHeaderConfig = () => {
    if (selectedDirectContact) {
      const recipient = teamMembers?.find(
        (m) => m._id === selectedDirectContact
      );
      return {
        icon: MessageCircle,
        title: recipient?.name || "Select a Contact",
        description: "Private conversation",
        initials: recipient ? getInitials(recipient.name) : "DM",
      };
    } else {
      return {
        icon: MessageCircle,
        title: "Team Messages",
        description: "Chat with the whole team",
        initials: "TM",
      };
    }
  };

  const config = getHeaderConfig();

  // Componente FacePile para mostrar membros online
  const FacePile = () => {
    const onlineMembers =
      teamMembers?.filter((m) => m.status === "online") || [];
    const displayMembers = onlineMembers.slice(0, 5); // Mostrar até 5 membros
    const remainingCount = onlineMembers.length - 5;

    // Cores para os avatares (seguindo o padrão da foto)
    const avatarColors = [
      "from-orange-400 to-orange-500", // Laranja
      "from-purple-400 to-purple-500", // Roxo
      "from-orange-400 to-orange-500", // Laranja
      "from-purple-400 to-purple-500", // Roxo
      "from-orange-400 to-orange-500", // Laranja
    ];

    return (
      <div className="flex items-center space-x-1">
        {displayMembers.map((member, index) => (
          <div
            key={member._id}
            className="relative"
            style={{ zIndex: displayMembers.length - index }}
          >
            <div
              className={`w-8 h-8 bg-gradient-to-br ${avatarColors[index]} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm`}
              title={member.name}
            >
              {getInitials(member.name)}
            </div>
            {/* Indicador de status online - pequeno ponto verde */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white shadow-sm">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-8 py-6 border-b border-purple-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {selectedDirectContact ? (
            config.initials
          ) : (
            <config.icon className="w-7 h-7" />
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold text-gray-800">
                {config.title}
              </h3>
              {/* FacePile - apenas quando não há contato selecionado */}
              {!selectedDirectContact && teamMembers.length > 0 && <FacePile />}
            </div>
            <p className="text-base text-gray-600">{config.description}</p>
          </div>

          {/* Indicador de membros online - apenas quando não há contato selecionado */}
          {/* Removido o badge "3 online" - mantendo apenas o FacePile */}
        </div>
      </div>

      <Button
        variant="ghost"
        size="lg"
        onClick={onClearChat}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl"
        title="Limpar chat"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
