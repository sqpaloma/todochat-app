"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Paperclip,
  Smile,
  Search,
  Users,
  Megaphone,
  MessageCircle,
  X,
  Plus,
} from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";

interface MessageType {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  teamId: string;
  messageType?: "general" | "announcement" | "direct";
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

type ChatTab = "general" | "announcements" | "direct";

export function ChatPage() {
  const [selectedTeam] = useState("team-1");
  const [activeTab, setActiveTab] = useState<ChatTab>("general");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
    null
  );
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDirectContact, setSelectedDirectContact] = useState<
    string | null
  >(null);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useQuery(api.users.current);

  // Buscar mensagens baseado na aba ativa
  const messages = useQuery(api.messages.getMessages, {
    teamId: selectedTeam,
    messageType:
      activeTab === "general"
        ? "general"
        : activeTab === "announcements"
          ? "announcement"
          : "direct",
    recipientId:
      activeTab === "direct" ? selectedDirectContact || undefined : undefined,
    currentUserId: currentUser?._id,
  });

  // Buscar mensagens com termo de pesquisa
  const searchResults = useQuery(
    api.messages.searchMessages,
    searchTerm.trim()
      ? {
          teamId: selectedTeam,
          searchTerm: searchTerm,
          messageType:
            activeTab === "general"
              ? "general"
              : activeTab === "announcements"
                ? "announcement"
                : "direct",
        }
      : "skip"
  );

  // Buscar contatos para mensagens diretas
  const directContacts = useQuery(
    api.messages.getDirectMessageContacts,
    currentUser
      ? {
          teamId: selectedTeam,
          currentUserId: currentUser._id,
        }
      : "skip"
  );

  const teamMembers = useQuery(api.teams.getTeamMembers, {
    teamId: selectedTeam,
  });

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset quando muda de aba
  useEffect(() => {
    setSearchTerm("");
    setSelectedDirectContact(null);
    setNewMessage("");
  }, [activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    // Validações específicas por tipo
    if (activeTab === "direct" && !selectedDirectContact) {
      alert("Selecione um contato para enviar mensagem direta");
      return;
    }

    try {
      const displayName =
        [currentUser.firstName, currentUser.lastName]
          .filter(Boolean)
          .join(" ") || "Anonymous";

      let recipientData = {};
      if (activeTab === "direct" && selectedDirectContact) {
        const recipient = teamMembers?.find(
          (m) => m._id === selectedDirectContact
        );
        if (recipient) {
          recipientData = {
            recipientId: recipient._id,
            recipientName: recipient.name,
          };
        }
      }

      await sendMessage({
        content: newMessage.trim(),
        authorId: currentUser._id,
        authorName: displayName,
        teamId: selectedTeam,
        messageType:
          activeTab === "general"
            ? "general"
            : activeTab === "announcements"
              ? "announcement"
              : "direct",
        ...recipientData,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !currentUser) return;

    // Validações específicas por tipo
    if (activeTab === "direct" && !selectedDirectContact) {
      alert("Selecione um contato para enviar arquivo");
      return;
    }

    setIsUploading(true);
    try {
      const displayName =
        [currentUser.firstName, currentUser.lastName]
          .filter(Boolean)
          .join(" ") || "Anonymous";

      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();

      let recipientData = {};
      if (activeTab === "direct" && selectedDirectContact) {
        const recipient = teamMembers?.find(
          (m) => m._id === selectedDirectContact
        );
        if (recipient) {
          recipientData = {
            recipientId: recipient._id,
            recipientName: recipient.name,
          };
        }
      }

      // Step 3: Save file message to database
      await sendFile({
        fileId: storageId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        teamId: selectedTeam,
        authorId: currentUser._id,
        authorName: displayName,
        messageType:
          activeTab === "general"
            ? "general"
            : activeTab === "announcements"
              ? "announcement"
              : "direct",
        ...recipientData,
      });

      // Reset file selection
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateTask = (message: MessageType) => {
    setSelectedMessage(message);
    setShowTaskDialog(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTabConfig = (tab: ChatTab) => {
    switch (tab) {
      case "general":
        return {
          icon: Users,
          label: "Chat Geral",
          description: "Conversas da equipe",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "announcements":
        return {
          icon: Megaphone,
          label: "Comunicados",
          description: "Mensagens importantes",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case "direct":
        return {
          icon: MessageCircle,
          label: "Mensagens Diretas",
          description: "Conversas privadas",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
    }
  };

  const displayMessages = searchTerm.trim()
    ? searchResults || []
    : messages || [];
  const currentTabConfig = getTabConfig(activeTab);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
        style={{ height: "calc(100vh - 120px)" }}
      >
        {/* Header com abas */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-purple-200 shadow-sm">
          {/* Header principal */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">TC</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">TodoChat</h1>
                  <p className="text-xs text-purple-100">
                    {teamMembers?.length || 0} membros online
                  </p>
                </div>
              </div>

              {/* Campo de busca */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar mensagens..."
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30 focus:border-white"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-auto text-white/70 hover:text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Abas */}
          <div className="px-4 py-3">
            <div className="flex space-x-1">
              {(["general", "announcements", "direct"] as ChatTab[]).map(
                (tab) => {
                  const config = getTabConfig(tab);
                  const isActive = activeTab === tab;
                  return (
                    <Button
                      key={tab}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? `bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md`
                          : `text-gray-600 hover:${config.bgColor} hover:${config.color}`
                      }`}
                    >
                      <config.icon className="w-4 h-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {config.label}
                        </div>
                        <div className="text-xs opacity-75">
                          {config.description}
                        </div>
                      </div>
                    </Button>
                  );
                }
              )}
            </div>
          </div>

          {/* Seletor de contato para mensagens diretas */}
          {activeTab === "direct" && (
            <div className="px-4 pb-3 border-t border-gray-200">
              <div className="flex items-center space-x-3 mt-3">
                <span className="text-sm font-medium text-gray-700">
                  Conversar com:
                </span>
                {selectedDirectContact ? (
                  <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-green-800">
                      {
                        teamMembers?.find(
                          (m) => m._id === selectedDirectContact
                        )?.name
                      }
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDirectContact(null)}
                      className="p-0 h-auto text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowContactSelector(!showContactSelector)}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Selecionar contato</span>
                  </Button>
                )}
              </div>

              {/* Lista de contatos */}
              {(showContactSelector ||
                (!selectedDirectContact && directContacts?.length)) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    {showContactSelector
                      ? "Todos os membros:"
                      : "Conversas recentes:"}
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {showContactSelector
                      ? // Mostrar todos os membros da equipe
                        teamMembers
                          ?.filter((member) => member._id !== currentUser._id)
                          .map((member) => (
                            <Button
                              key={member._id}
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDirectContact(member._id);
                                setShowContactSelector(false);
                              }}
                              className="w-full justify-start text-left p-2 h-auto"
                            >
                              <div>
                                <div className="text-sm font-medium">
                                  {member.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {member.email}
                                </div>
                              </div>
                            </Button>
                          ))
                      : // Mostrar conversas recentes
                        directContacts?.map((contact) => (
                          <Button
                            key={contact.userId}
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedDirectContact(contact.userId)
                            }
                            className="w-full justify-start text-left p-2 h-auto"
                          >
                            <div>
                              <div className="text-sm font-medium">
                                {contact.userName}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {contact.lastMessage}
                              </div>
                            </div>
                          </Button>
                        ))}
                    {showContactSelector && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowContactSelector(false)}
                        className="w-full text-center text-gray-500 mt-2"
                      >
                        Fechar
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Background */}
        <div
          className="flex-1 overflow-y-auto p-4 relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23e879f9' fill-opacity='0.03'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
            backgroundColor: "transparent",
          }}
        >
          {/* Indicador de busca */}
          {searchTerm.trim() && (
            <div className="mb-4 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700">
                  Resultados para: <strong>"{searchTerm}"</strong>
                </span>
                <span className="text-xs text-gray-500">
                  ({displayMessages.length} encontrados)
                </span>
              </div>
            </div>
          )}

          {/* Estado vazio para mensagens diretas */}
          {activeTab === "direct" &&
            !selectedDirectContact &&
            !directContacts?.length && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Nenhuma conversa ainda
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Selecione um membro da equipe para iniciar uma conversa
                    privada
                  </p>
                  <Button
                    onClick={() => setShowContactSelector(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Iniciar Conversa
                  </Button>
                </div>
              </div>
            )}

          {/* Mensagens */}
          {displayMessages.length > 0 && (
            <div className="space-y-1">
              {displayMessages
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((message: MessageType, index: number) => {
                  const sortedMessages = displayMessages.sort(
                    (a, b) => a.timestamp - b.timestamp
                  );
                  const previousMessage =
                    index > 0 ? sortedMessages[index - 1] : null;
                  const isGrouped =
                    previousMessage?.authorId === message.authorId;
                  const currentUserName =
                    [currentUser.firstName, currentUser.lastName]
                      .filter(Boolean)
                      .join(" ") || "Anonymous";

                  return (
                    <Message
                      key={message._id}
                      message={message}
                      currentUserId={currentUser._id}
                      currentUserName={currentUserName}
                      isGrouped={isGrouped}
                      onCreateTask={() => handleCreateTask(message)}
                    />
                  );
                })}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Estado vazio quando não há mensagens */}
          {displayMessages.length === 0 &&
            !searchTerm.trim() &&
            selectedDirectContact && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <currentTabConfig.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Nenhuma mensagem ainda
                  </h3>
                  <p className="text-gray-500">
                    Seja o primeiro a enviar uma mensagem!
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="bg-purple-50 border-t border-purple-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                  <Paperclip className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isUploading ? "Uploading..." : "Send File"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-purple-200">
          {/* Indicador do tipo de mensagem ativa */}
          <div className="flex items-center space-x-2 mb-3">
            <currentTabConfig.icon
              className={`w-4 h-4 ${currentTabConfig.color}`}
            />
            <span className="text-sm font-medium text-gray-700">
              {currentTabConfig.label}
            </span>
            {activeTab === "direct" && selectedDirectContact && (
              <>
                <span className="text-gray-400">→</span>
                <span className="text-sm text-gray-600">
                  {
                    teamMembers?.find((m) => m._id === selectedDirectContact)
                      ?.name
                  }
                </span>
              </>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-end space-x-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-purple-500 hover:bg-purple-100 rounded-full"
              disabled={
                isUploading ||
                selectedFile !== null ||
                (activeTab === "direct" && !selectedDirectContact)
              }
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  activeTab === "general"
                    ? "Digite uma mensagem para a equipe..."
                    : activeTab === "announcements"
                      ? "Digite um comunicado importante..."
                      : selectedDirectContact
                        ? "Digite uma mensagem privada..."
                        : "Selecione um contato primeiro..."
                }
                className="pr-12 py-3 rounded-3xl border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                disabled={
                  selectedFile !== null ||
                  (activeTab === "direct" && !selectedDirectContact)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:bg-purple-100 rounded-full"
                disabled={activeTab === "direct" && !selectedDirectContact}
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={
                !newMessage.trim() ||
                selectedFile !== null ||
                (activeTab === "direct" && !selectedDirectContact)
              }
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg disabled:opacity-50 disabled:bg-gray-400"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>

          {/* Aviso para mensagens diretas */}
          {activeTab === "direct" && !selectedDirectContact && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 Selecione um contato acima para enviar mensagens diretas
            </div>
          )}
        </div>
      </div>

      <CreateTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        message={selectedMessage}
        teamMembers={teamMembers || []}
        teamId={selectedTeam}
      />
    </>
  );
}
