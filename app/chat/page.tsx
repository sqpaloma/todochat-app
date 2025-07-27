"use client";

import { ChatPage } from "@/components/chat/chat-page";
import { api } from "../../convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
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

  return <PresenceContent userId={userId} />;
}

function PresenceContent({ userId }: { userId: string }) {
  const presenceState = usePresence(api.presence, "my-chat-room", userId);

  return (
    <div>
      <div className="mb-4">
        <FacePile presenceState={presenceState ?? []} />
      </div>
      <ChatPage />
    </div>
  );
}
