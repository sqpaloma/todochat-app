"use client";

import { ChatPage } from "@/components/chat/chat-page";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function Chat() {
  return <Content />;
}

function Content() {
  const userId = useQuery(api.presence.getUserId);

  if (userId === undefined) {
    return <div>Loading...</div>;
  }
  if (userId === null) {
    return <div>Authentication required</div>;
  }

  return <ChatPage />;
}
