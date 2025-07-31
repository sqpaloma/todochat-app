"use client";

import { Button } from "@/components/ui/button";
import { Search, Users, Wifi, MessageCircle } from "lucide-react";
import { getInitials } from "@/utils/user";
import { useState } from "react";

interface ContactSelectorModalProps {
  isOpen: boolean;
  teamMembers: any[];
  currentUser: any;
  onSelectContact: (contactId: string | null) => void;
  onClose: () => void;
}

export function ContactSelectorModal({
  isOpen,
  teamMembers,
  currentUser,
  onSelectContact,
  onClose,
}: ContactSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Filtrar membros da equipe (excluindo o usuário atual)
  const availableMembers =
    teamMembers?.filter((member) => member._id !== currentUser?._id) || [];

  // Filtrar por termo de busca
  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Select Contact
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose a team member to start a private conversation
          </p>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        <div className="p-4 max-h-64 overflow-y-auto">
          {filteredMembers.length > 0 ? (
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <Button
                  key={member._id}
                  variant="ghost"
                  onClick={() => {
                    onSelectContact(member._id);
                    onClose();
                  }}
                  className="w-full justify-start p-4 h-auto rounded-xl hover:bg-purple-50"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(member.name)}
                      </div>
                      {member.status === "online" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                          <Wifi className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-semibold text-gray-800">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.email}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {searchTerm ? "No members found" : "No team members available"}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
