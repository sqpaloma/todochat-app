"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
    <>
      <div className="h-full flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Team Chat
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Chat and collaborate in real time
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
          {(messages || []).map((message: MessageType) => (
            <Message
              key={message._id}
              message={message}
              onCreateTask={() => handleCreateTask(message)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200">
          <form
            onSubmit={handleSendMessage}
            className="flex flex-col sm:flex-row gap-2 sm:gap-4"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl text-sm sm:text-base px-4 py-2.5 sm:py-3"
            />
            <Button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            >
              <Send className="w-4 h-4 mr-2 sm:mr-0" />
              <span className="sm:sr-only">Send</span>
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
    </>
  );
}
