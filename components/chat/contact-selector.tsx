"use client";

import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  ArrowLeft,
  Wifi,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  const [showAllContacts, setShowAllContacts] = useState(false);

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

  const toggleShowAllContacts = () => {
    setShowAllContacts(!showAllContacts);
  };

  return (
    <>
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {selectedDirectContact ? (
            <div className="flex items-center space-x-3">
              {/* Botão Back - apenas no desktop */}
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectContact(null)}
                  className="p-1 h-auto hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>

              {/* Avatar e nome do usuário */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {availableMembers
                      ?.find((m) => m._id === selectedDirectContact)
                      ?.name.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2) || "U"}
                  </div>
                  {/* Indicador de status online */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {
                      availableMembers?.find(
                        (m) => m._id === selectedDirectContact
                      )?.name
                    }
                  </span>
                  <span className="text-xs text-green-600 font-medium flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                    Online
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 ml-12 md:ml-0">
                <h3 className="text-sm font-medium text-gray-700">
                  Chat with team or select contact:
                </h3>
              </div>

              <div className="space-y-3">
                {directContacts && directContacts.length > 0 ? (
                  <div className="space-y-3">
                    {/* Primeiro contato e botão ver mais na mesma linha */}
                    <div className="flex items-center space-x-2 ml-12 md:ml-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectContact(directContacts[0]._id)}
                        className="h-auto py-2.5 px-4 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 flex-1 justify-start rounded-lg max-w-sm"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {getInitials(directContacts[0].name)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {directContacts[0].name}
                          </span>
                        </div>
                      </Button>

                      {/* Botão "Ver mais" se houver mais contatos */}
                      {directContacts.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleShowAllContacts}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors h-9 px-3 text-xs whitespace-nowrap rounded-lg"
                        >
                          {showAllContacts ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Ver menos
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />+
                              {directContacts.length - 1}
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Outros contatos (ocultos por padrão) */}
                    {showAllContacts && directContacts.length > 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pt-1 ml-12 md:ml-0">
                        {directContacts.slice(1).map((contact) => (
                          <Button
                            key={contact._id}
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectContact(contact._id)}
                            className="h-auto py-2 px-3 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 justify-start rounded-lg"
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {getInitials(contact.name)}
                              </div>
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {contact.name}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : availableMembers.length > 0 ? (
                  <div className="space-y-3">
                    {/* Primeiro membro e botão ver mais na mesma linha */}
                    <div className="flex items-center space-x-2 ml-12 md:ml-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectContact(availableMembers[0]._id)}
                        className="h-auto py-2.5 px-4 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 flex-1 justify-start rounded-lg max-w-sm"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="relative">
                            <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {getInitials(availableMembers[0].name)}
                            </div>
                            {availableMembers[0].status === "online" && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {availableMembers[0].name}
                            </span>
                            {availableMembers[0].status === "online" && (
                              <span className="text-xs text-green-600 font-medium flex items-center">
                                <Wifi className="w-3 h-3 mr-1" />
                                Online
                              </span>
                            )}
                          </div>
                        </div>
                      </Button>

                      {/* Botão "Ver mais" se houver mais membros */}
                      {availableMembers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleShowAllContacts}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors h-9 px-3 text-xs whitespace-nowrap rounded-lg"
                        >
                          {showAllContacts ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Ver menos
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />+
                              {availableMembers.length - 1}
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Outros membros (ocultos por padrão) */}
                    {showAllContacts && availableMembers.length > 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pt-1 ml-12 md:ml-0">
                        {availableMembers.slice(1).map((member) => (
                          <Button
                            key={member._id}
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectContact(member._id)}
                            className="h-auto py-2 px-3 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 justify-start rounded-lg"
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <div className="relative">
                                <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {getInitials(member.name)}
                                </div>
                                {member.status === "online" && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {member.name}
                                </span>
                                {member.status === "online" && (
                                  <span className="text-xs text-green-600 font-medium flex items-center">
                                    <Wifi className="w-2.5 h-2.5 mr-1" />
                                    Online
                                  </span>
                                )}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4 ml-12 md:ml-0">
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          No team members available
                        </p>
                        <p className="text-xs text-gray-500">
                          Add team members to start chatting
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
