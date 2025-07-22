"use client";

import { ChatPage } from "@/components/chat/chat-page";
import { SidebarLayout } from "@/components/sidebar-layout";

export default function Chat() {
  return (
    <SidebarLayout activeView="chat">
      <ChatPage />
    </SidebarLayout>
  );
}
