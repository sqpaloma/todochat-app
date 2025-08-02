"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users, ArrowLeft, Wifi } from "lucide-react";
import { getInitials } from "@/utils/user";
import { useState } from "react";
import { ContactSelectorModal } from "./contact-selector-modal";

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
  selectedDirectContact,
  teamMembers,
  directContacts,
  currentUser,
  onSelectContact,
  onShowContactSelector,
}: ContactSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar membros da equipe (excluindo o usuário atual)
  const availableMembers =
    teamMembers?.filter((member) => member._id !== currentUser?._id) || [];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectContactFromModal = (contactId: string | null) => {
    onSelectContact(contactId);
    handleCloseModal();
  };

  return (
    <>
      <div className="px-8 py-4 border-t border-gray-200 bg-white/90 rounded-lg">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          {selectedDirectContact ? (
            <div className="flex items-center space-x-4 w-full">
              {/* Botão Back - apenas no desktop */}
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectContact(null)}
                  className="p-2 h-auto hover:bg-purple-100 text-purple-600 hover:text-purple-700"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </div>

              {/* Avatar e nome do usuário */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {availableMembers
                    ?.find((m) => m._id === selectedDirectContact)
                    ?.name.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2) || "U"}
                </div>
                {/* Indicador de status online */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <Wifi className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800">
                  {
                    availableMembers?.find(
                      (m) => m._id === selectedDirectContact
                    )?.name
                  }
                </span>
                <span className="text-xs text-green-600 ml-3 font-medium">
                  Online
                </span>
              </div>
            </div>
          ) : (
            <>
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                Chat with team or select contact:
              </span>
              <div className="flex-1">
                {directContacts && directContacts.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {directContacts.map((contact) => (
                      <Button
                        key={contact._id}
                        variant="outline"
                        size="lg"
                        onClick={() => onSelectContact(contact._id)}
                        className="hover:bg-purple-50 px-6 py-3"
                      >
                        {contact.name}
                      </Button>
                    ))}
                  </div>
                ) : availableMembers.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {/* Desktop: Mostra até 6 contatos */}
                    <div className="hidden md:flex flex-wrap gap-3">
                      {availableMembers.slice(0, 6).map((member) => (
                        <Button
                          key={member._id}
                          variant="outline"
                          size="lg"
                          onClick={() => onSelectContact(member._id)}
                          className="hover:bg-purple-50 flex items-center space-x-3 px-6 py-3 relative"
                        >
                          <div className="relative">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {getInitials(member.name)}
                            </div>
                            {/* Indicador de status online */}
                            {member.status === "online" && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                            )}
                          </div>
                          <span>{member.name}</span>
                          {member.status === "online" && (
                            <Wifi className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                      ))}
                      {availableMembers.length > 6 && (
                        <Button
                          onClick={onShowContactSelector}
                          variant="outline"
                          size="lg"
                          className="hover:bg-purple-50 px-6 py-3"
                        >
                          <Plus className="w-5 h-5 mr-2" />+
                          {availableMembers.length - 6} more
                        </Button>
                      )}
                    </div>

                    {/* Mobile: Mostra apenas 1 contato + botão + */}
                    <div className="flex md:hidden items-center gap-3">
                      {availableMembers.length > 0 && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() =>
                            onSelectContact(availableMembers[0]._id)
                          }
                          className="hover:bg-purple-50 flex items-center space-x-3 px-6 py-3 relative"
                        >
                          <div className="relative">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {getInitials(availableMembers[0].name)}
                            </div>
                            {/* Indicador de status online */}
                            {availableMembers[0].status === "online" && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                            )}
                          </div>
                          <span className="hidden sm:inline">
                            {availableMembers[0].name}
                          </span>
                          {availableMembers[0].status === "online" && (
                            <Wifi className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                      )}
                      <Button
                        onClick={handleOpenModal}
                        variant="outline"
                        size="lg"
                        className="hover:bg-purple-50 px-6 py-3"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Users className="w-5 h-5" />
                    <span className="text-fon">No team members available</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal para seleção de contatos no mobile */}
      <ContactSelectorModal
        isOpen={isModalOpen}
        teamMembers={teamMembers}
        currentUser={currentUser}
        onSelectContact={handleSelectContactFromModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
