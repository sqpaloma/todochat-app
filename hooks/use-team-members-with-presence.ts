import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useMemo } from "react";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  status?: "online" | "offline";
  role?: string;
  joinDate?: number;
  phone?: string;
  location?: string;
  imageUrl?: string;
}

export function useTeamMembersWithPresence(teamId: string) {
  // Get current user
  const currentUser = useQuery(api.users.current);

  // Get team members (simplified - using debugUsers for now)
  const teamMembers = useQuery(api.users.debugUsers);

  // Buscar lista de usuários online na sala
  const onlineUsers = useQuery(api.presence.list, {
    roomToken: teamId,
  });

  // Enviar heartbeat para manter o presence ativo
  const heartbeat = useMutation(api.presence.heartbeat);

  useEffect(() => {
    if (!currentUser?._id || !teamId) return;

    // Enviar heartbeat inicial
    const sendHeartbeat = async () => {
      try {
        await heartbeat({
          roomId: teamId,
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
  }, [currentUser?._id, teamId, heartbeat]);

  // Create members with real presence data
  const membersWithPresence = useMemo(() => {
    if (!teamMembers || !onlineUsers) return [];

    // Criar um mapa dos usuários online
    const onlineUserIds = new Set(
      onlineUsers
        .filter((user: any) => user.online)
        .map((user: any) => user.userId)
    );

    return teamMembers.map((member: any) => {
      const isOnline =
        onlineUserIds.has(member._id) || member._id === currentUser?._id;

      return {
        _id: member._id,
        name:
          `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
          member.email?.split("@")[0] ||
          "Anonymous",
        email: member.email || "",
        status: isOnline ? "online" : "offline",
        role: "member",
        joinDate: member._creationTime,
        imageUrl: member.imageUrl,
      };
    });
  }, [teamMembers, onlineUsers, currentUser?._id]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = membersWithPresence.length;
    const online = membersWithPresence.filter(
      (m) => m.status === "online"
    ).length;
    const offline = total - online;

    return {
      total,
      online,
      offline,
      onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0,
    };
  }, [membersWithPresence]);

  return {
    members: membersWithPresence,
    stats,
    isLoading: teamMembers === undefined,
    currentUserId: currentUser?._id,
    isPresenceReady: onlineUsers !== undefined,
    hasPresenceError: false,
  };
}
