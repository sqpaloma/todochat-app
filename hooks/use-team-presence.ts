import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useEffect, useMemo } from "react";

export function useTeamPresence(roomId: string, currentUser: any) {
  // Buscar informações dos usuários
  const users = useQuery(api.users.debugUsers);

  // Buscar lista de usuários online na sala
  const onlineUsers = useQuery(api.presence.list, {
    roomToken: roomId,
  });

  // Enviar heartbeat para manter o presence ativo
  const heartbeat = useMutation(api.presence.heartbeat);

  useEffect(() => {
    if (!currentUser?._id || !roomId) return;

    // Enviar heartbeat inicial
    const sendHeartbeat = async () => {
      try {
        await heartbeat({
          roomId,
          userId: currentUser._id,
          sessionId: `session-${currentUser._id}-${Date.now()}`,
          interval: 30000,
        });
      } catch (error) {
        console.error("Failed to send heartbeat:", error);
      }
    };

    sendHeartbeat();

    // Enviar heartbeat a cada 30 segundos
    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [currentUser?._id, roomId, heartbeat]);

  // Criar lista de membros com presence real
  const teamMembersWithPresence = useMemo(() => {
    if (!users || !onlineUsers) return [];

    // Criar um mapa dos usuários online
    const onlineUserIds = new Set(onlineUsers.map((user: any) => user.userId));

    return users.map((user: any) => {
      const isOnline =
        onlineUserIds.has(user._id) || user._id === currentUser?._id;

      const member = {
        _id: user._id,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email?.split("@")[0] ||
          "Anonymous",
        email: user.email || "",
        status: isOnline ? "online" : "offline",
      };

      return member;
    });
  }, [users, onlineUsers, currentUser?._id]);

  // Contar usuários online reais
  const onlineCount = teamMembersWithPresence.filter(
    (m) => m.status === "online"
  ).length;

  return {
    members: teamMembersWithPresence,
    onlineCount,
    isPresenceReady: onlineUsers !== undefined,
    hasPresenceError: false,
  };
}
