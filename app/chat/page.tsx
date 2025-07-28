"use client";

import { ChatPage } from "@/components/chat/chat-page";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function Chat() {
  return (
    <AuthGuard pageName="Chat">
      <ChatPage />
    </AuthGuard>
  );
}
