import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

/**
 * Hook simplificado para gerenciar dados do team e presence
 * Consolida funcionalidade de múltiplos hooks redundantes
 */
export function useTeam(teamId: string) {
  // Buscar membros do team
  const teamMembers = useQuery(api.users.debugUsers);
  
  // Buscar usuários online (optional)
  const onlineUsers = useQuery(api.presence.list, {
    roomToken: teamId,
  });

  // Calcular estatísticas simples
  const stats = useMemo(() => {
    const total = teamMembers?.length || 0;
    const online = onlineUsers?.length || 0;
    
    return {
      total,
      online,
      offline: total - online,
    };
  }, [teamMembers?.length, onlineUsers?.length]);

  // Combinar dados de membros com status online
  const members = useMemo(() => {
    if (!teamMembers) return [];
    
    const onlineUserIds = new Set(onlineUsers?.map(u => u.userId) || []);
    
    return teamMembers.map(member => ({
      ...member,
      isOnline: onlineUserIds.has(member._id),
    }));
  }, [teamMembers, onlineUsers]);

  return {
    members,
    stats,
    isLoading: teamMembers === undefined,
  };
}