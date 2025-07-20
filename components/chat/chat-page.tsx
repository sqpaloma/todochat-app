"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";

interface MessageType {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  teamId: string;
}

export function ChatPage() {
  const [selectedTeam] = useState("team-1");
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
    null
  );
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.messages.getMessages, { teamId: selectedTeam });
  const teamMembers = useQuery(api.teams.getTeamMembers, {
    teamId: selectedTeam,
  });
  const sendMessage = useMutation(api.messages.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        content: newMessage.trim(),
        authorId: "user-1", // In real app, get from auth
        authorName: "Você",
        teamId: selectedTeam,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateTask = (message: MessageType) => {
    setSelectedMessage(message);
    setShowTaskDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView="chat" />

      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Chat da Equipe</h1>
          <p className="text-gray-600">Converse e colabore em tempo real</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {(messages || []).map((message: MessageType) => (
            <Message
              key={message._id}
              message={message}
              onCreateTask={() => handleCreateTask(message)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" className="px-6">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      <CreateTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        message={selectedMessage}
        teamMembers={teamMembers || []}
        teamId={selectedTeam}
      />
    </div>
  );
}
