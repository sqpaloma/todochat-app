"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users, ArrowLeft } from "lucide-react";
import { getInitials } from "@/utils/user";

interface ContactSelectorProps {
  activeTab: string;
  selectedDirectContact: string | null;
  teamMembers: any[];
  directContacts: any[];
  currentUser: any;
  onSelectContact: (contactId: string | null) => void;
  onShowContactSelector: () => void;
}

export function ContactSelector({
  activeTab,
  selectedDirectContact,
  teamMembers,
  directContacts,
  currentUser,
  onSelectContact,
  onShowContactSelector,
}: ContactSelectorProps) {
  if (activeTab !== "direct") return null;

  // Filtrar membros da equipe (excluindo o usuário atual)
  const availableMembers =
    teamMembers?.filter((member) => member._id !== currentUser?._id) || [];

  // Se não há membros reais, mostrar membros de teste
  const testMembers = [
    {
      _id: "test-1",
      name: "João Silva",
      email: "joao@test.com",
      status: "online",
    },
    {
      _id: "test-2",
      name: "Maria Santos",
      email: "maria@test.com",
      status: "online",
    },
    {
      _id: "test-3",
      name: "Pedro Oliveira",
      email: "pedro@test.com",
      status: "offline",
    },
  ];

  const membersToShow =
    availableMembers.length > 0 ? availableMembers : testMembers;

  return (
    <div className="px-6 pb-3 border-t border-gray-200 bg-white/90">
      <div className="flex items-center space-x-3 mt-3 max-w-7xl mx-auto">
        {selectedDirectContact ? (
          <div className="flex items-center space-x-3">
            {/* Botão Back - apenas seta */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectContact(null)}
              className="p-1 h-auto hover:bg-purple-100 text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {/* Avatar e nome do usuário */}
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {membersToShow
                ?.find((m) => m._id === selectedDirectContact)
                ?.name.split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2) || "U"}
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800">
                {
                  membersToShow?.find((m) => m._id === selectedDirectContact)
                    ?.name
                }
              </span>
              <span className="text-xs text-gray-500 ml-2">(Online)</span>
            </div>
          </div>
        ) : (
          <>
            <span className="text-sm font-medium text-gray-700">
              Select contact to chat:
            </span>
            <div className="flex-1">
              {directContacts && directContacts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {directContacts.map((contact) => (
                    <Button
                      key={contact._id}
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectContact(contact._id)}
                      className="hover:bg-purple-50"
                    >
                      {contact.name}
                    </Button>
                  ))}
                </div>
              ) : membersToShow.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {membersToShow.slice(0, 5).map((member) => (
                    <Button
                      key={member._id}
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectContact(member._id)}
                      className="hover:bg-purple-50 flex items-center space-x-2"
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(member.name)}
                      </div>
                      <span>{member.name}</span>
                      {member.status === "online" && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </Button>
                  ))}
                  {membersToShow.length > 5 && (
                    <Button
                      onClick={onShowContactSelector}
                      variant="outline"
                      size="sm"
                      className="hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />+
                      {membersToShow.length - 5} more
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">No team members available</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
